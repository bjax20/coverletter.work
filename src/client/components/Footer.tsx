import { Box, HStack, VStack, Text, Link as ChakraLink, useColorModeValue, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const borderColor = useColorModeValue('white', 'whiteAlpha.100');
  const bgFooter = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(15, 23, 42, 0.75)');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('blue.600', 'blue.300');
  const footerShadow = useColorModeValue('0px -10px 40px rgba(0, 0, 0, 0.05)', '0px -10px 40px rgba(0, 0, 0, 0.4)');

  return (
    <Box 
      as="footer"
      w="full" 
      mt={16} 
      zIndex={99}
      borderTop="1px solid"
      borderColor={borderColor}
      bg="whiteAlpha.50"
      _dark={{ bg: "blackAlpha.200" }}
      backdropFilter="blur(10px)"
    >
      <VStack
        w="full"
        maxW="5xl"
        mx="auto"
        px={{ base: 6, md: 8 }}
        py={{ base: 8, md: 10 }}
        gap={8}
      >
        <HStack w="full" justify="space-between" align="center" flexDir={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 0 }}>
          
          {/* Brand & Copyright */}
          <VStack align={{ base: 'center', md: 'start' }} gap={1}>
            <Text fontWeight="800" fontSize="lg" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text" _dark={{ bgGradient: "linear(to-r, blue.400, teal.300)" }}>
              CoverLetter.Work
            </Text>
            <Text fontSize="sm" color={textColor} fontWeight="500">
              © 2026 CoverLetter.Work. All rights reserved.
            </Text>
          </VStack>

          {/* Links */}
          <HStack gap={{ base: 4, md: 8 }} flexWrap="wrap" justify="center">
            <ChakraLink as={RouterLink} to="/profile" fontSize="sm" fontWeight="600" color={textColor} _hover={{ color: hoverColor, textDecoration: 'none' }}>
              Pricing
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/privacy" fontSize="sm" fontWeight="600" color={textColor} _hover={{ color: hoverColor, textDecoration: 'none' }}>
              Privacy
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/tos" fontSize="sm" fontWeight="600" color={textColor} _hover={{ color: hoverColor, textDecoration: 'none' }}>
              Terms
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/login" fontSize="sm" fontWeight="600" color={textColor} _hover={{ color: hoverColor, textDecoration: 'none' }}>
              Log In
            </ChakraLink>
          </HStack>

          {/* Social Media */}
          <HStack gap={2}>
            <IconButton
              as="a"
              href="#"
              aria-label="Facebook"
              icon={<FaFacebook size={18} />}
              variant="ghost"
              color={textColor}
              borderRadius="full"
              _hover={{ bg: 'blue.50', color: 'blue.500', _dark: { bg: 'whiteAlpha.200', color: 'blue.300' } }}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Instagram"
              icon={<FaInstagram size={18} />}
              variant="ghost"
              color={textColor}
              borderRadius="full"
              _hover={{ bg: 'pink.50', color: 'pink.500', _dark: { bg: 'whiteAlpha.200', color: 'pink.300' } }}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="TikTok"
              icon={<FaTiktok size={18} />}
              variant="ghost"
              color={textColor}
              borderRadius="full"
              _hover={{ bg: 'gray.100', color: 'black', _dark: { bg: 'whiteAlpha.200', color: 'white' } }}
            />
          </HStack>

        </HStack>
      </VStack>
    </Box>
  );
}
