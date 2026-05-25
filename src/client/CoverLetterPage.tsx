import { type CoverLetter } from "wasp/entities";
import { editCoverLetter, useQuery, getCoverLetter } from "wasp/client/operations";
import { Tooltip, Button, Textarea, useClipboard, Spinner, HStack, Flex, Box, Text, IconButton, VStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router';
import { useContext } from 'react';
import { TextareaContext } from './App';
import { EditAlert } from './components/AlertDialog';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiSave, FiCopy, FiCheck, FiFileText, FiEye } from 'react-icons/fi';
import { generatePdfBlobUrl } from './utils/pdf';
import PdfPreviewModal from './components/PdfPreviewModal';

export default function CoverLetterPage() {
  const { textareaState, setTextareaState } = useContext(TextareaContext);
  const [editIsLoading, setEditIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const { id } = useParams();
  
  const {
    data: coverLetter,
    isLoading,
    refetch,
  } = useQuery<{ id: string }, CoverLetter>(getCoverLetter, { id: id as string }, { enabled: !!id });

  const { hasCopied, onCopy, setValue } = useClipboard(textareaState);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Update clipboard value when textarea changes
  useEffect(() => {
    setValue(textareaState);
  }, [textareaState, setValue]);

  useEffect(() => {
    if (coverLetter && !hasInitialized) {
      setTextareaState(coverLetter.content);
      setHasInitialized(true);
    }
  }, [coverLetter, hasInitialized, setTextareaState]);

  if (!id) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red.500" fontWeight="bold">Error: Cover letter ID is required</Text>
      </Flex>
    );
  }

  const handleClick = async () => {
    try {
      setEditIsLoading(true);
      if (!id) {
        throw new Error('Cover letter ID is required');
      }

      const editedCoverLetter = await editCoverLetter({ coverLetterId: id, content: textareaState });

      if (!!editedCoverLetter) {
        setIsEdited(true);
        setTimeout(() => {
          setIsEdited(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      alert('An error occured. Please try again.');
    }
    setEditIsLoading(false);
  };

  return (
    <Flex w="full" direction="column" flex={1}>
      {/* Main Editor Area */}
      <Flex flex={1} justify="center" py={12} px={{ base: 4, md: 8, lg: 12 }} position="relative">
        <VStack w="full" maxW="5xl" spacing={6} align="stretch">
          
          {/* Editor Toolbar */}
          <HStack justify="space-between" w="full" bg="transparent">
            <Button 
              leftIcon={<FiArrowLeft />} 
              variant="ghost" 
              onClick={() => navigate('/')} 
              color="gray.600"
              _dark={{ color: "whiteAlpha.800", _hover: { bg: "whiteAlpha.200" } }}
              size="sm"
            >
              Back to Jobs
            </Button>

            {coverLetter && (
              <HStack spacing={4}>
                <Text fontSize="sm" fontWeight="500" color={isEdited ? "green.500" : "gray.500"} _dark={{ color: isEdited ? "green.300" : "whiteAlpha.500" }}>
                  {isLoading ? 'Loading...' : (isEdited ? '✓ Saved' : 'Unsaved changes')}
                </Text>
                
                <HStack spacing={2}>
                  <Button 
                    leftIcon={<FiEye />} 
                    variant="outline" 
                    colorScheme="gray" 
                    onClick={() => {
                      setPdfBlobUrl(generatePdfBlobUrl(textareaState));
                      setIsPreviewOpen(true);
                    }}
                    size="sm"
                    fontWeight="600"
                    _dark={{ color: "whiteAlpha.900", borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.200" } }}
                  >
                    Preview PDF
                  </Button>
                  <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'} placement="top" hasArrow>
                    <Button 
                      leftIcon={hasCopied ? <FiCheck /> : <FiCopy />} 
                      variant={hasCopied ? "solid" : "outline"}
                      colorScheme={hasCopied ? "green" : "gray"}
                      onClick={onCopy}
                      size="sm"
                      fontWeight="600"
                      _dark={!hasCopied ? { color: "whiteAlpha.900", borderColor: "whiteAlpha.300", _hover: { bg: "whiteAlpha.200" } } : undefined}
                    >
                      {hasCopied ? 'Copied' : 'Copy'}
                    </Button>
                  </Tooltip>
                  <Button 
                    leftIcon={<FiSave />} 
                    bg="blue.600" 
                    color="white" 
                    _hover={{ bg: "blue.700" }} 
                    _dark={{ bg: "blue.500", _hover: { bg: "blue.400" } }}
                    onClick={handleClick} 
                    isLoading={editIsLoading}
                    size="sm"
                    fontWeight="bold"
                    px={5}
                  >
                    Save
                  </Button>
                </HStack>
              </HStack>
            )}
          </HStack>

          <Box position="relative">
            {isLoading && (
              <Flex position="absolute" top="40%" left="50%" transform="translate(-50%, -50%)" align="center" direction="column" gap={4} zIndex={10}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text color="gray.500" fontWeight="600">Loading your masterpiece...</Text>
              </Flex>
            )}
            
            <Box 
              w="full" 
              bg="white" 
              borderRadius="xl" 
              boxShadow="0px 24px 48px rgba(0, 0, 0, 0.08)"
              border="1px solid"
              borderColor="gray.200"
              _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200", boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.4)" }}
              visibility={isLoading ? 'hidden' : 'visible'}
              transition="all 0.3s"
            >
              <Textarea
                id='cover-letter-textarea'
                value={textareaState}
                onChange={(e) => setTextareaState(e.target.value)}
                minH="85vh"
                w="full"
                p={{ base: 6, md: 12, lg: 16 }}
                variant="unstyled"
                resize="none"
                fontFamily="'Georgia', 'Times New Roman', serif"
                fontSize="lg"
                lineHeight="2"
                letterSpacing="0.3px"
                color="gray.800"
                _dark={{ color: "whiteAlpha.900" }}
                _placeholder={{ color: "gray.400", _dark: { color: "whiteAlpha.400" } }}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '10px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'var(--chakra-colors-gray-300)',
                    borderRadius: '10px',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                  },
                }}
              />
            </Box>
          </Box>
        </VStack>
      </Flex>

      <EditAlert coverLetter={!!coverLetter} />
      <PdfPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        pdfUrl={pdfBlobUrl} 
        filename="Cover_Letter.pdf" 
      />
    </Flex>
  );
}
