import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import config from "../assets/siteConfig.json";
import BikeLogo from "../images/logo192.png";
import HeaderImage from "../images/header-image.jpeg";

const PageHeader = styled.header`
  position: relative;
  background-color: ${({ theme }) => theme.colors.headerBg};
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderStrong};
  display: flex;
  flex-direction: column;
  align-items: center;
  isolation: isolate;

  h1 {
    text-align: center;
  }

  @media screen and (min-width: 1100px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem 2rem;
    padding: 1.5rem 2rem 1.5rem;
    min-height: 12rem;
    background-color: ${({ theme }) => theme.colors.headerBg};
    background-image: url(${HeaderImage});
    background-size: cover;
    background-position: center 35%;
    background-repeat: no-repeat;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        105deg,
        rgba(10, 10, 10, 0.88) 0%,
        rgba(10, 10, 10, 0.55) 45%,
        rgba(10, 10, 10, 0.25) 100%
      );
      z-index: 0;
    }

    h1 {
      text-align: left;
    }
  }
`;

const HeaderInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media screen and (min-width: 1100px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 2rem;
  }
`;

const Title = styled.h1`
  width: 16rem;
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textInverse};
  margin: 0 auto 0.5rem;
  padding-top: 0.5rem;
  text-align: center;

  a {
    color: inherit;
    text-decoration: none;
    display: block;
    margin-top: 0.35rem;
    font-weight: 500;
    font-size: 0.95em;
    opacity: 0.95;
  }

  @media screen and (min-width: 1000px) {
    text-align: left;
    margin: 0;
    padding-top: 0;
    width: auto;
  }
`;

const Tagline = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.brandGreen};
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
  margin-top: 0.75rem;

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const Logo = styled.img`
  position: relative;
  z-index: 1;
  width: 5rem;
  height: auto;
  padding-right: 1rem;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: opacity ${({ theme }) => theme.transition};

  &:hover {
    opacity: 0.92;
  }
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

const NavContainer = styled.nav`
  display: none;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
  justify-content: flex-start;

  @media screen and (min-width: 1000px) {
    display: flex;
    position: relative;
    z-index: 1;
    margin-left: auto;
  }
`;

const HamburgerButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  z-index: 1002;
  transition: background ${({ theme }) => theme.transition};

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(280px, 88vw);
  background-color: ${({ theme }) => theme.colors.headerBg};
  padding: 5rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: stretch;
  justify-content: flex-start;
  z-index: 1001;
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 1px solid ${({ theme }) => theme.colors.borderStrong};
  box-shadow: ${({ theme }) => theme.shadow.lg};

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const HomeLink = styled.a`
  color: ${({ theme }) => theme.colors.textInverse};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.transition};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const MobileMenuLink = styled(HomeLink)`
  padding: 0.85rem 1rem;
`;

const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const BookButton = styled.a`
  background-color: ${({ theme }) => theme.colors.accent};
  border: none;
  color: ${({ theme }) => theme.colors.text};
  text-transform: none;
  letter-spacing: 0.02em;
  text-decoration: none;
  font-weight: 600;
  padding: 0.55rem 1.15rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background ${({ theme }) => theme.transition}, transform ${({ theme }) => theme.transition};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NavBookButton = styled(BookButton)`
  @media screen and (min-width: 1000px) {
    margin-left: 0.25rem;
  }
`;

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <path d="M6 6l12 12M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

function Header() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (e, path) => {
    e.preventDefault();
    navigate(path);
    setMenuOpen(false);
  };

  const triggerBook = (e) => {
    e.preventDefault();
    document.getElementById("bikeops-book-trigger")?.click();
  };

  return (
    <PageHeader>
      <HeaderInner>
        <Logo
          src={BikeLogo}
          alt={config.title}
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        />
        <HeaderContent>
          <Title>
            {config.title}{" "}
            {width < 1000 && (
              <a href={`tel:${config.phone}`}>{config.phone}</a>
            )}
          </Title>
          <Tagline>{config.tagline}</Tagline>
          <MobileBookButtonContainer>
            <BookButton href="#" onClick={triggerBook}>
              Book now
            </BookButton>
          </MobileBookButtonContainer>
        </HeaderContent>
        <HamburgerButton
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon open={menuOpen} />
        </HamburgerButton>
        <NavContainer aria-label="Main">
          <HomeLink href="/" onClick={(e) => handleNav(e, "/")}>
            Home
          </HomeLink>
          <HomeLink href="/bikes-for-sale" onClick={(e) => handleNav(e, "/bikes-for-sale")}>
            Bikes for Sale
          </HomeLink>
          <NavBookButton href="#" onClick={triggerBook}>
            Book now
          </NavBookButton>
        </NavContainer>
      </HeaderInner>
      <MenuBackdrop $isOpen={menuOpen} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <MobileMenu id="site-mobile-menu" $isOpen={menuOpen} role="dialog" aria-modal="true" aria-label="Menu">
        <MobileMenuLink href="/" onClick={(e) => handleNav(e, "/")}>
          Home
        </MobileMenuLink>
        <MobileMenuLink href="/bikes-for-sale" onClick={(e) => handleNav(e, "/bikes-for-sale")}>
          Bikes for Sale
        </MobileMenuLink>
        <BookButton href="#" onClick={(e) => { triggerBook(e); setMenuOpen(false); }} style={{ marginTop: "0.5rem", textAlign: "center" }}>
          Book now
        </BookButton>
      </MobileMenu>
    </PageHeader>
  );
}

export default Header;
