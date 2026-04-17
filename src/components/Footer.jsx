import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const FooterStyled = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.25rem 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  a,
  button {
    color: ${({ theme }) => theme.colors.footerLink};
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0.25rem 0.35rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    transition: color ${({ theme }) => theme.transition}, background ${({ theme }) => theme.transition};

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    &:focus-visible {
      outline-offset: 2px;
    }
  }
`;

function Footer({ onNavigatePrivacy, onNavigateTerms, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBackPage = location.pathname === "/privacy" || location.pathname === "/terms" || location.pathname === "/admin" || location.pathname === "/book";

  const handleBackClick = (e) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    if (onNavigatePrivacy) {
      onNavigatePrivacy();
    } else {
      navigate("/privacy");
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    if (onNavigateTerms) {
      onNavigateTerms();
    } else {
      navigate("/terms");
    }
  };

  return (
    <FooterStyled>
      {isBackPage ? (
        <button type="button" onClick={handleBackClick}>
          Back to home
        </button>
      ) : (
        <>
          <button type="button" onClick={handlePrivacyClick}>
            Privacy Policy
          </button>
          <span aria-hidden="true"> · </span>
          <button type="button" onClick={handleTermsClick}>
            Terms & Conditions
          </button>
        </>
      )}
    </FooterStyled>
  );
}

export default Footer;
