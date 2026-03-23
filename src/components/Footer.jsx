import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';

const FooterStyled = styled.footer`
  background-color: #f9f9f9;
  padding: 1rem 0;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;

  a, button {
    color: #0077cc;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }

`;

function Footer({ onNavigatePrivacy, onNavigateTerms, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBackPage = location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/admin';

  const handleBackClick = (e) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    if (onNavigatePrivacy) {
      onNavigatePrivacy();
    } else {
      navigate('/privacy');
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    if (onNavigateTerms) {
      onNavigateTerms();
    } else {
      navigate('/terms');
    }
  };

  return (
    <FooterStyled>
      {isBackPage ? (
        <button onClick={handleBackClick}>Back to home</button>
      ) : (
        <>
          <button onClick={handlePrivacyClick}>Privacy Policy</button>
          {' · '}
          <button onClick={handleTermsClick}>Terms & Conditions</button>
        </>
      )}
    </FooterStyled>
  );
}

export default Footer;
