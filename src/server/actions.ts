import { type Job, type CoverLetter, type User, type LnPayment } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type GenerateCoverLetter,
  type CreateJob,
  type UpdateCoverLetter,
  type EditCoverLetter,
  type UpdateJob,
  type UpdateUser,
  type DeleteJob,
  type GenerateEdit,
  type CreatePaymongoCheckout,
} from "wasp/server/operations";
import fetch from 'node-fetch';
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY!;
const paymongoHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY || '').toString('base64')}`,
};

const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

const gptConfig = {
  completeCoverLetter: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description. Write the cover letter in the same language as the job description provided!
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, professional style without being too formal, as a modern employee might do naturally.`,
  coverLetterWithAWittyRemark: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description. Write the cover letter in the same language as the job description provided!
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, relaxed style, as a modern employee might do naturally.
Include a job related joke at the end of the cover letter.`,
  ideasForCoverLetter:
    "You are a cover letter idea generator. You will be given a job description along with the job applicant's resume. You will generate a bullet point list of ideas for the applicant to use in their cover letter. ",
};

type CoverLetterPayload = Pick<CoverLetter, 'title' | 'jobId'> & {
  content: string;
  description: string;
  isCompleteCoverLetter: boolean;
  includeWittyRemark: boolean;
  temperature: number;
  gptModel: string;
  lnPayment?: LnPayment;
};

type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
  error?: {
    message?: string;
  };
};

async function checkIfUserPaid({ context, lnPayment }: { context: any; lnPayment?: LnPayment }) {
  if (!context.user.hasPaid && !context.user.credits && !context.user.isUsingLn) {
    throw new HttpError(402, 'User must pay to continue');
  }
  if (context.user.subscriptionStatus === 'past_due') {
    throw new HttpError(402, 'Your subscription is past due. Please update your payment method.');
  }
  if (context.user.isUsingLn) {
    let invoiceStatus;
    if (lnPayment) {
      const lnPaymentInDB = await context.entities.LnPayment.findUnique({
        where: {
          pr: lnPayment.pr,
        },
      });
      invoiceStatus = lnPaymentInDB?.status;
    }
    console.table({ lnPayment, invoiceStatus });
    if (invoiceStatus !== 'success') {
      throw new HttpError(402, 'Your lightning payment has not been paid');
    }
  }
}

export const generateCoverLetter: GenerateCoverLetter<CoverLetterPayload, CoverLetter> = async (
  { jobId, title, content, description, isCompleteCoverLetter, includeWittyRemark, temperature, gptModel, lnPayment },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context, lnPayment })

  let command;
  if (isCompleteCoverLetter) {
    command = includeWittyRemark ? gptConfig.coverLetterWithAWittyRemark : gptConfig.completeCoverLetter;
  } else {
    command = gptConfig.ideasForCoverLetter;
  }

  console.log(' gpt model: ', gptModel);

  const payload = {
    model: gptModel,
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `My Resume: ${content}. Job title: ${title} Job Description: ${description}.`,
      },
    ],
    temperature,
  };

  let json: OpenAIResponse;

  try {
    if (!context.user.hasPaid && !context.user.credits && !context.user.isUsingLn) {
      throw new HttpError(402, 'User has not paid or is out of credits');
    } else if (context.user.credits && !context.user.hasPaid) {
      console.log('decrementing credits \n\n');
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    json = (await response.json()) as OpenAIResponse;

    if (json?.error) throw new HttpError(500, json?.error?.message || 'Something went wrong');

    return context.entities.CoverLetter.create({
      data: {
        title,
        content: json?.choices[0].message.content,
        tokenUsage: json?.usage.completion_tokens,
        user: { connect: { id: context.user.id } },
        job: { connect: { id: jobId } },
      },
    });
  } catch (error: any) {
    if (!context.user.hasPaid && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    throw new HttpError(error.statusCode || 500, error.message || 'Something went wrong');
  }
};

export const generateEdit: GenerateEdit<
  { content: string; improvement: string; lnPayment?: LnPayment },
  string
> = async ({ content, improvement, lnPayment }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context, lnPayment });

  let command;
  command = `You are a cover letter editor. You will be given a piece of isolated text from within a cover letter and told how you can improve it. Only respond with the revision. Make sure the revision is in the same language as the given isolated text.`;

  const payload = {
    model: context.user.gptModel === 'gpt-4' || context.user.gptModel === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `Isolated text from within cover letter: ${content}. It should be improved by making it more: ${improvement}`,
      },
    ],
    temperature: 0.5,
  };

  let json: OpenAIResponse;

  try {
    if (!context.user.hasPaid && !context.user.credits && !context.user.isUsingLn) {
      throw new HttpError(402, 'User has not paid or is out of credits');
    } else if (context.user.credits && !context.user.hasPaid) {
      console.log('decrementing credits \n\n');
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    json = (await response.json()) as OpenAIResponse;
    if (json?.choices[0].message.content.length) {
      return json?.choices[0].message.content;
    } else {
      throw new HttpError(500, 'GPT returned an empty response');
    }
  } catch (error: any) {
    if (!context.user.hasPaid && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    throw new HttpError(error.statusCode || 500, error.message || 'Something went wrong');
  }
};

export type JobPayload = Pick<Job, 'title' | 'company' | 'location' | 'description'>;

export const createJob: CreateJob<JobPayload, Job> = ({ title, company, location, description }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.create({
    data: {
      title,
      description,
      location,
      company,
      user: { connect: { id: context.user.id } },
    },
  });
};

export type UpdateJobPayload = Pick<Job, 'id' | 'title' | 'company' | 'location' | 'description' | 'isCompleted'>;

export const updateJob: UpdateJob<UpdateJobPayload, Job> = (
  { id, title, company, location, description, isCompleted },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      location,
      company,
      isCompleted,
    },
  });
};

export type UpdateCoverLetterPayload = Pick<Job, 'id' | 'description'> &
  Pick<CoverLetter, 'content'> & {
    isCompleteCoverLetter: boolean;
    includeWittyRemark: boolean;
    temperature: number;
    gptModel: string;
    lnPayment?: LnPayment;
  };

export const updateCoverLetter: UpdateCoverLetter<UpdateCoverLetterPayload, string> = async (
  { id, description, content, isCompleteCoverLetter, includeWittyRemark, temperature, gptModel, lnPayment },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context, lnPayment });

  const job = await context.entities.Job.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });

  if (!job) {
    throw new HttpError(404, 'Job not found');
  }

  const coverLetter = await generateCoverLetter(
    {
      jobId: id,
      title: job.title,
      content,
      description: job.description,
      isCompleteCoverLetter,
      includeWittyRemark,
      temperature,
      gptModel,
      lnPayment,
    },
    context
  );

  await context.entities.Job.update({
    where: {
      id,
    },
    data: {
      description,
      coverLetter: { connect: { id: coverLetter.id } },
    },
  });

  return coverLetter.id;
};

export const editCoverLetter: EditCoverLetter<{ coverLetterId: string; content: string }, CoverLetter> = (
  { coverLetterId, content },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.update({
    where: {
      id: coverLetterId,
    },
    data: {
      content,
    },
  });
};

export const deleteJob: DeleteJob<{ jobId: string }, { count: number }> = ({ jobId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  if (!jobId) {
    throw new HttpError(401);
  }

  return context.entities.Job.deleteMany({
    where: {
      id: jobId,
      userId: context.user.id,
    },
  });
};

type UpdateUserArgs = Partial<Pick<User, 'id' | 'notifyPaymentExpires' | 'gptModel'>>;
type UserWithoutPassword = Omit<User, 'password'>;

export const updateUser: UpdateUser<UpdateUserArgs, UserWithoutPassword> = async (
  { notifyPaymentExpires, gptModel },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      notifyPaymentExpires,
      gptModel,
    },
    select: {
      id: true,
      email: true,
      username: true,
      hasPaid: true,
      datePaid: true,
      notifyPaymentExpires: true,
      checkoutSessionId: true,
      paymongoId: true,
      credits: true,
      gptModel: true,
      isUsingLn: true,
      subscriptionStatus: true,
    },
  });
};

type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;

function dontUpdateUser(user: UserWithoutPassword): Promise<UserWithoutPassword> {
  return new Promise((resolve) => {
    resolve(user);
  });
}

type PaymongoPaymentResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export const createPaymongoCheckout: CreatePaymongoCheckout<{ tier: string }, PaymongoPaymentResult> = async ({ tier }, context) => {
  if (!context.user || !context.user.email) {
    throw new HttpError(401, 'User or email not found');
  }

  let amount = 0;
  let credits = 0;
  let name = '';
  let description = '';

  if (tier === 'tester') {
    amount = 7900; // PHP 79.00
    credits = 5;
    name = 'The Tester';
    description = '5 ATS-Optimized Cover Letters';
  } else if (tier === 'hunter') {
    amount = 19900; // PHP 199.00
    credits = 20;
    name = 'The Job Hunter';
    description = '20 ATS-Optimized Cover Letters';
  } else if (tier === 'aggressive') {
    amount = 34900; // PHP 349.00
    credits = 45;
    name = 'The Aggressive Freelancer';
    description = '45 ATS-Optimized Cover Letters';
  } else {
    throw new HttpError(400, 'Invalid tier selected');
  }

  const payload = {
    data: {
      attributes: {
        billing: {
          email: context.user.email,
        },
        send_email_receipt: true,
        show_description: true,
        show_line_items: true,
        line_items: [
          {
            currency: 'PHP',
            amount,
            description,
            name,
            quantity: 1,
          },
        ],
        payment_method_types: ['gcash', 'paymaya', 'qrph', 'card'],
        success_url: `${DOMAIN}/profile?success=true`,
        cancel_url: `${DOMAIN}/profile?canceled=true`,
        description: `CoverLetterGPT - ${name}`,
        metadata: {
          userId: context.user.id.toString(),
          credits: credits.toString(),
          tier
        }
      },
    },
  };

  const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: paymongoHeaders,
    body: JSON.stringify(payload),
  });

  const session = (await response.json()) as any;

  if (!session || session.errors) {
    console.error(session.errors);
    throw new HttpError(402, 'Could not create a PayMongo checkout session');
  }

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session.data.id ?? null,
      paymongoId: session.data.id ?? null,
    },
  });

  return {
    sessionUrl: session.data.attributes.checkout_url,
    sessionId: session.data.id,
  };
};
