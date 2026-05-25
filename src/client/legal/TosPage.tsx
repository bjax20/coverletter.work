import BorderBox from '../components/BorderBox';
import { useEffect } from 'react';
import LegalSection from './components/legalSection';
import { 
  Heading, 
  Text, 
  VStack, 
  UnorderedList, 
  ListItem, 
  Link,
  Box
} from '@chakra-ui/react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BorderBox>
      <VStack maxW='4xl' mx='auto' p={6} spacing={6} align='flex-start'>
        <Heading as='h1' size='xl' mb={6}>Terms of Service</Heading>
        <Text fontSize='sm' color='gray.600' mb={6}>Last updated: {new Date().toLocaleDateString()}</Text>

        <LegalSection title='1. Company Information'>
          <Text>
            Latte Tech Industry
            <br />
            Calamba, Laguna, Philippines
            <br />
            Email: lattetechindustry@coverletter.work
          </Text>
        </LegalSection>

        <LegalSection title='2. Description of Service'>
          <Text>
            CoverLetter.Work is a SaaS application that uses AI technology to assist users in creating personalized cover letter examples based on their curriculum vitae (CV) and job descriptions. The service is provided from
            the Philippines and is subject to Philippine law.
          </Text>
        </LegalSection>

        <LegalSection title='3. Contract Formation'>
          <Text>By registering for our service, you enter into a legally binding contract with Latte Tech Industry under Philippine law. The contract is formed when we confirm your registration via email.</Text>
        </LegalSection>

        <LegalSection title='4. User Account and Data Protection'>
          <Text>To use CoverLetter.Work, you must register for an account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.</Text>
        </LegalSection>

        <LegalSection title='5. Prices and Payment Terms'>
          <Text>
            Prices are displayed in your local currency. Base prices are in Philippine Peso (PHP). 
            All prices include applicable taxes. Charges for our services are one-time payments for credits.
          </Text>
          <UnorderedList mt={2} spacing={2} pl={5}>
            <ListItem>
              Payments are processed in PHP, and final charges may vary slightly due to exchange rate fluctuations and conversion fees.
            </ListItem>
            <ListItem>
              Prices include applicable Value Added Tax (VAT) as per local regulations.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='6. Refund Policy'>
          <Text>
            Due to the nature of digital goods and AI generation, all purchases of credits are generally final and non-refundable. 
            However, if you experience technical issues that prevent you from using our service, please contact us at lattetechindustry@coverletter.work within 7 days of your purchase so we can assist you.
          </Text>
        </LegalSection>

        <LegalSection title='7. Dispute Resolution'>
          <Text>
            Any disputes arising out of or in connection with these Terms shall be resolved through amicable negotiations. If a resolution cannot be reached, the dispute shall be subject to the exclusive jurisdiction of the courts of the Philippines.
          </Text>
        </LegalSection>

        <LegalSection title='8. Governing Law'>
          <Text>These Terms are governed by Philippine law. The application of the UN Convention on Contracts for the International Sale of Goods is excluded.</Text>
        </LegalSection>

        <LegalSection title='9. Service Usage and Limitations'>
          <Text>
            CoverLetter.Work provides AI-assisted cover letter generation services. Users 
            acknowledge and agree to the following terms of use:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Our service is designed to help you generate high-quality cover letters tailored for your job applications.
            </ListItem>
            <ListItem>
              Users are encouraged to review their generated cover letters to ensure the information accurately reflects their background and fits their application needs.
            </ListItem>
            <ListItem>
              We reserve the right to limit, suspend, or terminate access to the service 
              at our discretion if we detect abuse or violation of these terms.
            </ListItem>
            <ListItem>
              Users are responsible for maintaining the confidentiality of their account 
              credentials and may not share their account with others.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='10. Disclaimer of Liability'>
          <Text>
            To the maximum extent permitted by applicable law:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              The cover letters generated through our service are provided "AS IS" and 
              "AS AVAILABLE" without any warranties, express or implied.
            </ListItem>
            <ListItem>
              We explicitly disclaim any liability for the content, accuracy, or 
              appropriateness of the generated cover letters for any specific purpose, 
              including but not limited to job applications.
            </ListItem>
            <ListItem>
              Users assume full responsibility for any use, modification, or submission 
              of the generated cover letters in job applications or other professional 
              contexts.
            </ListItem>
            <ListItem>
              We are not liable for any consequences, direct or indirect, arising from 
              the use of our service, including but not limited to:
              <UnorderedList mt={2} pl={5}>
                <ListItem>Missed job opportunities</ListItem>
                <ListItem>Rejected applications</ListItem>
                <ListItem>Professional reputation impact</ListItem>
                <ListItem>Loss of potential income</ListItem>
                <ListItem>Any misrepresentation in generated content</ListItem>
                <ListItem>Technical errors or service interruptions</ListItem>
                <ListItem>Data loss or security breaches</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              While we strive to provide excellent, high-quality cover letters, it is the user's responsibility to review the final content for accuracy before submitting it.
            </ListItem>
            <ListItem>
              We do not guarantee that our service will meet your specific requirements or 
              expectations, or that it will be compatible with your particular job application 
              needs.
            </ListItem>
            <ListItem>
              Our total liability, if any, shall not exceed the amount paid by you 
              for the service in the month preceding the incident.
            </ListItem>
            <ListItem>
              Some jurisdictions do not allow the exclusion of certain warranties or 
              limitations on applicable statutory rights of a consumer, so some or all 
              of the above exclusions and limitations may not apply to you.
            </ListItem>
          </UnorderedList>
          <Text mt={4} fontWeight='semibold'>
            By using our service, you explicitly acknowledge and accept these limitations 
            and disclaimers.
          </Text>
        </LegalSection>

        <LegalSection title='11. Intellectual Property'>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              The service, including all software, algorithms, and interface designs, 
              remains the exclusive property of Latte Tech Industry.
            </ListItem>
            <ListItem>
              While users retain rights to their personal information and modified cover 
              letters, the AI-generated content templates are provided under a limited, 
              non-exclusive license for personal use only.
            </ListItem>
            <ListItem>
              Users may not reproduce, distribute, or commercialize the service or its 
              outputs without explicit written permission.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title="12. Security">
          <Text as="p" fontSize="md" mt={2}>
            All payments are processed securely through PayMongo, a third party online 
            payment provider. We do not store or have access to your full credit card details. 
          </Text>
          <UnorderedList pl={5} mt={2}>
            <ListItem>
              All payment transactions are encrypted and processed securely by PayMongo.
            </ListItem>
            <ListItem>
              For more information about PayMongo's security measures, please visit {" "}
              <Link 
                href="https://paymongo.com" 
                color="blue.500" 
                isExternal
              >
                PayMongo's Website
              </Link>
            </ListItem>
          </UnorderedList>
        </LegalSection>
      </VStack>
    </BorderBox>
  );
};

export default TermsOfService;
