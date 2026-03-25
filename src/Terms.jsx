import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import PageSeo from './components/PageSeo';

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const TermsContent = styled.section`
  font-size: 1.0625rem;
  max-width: ${({ theme }) => theme.maxWidth.prose};
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: clamp(1.5rem, 3vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h2 {
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.colors.footerLink};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

function Terms() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageSeo
        title="Terms of Service | Basement Bike Mechanic"
        description="Terms for SMS messaging, bicycle repair services, estimates, and liability at Basement Bike Mechanic in Atlanta."
        path="/terms"
      />
      <Header />
      <TermsContent>
        <h1>Terms and Conditions</h1>
        <p>Welcome to <strong>Basement Bike Mechanic</strong>. By using our bicycle repair services and communication channels, you agree to the following terms. Please read them carefully.</p>

        <h2>1. SMS Messaging Terms</h2>
        <p>By providing your mobile number and opting in to receive text messages, you agree to receive automated SMS updates from <strong>Basement Bike Mechanic</strong> regarding your bicycle repair services. This may include:</p>
        <ul>
          <li>Repair status updates and progress notifications.</li>
          <li>Estimates, parts availability, and technical findings.</li>
          <li>Pickup notifications when your bike is ready.</li>
          <li>Appointment reminders and scheduling confirmations.</li>
        </ul>
        <p>Message frequency varies based on your repair. Standard message and data rates may apply. You can opt out at any time by replying STOP to any message or by contacting us directly.</p>

        <h2>2. Consent and Opt-Out</h2>
        <p>You consent to receive SMS messages when you:</p>
        <ul>
          <li>Provide your phone number for repair services.</li>
          <li>Text or call us to initiate service.</li>
          <li>Opt in via our website or during intake.</li>
        </ul>
        <p>To opt out, reply STOP, text HELP for assistance, or contact us at <a href="mailto:support@basementbikemechanic.com">support@basementbikemechanic.com</a>. Carriers are not liable for delayed or undelivered messages.</p>

        <h2>3. Services and Estimates</h2>
        <p>Quotes and estimates are subject to change based on our inspection. We will communicate any additional findings or costs before proceeding. Payment is due upon completion of service unless otherwise agreed in writing.</p>

        <h2>4. Limitation of Liability</h2>
        <p><strong>Basement Bike Mechanic</strong> provides repair services in good faith. We are not liable for pre-existing damage, wear, or defects beyond our control. Our liability is limited to the cost of the service provided. Bicycles and personal property are left at your own risk while in our care.</p>

        <h2>5. General Terms</h2>
        <p>We reserve the right to modify these terms. Continued use of our services after changes constitutes acceptance. If you have questions about these terms, please <a href="mailto:support@basementbikemechanic.com">email us</a>.</p>
      </TermsContent>
      <Footer onBack={() => navigate('/')} />
    </PageWrapper>
  );
}

export default Terms;
