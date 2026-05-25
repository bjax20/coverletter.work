import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { createPaymongoCheckout, useQuery, getUserInfo } from 'wasp/client/operations';
import BorderBox from './components/BorderBox';
import { Box, Heading, Text, Button, Spinner, VStack, HStack, Grid, GridItem, Badge, List, ListItem, ListIcon, Divider, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { IoCheckmarkCircle, IoFlashOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import gcashLogo from './payment-methods/gcash_logo-D_MXPFWx.png';
import mayaLogo from './payment-methods/maya_logo-pwM9QIuw.png';
import grabpayLogo from './payment-methods/grabpay_logo-6FIJNdO1.png';
import shopeepayLogo from './payment-methods/shopeepay_logo-Vevx_T6x.png';
import bpiLogo from './payment-methods/bpi_logo-C6W3vZO1.png';
import unionbankLogo from './payment-methods/unionbank_logo-B8_kvQjN.png';

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
    <VStack w="full" maxW="5xl" mx="auto" py={10} px={4} gap={8}>
      {!!userInfo ? (
        <>
          {/* Header & Balance Section */}
          <HStack w="full" justify="space-between" align="flex-end" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1}>
              <Heading size="xl" fontWeight="800" letterSpacing="tight" color="gray.900" _dark={{ color: "white" }}>
                Your Workspace
              </Heading>
              <Text color="gray.500" fontSize="md">
                Manage your account, credits, and career tools.
              </Text>
            </VStack>
            <Button 
              variant="ghost" 
              colorScheme="red" 
              size="sm" 
              onClick={() => logout()} 
              leftIcon={<FiLogOut />}
            >
              Logout
            </Button>
          </HStack>

          <HStack 
            w="full" 
            bg="gray.900" 
            _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }} 
            border="1px solid"
            borderColor="transparent"
            color="white" 
            borderRadius="2xl" 
            p={{ base: 6, md: 8 }} 
            justify="space-between" 
            align="center" 
            boxShadow="xl"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" right="-10%" top="-20%" opacity={0.05} transform="rotate(15deg)">
              <IoFlashOutline size={250} />
            </Box>
            <VStack align="start" gap={1} zIndex={1}>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" fontWeight="700" color="gray.400" _dark={{ color: "gray.400" }}>
                Current Balance
              </Text>
              <HStack align="baseline">
                <Heading size="3xl" fontWeight="900" letterSpacing="tighter">
                  {userInfo?.credits || 0}
                </Heading>
                <Text fontSize="xl" fontWeight="600" color="gray.400" _dark={{ color: "gray.400" }}>
                  credits
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.300" _dark={{ color: "gray.400" }} mt={1} maxW="md">
                1 Credit = 1 Cover Letter. Generate a highly-optimized draft to beat ATS filters. Once generated, all AI inline edits and rewrites are 100% free.
              </Text>
            </VStack>
          </HStack>

          {/* Accepted Payment Methods Section */}
          <VStack mt={6} mb={2} w="full" gap={4}>
            <Text fontSize="sm" fontWeight="600" color="gray.500" _dark={{ color: "gray.400" }} textTransform="uppercase" letterSpacing="wider" textAlign="center">
              We accept these payment methods securely via <Link href="https://paymongo.com/" isExternal color="blue.500" _hover={{ textDecoration: 'underline' }}>PayMongo</Link>
            </Text>
            <HStack flexWrap="wrap" justify="center" gap={8} opacity={0.7} _hover={{ opacity: 1 }} transition="opacity 0.2s">
              <img src={gcashLogo} alt="GCash" style={{ height: '28px', objectFit: 'contain' }} />
              <img src={mayaLogo} alt="Maya" style={{ height: '28px', objectFit: 'contain' }} />
              <img src={grabpayLogo} alt="GrabPay" style={{ height: '28px', objectFit: 'contain' }} />
              <img src={shopeepayLogo} alt="ShopeePay" style={{ height: '28px', objectFit: 'contain' }} />
              <img src={bpiLogo} alt="BPI" style={{ height: '28px', objectFit: 'contain' }} />
              <img src={unionbankLogo} alt="UnionBank" style={{ height: '28px', objectFit: 'contain' }} />
            </HStack>
          </VStack>

          <Divider my={4} borderColor="gray.200" _dark={{ borderColor: "whiteAlpha.200" }} />

          {/* Pricing Section */}
          <VStack w="full" align="center" mt={4} mb={6} gap={4}>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" letterSpacing="wider">
              <HStack gap={1}><IoShieldCheckmarkOutline size={14} /> <Text>SECURE CHECKOUT</Text></HStack>
            </Badge>
            <Heading size="lg" fontWeight="800" letterSpacing="tight" textAlign="center" color="gray.900" _dark={{ color: "white" }}>
              Invest in your career.
            </Heading>
            <Text color="gray.500" textAlign="center" maxW="xl" fontSize="md">
              No subscriptions. No hidden fees. Just pay for what you need to land your next role. We proudly support GCash, Maya, QR Ph, and major banks.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={8} w="full" alignItems="stretch">
            {/* Tier 1 */}
            <GridItem>
              <VStack h="full" bg="white" _dark={{ bg: "transparent", borderColor: "whiteAlpha.300" }} borderRadius="2xl" p={8} border="1px solid" borderColor="gray.200" boxShadow="sm" align="start" spacing={6} transition="all 0.2s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg', _dark: { bg: "whiteAlpha.50" } }}>
                <VStack align="start" spacing={2} w="full">
                  <Text fontWeight="700" color="gray.500" fontSize="xs" textTransform="uppercase" letterSpacing="widest">The Tester</Text>
                  <Heading size="2xl" color="gray.900" _dark={{ color: "white" }} fontWeight="900" letterSpacing="tighter">₱79</Heading>
                  <Text color="gray.900" _dark={{ color: "white" }} fontWeight="700" fontSize="lg">5 Credits</Text>
                </VStack>
                <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" minH="40px">Just testing the waters. Perfect for your top priority applications.</Text>
                <Button 
                  w="full" 
                  size="lg" 
                  variant="outline" 
                  borderColor="gray.300"
                  _dark={{ borderColor: "whiteAlpha.400", color: "white", _hover: { bg: "whiteAlpha.200" } }}
                  _hover={{ bg: "gray.50" }}
                  isLoading={loadingTier === 'tester'} 
                  onClick={() => handleCheckout('tester')}
                  fontWeight="600"
                >
                  Choose Plan
                </Button>
                <List spacing={4} mt={2} color="gray.600" _dark={{ color: "gray.300" }}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">5 ATS-Optimized Cover Letters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">Tailored tone matching</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">Premium Inline Editing tools</Text></ListItem>
                </List>
              </VStack>
            </GridItem>

            {/* Tier 2 */}
            <GridItem>
              <VStack h="full" bg="gray.900" _dark={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.500" }} borderRadius="2xl" p={8} border="1px solid" borderColor="gray.800" boxShadow="2xl" align="start" spacing={6} position="relative" transform={{ lg: 'scale(1.05)' }} zIndex={1} transition="all 0.2s" _hover={{ transform: { lg: 'scale(1.05) translateY(-4px)' } }}>
                <Badge position="absolute" top="-3" left="50%" transform="translateX(-50%)" bg="white" color="gray.900" _dark={{ bg: "white", color: "gray.900" }} px={4} py={1} borderRadius="full" textTransform="uppercase" fontSize="xs" fontWeight="800" letterSpacing="wider" boxShadow="md">
                  Most Popular
                </Badge>
                <VStack align="start" spacing={2} w="full">
                  <Text fontWeight="700" color="gray.400" _dark={{ color: "gray.300" }} fontSize="xs" textTransform="uppercase" letterSpacing="widest">The Job Hunter</Text>
                  <Heading size="2xl" color="white" _dark={{ color: "white" }} fontWeight="900" letterSpacing="tighter">₱199</Heading>
                  <Text color="white" _dark={{ color: "white" }} fontWeight="700" fontSize="lg">20 Credits <Box as="span" fontSize="sm" color="gray.400" _dark={{ color: "gray.400" }} fontWeight="500">(Only ₱9.95/ea)</Box></Text>
                </VStack>
                <Text color="gray.300" _dark={{ color: "gray.300" }} fontSize="sm" minH="40px">Our most chosen plan. A focused week of applying to land interviews fast.</Text>
                <Button 
                  w="full" 
                  size="lg" 
                  bg="white" 
                  color="gray.900" 
                  _dark={{ bg: "white", color: "gray.900", _hover: { bg: "gray.200" } }}
                  _hover={{ bg: "gray.100" }}
                  isLoading={loadingTier === 'hunter'} 
                  onClick={() => handleCheckout('hunter')}
                  boxShadow="md"
                  fontWeight="700"
                >
                  Choose Plan
                </Button>
                <List spacing={4} mt={2} color="gray.100" _dark={{ color: "gray.200" }}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="green.400" mt={1} /> <Text fontSize="sm" fontWeight="500">20 ATS-Optimized Cover Letters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="green.400" mt={1} /> <Text fontSize="sm" fontWeight="500">Platform-Specific Tuning (Upwork, LinkedIn, etc.)</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="green.400" mt={1} /> <Text fontSize="sm" fontWeight="500">Advanced Keyword Matching</Text></ListItem>
                </List>
              </VStack>
            </GridItem>

            {/* Tier 3 */}
            <GridItem>
              <VStack h="full" bg="white" _dark={{ bg: "transparent", borderColor: "whiteAlpha.300" }} borderRadius="2xl" p={8} border="1px solid" borderColor="gray.200" boxShadow="sm" align="start" spacing={6} transition="all 0.2s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg', _dark: { bg: "whiteAlpha.50" } }}>
                <VStack align="start" spacing={2} w="full">
                  <Text fontWeight="700" color="gray.500" fontSize="xs" textTransform="uppercase" letterSpacing="widest">The Aggressive</Text>
                  <Heading size="2xl" color="gray.900" _dark={{ color: "white" }} fontWeight="900" letterSpacing="tighter">₱349</Heading>
                  <Text color="gray.900" _dark={{ color: "white" }} fontWeight="700" fontSize="lg">45 Credits <Box as="span" fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} fontWeight="500">(Best Value)</Box></Text>
                </VStack>
                <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" minH="40px">For career switchers, VAs, and high-volume daily applications.</Text>
                <Button 
                  w="full" 
                  size="lg" 
                  variant="outline" 
                  borderColor="gray.300"
                  _dark={{ borderColor: "whiteAlpha.400", color: "white", _hover: { bg: "whiteAlpha.200" } }}
                  _hover={{ bg: "gray.50" }}
                  isLoading={loadingTier === 'aggressive'} 
                  onClick={() => handleCheckout('aggressive')}
                  fontWeight="600"
                >
                  Choose Plan
                </Button>
                <List spacing={4} mt={2} color="gray.600" _dark={{ color: "gray.300" }}>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">45 ATS-Optimized Cover Letters</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">Priority Generation Speed</Text></ListItem>
                  <ListItem display="flex" alignItems="flex-start"><ListIcon as={IoCheckmarkCircle} color="gray.900" _dark={{ color: "gray.300" }} mt={1} /> <Text fontSize="sm" fontWeight="500">Full Keyword Extraction</Text></ListItem>
                </List>
              </VStack>
            </GridItem>
          </Grid>

          {userInfo.isUsingLn && (
            <VStack mt={8} w="full" bg="blue.50" _dark={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.300" }} borderRadius="xl" p={6} border="1px solid" borderColor="blue.100">
              <Heading size='xl'>⚡️</Heading>
              <Text textAlign='center' fontSize='md' fontWeight="500" color="blue.900" _dark={{ color: "white" }}>
                You have affordable, pay-per-use access to CoverLetter.Work with GPT-4o via the Lightning Network
              </Text>
            </VStack>
          )}
          
        </>
      ) : (
        <VStack h="50vh" justify="center" w="full">
          <Spinner size="xl" color="gray.900" _dark={{ color: "white" }} thickness="4px" />
        </VStack>
      )}
    </VStack>
  );
}
