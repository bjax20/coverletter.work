import { deleteJob } from "wasp/client/operations";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Code,
  Text,
  VStack,
  Box,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';

const overlayProps = {
  backdropFilter: 'blur(8px)',
  bg: 'blackAlpha.600',
};

const contentProps = {
  bg: 'white',
  borderRadius: '2xl',
  boxShadow: '2xl',
  border: '1px solid',
  borderColor: 'gray.200',
  _dark: { bg: 'gray.800', borderColor: 'whiteAlpha.200' },
};

const primaryButtonProps = {
  bg: "blue.600",
  color: "white",
  _hover: { bg: "blue.700", transform: 'translateY(-1px)', shadow: 'md' },
  _active: { transform: 'translateY(0)' },
  transition: "all 0.2s",
  _dark: { bg: "blue.300", color: "gray.900", _hover: { bg: "blue.200", transform: 'translateY(-1px)', shadow: 'md' } },
};

const ghostButtonProps = {
  variant: "ghost",
  color: "gray.500",
  _hover: { bg: "gray.100", color: "gray.900" },
  _dark: { color: "gray.400", _hover: { bg: "whiteAlpha.200", color: "white" } },
};

export function LeaveATip({
  isOpen,
  onClose,
  credits,
  isUsingLn,
}: {
  isUsingLn: boolean;
  credits: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const tipRef = useRef<any>(null);

  const navigate = useNavigate();
  const handleClick = async () => {
    window.open('/profile', '_blank');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose} isCentered>
      <AlertDialogOverlay {...overlayProps}>
        <AlertDialogContent {...contentProps}>
          <AlertDialogHeader display='flex' flexDirection='column' alignItems='center' gap={2} pt={4}>
            <Box fontSize='5xl'>{credits > 0 ? '👋' : '🚀'}</Box>
            <Text fontSize='xl' fontWeight='bold' textAlign='center' color="gray.900" _dark={{ color: "whiteAlpha.900" }}>
              {credits > 0 ? 'Thanks for trying CoverLetter.Work' : "You're out of credits!"}
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center' color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
            <Text mb={4}>
              {credits > 0 ? (
                <>You have <Code colorScheme='blue' borderRadius='md' px={2} py={0.5}>{credits}</Code> free cover letter {credits === 1 ? 'credit' : 'credits'} left.</>
              ) : (
                <>You have used all your cover letter credits.</>
              )}
            </Text>
            <Text>
              {!isUsingLn ? (
                <>Purchase a credit pack to continue crafting tailored applications!</>
              ) : (
                <>After, just pay a small fee per cover letter with your lightning ⚡️ wallet.</>
              )}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter display='flex' flexDirection='column' gap={3} pb={2}>
            {!isUsingLn ? (
              <>
                <Button w='full' isLoading={isLoading} ref={tipRef} {...primaryButtonProps} onClick={handleClick} size='lg' borderRadius='xl'>
                  💰 {credits > 0 ? 'Buy More' : 'Top Up Now'}
                </Button>
                <Button w='full' size='sm' onClick={onClose} {...ghostButtonProps}>
                  {credits > 0 ? 'No, Thanks' : 'Cancel'}
                </Button>
              </>
            ) : (
              <Button w='full' size='lg' borderRadius='xl' onClick={onClose} {...primaryButtonProps}>
                OK
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function LoginToBegin({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const loginRef = useRef<any>(null);

  const handleClick = async () => {
    navigate('/login');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={loginRef} onClose={onClose} isCentered>
      <AlertDialogOverlay {...overlayProps}>
        <AlertDialogContent {...contentProps}>
          <AlertDialogHeader display='flex' flexDirection='column' alignItems='center' gap={2} pt={4}>
            <Box fontSize='5xl'>✋</Box>
            <Text fontSize='xl' fontWeight='bold' color="gray.900" _dark={{ color: "whiteAlpha.900" }}>Login Required</Text>
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center' color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
            Please login to begin using this feature!
          </AlertDialogBody>

          <AlertDialogFooter w='full' pb={2} pt={6}>
            <Button w='full' size='lg' borderRadius='xl' ref={loginRef} leftIcon={<AiOutlineLogin size={20} />} {...primaryButtonProps} onClick={handleClick}>
              Login to Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function DeleteJob({
  isOpen,
  onClose,
  jobId,
}: {
  jobId: string | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay {...overlayProps}>
        <AlertDialogContent {...contentProps}>
          <AlertDialogHeader display='flex' flexDirection='column' alignItems='center' gap={3} pt={4}>
            <Box bg='red.500' color='white' p={4} borderRadius='full' boxShadow='md' _dark={{ bg: 'red.400', color: "gray.900" }}>
              <BiTrash size={32} />
            </Box>
            <Text fontSize='xl' fontWeight='bold' color="gray.900" _dark={{ color: "whiteAlpha.900" }}>Delete Job</Text>
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center' color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
            Are you sure you want to delete this job and all its cover letters?
            <Box mt={3} color='red.500' fontSize='sm' fontWeight='medium' _dark={{ color: "red.300" }}>
              This action cannot be undone.
            </Box>
          </AlertDialogBody>

          <AlertDialogFooter display='flex' flexDirection='column' gap={3} pb={2} pt={6}>
            <Button
              w='full'
              bg="red.600"
              color="white"
              _hover={{ bg: "red.700", transform: 'translateY(-1px)', shadow: 'md' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
              _dark={{ bg: "red.400", color: "gray.900", _hover: { bg: "red.300", transform: 'translateY(-1px)', shadow: 'md' } }}
              size='lg'
              borderRadius='xl'
              isLoading={isLoading}
              onClick={async () => {
                if (!jobId) return;
                setIsLoading(true);
                await deleteJob({ jobId });
                setIsLoading(false);
                onClose();
              }}
            >
              Delete Job
            </Button>
            <Button w='full' ref={cancelRef} size='sm' onClick={onClose} {...ghostButtonProps}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function EditAlert({ coverLetter }: { coverLetter: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (coverLetter && localStorage.getItem('edit-alert') !== 'do not show') {
      onOpen();
    }
  }, [coverLetter]);

  const cancelRef = useRef<any>(null);
  function handleCheckboxChange(e: any) {
    if (e.target.checked) {
      localStorage.setItem('edit-alert', 'do not show');
    } else {
      localStorage.removeItem('edit-alert');
    }
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay {...overlayProps}>
        <AlertDialogContent {...contentProps} maxW='md'>
          <AlertDialogHeader display='flex' flexDirection='column' alignItems='center' gap={2} pt={4}>
            <Box fontSize='5xl'>✨</Box>
            <Text fontSize='xl' fontWeight='bold' textAlign='center' color="gray.900" _dark={{ color: "whiteAlpha.900" }}>
              Your cover letter is ready!
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody gap={5} pointerEvents='none'>
            <Text pb={4} textAlign='center' color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
              Want to make finer edits? Highlight any text to access the quick-edit menu:
            </Text>
            <VStack 
              m={2} 
              gap={2} 
              borderRadius='xl' 
              bg="gray.50" 
              _dark={{ bg: "whiteAlpha.50", borderColor: "whiteAlpha.200" }} 
              p={4} 
              border='1px solid' 
              borderColor="gray.200"
            >
              <Text fontSize='sm' textAlign='center' fontWeight='bold' mb={1} color="gray.700" _dark={{ color: "whiteAlpha.800" }}>
                🤔 Ask AI to make it...
              </Text>
              <Flex gap={2} flexWrap='wrap' justifyContent='center' w='full'>
                <Button flex={1} minW='45%' borderRadius='md' size='sm' colorScheme='blue' variant='solid'>Concise</Button>
                <Button flex={1} minW='45%' borderRadius='md' size='sm' colorScheme='blue' variant='solid'>Detailed</Button>
                <Button flex={1} minW='45%' borderRadius='md' size='sm' colorScheme='blue' variant='solid'>Professional</Button>
                <Button flex={1} minW='45%' borderRadius='md' size='sm' colorScheme='blue' variant='solid'>Informal</Button>
              </Flex>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter display='flex' justifyContent='space-between' alignItems='center' pb={2} pt={6}>
            <Checkbox onChange={handleCheckboxChange} size='sm' color="gray.500" _dark={{ color: "gray.400" }} colorScheme='blue'>
              Don't show again
            </Checkbox>
            <Button ref={cancelRef} size='md' borderRadius='xl' {...primaryButtonProps} onClick={onClose} px={6}>
              Got it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
