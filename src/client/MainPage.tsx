import { type User, type LnPayment } from "wasp/entities";
import { useAuth } from "wasp/client/auth";

import {
  generateCoverLetter,
  createJob,
  updateCoverLetter,
  updateLnPayment,
  useQuery,
  getJob,
  getCoverLetterCount,
} from "wasp/client/operations";

import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormHelperText,
  Code,
  Checkbox,
  Spinner,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  RadioGroup,
  Radio,
  Tooltip,
  useDisclosure,
  Icon,
  Image,
  Badge,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { FiMinimize2, FiMaximize2, FiBriefcase, FiMessageCircle } from 'react-icons/fi';
import BorderBox from './components/BorderBox';
import { LeaveATip, LoginToBegin } from './components/AlertDialog';
import { convertToSliderValue, convertToSliderLabel } from './components/CreativitySlider';
import * as pdfjsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import LnPaymentModal from './components/LnPaymentModal';
import { fetchLightningInvoice } from './lightningUtils';
import type { LightningInvoice } from './lightningUtils';

import bossjobLogo from './jobsites/bossjob_logo-csUBsW1P.png';
import hiringcafeLogo from './jobsites/hiringcafe_logo-m02U6uWk.png';
import indeedLogo from './jobsites/indeed_logo-BAtONpkv.png';
import jobstreetLogo from './jobsites/jobstreet_logo-CYNtYazg.png';
import kalibrrLogo from './jobsites/kalibrr_logo-DOAWMtD_.png';
import linkedinLogo from './jobsites/linkedin_logo-Bqdewmi5.png';
import onlinejobsphLogo from './jobsites/onlinejobsph_logo-DH21eAc1.png';

const logos = [
  bossjobLogo,
  hiringcafeLogo,
  indeedLogo,
  jobstreetLogo,
  kalibrrLogo,
  linkedinLogo,
  onlinejobsphLogo,
];

