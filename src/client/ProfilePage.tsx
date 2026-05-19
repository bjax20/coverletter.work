import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { createPaymongoCheckout, useQuery, getUserInfo } from 'wasp/client/operations';
import BorderBox from './components/BorderBox';
import { Box, Heading, Text, Button, Code, Spinner, VStack, HStack, Link, Grid, GridItem, Badge, List, ListItem, ListIcon } from '@chakra-ui/react';
import { useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

export default function ProfilePage({ user }: { user: User }) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });

  async function handleCheckout(tier: string) {
    setLoadingTier(tier);
    try {
      const response = await createPaymongoCheckout({ tier });
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setLoadingTier(null);
  }

  return (
    <BorderBox>
      {!!userInfo ? (
        <VStack spacing={8} w="full" maxW="6xl" mx="auto" py={4}>
          <Heading size='lg'>👋 Hi {userInfo.email || 'There'} </Heading>
          
          <VStack bg="purple.50" p={6} borderRadius="xl" w="full" textAlign="center" border="1px solid" borderColor="purple.100">
            <Heading size='md' color="purple.700">You have <Code colorScheme="purple" fontSize="xl" px={3} py={1} borderRadius="md" mx={2}>{userInfo?.credits || 0}</Code> cover letters available</Heading>
            <Text fontSize="sm" color="purple.600" mt={2}>
              Need more? Top up your credits below. They never expire!
            </Text>
          </VStack>

          <VStack spacing={2} w="full" textAlign="center" mt={6}>
            <Heading size="md" color="gray.700">We accept: QR Ph, GCash, Maya, GrabPay, ShopeePay, BPI, UnionBank</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              One-time payment • No auto-recurring subscriptions • Credits never expire
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full" mt={6} alignItems="stretch">
            {/* Tier 1 */}
            <GridItem>
              <VStack h="full" bg="white" borderRadius="2xl" p={8} border="1px solid" borderColor="gray.200" boxShadow="sm" align="start" spacing={6} transition="all 0.2s" _hover={{ boxShadow: 'md' }}>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.800">The Tester</Heading>
                  <Text color="gray.500" fontSize="sm">Just testing the waters. Perfect for your top priority applications.</Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Heading size="2xl" color="gray.900">₱79</Heading>
                  <Text color="purple.600" fontWeight="bold" mt={2}>5 Credits</Text>
                </VStack>
                <Button 
                  w="full" 
                  size="lg" 
                  variant="outline" 
                  colorScheme="purple" 
                  isLoading={loadingTier === 'tester'} 
                  onClick={() => handleCheckout('tester')}
                >
                  Choose Plan
                </Button>
                <List spacing={3} mt={4}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">5 ATS-Optimized Cover Letters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Tailored tone matching the job description</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Access to Premium Inline Editing text tools</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Standard Generation Model</Text></ListItem>
                </List>
              </VStack>
            </GridItem>

            {/* Tier 2 */}
            <GridItem>
              <VStack h="full" bg="white" borderRadius="2xl" p={8} border="2px solid" borderColor="purple.500" boxShadow="xl" align="start" spacing={6} position="relative" transform={{ md: 'scale(1.05)' }} zIndex={1}>
                <Badge position="absolute" top="-3" left="50%" transform="translateX(-50%)" colorScheme="purple" px={3} py={1} borderRadius="full" textTransform="uppercase" fontSize="xs" fontWeight="bold">
                  Most Popular
                </Badge>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.800">The Job Hunter</Heading>
                  <Text color="gray.500" fontSize="sm">Our most chosen plan. A focused week or two of applying to land interviews fast.</Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Heading size="2xl" color="gray.900">₱199</Heading>
                  <Text color="purple.600" fontWeight="bold" mt={2}>20 Credits</Text>
                </VStack>
                <Button 
                  w="full" 
                  size="lg" 
                  colorScheme="purple" 
                  isLoading={loadingTier === 'hunter'} 
                  onClick={() => handleCheckout('hunter')}
                  boxShadow="md"
                >
                  Choose Plan
                </Button>
                <List spacing={3} mt={4}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">20 ATS-Optimized Cover Letters (Only ₱9.95 per letter!)</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Platform-Specific Tuning (Optimized for Upwork Proposals, LinkedIn, and OnlineJobs.ph)</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Advanced Keyword Matching to beat automated HR filters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Access to Premium Inline Editing text tools</Text></ListItem>
                </List>
              </VStack>
            </GridItem>

            {/* Tier 3 */}
            <GridItem>
              <VStack h="full" bg="white" borderRadius="2xl" p={8} border="1px solid" borderColor="gray.200" boxShadow="sm" align="start" spacing={6} transition="all 0.2s" _hover={{ boxShadow: 'md' }}>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.800">The Aggressive Freelancer</Heading>
                  <Text color="gray.500" fontSize="sm">Best value for career switchers, VAs, and high-volume daily applications.</Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Heading size="2xl" color="gray.900">₱349</Heading>
                  <Text color="purple.600" fontWeight="bold" mt={2}>45 Credits</Text>
                </VStack>
                <Button 
                  w="full" 
                  size="lg" 
                  variant="outline" 
                  colorScheme="purple" 
                  isLoading={loadingTier === 'aggressive'} 
                  onClick={() => handleCheckout('aggressive')}
                >
                  Choose Plan
                </Button>
                <List spacing={3} mt={4}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">45 ATS-Optimized Cover Letters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Full Platform-Specific Tuning & Keyword Extraction</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Priority Generation Speed</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="purple.500" mt={1} /> <Text fontSize="sm">Access to Premium Inline Editing text tools</Text></ListItem>
                </List>
              </VStack>
            </GridItem>
          </Grid>

          {userInfo.isUsingLn && (
            <VStack py={3} gap={5} w="full">
              <VStack layerStyle='card' py={5} px={7} gap={3} width='100%' justifyContent='center' alignItems='center'>
                <Heading size='xl'>⚡️</Heading>
                <Text textAlign='center' fontSize='md'>
                  You have affordable, pay-per-use access to CoverLetterGPT with GPT-4o via the Lightning Network
                </Text>
                <Text textAlign='center' fontSize='sm'>
                  Note: if you prefer a monthly subscription, please logout and sign in with Google.
                </Text>
              </VStack>
            </VStack>
          )}
          
          <Button alignSelf='flex-end' size='sm' onClick={() => logout()} variant="ghost">
            Logout
          </Button>
        </VStack>
      ) : (
        <VStack h="50vh" justify="center">
          <Spinner size="xl" color="purple.500" />
        </VStack>
      )}
    </BorderBox>
  );
}
