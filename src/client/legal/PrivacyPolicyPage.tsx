import BorderBox from '../components/BorderBox';
import { useEffect } from 'react';
import LegalSection from './components/legalSection';
import { 
  Heading, 
  Text, 
  VStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BorderBox>
      <VStack maxW='4xl' mx='auto' p={6} spacing={6} align='flex-start'>
        <Heading as='h1' size='xl' mb={6}>Privacy Policy</Heading>
        <Text fontSize='sm' color='gray.600' mb={6}>Last updated: {new Date().toLocaleDateString()}</Text>

        <LegalSection title='1. Introduction'>
          <Text>
            Latte Tech Industry ("we", "us", or "our") operates lattetechindustry@coverletter.work 
            This page informs you of our policies regarding the collection, use, and 
            disclosure of personal data when you use our Service and the choices you 
            have associated with that data.
          </Text>
        </LegalSection>

        <LegalSection title='2. Data Controller Information'>
          <Text>
            The data controller for your personal data is:
            <br />
            Latte Tech Industry
            <br />
            Calamba, Laguna, Philippines
            <br />
            Email: lattetechindustry@coverletter.work
          </Text>
        </LegalSection>

        <LegalSection title='3. Data We Collect'>
          <Text mb={4}>We collect several different types of information for various purposes:</Text>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold'>Account Data:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Email address</ListItem>
                <ListItem>Name</ListItem>
                <ListItem>Password (encrypted)</ListItem>
                <ListItem>Profile information</ListItem>
                <ListItem>Account settings</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Usage Data:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Access times and dates</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Content Data:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>CV information you provide</ListItem>
                <ListItem>Job descriptions you input</ListItem>
                <ListItem>Generated (example)cover letters</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Payment Data:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Payment history</ListItem>
                <ListItem>Note: Payment processing is handled securely by PayMongo.</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='4. How We Use Your Data'>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold'>To Provide Our Service:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Generate personalized cover letters</ListItem>
                <ListItem>Manage your account</ListItem>
                <ListItem>Process your payments</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>To Improve Our Service:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Analyze usage patterns</ListItem>
                <ListItem>Debug technical issues</ListItem>
                <ListItem>Enhance user experience</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>To Communicate With You:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Send service updates</ListItem>
                <ListItem>Respond to your requests</ListItem>
                <ListItem>Provide customer support</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='5. Legal Basis for Processing'>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Contract Performance: </Text>
              Processing necessary for the performance of our contract with you
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Legal Obligations: </Text>
              Processing necessary for compliance with legal obligations
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Legitimate Interests: </Text>
              Processing based on our legitimate interests in improving and promoting our services
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Consent: </Text>
              Processing based on your specific consent where required
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='6. Data Retention'>
          <Text mb={4}>
            We retain your personal data only for as long as necessary to fulfill the 
            purposes for which we collected it, including:
          </Text>
          <UnorderedList spacing={2}>
            <ListItem>Account data: As long as your account is active</ListItem>
            <ListItem>Generated content: For as long as necessary to provide our services or until you delete your account</ListItem>
            <ListItem>Payment records: As required by tax laws (typically 10 years in the Philippines)</ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='7. Your Data Protection Rights'>
          <Text mb={4}>Under the Data Privacy Act of 2012 (DPA), you have the following rights:</Text>
          <UnorderedList spacing={2} mb={4}>
            <ListItem>Right to access your personal data</ListItem>
            <ListItem>Right to rectification of inaccurate data</ListItem>
            <ListItem>Right to erasure ("right to be forgotten")</ListItem>
            <ListItem>Right to restrict processing</ListItem>
            <ListItem>Right to data portability</ListItem>
            <ListItem>Right to object to processing</ListItem>
            <ListItem>Right to withdraw consent</ListItem>
          </UnorderedList>
          <Text>
            To exercise these rights, please contact us at lattetechindustry@coverletter.work
          </Text>
        </LegalSection>

        <LegalSection title='8. Data Sharing and Third Parties'>
          <Text mb={4}>We share your data with the following third parties:</Text>
          <UnorderedList spacing={4} mb={4}>
            <ListItem>
              <Text fontWeight='semibold' as='span'>PayMongo: </Text>
              Our payment processor, which collects necessary billing information.
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>OpenAI: </Text>
              For AI-powered content generation.
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Google: </Text>
              For user authentication and single sign-on (SSO).
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>SendGrid: </Text>
              For sending transactional emails and notifications.
            </ListItem>
          </UnorderedList>
          <Text>
            All third parties are contractually obligated to protect your data and 
            may only use it for specified purposes.
          </Text>
        </LegalSection>

        <LegalSection title='9. Data Storage and Transfers'>
          <Text mb={4}>
            Your data is stored and processed securely within the Philippines. We do not 
            transfer your personal data internationally. All data handling complies 
            strictly with the Data Privacy Act of 2012 (Republic Act No. 10173).
          </Text>
        </LegalSection>

        <LegalSection title='10. Cookies and Tracking'>
          <Text mb={4}>
            Our service does not use cookies or tracking technologies. We prioritize your privacy 
            and have designed our service to function without the need for cookies or similar 
            tracking mechanisms.
          </Text>
          <Text>
            Any essential session management is handled securely through standard authentication 
            tokens that are automatically cleared when you log out or close your browser.
          </Text>
        </LegalSection>

        <LegalSection title='11. Data Security'>
          <Text mb={4}>
            We implement appropriate technical and organizational measures to protect 
            your personal data, including:
          </Text>
          <UnorderedList spacing={2}>
            <ListItem>Regular security assessments</ListItem>
            <ListItem>Access controls and authentication</ListItem>
            <ListItem>Regular backups</ListItem>
            <ListItem>Staff training on data protection</ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='12. Changes to This Privacy Policy'>
          <Text mb={4}>
            We may update our Privacy Policy from time to time. We will notify you of 
            any changes by posting the new Privacy Policy on this page and updating 
            the "Last updated" date.
          </Text>
          <Text>
            You are advised to review this Privacy Policy periodically for any changes. 
            Changes to this Privacy Policy are effective when they are posted on this page.
          </Text>
        </LegalSection>

        <LegalSection title='13. Contact Us'>
          <Text mb={4}>
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us:
          </Text>
          <UnorderedList spacing={2} mb={4}>
            <ListItem>
              By email: lattetechindustry@coverletter.work
            </ListItem>
            <ListItem>
              By mail: Latte Tech Industry, Calamba, Laguna, Philippines
            </ListItem>
          </UnorderedList>
          <Text>
            You have the right to lodge a complaint with a supervisory authority if you 
            believe our processing of your personal data violates data protection laws.
          </Text>
        </LegalSection>
      </VStack>
    </BorderBox>
  );
};

export default PrivacyPolicy;