function MainPage() {
  const [isPdfReady, setIsPdfReady] = useState<boolean>(false);
  const [jobToFetch, setJobToFetch] = useState<string>('');
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState(30);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lightningInvoice, setLightningInvoice] = useState<LightningInvoice | null>(null);

  const { data: user } = useAuth();

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get('job');

  const {
    data: job,
    isLoading: isJobLoading,
    error: getJobError,
  } = useQuery(getJob, { id: jobToFetch }, { enabled: jobToFetch.length > 0 });

  const { data: coverLetterCount } = useQuery(getCoverLetterCount);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    clearErrors,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: loginIsOpen, onOpen: loginOnOpen, onClose: loginOnClose } = useDisclosure();
  const { isOpen: lnPaymentIsOpen, onOpen: lnPaymentOnOpen, onClose: lnPaymentOnClose } = useDisclosure();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (jobIdParam) {
      setJobToFetch(jobIdParam);
      setIsCoverLetterUpdate(true);
      resetJob();
    } else {
      setIsCoverLetterUpdate(false);
      reset({
        title: '',
        company: '',
        location: '',
        description: '',
      });
    }
  }, [jobIdParam, job]);

  useEffect(() => {
    resetJob();
  }, [job]);

  function resetJob() {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
      });
    }
  }

  // pdf to text parser
  async function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null) return;
    if (event.target.files.length == 0) return;

    setValue('pdf', null);
    setIsPdfReady(false);
    const pdfFile = event.target.files[0];

    // Read the file using file reader
    const fileReader = new FileReader();

    fileReader.onload = function () {
      // turn array buffer into typed array
      if (this.result == null || !(this.result instanceof ArrayBuffer)) {
        return;
      }
      const typedarray = new Uint8Array(this.result);

      // pdfjs should be able to read this
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      const loadingTask = pdfjsLib.getDocument(typedarray);
      let textBuilder: string = '';
      loadingTask.promise
        .then(async (pdf) => {
          // Loop through each page in the PDF file
          for (let i = 1; i <= pdf.numPages; i++) {
            // Get the text content for the page
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items
              .map((item: any) => {
                if (item.str) {
                  return item.str;
                }
                return '';
              })
              .join(' ');
            textBuilder += text;
          }
          setIsPdfReady(true);
          setValue('pdf', textBuilder);
          clearErrors('pdf');
        })
        .catch((err) => {
          alert('An Error occured uploading your PDF. Please try again.');
          console.error(err);
        });
    };
    // Read the file as ArrayBuffer
    try {
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      alert('An Error occured uploading your PDF. Please try again.');
    }
  }

  async function checkIfLnAndPay(user: Omit<User, 'password'>): Promise<LnPayment | null> {
    try {
      if (user.isUsingLn && user.credits === 0) {
        const invoice = await fetchLightningInvoice();
        let lnPayment: LnPayment;
        if (invoice) {
          invoice.status = 'pending';
          lnPayment = await updateLnPayment(invoice);
          setLightningInvoice(invoice);
          lnPaymentOnOpen();
        } else {
          throw new Error('fetching lightning invoice failed');
        }
  
        let status = invoice.status;
        while (status === 'pending') {
          lnPayment = await updateLnPayment(invoice);
          status = lnPayment.status;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (status !== 'success') {
          throw new Error('payment failed');
        }
        return lnPayment;
      } 
    } catch (error) {
      console.error('Error processing payment, please try again');
    }
    return null;
  }



  async function onSubmit(values: any): Promise<void> {
    let canUserContinue = hasUserPaidOrActiveTrial();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!canUserContinue) {
      return;
    }

    try {
      const lnPayment = await checkIfLnAndPay(user);



      const job = await createJob(values);

      const creativityValue = convertToSliderValue(sliderValue);

      const payload = {
        jobId: job.id,
        title: job.title,
        content: values.pdf,
        description: job.description,
        isCompleteCoverLetter,
        temperature: creativityValue,
        lnPayment: lnPayment || undefined,
      };

      const coverLetter = await generateCoverLetter(payload);

      navigate(`/cover-letter/${coverLetter.id}`);
    } catch (error: any) {
      alert(`${error?.message ?? 'Something went wrong, please try again'}`);
      console.error(error);
    }
  }

  async function onUpdate(values: any): Promise<void> {
    const canUserContinue = hasUserPaidOrActiveTrial();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!canUserContinue) {
      return;
    }

    try {
      const lnPayment = await checkIfLnAndPay(user);



      if (!job) {
        throw new Error('Job not found');
      }

      const creativityValue = convertToSliderValue(sliderValue);
      const payload = {
        id: job.id,
        title: values.title,
        company: values.company,
        location: values.location,
        description: values.description,
        content: values.pdf,
        isCompleteCoverLetter,
        temperature: creativityValue,
        lnPayment: lnPayment || undefined,
      };

      const coverLetterId = await updateCoverLetter(payload);

      navigate(`/cover-letter/${coverLetterId}`);
    } catch (error: any) {
      alert(`${error?.message ?? 'Something went wrong, please try again'}`);
      console.error(error);
    }
  }

  function handleFileButtonClick() {
    if (!fileInputRef.current) {
      return;
    } else {
      fileInputRef.current.click();
    }
  }



  function hasUserPaidOrActiveTrial(): Boolean {
    if (user) {
      if (user.isUsingLn) {
        if (user.credits < 3 && user.credits > 0) {
          onOpen();
        }
        return true;
      }
      if (user.credits > 0) {
        if (user.credits < 3) {
          onOpen();
        }
        return true;
      }
      onOpen();
      return false;
    }
    return false;
  }

  const showForm = (isCoverLetterUpdate && job) || !isCoverLetterUpdate;
  const showSpinner = isCoverLetterUpdate && isJobLoading;
  const showJobNotFound = isCoverLetterUpdate && !job && !isJobLoading;

  return (
    <>
      <VStack gap={4} mt={20} mb={10} textAlign="center" maxW="4xl" px={4} align="center" mx="auto">
        <VStack gap={4}>
          {user && (
            <Box px={4} py={1} bg="blue.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="full" mb={-2}>
              <Text fontSize="sm" fontWeight="600" color="blue.600" _dark={{ color: "blue.300" }}>
                Hi, {user.username || user.email?.split('@')[0] || 'User'}! 👋
              </Text>
            </Box>
          )}
          <Heading size="4xl" fontWeight="900" letterSpacing="tighter" lineHeight="1.1" color="gray.900" _dark={{ color: 'white' }}>
            Generate. Edit. <Box as="span" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text" _dark={{ bgGradient: "linear(to-r, blue.400, teal.300)" }}>Get Hired.</Box>
          </Heading>
          <Text fontSize="xl" fontWeight="500" color="gray.600" _dark={{ color: 'gray.400' }} mt={4} maxW="3xl" lineHeight="tall">
          Build your cover letter in seconds. Don't like a sentence? Highlight and rewrite it instantly right on the page.
          </Text>
        </VStack>
        
        <HStack justify="center" wrap="wrap" gap={6} mt={6} color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" fontWeight="600">
          <HStack gap={2} bg="gray.100" _dark={{ bg: "whiteAlpha.100" }} px={4} py={2} borderRadius="full">
            <Icon as={MdCheckCircle} color="gray.900" _dark={{ color: 'white' }} boxSize={4} />
            <Text>Targeted First Drafts</Text>
          </HStack>
          <HStack gap={2} bg="gray.100" _dark={{ bg: "whiteAlpha.100" }} px={4} py={2} borderRadius="full">
            <Icon as={MdCheckCircle} color="gray.900" _dark={{ color: 'white' }} boxSize={4} />
            <Text>Free Highlight-to-Rewrite</Text>
          </HStack>
          <HStack gap={2} bg="gray.100" _dark={{ bg: "whiteAlpha.100" }} px={4} py={2} borderRadius="full">
            <Icon as={MdCheckCircle} color="gray.900" _dark={{ color: 'white' }} boxSize={4} />
            <Text>Instant PDF Export</Text>
          </HStack>
        </HStack>
      </VStack>

      {/* --- Logos Carousel --- */}
      <VStack mt={10} mb={10} w="full" overflow="hidden" position="relative" maxW="5xl" mx="auto">
        <Text fontSize="sm" fontWeight="600" color="gray.500" mb={8} textTransform="uppercase" letterSpacing="wider">
          Tailored for recruitment platforms like
        </Text>
        
        <Box
          w="full"
          overflow="hidden"
          position="relative"
        >
          <style>
            {`
              @keyframes slide {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes pulse-fast {
                0% { opacity: 0.7; transform: scale(0.98); }
                50% { opacity: 1; transform: scale(1.02); }
                100% { opacity: 0.7; transform: scale(0.98); }
              }
            `}
          </style>
          <Box
            display="flex"
            w="max-content"
            animation="slide 30s linear infinite"
            _hover={{ animationPlayState: 'paused' }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <Box key={index} w="200px" display="flex" alignItems="center" justifyContent="center" px={6}>
                <Image src={logo} alt="Job Site Logo" maxH="40px" objectFit="contain" />
              </Box>
            ))}
          </Box>
        </Box>
      </VStack>
      
      {/* <Box
        px={4}
        py={1.5}
        mt={6}
        mb={-2}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        bg="transparent"
        _dark={{
          borderColor: "whiteAlpha.200",
        }}
        visibility={!coverLetterCount ? 'hidden' : 'visible'}
        transition='all 0.2s ease-in-out'
        zIndex={1}
      >
        <Text fontSize='xs' fontWeight="500" color="gray.600" _dark={{ color: "gray.400" }}>
          {coverLetterCount?.toLocaleString()} Cover Letters Generated
        </Text>
      </Box> */}
      <BorderBox>
        <form
          onSubmit={!isCoverLetterUpdate ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
          style={{ width: '100%' }}
        >
          <HStack justify="space-between" align="center" mb={6} w="full">
            <Heading size={'md'} fontWeight="600" letterSpacing="tight">
              Job Details {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
            </Heading>
            {user && (
              <Badge colorScheme={user.credits > 0 ? "blue" : "red"} variant="subtle" px={3} py={1} borderRadius="full" fontSize="sm" textTransform="none" fontWeight="700" boxShadow="sm">
                ✨ {user.credits} Credits Remaining
              </Badge>
            )}
          </HStack>

          {showSpinner && <Spinner />}
          {showForm && (
            <VStack gap={5} w="full">
              <FormControl isInvalid={!!formErrors.title}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }} mb={1.5}>Job Title</FormLabel>
                <Input
                  id='title'
                  placeholder='e.g. Senior React Developer'
                  {...register('title', {
                    required: 'This is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum length should be 2',
                    },
                  })}
                  onFocus={(e: any) => {
                    if (user === null) {
                      loginOnOpen();
                      e.target.blur();
                    }
                  }}
                />
                <FormErrorMessage>{!!formErrors.title && formErrors.title.message?.toString()}</FormErrorMessage>
              </FormControl>
              
              <HStack w="full" gap={6}>
                <FormControl isInvalid={!!formErrors.company}>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }} mb={1.5}>Company</FormLabel>
                  <Input
                    id='company'
                    placeholder='Company Name'
                    {...register('company', {
                      required: 'This is required',
                      minLength: {
                        value: 1,
                        message: 'Minimum length should be 1',
                      },
                    })}
                  />
                  <FormErrorMessage>{!!formErrors.company && formErrors.company.message?.toString()}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={!!formErrors.location}>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }} mb={1.5}>Location</FormLabel>
                  <Input
                    id='location'
                    placeholder='Location'
                    {...register('location', {
                      required: 'This is required',
                      minLength: {
                        value: 2,
                        message: 'Minimum length should be 2',
                      },
                    })}
                  />
                  <FormErrorMessage>{!!formErrors.location && formErrors.location.message?.toString()}</FormErrorMessage>
                </FormControl>
              </HStack>
              
              <FormControl isInvalid={!!formErrors.description}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }} mb={1.5}>Job Description</FormLabel>
                <Textarea
                  id='description'
                  borderRadius="md"
                  borderColor="gray.200"
                  _dark={{ borderColor: "whiteAlpha.200" }}
                  minH="120px"
                  placeholder='Copy and Paste the job description here...'
                  _focus={{ borderColor: "gray.900", boxShadow: "none" }}
                  {...register('description', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>
                  {!!formErrors.description && formErrors.description.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!formErrors.pdf}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }} mb={1.5}>Resume / CV</FormLabel>
                <Input
                  id='pdf'
                  type='file'
                  accept='application/pdf'
                  placeholder='pdf'
                  {...register('pdf', {
                    required: 'Please upload a CV/Resume',
                  })}
                  onChange={(e) => {
                    onFileUpload(e);
                  }}
                  display='none'
                  ref={fileInputRef}
                />
                <VStack
                  border={!!formErrors.pdf ? '1px dashed #FC8181' : '1px dashed'}
                  borderColor={!!formErrors.pdf ? '#FC8181' : 'gray.300'}
                  _dark={{ borderColor: !!formErrors.pdf ? '#FC8181' : 'whiteAlpha.300' }}
                  borderRadius="md"
                  bg='transparent'
                  p={4}
                  alignItems='flex-start'
                  _hover={{
                    borderColor: 'gray.400',
                  }}
                  transition='all 0.2s'
                >
                  <HStack>
                    <Button size='sm' variant="outline" borderColor="gray.300" borderRadius="md" onClick={handleFileButtonClick}>
                      Upload File
                    </Button>
                    {isPdfReady && <Text fontSize={'sm'} fontWeight="500" color="gray.700" _dark={{ color: "gray.300" }}>Uploaded</Text>}
                    <FormErrorMessage>{!!formErrors.pdf && formErrors.pdf.message?.toString()}</FormErrorMessage>
                  </HStack>
                </VStack>
              </FormControl>

              <VStack
                border={'1px solid'}
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.200" }}
                borderRadius="md"
                w="full"
                px={5}
                py={4}
                alignItems='flex-start'
              >
                <FormControl mb={4}>
                  <FormLabel
                    htmlFor='temperature'
                    fontSize='sm'
                    fontWeight="500"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                    mb={1.5}
                  >
                    Creativity Level
                  </FormLabel>
                  <Slider
                    id='temperature'
                    defaultValue={30}
                    min={0}
                    max={68}
                    colorScheme='gray'
                    onChange={(v) => setSliderValue(v)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderTrack bg="gray.100" _dark={{ bg: "whiteAlpha.200" }}>
                      <SliderFilledTrack bg="gray.800" _dark={{ bg: "gray.200" }} />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg='gray.800'
                      color='white'
                      placement='top'
                      isOpen={showTooltip}
                      label={`${convertToSliderLabel(sliderValue)}`}
                    >
                      <SliderThumb boxSize={4} borderColor="gray.800" _dark={{ borderColor: "gray.200" }} />
                    </Tooltip>
                  </Slider>
                </FormControl>
              </VStack>

              <VStack alignItems='center' w="full" mt={4}>
                <Button
                  bg="blue.600"
                  color="white"
                  _dark={{ bg: "blue.500", color: "white" }}
                  _hover={{ bg: "blue.700", _dark: { bg: "blue.400" }, transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                  borderRadius="md"
                  fontWeight="500"
                  size='md'
                  w="full"
                  isLoading={isSubmitting}
                  disabled={user === null}
                  type='submit'
                >
                  {!isCoverLetterUpdate ? 'Generate Cover Letter' : 'Create New Cover Letter'}
                </Button>
                {isSubmitting ? (
                  <HStack 
                    mt={3} 
                    h="24px"
                    spacing={3}
                    animation="pulse-fast 1.2s ease-in-out infinite"
                  >
                    <Icon as={MdCheckCircle} color="blue.500" _dark={{ color: "blue.300" }} boxSize={4} />
                    <Text fontSize='sm' fontWeight="700" bgGradient="linear(to-r, blue.500, purple.500)" bgClip="text" textTransform="uppercase" letterSpacing="widest">
                      Analyzing & Generating...
                    </Text>
                  </HStack>
                ) : (
                  <Box h="24px" mt={3} />
                )}
              </VStack>
            </VStack>
          )}
          {showJobNotFound && (
            <>
              <Text fontSize='sm' color='gray.500'>
                Can't find that job...
              </Text>
            </>
          )}
        </form>
      </BorderBox>

      {/* --- How it Works --- */}
      <VStack mt={32} w="full" maxW="5xl" px={4} gap={12}>
        <VStack textAlign="center">
          <Heading size="xl" fontWeight="800" letterSpacing="tight" color="gray.900" _dark={{ color: "white" }}>
            How it Works
          </Heading>
          <Text color="gray.500" fontSize="lg">Three simple steps to the perfect pitch.</Text>
        </VStack>
        
        <HStack w="full" gap={6} align="stretch" flexDirection={{ base: "column", md: "row" }}>
          <VStack flex={1} align="start" p={8} border="1px solid" borderColor="gray.200" borderRadius="2xl" bg="white" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.100" }} transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'blue.100', _dark: { borderColor: 'blue.800' } }}>
            <Box boxSize={12} borderRadius="xl" bg="blue.50" display="flex" alignItems="center" justifyContent="center" fontWeight="800" fontSize="lg" color="blue.600" _dark={{ bg: "whiteAlpha.100", color: "blue.300" }}>1</Box>
            <Heading size="md" mt={4} color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Upload CV</Heading>
            <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} mt={2} lineHeight="tall">Provide your background so the AI knows your exact experience and tone.</Text>
          </VStack>
          <VStack flex={1} align="start" p={8} border="1px solid" borderColor="gray.200" borderRadius="2xl" bg="white" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.100" }} transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'purple.100', _dark: { borderColor: 'purple.800' } }}>
            <Box boxSize={12} borderRadius="xl" bg="purple.50" display="flex" alignItems="center" justifyContent="center" fontWeight="800" fontSize="lg" color="purple.600" _dark={{ bg: "whiteAlpha.100", color: "purple.300" }}>2</Box>
            <Heading size="md" mt={4} color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Paste Job Details</Heading>
            <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} mt={2} lineHeight="tall">Give us the job title and description so we can tailor the keywords perfectly.</Text>
          </VStack>
          <VStack flex={1} align="start" p={8} border="1px solid" borderColor="teal.100" _dark={{ borderColor: "teal.800", bg: "gray.800" }} borderRadius="2xl" bg="teal.50" transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'teal.200', _dark: { borderColor: 'teal.700' } }}>
            <Box boxSize={12} borderRadius="xl" bg="teal.500" display="flex" alignItems="center" justifyContent="center" fontWeight="800" fontSize="lg" color="white" _dark={{ bg: "teal.400", color: "gray.900" }}>3</Box>
            <Heading size="md" mt={4} color="teal.900" _dark={{ color: "teal.100" }} fontWeight="800" letterSpacing="tight">Generate & Refine</Heading>
            <Text fontSize="sm" color="teal.700" _dark={{ color: "teal.200" }} mt={2} lineHeight="tall">Get a tailored letter in seconds. Tweak and refine instantly inline.</Text>
          </VStack>
        </HStack>
      </VStack>

      {/* --- Why Choose CoverLetter.Work --- */}
      <VStack mt={32} w="full" maxW="4xl" px={4} gap={10}>
        <VStack textAlign="center">
          <Heading size="xl" fontWeight="800" letterSpacing="tight" color="gray.900" _dark={{ color: "white" }}>
            Why choose CoverLetter.Work?
          </Heading>
        </VStack>
        <VStack w="full" gap={6}>
          <HStack w="full" p={8} border="1px solid" borderColor="gray.200" _dark={{ borderColor: "whiteAlpha.100", bg: "gray.800" }} bg="white" borderRadius="2xl" align="start" transition="all 0.3s" _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}>
            <Box p={3} bg="blue.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="xl" mr={4}>
              <Icon as={MdCheckCircle} color="blue.600" _dark={{ color: "blue.400" }} boxSize={6} />
            </Box>
            <VStack align="start" gap={2}>
              <Heading size="md" color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Professional English, Zero "Fluff"</Heading>
              <Text fontSize="md" color="gray.500" _dark={{ color: "gray.400" }} lineHeight="tall">Most AI generators use heavy, Americanized corporate jargon that makes you sound like a robot (nobody actually says "delve" or "tapestry"). Our AI is tuned to write clean, professional, and direct English that foreign clients and local recruiters actually appreciate.</Text>
            </VStack>
          </HStack>
          <HStack w="full" p={8} border="1px solid" borderColor="gray.200" _dark={{ borderColor: "whiteAlpha.100", bg: "gray.800" }} bg="white" borderRadius="2xl" align="start" transition="all 0.3s" _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}>
            <Box p={3} bg="green.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="xl" mr={4}>
              <Icon as={MdCheckCircle} color="green.600" _dark={{ color: "green.400" }} boxSize={6} />
            </Box>
            <VStack align="start" gap={2}>
              <Heading size="md" color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Local Payments, No Monthly Subscriptions</Heading>
              <Text fontSize="md" color="gray.500" _dark={{ color: "gray.400" }} lineHeight="tall">Stop paying $20/month for foreign AI tools you only use a few times. We are proudly localized with PayMongo. Pay in Pesos using GCash, Maya, or QRPh. Buy credits only when you are actively job hunting—no hidden auto-renewals, no credit card required.</Text>
            </VStack>
          </HStack>
          <HStack w="full" p={8} border="1px solid" borderColor="gray.200" _dark={{ borderColor: "whiteAlpha.100", bg: "gray.800" }} bg="white" borderRadius="2xl" align="start" transition="all 0.3s" _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}>
            <Box p={3} bg="purple.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="xl" mr={4}>
              <Icon as={MdCheckCircle} color="purple.600" _dark={{ color: "purple.400" }} boxSize={6} />
            </Box>
            <VStack align="start" gap={2}>
              <Heading size="md" color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Built for the Platforms You Actually Use</Heading>
              <Text fontSize="md" color="gray.500" _dark={{ color: "gray.400" }} lineHeight="tall">Whether you are pitching a direct client on Upwork, applying for a remote role on OnlineJobs.ph, or passing the strict ATS algorithms on JobStreet and LinkedIn, our generated letters adapt to the exact keywords the employer is looking for.</Text>
            </VStack>
          </HStack>
          <HStack w="full" p={8} border="1px solid" borderColor="gray.200" _dark={{ borderColor: "whiteAlpha.100", bg: "gray.800" }} bg="white" borderRadius="2xl" align="start" transition="all 0.3s" _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}>
            <Box p={3} bg="teal.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="xl" mr={4}>
              <Icon as={MdCheckCircle} color="teal.600" _dark={{ color: "teal.400" }} boxSize={6} />
            </Box>
            <VStack align="start" gap={2}>
              <Heading size="md" color="gray.900" _dark={{ color: "white" }} fontWeight="800" letterSpacing="tight">Total Control with "Highlight-to-Edit"</Heading>
              <Text fontSize="md" color="gray.500" _dark={{ color: "gray.400" }} lineHeight="tall">We don't just spit out a PDF and force you to use it. Our built-in inline editor lets you highlight any sentence that doesn't feel right and tweak it instantly. Change the tone, shorten a paragraph, or add a specific technical skill on the fly without ever leaving the page.</Text>
            </VStack>
          </HStack>
        </VStack>
      </VStack>

      {/* --- Refine Your Message Instantly --- */}
      <VStack mt={32} w="full" maxW="4xl" px={4} gap={10} textAlign="center">
        <VStack gap={4}>
          <Heading size="xl" fontWeight="800" letterSpacing="tight" color="gray.900" _dark={{ color: "white" }}>
            Refine Your Message Instantly
          </Heading>
          <Text color="gray.500" fontSize="lg" maxW="2xl">
            Highlight any part of your generated letter to easily adjust the tone and length. Make it yours, faster.
          </Text>
        </VStack>

        <Box w="full" maxW="3xl" p={{ base: 6, md: 10 }} bg="white" border="1px solid" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }} borderRadius="2xl" position="relative" boxShadow="xl">
          <Text color="gray.700" _dark={{ color: "gray.300" }} fontSize="md" textAlign="left" lineHeight="loose">
            Dear Hiring Manager,<br/><br/>
            I am thrilled to apply for the Senior React Developer role. With over 5 years of experience building highly scalable applications, <Box as="span" bg="gray.900" _dark={{ bg: "white", color: "gray.900" }} color="white" borderRadius="md" px={2} py={1} fontWeight="600" boxShadow="sm">I have consistently driven 30% performance increases across my front-end architecture.</Box> I believe my background aligns perfectly with the requirements...
          </Text>
          
          <Box position={{ base: "relative", md: "absolute" }} mt={{ base: 6, md: 0 }} bottom={-20} right={{ base: 0, md: 10 }} bg="white" p={2} borderRadius="xl" boxShadow="0px 10px 40px rgba(0, 0, 0, 0.15)" border="1px solid" borderColor="gray.100" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }} overflow="hidden" minW="220px">
            <Text fontSize="xs" fontWeight="700" color="gray.500" _dark={{ color: "whiteAlpha.600" }} px={2} pt={1} pb={2} letterSpacing="wide" textAlign="left">
              🤔 Ask AI to make it...
            </Text>
            <VStack align="stretch" spacing={1}>
              <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMinimize2 />} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
                More Concise
              </Button>
              <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMaximize2 />} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
                More Detailed
              </Button>
              <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiBriefcase />} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
                More Professional
              </Button>
              <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMessageCircle />} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
                More Casual
              </Button>
            </VStack>
          </Box>
        </Box>
      </VStack>

      {/* --- CTA --- */}
      {!user && (
        <VStack mt={40} mb={16} w="full" px={4} gap={8} textAlign="center">
          <Heading size="2xl" fontWeight="900" letterSpacing="tighter" color="gray.900" _dark={{ color: "white" }}>
            Ready to land more interviews?
          </Heading>
          <Button 
            size="lg" 
            bg="blue.600" 
            color="white" 
            _hover={{ bg: "blue.700", transform: "translateY(-4px)", boxShadow: "xl" }} 
            _dark={{ bg: "blue.500", color: "white", _hover: { bg: "blue.400", transform: "translateY(-4px)", boxShadow: "xl" } }}
            h={16} 
            px={12} 
            borderRadius="full" 
            fontWeight="800"
            fontSize="lg"
            transition="all 0.2s"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Try Now! Try it for free 3 credits.
          </Button>
        </VStack>
      )}

      <LeaveATip
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        credits={user?.credits || 0}
        isUsingLn={user?.isUsingLn || false}
      />
      <LoginToBegin isOpen={loginIsOpen} onOpen={loginOnOpen} onClose={loginOnClose} />
      <LnPaymentModal isOpen={lnPaymentIsOpen} onClose={lnPaymentOnClose} lightningInvoice={lightningInvoice} />
    </>
  );
}

export default MainPage;