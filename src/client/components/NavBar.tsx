import { useAuth } from "wasp/client/auth";
import {
  HStack,
  Heading,
  Button,
  Link,
  Spacer,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  StackProps,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { MdWorkOutline } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { useRef } from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function NavBar() {
  const { data: user } = useAuth();

  const borderColor = useColorModeValue('white', 'whiteAlpha.100');
  const bgNav = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(15, 23, 42, 0.75)');
  const headingColor = useColorModeValue('gray.900', 'white');
  const navShadow = useColorModeValue('0px 10px 40px rgba(0, 0, 0, 0.08)', '0px 10px 40px rgba(0, 0, 0, 0.4)');

  return (
    <Box
      display="flex"
      justifyContent="center"
      position="sticky"
      top={4}
      w="full"
      zIndex={99}
      px={4}
    >
      <Box
        as='nav'
        width='full'
        maxW="5xl"
        backdropFilter='blur(20px)'
        bg={bgNav}
        border='1px solid'
        borderColor={borderColor}
        borderRadius="full"
        boxShadow={navShadow}
        transition="all 0.3s"
      >
        <HStack
          align='center'
          justify='space-between'
          px={{ base: 5, md: 6 }}
          py={2}
        >
          <Link as={RouterLink} to='/' _hover={{ textDecoration: 'none' }}>
            <Heading size='md' fontWeight="900" letterSpacing="tighter" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text" _dark={{ bgGradient: "linear(to-r, blue.400, teal.300)" }}>
              CoverLetter.Work
            </Heading>
          </Link>
          <Spacer />
          
          <HStack gap={{ base: 3, md: 4 }} align="center">
            {user ? (
              <>
                <NavButton icon={<MdWorkOutline />} to='/jobs'>
                  My Jobs
                </NavButton>
                <NavButton icon={<CgProfile />} to='/profile'>
                  Credits
                </NavButton>
              </>
            ) : (
              <NavButton icon={<CgProfile />} to='/login'>
                Login
              </NavButton>
            )}
            
            <Box w="1px" h="16px" bg={borderColor} display={{ base: 'none', md: 'block' }} mx={1} />
            
            <ThemeSwitch />
            
            {user ? (
              <MobileButton icon={<AiOutlineMenu />} isUser={true}>
                Menu
              </MobileButton>
            ) : (
              <MobileButton icon={<AiOutlineMenu />} isUser={false}>
                Menu
              </MobileButton>
            )}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}

interface NavButtonProps extends StackProps {
  children: React.ReactNode;
  icon: React.ReactElement;
  to: string;
  props?: StackProps;
}

function NavButton({ children, icon, to, ...props }: NavButtonProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  const hoverColor = useColorModeValue('blue.600', 'blue.300');
  const color = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('blue.50', 'whiteAlpha.100');

  function removeFocus() {
    if (linkRef.current) {
      linkRef.current.blur();
    }
  }

  return (
    <Link as={RouterLink} to={to} display={['none', 'block']} ref={linkRef} onClick={removeFocus} _hover={{ textDecoration: 'none' }}>
      <Button
        variant="unstyled"
        display="flex"
        alignItems="center"
        size="sm"
        leftIcon={icon}
        fontWeight="600"
        color={color}
        borderRadius="full"
        px={3}
        transition="all 0.2s"
        _hover={{ color: hoverColor, bg: hoverBg }}
      >
        {children}
      </Button>
    </Link>
  );
}

function MobileButton({
  children,
  icon,
  isUser,
}: {
  children: React.ReactNode;
  icon: React.ReactElement;
  isUser?: boolean;
}) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const menuBg = useColorModeValue('white', 'gray.900');

  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label={children as string}
        leftIcon={icon}
        display={['block', 'none']}
        size='sm'
        variant="outline"
        borderColor={borderColor}
        bg="transparent"
        _hover={{
          bg: hoverBg,
        }}
      >
        {children}
      </MenuButton>
      <MenuList bgColor={menuBg} borderColor={borderColor} boxShadow="sm" p={1}>
        {isUser ? (
          <>
            <Link as={RouterLink} to={`/jobs`} _hover={{ textDecoration: 'none' }}>
              <MenuItem borderRadius="md" fontWeight="500" _hover={{ bg: hoverBg }}>My Jobs</MenuItem>
            </Link>
            <Link as={RouterLink} to={`/profile`} _hover={{ textDecoration: 'none' }}>
              <MenuItem borderRadius="md" fontWeight="500" _hover={{ bg: hoverBg }}>Credits</MenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link as={RouterLink} to='/login' _hover={{ textDecoration: 'none' }}>
              <MenuItem borderRadius="md" _hover={{ bg: hoverBg }}>Login</MenuItem>
            </Link>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
