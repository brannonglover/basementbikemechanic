import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import ServiceBox from "./components/service-box";
import IndividualBox from "./components/individual-box";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Privacy from "./Privacy";
import Terms from "./Terms";
import BikesForSale from "./pages/BikesForSale";
import Admin from "./pages/Admin";
import config from './assets/siteConfig.json';
import PageSeo from './components/PageSeo';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from './seoConstants';
import TuneUp from './images/close-up-hand-repairing-bike.jpg';

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

function HomePage({ width, view, switchViews }) {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageSeo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} path="" />
      <Header />
      <SiteDescription>
        <h1>Atlanta Bike Repair &amp; Bicycle Tune-Ups</h1>
        {config.site_description}
      </SiteDescription>
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
            <button onClick={() => switchViews('tuneup')} className={view === 'tuneup' ? 'active' : undefined}>Tune Ups</button><button onClick={() => switchViews('service')} className={view === 'service' ? 'active' : undefined}>Services</button>
          </ViewButton>
          {view === 'tuneup' && (
            <>
              <ServiceHeader>{ config.service_header }</ServiceHeader>
              <MyServices>
                {config.services.map(item => <ServiceBox services={item} key={item.id} />)}
              </MyServices>
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
        Text: <a href={`tel:${config.phone}`}>{config.phone}</a><br />
        Email: <a href={`mailto:${config.email}`}>{config.email}</a><br />
        Location: <a href="https://maps.app.goo.gl/dPsymJhVVwD5ymha6">Melinda Dr NE, Atlanta GA 30345</a>
      </MyEmail>
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

  function switchViews(view) {
    if (view === 'tuneup') {
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
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/bikes-for-sale" element={<BikesForSale />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/" element={<HomePage width={width} view={view} switchViews={switchViews} />} />
    </Routes>
  )
}

export default App;
