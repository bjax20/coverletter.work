import { type CoverLetter } from "wasp/entities";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Tooltip,
  Box,
  Button,
  useClipboard,
  HStack,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FiEdit3, FiCopy, FiCheck, FiFileText, FiChevronDown, FiEye } from 'react-icons/fi';
import { generatePdfBlobUrl } from '../utils/pdf';
import PdfPreviewModal from './PdfPreviewModal';

type ModalProps = {
  coverLetterData: CoverLetter[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function ModalElement({ coverLetterData, isOpen, onOpen, onClose }: ModalProps) {
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter>(coverLetterData[0]);

  const { hasCopied, onCopy, setValue } = useClipboard(selectedCoverLetter.content);

  // Update clipboard value when selected cover letter changes
  useEffect(() => {
    setValue(selectedCoverLetter.content);
  }, [selectedCoverLetter.content, setValue]);

  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const convertDateToLocaleString = (date: Date) => {
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString().split(':').slice(0, 2).join(':');
  }

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter='auto' backdropBlur='10px' bg="blackAlpha.400" _dark={{ bg: "blackAlpha.700" }} />
      <ModalContent borderRadius="2xl" overflow="hidden" bg="white" _dark={{ bg: "gray.900" }} shadow="2xl">
        <ModalHeader borderBottom="1px solid" borderColor="gray.100" _dark={{ borderColor: "whiteAlpha.100" }} py={5}>
          <HStack spacing={4}>
            <Box p={2} bg="blue.50" _dark={{ bg: "blue.900" }} borderRadius="lg">
              <FiFileText size={24} color="var(--chakra-colors-blue-500)" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="xl" fontWeight="800" color="gray.900" _dark={{ color: "whiteAlpha.900" }}>
                Cover Letter{coverLetterData.length > 1 && 's'}
              </Text>
              <Text fontSize="sm" color="gray.500" _dark={{ color: "whiteAlpha.600" }} fontWeight="500">
                Ready to send to the employer
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={6} right={6} rounded="full" />
        
        <ModalBody p={0} bg="gray.50" _dark={{ bg: "whiteAlpha.50" }}>
          <VStack w="full" h="full" align="stretch" spacing={0}>
            
            {coverLetterData.length > 1 && (
              <Box w="full" borderBottom="1px solid" borderColor="gray.200" bg="white" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }} px={6} py={3}>
                <Menu>
                  <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm" variant="outline" borderRadius="full" fontWeight="600" _dark={{ borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.100" } }}>
                    Version {coverLetterData.findIndex(l => l.id === selectedCoverLetter.id) + 1}
                  </MenuButton>
                  <MenuList shadow="lg" borderRadius="xl" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }} maxH="300px" overflowY="auto">
                    {coverLetterData.map((letter, index) => (
                      <MenuItem 
                        key={letter.id} 
                        onClick={() => setSelectedCoverLetter(letter)}
                        fontWeight={selectedCoverLetter.id === letter.id ? "700" : "500"}
                        color={selectedCoverLetter.id === letter.id ? "blue.600" : "inherit"}
                        bg={selectedCoverLetter.id === letter.id ? "blue.50" : "transparent"}
                        _dark={{ 
                          color: selectedCoverLetter.id === letter.id ? "blue.300" : "inherit", 
                          bg: selectedCoverLetter.id === letter.id ? "whiteAlpha.100" : "transparent",
                          _hover: { bg: "whiteAlpha.200" } 
                        }}
                        _hover={{ bg: "gray.100" }}
                        px={4}
                        py={2}
                      >
                        Version {index + 1} <Text as="span" ml={2} fontSize="xs" color="gray.500" _dark={{ color: "whiteAlpha.500" }} fontWeight="normal">• {convertDateToLocaleString(letter.createdAt)}</Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            )}

            <Box p={6} pb={8} w="full">
               <Box 
                 bg="white" 
                 p={8} 
                 borderRadius="xl"
                 shadow="sm"
                 border="1px solid"
                 borderColor="gray.200"
                 _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }}
                 minH="400px"
               >
                 <Text 
                   whiteSpace="pre-wrap" 
                   fontFamily="'Georgia', 'Times New Roman', serif" 
                   fontSize="md" 
                   lineHeight="1.8" 
                   color="gray.800"
                   _dark={{ color: "whiteAlpha.900" }}
                   letterSpacing="0.3px"
                 >
                   {selectedCoverLetter.content}
                 </Text>
               </Box>
            </Box>

          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100" py={4} bg="white" _dark={{ bg: "gray.900", borderColor: "whiteAlpha.100" }}>
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" color="gray.500" _dark={{ color: "whiteAlpha.600" }}>
              Created: {convertDateToLocaleString(selectedCoverLetter.createdAt)}
            </Text>
            <HStack spacing={3}>
              <Button 
                leftIcon={<FiEye />} 
                variant="outline" 
                colorScheme="gray" 
                onClick={() => {
                  setPdfBlobUrl(generatePdfBlobUrl(selectedCoverLetter.content));
                  setIsPreviewOpen(true);
                }}
                size="md"
                fontWeight="600"
                _dark={{ color: "whiteAlpha.900", borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.200" } }}
              >
                Preview PDF
              </Button>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy to Clipboard'} placement='top' hasArrow>
                <Button 
                  leftIcon={hasCopied ? <FiCheck /> : <FiCopy />} 
                  colorScheme={hasCopied ? "green" : "gray"}
                  variant={hasCopied ? "solid" : "outline"}
                  onClick={onCopy}
                  size="md"
                  fontWeight="600"
                  _dark={!hasCopied ? { color: "whiteAlpha.900", borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.200" } } : undefined}
                >
                  {hasCopied ? 'Copied' : 'Copy Text'}
                </Button>
              </Tooltip>
              <Button
                leftIcon={<FiEdit3 />}
                bg="blue.600"
                color="white"
                _hover={{ bg: "blue.700" }}
                _dark={{ bg: "blue.500", _hover: { bg: "blue.400" } }}
                onClick={() => navigate(`/cover-letter/${selectedCoverLetter.id}`)}
                size="md"
                fontWeight="bold"
              >
                Edit Letter
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <PdfPreviewModal 
      isOpen={isPreviewOpen} 
      onClose={() => setIsPreviewOpen(false)} 
      pdfUrl={pdfBlobUrl} 
      filename="Cover_Letter.pdf" 
    />
    </>
  );
}
