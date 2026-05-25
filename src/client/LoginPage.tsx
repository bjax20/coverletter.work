import { useAuth, googleSignInUrl as signInUrl } from 'wasp/client/auth';
import { AiOutlineGoogle } from 'react-icons/ai';
import { VStack, Button, Spinner, Text, Heading, Box } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <VStack w="full" mt={12} px={4}>
      <BorderBox maxW="sm" w="full" py={10} px={8}>
        {isLoading ? (
          <Spinner size="lg" color="gray.500" thickness="2px" />
        ) : (
          <VStack gap={6} w="full">
            <VStack gap={2} textAlign="center" w="full">
              <Heading size="lg" fontWeight="700" letterSpacing="tight" color="gray.900" _dark={{ color: "white" }}>
                Welcome back
              </Heading>
              <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
                Sign in to save and manage your cover letters
              </Text>
            </VStack>

            <Box w="full" mt={2}>
              <a href={signInUrl} style={{ width: '100%', display: 'block' }}>
                <Button
                  w="full"
                  variant="outline"
                  size="lg"
                  height={12}
                  leftIcon={<AiOutlineGoogle size={20} />}
                  border="1px solid"
                  borderColor="gray.300"
                  _dark={{ borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.100" }, color: "gray.200" }}
                  _hover={{ bg: "gray.50" }}
                  color="gray.700"
                  fontWeight="500"
                >
                  Continue with Google
                </Button>
              </a>
            </Box>
            
            <Text fontSize="xs" color="gray.400" textAlign="center" mt={4}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </VStack>
        )}
      </BorderBox>
    </VStack>
  );
}
