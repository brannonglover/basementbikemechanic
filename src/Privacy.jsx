import React from "react";
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const PrivacyContent = styled.section`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  h2 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
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
    color: #0077cc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Privacy({ onBack }) {
  return (
    <PageWrapper>
      <Header onHome={onBack} />
      <PrivacyContent>
        <h1>Privacy Policy</h1>
        <p>At <strong>Basement Bike Mechanic</strong>, your privacy matters. We only collect contact information that you voluntarily provide when seeking bicycle repair services. This page describes how we handle your phone number and ensure your data stays secure.</p>

        <h2>1. Opting In</h2>
        <p>We will only contact you if you initiate communication. Consent is granted when you:</p>
        <ul>
          <li>Send us a text message or call directly.</li>
          <li>Click the "Text Us" button on our website.</li>
        </ul>
        <p>By reaching out first, you authorize <strong>Basement Bike Mechanic</strong> to respond regarding your bicycle repair needs.</p>

        <h2>2. Use of Your Contact Information</h2>
        <p>Your phone number is used solely for operational purposes related to bicycle repair:</p>
        <ul>
          <li>Answering inquiries and providing quotes.</li>
          <li>Updating you on repair status.</li>
          <li>Notifying when your bike is ready for pickup.</li>
          <li>Discussing parts, estimates, and technical issues discovered during service.</li>
        </ul>

        <h2>3. No-Spam and Data Sharing Policy</h2>
        <p>We respect your inbox and will never:</p>
        <ul>
          <li>Send marketing messages, newsletters, or promotional blasts.</li>
          <li>Sell, share, or lease your information to third parties.</li>
        </ul>
        <p>Your contact details remain private and are used only by our shop.</p>
        
        <p>If you have questions about this policy, please <a href="mailto:support@basementbikemechanic.com">email us</a>.</p>
      </PrivacyContent>
      <Footer onBack={onBack} />
    </PageWrapper>
  );
}

export default Privacy;
