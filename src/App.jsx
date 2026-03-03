import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import ServiceBox from "./components/service-box";
import IndividualBox from "./components/individual-box";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Privacy from "./Privacy";
import config from './assets/siteConfig.json';
import TuneUp from './images/close-up-hand-repairing-bike.jpg';

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const SiteDescription = styled.section`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 25px;

  h1 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 1350px) {
    padding-top: 2rem; 

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  }
`;

const RegularMaintenance = styled.section`
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 25px;

  h2 {
    margin-top: 3rem;
  }

  @media screen and (min-width: 1100px) {
    flex-direction: row;

    h2 {
      margin-top: 0;
    }
  }

  img {
    width: calc(100% + 4rem);
    margin-left: -2rem;
    margin-right: -2rem;
    object-fit: cover;

    @media screen and (min-width: 1100px) {
      width: auto;
      margin: 0;
      padding-right: 4rem;
    }
  }
`



const ServiceHeader = styled.h2`
  margin: 0;
  text-align: center;
  padding: 2rem 0 0;
  font-size: 2rem;
  font-family: Arial, Helvetica, sans-serif;
`;

const MyServices = styled.section`
  margin: 0 auto;
  padding-top: 1rem;
  max-width: 1325px;
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const IndividualServices = styled.section`
  display: grid;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding-top: 1rem;

  @media screen and (min-width: 1000px) {
    grid-template-columns: 1fr 1fr;
    width: 57rem;
    column-gap: 1rem;
  }

  @media screen and (min-width: 1450px) {
    width: 86rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const BreakLine = styled.div`
  width: 50%;
  background-color: #7a7979;
  height: 2px;
  padding: 0;
  margin: 5rem auto 1rem;
`;

const MyEmail = styled.div`
  padding-top: 4rem;
  padding-bottom: 2rem;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.3rem;
  text-align: center;
  line-height: 2rem;

  a {
    color: #000;
  }
`;



const ViewButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .active {
    background-color: #fecf11;
  }

  button {
    margin: 0 .5rem;
    background-color: #f9a61c;
    border: 1px solid #b90000;
    padding: .5rem 1.5rem;
    font-size: 1rem;
    color: #000;
    cursor: pointer;
  }
`;



const App = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [view, setView] = useState('tuneup');
  const [currentPage, setCurrentPage] = useState('home');

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

  if (currentPage === 'privacy') {
    return <Privacy onBack={() => setCurrentPage('home')} />;
  }

  return (
    <PageWrapper>
      <Header onHome={() => setCurrentPage('home')} />
      <SiteDescription>
        <h1>Welcome to Basement Bike Mechanic!</h1>
        {config.site_description}
      </SiteDescription>
      {/* ReviewWidget disabled due to script conflicts */}
      {/* <ReviewWidgetWrapper>
        <ReviewWidget token="bSpwsMrwg8NYUbvrGcAohM5Yqk7y5RfZ3dTI2ec6PDt9hESskv" />
      </ReviewWidgetWrapper> */}
      <RegularMaintenance>
        <img src={TuneUp} alt="Regular Maintenance" />
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
      <Footer onNavigatePrivacy={() => setCurrentPage('privacy')} />
    </PageWrapper>
  )
}

export default App;
