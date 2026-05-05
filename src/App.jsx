import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { usePostHog } from '@posthog/react';
import styled from 'styled-components';
import ServiceBox from "./components/service-box";
import MobileTuneUpsSelect from "./components/MobileTuneUpsSelect";
import IndividualBox from "./components/individual-box";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Privacy from "./Privacy";
import Terms from "./Terms";
import BikesForSale from "./pages/BikesForSale";
import Admin from "./pages/Admin";
import Book from "./pages/Book";
import config from './assets/siteConfig.json';
import PageSeo from './components/PageSeo';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from './seoConstants';
import TuneUp from './images/close-up-hand-repairing-bike.jpg';
import { useThemeMode } from "./ThemeModeContext";

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const SiteDescription = styled.section`
  font-size: 1.0625rem;
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  h1 {
    font-size: clamp(1.35rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  @media screen and (min-width: 1350px) {
    padding-top: 2.5rem;
  }
`;

const RegularMaintenance = styled.section`
  display: flex;
  flex-direction: column;
  font-size: 1.0625rem;
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  h2 {
    margin-top: 2.5rem;
    font-size: clamp(1.35rem, 2vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.text};
  }

  @media screen and (min-width: 1100px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;

    h2 {
      margin-top: 0;
    }
  }

  img {
    width: calc(100% + 3rem);
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    object-fit: cover;
    border-radius: 0;
    box-shadow: none;

    @media screen and (min-width: 1100px) {
      flex: 0 0 min(42%, 480px);
      width: 100%;
      margin: 0;
      padding-right: 0;
      border-radius: ${({ theme }) => theme.radius.md};
      box-shadow: ${({ theme }) => theme.shadow.md};
    }
  }
`;

const ServiceHeader = styled.h2`
  margin: 0;
  text-align: center;
  padding: 2rem 1rem 0;
  font-size: clamp(1.5rem, 2.5vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const MyServices = styled.section`
  margin: 0 auto;
  padding: 1rem 0.75rem 0;
  max-width: 1325px;
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const IndividualServices = styled.section`
  display: grid;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  padding: 1rem 0.75rem 0;
  width: 100%;
  max-width: 56rem;
  gap: 0.5rem;

  @media screen and (min-width: 1000px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
  }

  @media screen and (min-width: 1450px) {
    max-width: 86rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const BreakLine = styled.div`
  width: min(280px, 40%);
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.colors.borderStrong},
    transparent
  );
  height: 1px;
  padding: 0;
  margin: 4rem auto 0.5rem;
`;

const ReviewsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem 1rem;
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto;

  h2 {
    font-size: clamp(1.35rem, 2.5vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem;
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
  }

  [data-bikeops-reviews] {
    width: 100%;
  }
`;

