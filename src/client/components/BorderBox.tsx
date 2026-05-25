import { Box, VStack, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface BorderBoxProps extends BoxProps {
  children: React.ReactNode;
}

export default function BorderBox({ children, ...props }: BorderBoxProps) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const shadow = useColorModeValue('xl', '0px 20px 40px rgba(0,0,0,0.4)');

  return (
    <Box
      width={['sm', 'xl', '3xl']}
      borderRadius='xl'
      bgColor={bgColor}
      border='1px solid'
      borderColor={borderColor}
      boxShadow={shadow}
      mt={7}
      transition="all 0.2s"
      {...props}
    >
      <VStack
        gap={5}
        py={{ base: 6, md: 8 }}
        px={{ base: 4, md: 8 }}
        w="full"
      >
        {children}
      </VStack>
    </Box>
  );
}
