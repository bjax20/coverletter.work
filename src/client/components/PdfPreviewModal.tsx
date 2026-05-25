import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

type PdfPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  filename: string;
};

export default function PdfPreviewModal({ isOpen, onClose, pdfUrl, filename }: PdfPreviewModalProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
      <ModalContent bg="gray.50" _dark={{ bg: "gray.900" }} borderRadius="xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" bg="white" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }}>
          PDF Preview
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={0} bg="gray.100" _dark={{ bg: "blackAlpha.500" }}>
          <Box w="full" h="70vh">
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            ) : (
              <Box p={8} textAlign="center" color="gray.500">Loading preview...</Box>
            )}
          </Box>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.200" bg="white" _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button leftIcon={<FiDownload />} colorScheme="blue" onClick={handleDownload}>
            Download PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
