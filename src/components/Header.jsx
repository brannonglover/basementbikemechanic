import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import config from '../assets/siteConfig.json';
import BikeLogo from '../images/logo192.png';
import HeaderImage from '../images/header-image.jpeg';

const PageHeader = styled.section`
  position: relative;
  background-color: #000;
  padding: 1rem;
  border-bottom: 2px solid #E1AE8B;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    text-align: center;
  }

  @media screen and (min-width: 1100px) {
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
  margin: 0 auto 0.5rem;
  padding-top: .5rem;
  text-align: center;

  a {
    color: #fff;
    text-decoration: none;
    display: block;
    margin-top: 0.25rem;
  }

  @media screen and (min-width: 1000px) {
    font-size: 2rem;
    font-weight: bold;
    text-align: left;
    margin: 0;
    padding-top: 0;
    width: auto;
  }
`;

const Tagline = styled.span`
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  color: #8bbe45;
  margin-top: 0.25rem;
  display: block;

  @media screen and (min-width: 1000px) {
    margin-top: 0;
  }
`;

const MobileBookButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const Logo = styled.img`
  width: 5rem;
  padding-right: 1rem;
  cursor: pointer;
`;

const HeaderContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0;

  @media screen and (min-width: 1000px) {
    align-items: flex-start;
    justify-content: center;
  }
`;

const NavContainer = styled.div`
  display: none;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  justify-content: flex-start;

  @media screen and (min-width: 1000px) {
    display: flex;
  }
`;

const HamburgerButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: block;
  z-index: 1002;

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 250px;
  background-color: rgba(0, 0, 0, 0.99);
  padding: 2rem 1.5rem;
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 1001;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  border-left: 2px solid #E1AE8B;

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const HomeLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const MobileMenuHomeLink = styled(HomeLink)`
  padding-left: 1rem;
`;

const MenuBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const BookButton = styled.a`
  background-color: #fecf11;
  border: none;
  color: #000;
  text-transform: uppercase;
  text-decoration: none;
  font-family: Helvetica;
  letter-spacing: 1px;
  padding: .5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: block;
  width: fit-content;
  margin: 0;

  @media screen and (min-width: 1000px) {
    margin: 0;
  }
`;

function Header() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNav = (e, path) => {
    e.preventDefault();
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <PageHeader>
      <Logo src={BikeLogo} alt={config.title} onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/')} />
      <HeaderContent>
        <Title>{config.title} {width < 1000 && <a href={`tel:${config.phone}`}>{config.phone}</a>}</Title>
        <Tagline>{config.tagline}</Tagline>
        <MobileBookButtonContainer>
          <BookButton href="#" onClick={(e) => { e.preventDefault(); document.getElementById('bikeops-book-trigger')?.click(); }}>Book now</BookButton>
        </MobileBookButtonContainer>
      </HeaderContent>
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </HamburgerButton>
      <NavContainer>
        <HomeLink href="/" onClick={(e) => handleNav(e, '/')}>Home</HomeLink>
        <span style={{color: '#fff', display: 'inline'}}>|</span>
        <HomeLink href="/bikes-for-sale" onClick={(e) => handleNav(e, '/bikes-for-sale')}>Bikes for Sale</HomeLink>
        <span style={{color: '#fff', display: 'inline'}}>|</span>
        <BookButton href="#" onClick={(e) => { e.preventDefault(); document.getElementById('bikeops-book-trigger')?.click(); }}>Book now</BookButton>
      </NavContainer>
      <MenuBackdrop $isOpen={menuOpen} onClick={() => setMenuOpen(false)} />
      <MobileMenu $isOpen={menuOpen}>
        <MobileMenuHomeLink href="/" onClick={(e) => handleNav(e, '/')}>Home</MobileMenuHomeLink>
        <MobileMenuHomeLink href="/bikes-for-sale" onClick={(e) => handleNav(e, '/bikes-for-sale')}>Bikes for Sale</MobileMenuHomeLink>
      </MobileMenu>
    </PageHeader>
  );
}

export default Header;
