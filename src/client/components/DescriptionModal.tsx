import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  Flex,
  Icon,
  useClipboard,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FiFileText, FiCopy, FiCheck, FiX } from 'react-icons/fi';

type DescriptionModalProps = {
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const overlayProps = {
  backdropFilter: 'blur(8px)',
  bg: 'blackAlpha.600',
};

const contentProps = {
  bg: 'white',
  borderRadius: '3xl',
  boxShadow: '2xl',
  border: '1px solid',
  borderColor: 'gray.200',
  _dark: { bg: 'gray.800', borderColor: 'whiteAlpha.200' },
  overflow: 'hidden',
};

const primaryButtonProps = {
  bg: "blue.600",
  color: "white",
  _hover: { bg: "blue.700", transform: 'translateY(-1px)', shadow: 'md' },
  _active: { transform: 'translateY(0)' },
  transition: "all 0.2s",
  _dark: { bg: "blue.300", color: "gray.900", _hover: { bg: "blue.200", transform: 'translateY(-1px)', shadow: 'md' } },
};

export default function DescriptionModal({ description, isOpen, onClose, onOpen }: DescriptionModalProps) {
  const { hasCopied, onCopy } = useClipboard(description || "");
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" initialFocusRef={closeBtnRef}>
      <ModalOverlay {...overlayProps} />
      <ModalContent {...contentProps} maxH="85vh" m={4}>
        
        <ModalHeader 
          pt={6} 
          pb={4} 
          px={{ base: 4, md: 8 }}
          display="flex" 
          justifyContent="space-between"
          alignItems="center" 
          borderBottom="1px solid"
          borderColor="gray.100"
          bg="white"
          _dark={{ borderColor: "whiteAlpha.100", bg: "gray.800" }}
          zIndex={10}
        >
          <Flex gap={4} alignItems="center">
            <Flex p={3} bg="blue.50" color="blue.600" borderRadius="xl" _dark={{ bg: "blue.900", color: "blue.300" }} display={{ base: 'none', sm: 'flex' }}>
              <Icon as={FiFileText} boxSize={6} />
            </Flex>
            <Box>
              <Text fontSize="2xl" fontWeight="800" color="gray.900" _dark={{ color: "white" }} letterSpacing="tight">
                Job Description
              </Text>
              <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} fontWeight="medium">
                Review the full details below
              </Text>
            </Box>
          </Flex>
          
          <Flex gap={2} alignItems="center">
            <Tooltip label={hasCopied ? "Copied!" : "Copy to clipboard"} placement="bottom">
              <Button
                size="sm"
                leftIcon={hasCopied ? <FiCheck /> : <FiCopy />}
                colorScheme={hasCopied ? "green" : "blue"}
                variant={hasCopied ? "solid" : "ghost"}
                onClick={onCopy}
                borderRadius="lg"
              >
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </Tooltip>
            <IconButton 
              aria-label="Close modal" 
              icon={<FiX size={20} />} 
              onClick={onClose} 
              variant="ghost" 
              colorScheme="gray" 
              size="sm" 
              borderRadius="lg"
            />
          </Flex>
        </ModalHeader>

        <ModalBody p={0} bg="gray.50" _dark={{ bg: "gray.900" }}>
          <Box 
            p={{ base: 6, md: 8 }}
            minH="40vh"
          >
            <Text 
              whiteSpace="pre-wrap" 
              color="gray.700" 
              _dark={{ color: "gray.300" }} 
              fontSize="md" 
              lineHeight="1.8"
            >
              {description || "No description provided."}
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter 
          bg="white"
          px={{ base: 4, md: 8 }}
          py={6} 
          borderTop="1px solid"
          borderColor="gray.100"
          _dark={{ bg: "gray.800", borderColor: "whiteAlpha.100" }}
          zIndex={10}
        >
          <Button 
            ref={closeBtnRef}
            w="full" 
            size="lg" 
            borderRadius="xl" 
            {...primaryButtonProps} 
            onClick={onClose}
          >
            Got it, close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