const MyEmail = styled.div`
  padding: 3rem 1.5rem 2rem;
  font-size: 1.125rem;
  text-align: center;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.text};

  a {
    color: ${({ theme }) => theme.colors.footerLink};
    text-decoration: none;
    font-weight: 500;
    text-underline-offset: 3px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const AboutSection = styled.section`
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.0625rem;

  h2 {
    font-size: clamp(1.35rem, 2vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0 0 1rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const SmsDisclosure = styled.section`
  max-width: ${({ theme }) => theme.maxWidth.prose};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};

  h2 {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 0.65rem;
    color: ${({ theme }) => theme.colors.textMuted};
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


const ViewButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  margin-top: 0.5rem;

  button {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    padding: 0.55rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radius.full};
    transition: background ${({ theme }) => theme.transition}, border-color ${({ theme }) => theme.transition},
      box-shadow ${({ theme }) => theme.transition};

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  .active {
    background-color: ${({ theme }) => theme.colors.accentMuted};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

function PageViewTracker() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [location, posthog]);

  return null;
}

function ReviewsWidget() {
  const containerRef = useRef(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const script = document.createElement("script");
    script.src = "https://bbm.bikeops.co/reviews-widget.js";
    script.async = true;
    script.setAttribute("data-base-url", "https://bbm.bikeops.co");
    script.setAttribute("data-theme", mode);

    containerRef.current.insertAdjacentElement("afterend", script);

    return () => {
      script.remove();
    };
  }, [mode]);

  return <div ref={containerRef} data-bikeops-reviews />;
}

function HomePage({ width, view, switchViews }) {
  const navigate = useNavigate();
  const posthog = usePostHog();
  return (
    <PageWrapper>
      <PageSeo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} path="" />
      <Header />
      <SiteDescription>
        <h1>Atlanta Bike Repair &amp; Bicycle Tune-Ups</h1>
        {config.site_description}
      </SiteDescription>
      <BreakLine />
      <ReviewsSection>
        <h2>What Customers Are Saying</h2>
        <ReviewsWidget />
      </ReviewsSection>
      <BreakLine />
      <AboutSection id="about">
        <h2>About</h2>
        <p>
          I grew up in Roswell, GA where bikes were just part of life — riding
          everywhere, taking things apart to see how they worked, and putting
          them back together. That curiosity never went away.
        </p>
        <p>
          A couple years ago I turned that lifelong passion into Basement Bike
          Mechanic. The name is literal: I work out of my basement in Atlanta,
          one appointment at a time. Working by reservation isn't just a
          scheduling preference — it means every bike gets real, focused
          attention instead of being rushed through a shop queue.
        </p>
        <p>
          When you drop your bike off with me, I'm the one working on it, start
          to finish. No handoffs, no shortcuts. Just an Atlanta cyclist who
          takes care of other people's bikes the same way he takes care of his
          own.
        </p>
      </AboutSection>
      <RegularMaintenance>
        <img
          src={TuneUp}
          alt="Mechanic performing bicycle tune-up and bike repair service in Atlanta"
        />
        <div>
          <h2>Regular Maintenance</h2>
          <p>{config.regular_maintenance_first}</p>
          <p>{config.regular_maintenance_second}</p>
        </div>
      </RegularMaintenance>
      {width <= 1000 ? (
        <>
          <ViewButton>
            <button onClick={() => { posthog.capture('service_tab_switched', { tab: 'tuneup' }); switchViews('tuneup'); }} className={view === 'tuneup' ? 'active' : undefined}>Tune Ups</button><button onClick={() => { posthog.capture('service_tab_switched', { tab: 'service' }); switchViews('service'); }} className={view === 'service' ? 'active' : undefined}>Services</button>
          </ViewButton>
          {view === 'tuneup' && (
            <>
              <ServiceHeader>{ config.service_header }</ServiceHeader>
              <MobileTuneUpsSelect services={config.services} />
            </>
          )}
          {view === 'service' && (
          <>
            <ServiceHeader>{ config.additional_services }</ServiceHeader>
            <IndividualServices>
              {config.individual_services.map(item => <IndividualBox services={item} key={item.id} />)}
            </IndividualServices>
          </>
          )}
        </>
      ) : (
        <>
          <ServiceHeader>{ config.service_header }</ServiceHeader>
          <MyServices>
            {config.services.map(item => <ServiceBox services={item} key={item.id} />)}
          </MyServices>
          <BreakLine/>
          <ServiceHeader>{ config.additional_services }</ServiceHeader>
          <IndividualServices>
            {config.individual_services.map(item => <IndividualBox services={item} key={item.id} />)}
          </IndividualServices>
        </>
      )}
      <MyEmail>
        Text: <a href={`tel:${config.phone}`} onClick={() => posthog.capture('contact_clicked', { method: 'phone' })}>{config.phone}</a><br />
        Email: <a href={`mailto:${config.email}`} onClick={() => posthog.capture('contact_clicked', { method: 'email' })}>{config.email}</a><br />
        Location: <a href="https://maps.app.goo.gl/dPsymJhVVwD5ymha6" onClick={() => posthog.capture('contact_clicked', { method: 'maps' })}>Melinda Dr NE, Atlanta GA 30345</a>
      </MyEmail>
      <SmsDisclosure>
        <h2>SMS Communication</h2>
        <p>We send SMS updates from Basement Bike Mechanic related to active bike repairs, including booking confirmations, service progress, and pickup notifications.</p>
        <p>Customers opt in by submitting a repair request form on our website and checking a required SMS acknowledgment checkbox before submission. This checkbox is displayed during the booking process and must be selected to receive messages.</p>
        <p>Message frequency varies. Message &amp; data rates may apply. Reply <strong>STOP</strong> to opt out, <strong>HELP</strong> for help. No marketing messages are sent.</p>
        <p>
          View our{' '}
          <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
          {' '}and{' '}
          <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a>.
        </p>
      </SmsDisclosure>
      <Footer onNavigatePrivacy={() => navigate('/privacy')} onNavigateTerms={() => navigate('/terms')} />
    </PageWrapper>
  );
}

const App = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [view, setView] = useState('tuneup');

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    // window.dataLayer = window.dataLayer || [];

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  function switchViews(newView) {
    if (newView === 'tuneup') {
      setView('tuneup');
    } else {
      setView('service');
    }
  }

  // function gtag(){window.dataLayer.push(arguments);}
  // gtag('js', new Date());

  // gtag('config', 'AW-16578987654');

  // // record page view
  // gtag('event', 'conversion', {'send_to': 'AW-16578987654/JcCuCIuT27gZEIaNveE9'});

  // function gtag_report_conversion(url) {
  //   gtag('event', 'conversion', {
  //       'send_to': 'AW-16578987654/P1sJCJPchsUZEIaNveE9',
  //       'event_callback': ''
  //   });
  //   return false;
  // }

  return (
    <>
      <PageViewTracker />
      <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/book" element={<Book />} />
      <Route path="/bikes-for-sale" element={<BikesForSale />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/" element={<HomePage width={width} view={view} switchViews={switchViews} />} />
      </Routes>
    </>
  )
}

export default App;
