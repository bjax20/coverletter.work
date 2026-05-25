import { type User, type LnPayment } from "wasp/entities";
import { generateEdit, useQuery, getUserInfo } from "wasp/client/operations";
import { VStack, Button, Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { TextareaContext } from '../App';
import { FiMinimize2, FiMaximize2, FiBriefcase, FiMessageCircle, FiUser } from 'react-icons/fi';

interface EditPopoverProps {
  selectedText?: string;
  setTooltip: any;
  user: Omit<User, 'password'>;
  [key: string]: any;
}

export function EditPopover({ setTooltip, selectedText, user, ...props }: EditPopoverProps) {
  const { textareaState, setTextareaState } = useContext(TextareaContext);

  const replaceSelectedText = async ({ improvement, lnPayment }: { improvement: string, lnPayment?: LnPayment }) => {
    const selection = window.getSelection();
    let loadingInterval;

    try {
      const value = textareaState;
      const selectString = selection!.toString();
      const index = value.indexOf(selectString);

      let loadingString = 'Loading';
      loadingInterval = setInterval(() => {
        if (loadingString.length < 'Loading...'.length) {
          loadingString += '.';
          let loading =
            value.slice(0, index + selectString.length) +
            '\n --- \n' +
            loadingString +
            '\n --- \n' +
            value.slice(index + selectString.length);
          setTextareaState(loading);
        } else {
          loadingString = 'Loading';
        }
      }, 750);

      const newValue = await generateEdit({ content: selectString, improvement, lnPayment });

      clearInterval(loadingInterval);
      setTextareaState(value);

      const newText =
        value.slice(0, index + selectString.length) +
        '\n --- Revision: \n' +
        newValue +
        '\n --- \n' +
        value.slice(index + selectString.length);

      setTextareaState(newText);
    } catch (error: any) {
      console.error(error);
      clearInterval(loadingInterval);
      alert(error?.message ?? 'An error has occurred');
    }
  };

  const handleClick = async (value: string) => {
    replaceSelectedText({ improvement: value });
    window.getSelection()?.removeAllRanges();
  };

  return (
    <Box {...props} zIndex={1000} transition="all 0.2s">
      <Box 
        bg="white" 
        borderRadius="xl" 
        boxShadow="0px 10px 40px rgba(0, 0, 0, 0.15)" 
        border="1px solid"
        borderColor="gray.100"
        _dark={{ bg: "gray.800", borderColor: "whiteAlpha.200" }}
        overflow="hidden"
        minW="220px"
        p={2}
      >
        <Text fontSize="xs" fontWeight="700" color="gray.500" _dark={{ color: "whiteAlpha.600" }} px={2} pt={1} pb={2} letterSpacing="wide">
          🤔 Ask AI to make it...
        </Text>
        <VStack align="stretch" spacing={1}>
          <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMinimize2 />} onClick={() => handleClick('concise')} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
            More Concise
          </Button>
          <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMaximize2 />} onClick={() => handleClick('detailed')} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
            More Detailed
          </Button>
          <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiBriefcase />} onClick={() => handleClick('Professional')} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
            More Professional
          </Button>
          <Button size="sm" variant="ghost" justifyContent="flex-start" fontWeight="500" leftIcon={<FiMessageCircle />} onClick={() => handleClick('informal')} _hover={{ bg: "blue.50", color: "blue.600", _dark: { bg: "whiteAlpha.100", color: "blue.300" } }}>
            More Casual
          </Button>

        </VStack>
      </Box>
    </Box>
  );
}
