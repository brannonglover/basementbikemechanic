import React, { useEffect, useState } from "react";
import { styled } from 'styled-components';
import ServiceBox from "./components/service-box";
import IndividualBox from "./components/individual-box";
import config from './assets/siteConfig.json';
import BikeLogo from './images/logo192.png';
import HeaderImage from './images/header-image.jpeg';

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

  @media screen and (min-width: 1350px) {
    padding-top: 2rem; 
  }
`;

const PageHeader = styled.section`
  background-color: #000;
  padding: 1rem;
  border-bottom: 2px solid #E1AE8B;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    text-align: center;
  }

  @media screen and (min-width: 1000px) {
    display: flex;
    flex-direction: row;
    padding: 5rem 1rem 1rem;
    background-color: unset;
    background-image: url(${HeaderImage});
    background-size: cover;
    background-position: 0 -10rem;
    background-repeat: no-repeat;

    h1 {
      text-align: left;
    }
  }
`;


const Title = styled.h1`
  width: 16rem;
  font-size: 1.3rem;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
  margin: 0 auto;
  padding-top: .5rem;

  a {
    color: #fff;
    text-decoration: none;
  }

  @media screen and (min-width: 1000px) {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin: 0;
    width: auto;
  }
`;

const Tagline = styled.span`
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  color: #8bbe45;
`

const Logo = styled.img`
  width: 5rem;
  padding-right: 1rem;
`;

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
    width: 53rem;
    column-gap: 1rem;
  }

  @media screen and (min-width: 1350px) {
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

const App = () => {
  const [width, setWidth] = useState(window.innerWidth);

  function gtag() { window.dataLayer.push(arguments); }

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    window.dataLayer = window.dataLayer || [];
    
    gtag('js', new Date());
    gtag('config', 'AW-16578987654');
    gtag('event', 'conversion', {'send_to': 'AW-16578987654/JcCuCIuT27gZEIaNveE9'});

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };

    gtag('event', 'conversion', {
        'send_to': 'AW-16578987654/P1sJCJPchsUZEIaNveE9',
        'event_callback': callback
    });

    gtag('event', 'conversion', {
      'send_to': 'TAG_ID/CONVERSION_LABEL',
      'value': 1.0,
      'currency': 'USD',
      'event_callback': callback
    });
    return false;
  }

  return (
    <PageWrapper>
      <PageHeader>
        <Logo src={BikeLogo} alt={config.title} />
        <div>
          <Title>{config.title} {width < 1000 && <a onClick={gtag_report_conversion} href={`sms:${config.phone}`}>{config.phone}</a>}</Title>
          <Tagline>{config.tagline}</Tagline>
        </div>
      </PageHeader>
      <SiteDescription>
        {config.site_description}
      </SiteDescription>
      <ServiceHeader>{ config.service_header }</ServiceHeader>
      <MyServices>
        {config.services.map(item => <ServiceBox services={item} key={item.id} />)}
      </MyServices>
      <BreakLine />
      <ServiceHeader>{ config.additional_services }</ServiceHeader>
      <IndividualServices>
        {config.individual_services.map(item => <IndividualBox services={item} key={item.id} />)}
      </IndividualServices>
      <MyEmail>
        Text: <a onClick={gtag_report_conversion} href={`sms:${config.phone}`}>{config.phone}</a><br />
        Email: <a href={`mailto:${config.email}`}>{config.email}</a><br />
        Location: <a href="https://maps.app.goo.gl/dPsymJhVVwD5ymha6">Melinda Dr NE, Atlanta GA 30345</a>
      </MyEmail>
    </PageWrapper>
  )
}

export default App;
