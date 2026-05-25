import { type Job, type User } from "wasp/entities";

import {
  useAction,
  type OptimisticUpdateDefinition,
  updateJob,
  useQuery,
  getJobs,
  getCoverLetters,
} from "wasp/client/operations";

import { useState, useEffect } from 'react';
import {
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  useDisclosure,
  Divider,
  Spinner,
  Box,
  SimpleGrid,
  Flex,
  Badge,
  IconButton,
  Icon,
  Tooltip,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import ModalElement from './components/Modal';
import DescriptionModal from './components/DescriptionModal';
import BorderBox from './components/BorderBox';
import { useNavigate } from 'react-router';
import { DeleteJob } from './components/AlertDialog';
import { FiTrash2, FiMapPin, FiBriefcase, FiFileText, FiPlus, FiCheckCircle, FiCircle, FiInfo } from 'react-icons/fi';

function JobsPage({ user }: { user: User }) {
  const [jobId, setJobId] = useState<string>('');
  const [descriptionText, setDescriptionText] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Applied'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const navigate = useNavigate();

  const { data: jobs, isLoading, error } = useQuery(getJobs);
  const { data: coverLetter } = useQuery(getCoverLetters, { id: jobId }, { enabled: jobId.length > 0 });

  const filteredJobs = jobs?.filter(job => {
    if (activeTab === 'Pending') return !job.isCompleted;
    if (activeTab === 'Applied') return job.isCompleted;
    return true;
  }) || [];

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const updateJobOptimistically = useAction(updateJob, {
    optimisticUpdates: [
      {
        getQuerySpecifier: () => [getJobs],
        updateQuery: ({ isCompleted, id }, oldData) => {
          return oldData && oldData.map((job) => (job.id === id ? { ...job, isCompleted } : job));
        },
      } as OptimisticUpdateDefinition<Pick<Job, 'id' | 'isCompleted'>, Job[]>,
    ],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: desIsOpen, onOpen: desOnOpen, onClose: desOnClose } = useDisclosure();
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();

  const coverLetterHandler = (job: Job) => {
    if (job) {
      setJobId(job.id);
      onOpen();
    }
  };

  const checkboxHandler = async (e: any, job: Job) => {
    try {
      const payload = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        isCompleted: e.target.checked,
      };
      updateJobOptimistically(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCoverLetterHandler = async (jobId: string) => {
    navigate(`/?job=${jobId}`);
  };

  return (
    <VStack gap={6} mt={8} px={4} w="full" maxW="7xl" mx="auto" alignItems="center" pb={12}>
      <VStack w="full" gap={6}>
        <HStack justify="space-between" w="full" align="flex-start">
          <VStack align="start" gap={2}>
            <Heading size='xl' fontWeight="800" letterSpacing="tight" color="gray.900" _dark={{ color: "whiteAlpha.900" }}>
              Your Tracked Jobs
            </Heading>
            <Text fontSize="md" color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
              Manage your applications and craft targeted cover letters.
            </Text>
          </VStack>
          <Button 
            leftIcon={<FiPlus />} 
            size='md' 
            bg="brand.500" 
            color="white" 
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'md' }} 
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.2s"
            fontWeight="bold"
            px={6}
            onClick={() => navigate('/')}
            // Fallback colors if brand.500 isn't defined in the theme
            sx={{ bg: "blue.600", _hover: { bg: "blue.700" } }}
            _dark={{ bg: "blue.300", color: "gray.900", _hover: { bg: "blue.200" } }}
          >
            New Cover Letter
          </Button>
        </HStack>

        <Box w="full" overflowX="auto" pb={2}>
          <Tabs variant="soft-rounded" colorScheme="blue" onChange={(index) => {
            const tabs: ('All' | 'Pending' | 'Applied')[] = ['All', 'Pending', 'Applied'];
            setActiveTab(tabs[index]);
            setCurrentPage(1);
          }}>
            <TabList gap={2}>
              <Tab fontWeight="600">All Jobs</Tab>
              <Tab fontWeight="600">Pending</Tab>
              <Tab fontWeight="600">Applied</Tab>
            </TabList>
          </Tabs>
        </Box>

        {isLoading && (
          <Flex w="full" justify="center" py={20}>
            <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
          </Flex>
        )}

        {!!jobs && !isLoading && (
          filteredJobs.length > 0 ? (
            <VStack w="full" spacing={8}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {currentJobs.map((job: Job) => (
                  <Flex
                    key={job.id}
                    direction="column"
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    _dark={{ bg: "whiteAlpha.50", borderColor: "whiteAlpha.200" }}
                    shadow="sm"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{ shadow: 'xl', transform: 'translateY(-4px)', borderColor: 'blue.200', _dark: { borderColor: 'blue.400', bg: "whiteAlpha.100" } }}
                    position="relative"
                  >
                    <Box position="absolute" top={0} left={0} w="full" h="3px" bg={job.isCompleted ? "green.400" : "blue.400"} _dark={{ bg: job.isCompleted ? "green.300" : "blue.300" }} />
                    
                    <VStack align="stretch" p={6} gap={4} flex={1}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" gap={1} flex={1} overflow="hidden">
                          <Text 
                            fontWeight="700" 
                            fontSize="lg" 
                            color="gray.900" 
                            _dark={{ color: "white" }} 
                            noOfLines={1}
                            title={job.title}
                            textDecoration={job.isCompleted ? 'line-through' : 'none'}
                            opacity={job.isCompleted ? 0.6 : 1}
                          >
                            {job.title}
                          </Text>
                          <HStack color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" spacing={3}>
                            <HStack spacing={1}>
                              <Icon as={FiBriefcase} />
                              <Text noOfLines={1} title={job.company}>{job.company}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                        
                        <Tooltip label={job.isCompleted ? "Mark as Pending" : "Mark as Applied"} placement="top">
                          <IconButton
                            aria-label="Toggle Status"
                            icon={<Icon as={job.isCompleted ? FiCheckCircle : FiCircle} boxSize={6} />}
                            variant="ghost"
                            color={job.isCompleted ? "green.500" : "gray.300"}
                            _hover={{ color: job.isCompleted ? "green.600" : "blue.500", bg: "transparent" }}
                            onClick={(e) => checkboxHandler({ target: { checked: !job.isCompleted } }, job)}
                            size="sm"
                            minW="auto"
                            h="auto"
                            p={0}
                          />
                        </Tooltip>
                      </HStack>

                      <HStack fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
                        <Icon as={FiMapPin} color="gray.400" />
                        <Text noOfLines={1}>{job.location || 'Remote / Unspecified'}</Text>
                      </HStack>

                      <HStack justify="space-between" align="center" mt="auto" pt={2}>
                        <Badge 
                          colorScheme={job.isCompleted ? "green" : "blue"} 
                          variant="subtle" 
                          px={2} 
                          py={1} 
                          borderRadius="full"
                          textTransform="capitalize"
                          fontSize="xs"
                          fontWeight="600"
                        >
                          {job.isCompleted ? 'Applied' : 'Pending'}
                        </Badge>
                        
                        <HStack spacing={1}>
                          <Tooltip label="View Description">
                            <IconButton
                              aria-label="View Details"
                              icon={<FiInfo />}
                              size="sm"
                              variant="ghost"
                              color="gray.500"
                              _hover={{ bg: "gray.100", color: "blue.600", _dark: { bg: "whiteAlpha.200", color: "blue.300" } }}
                              onClick={() => {
                                setDescriptionText(job.description);
                                desOnOpen();
                              }}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Job">
                            <IconButton
                              aria-label="Delete Job"
                              icon={<FiTrash2 />}
                              size="sm"
                              variant="ghost"
                              color="gray.400"
                              _hover={{ bg: "red.50", color: "red.500", _dark: { bg: "red.900", color: "red.300" } }}
                              onClick={() => {
                                setJobId(job.id);
                                deleteOnOpen();
                              }}
                            />
                          </Tooltip>
                        </HStack>
                      </HStack>
                    </VStack>

                    <Divider borderColor="gray.100" _dark={{ borderColor: "whiteAlpha.100" }} />
                    
                    <HStack p={4} bg="gray.50" _dark={{ bg: "whiteAlpha.50" }} justify="space-between">
                       <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<FiFileText />} 
                          color="gray.700" 
                          _dark={{ color: "whiteAlpha.800" }}
                          _hover={{ bg: "gray.200", _dark: { bg: "whiteAlpha.200", color: "white" } }}
                          onClick={() => coverLetterHandler(job)}
                          fontWeight="600"
                        >
                          Letters
                        </Button>
                        <Button 
                          size="sm" 
                          leftIcon={<FiPlus />} 
                          bg="gray.900" 
                          color="white" 
                          _hover={{ bg: "black" }} 
                          _dark={{ bg: "whiteAlpha.200", color: "whiteAlpha.900", _hover: { bg: "whiteAlpha.300", color: "white" } }}
                          onClick={() => updateCoverLetterHandler(job.id)}
                          fontWeight="600"
                        >
                          New Cover Letter
                        </Button>
                    </HStack>
                  </Flex>
                ))}
              </SimpleGrid>

              {totalPages > 1 && (
                <HStack w="full" justify="space-between" pt={4}>
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    isDisabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    _hover={{ bg: "gray.100", _dark: { bg: "whiteAlpha.200" } }}
                  >
                    Previous
                  </Button>
                  <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} fontWeight="500">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    isDisabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    _hover={{ bg: "gray.100", _dark: { bg: "whiteAlpha.200" } }}
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </VStack>
          ) : (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={20} 
              px={6} 
              w="full" 
              bg="white" 
              borderRadius="xl" 
              border="1px dashed" 
              borderColor="gray.300" 
              _dark={{ bg: "whiteAlpha.50", borderColor: "whiteAlpha.200" }}
            >
              <Box p={4} bg="blue.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="full" mb={4}>
                <Icon as={FiBriefcase} boxSize={8} color="blue.500" _dark={{ color: "blue.300" }} />
              </Box>
              <Heading size="md" color="gray.900" _dark={{ color: "whiteAlpha.900" }} mb={2}>
                {activeTab === 'All' ? 'No jobs tracked yet' : `No ${activeTab.toLowerCase()} jobs found`}
              </Heading>
              <Text color="gray.500" _dark={{ color: "whiteAlpha.600" }} textAlign="center" maxW="md" mb={6}>
                {activeTab === 'All' 
                  ? 'Start tracking your job applications to easily manage and generate targeted cover letters.'
                  : `You don't have any jobs marked as ${activeTab.toLowerCase()} at the moment.`}
              </Text>
              {activeTab === 'All' && (
                <Button 
                  leftIcon={<FiPlus />} 
                  bg="blue.600" 
                  color="white" 
                  _hover={{ bg: "blue.700" }} 
                  _dark={{ bg: "blue.300", color: "gray.900", _hover: { bg: "blue.200" } }}
                  onClick={() => navigate('/')}
                >
                  Add Your First Job
                </Button>
              )}
            </Flex>
          )
        )}
      </VStack>

      {coverLetter && coverLetter.length > 0 && (
        <ModalElement coverLetterData={coverLetter} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      )}
      {descriptionText && (
        <DescriptionModal description={descriptionText} isOpen={desIsOpen} onOpen={desOnOpen} onClose={desOnClose} />
      )}
      <DeleteJob jobId={jobId} isOpen={deleteIsOpen} onOpen={deleteOnOpen} onClose={deleteOnClose} />
    </VStack>
  );
}

export default JobsPage;
