import React from "react";
import styled from 'styled-components';

const FooterStyled = styled.footer`
  background-color: #f9f9f9;
  padding: 1rem 0;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;

  a {
    color: #0077cc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Footer({ onNavigatePrivacy, onBack }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else if (onNavigatePrivacy) {
      onNavigatePrivacy();
    }
  };

  const linkText = onBack ? "Back to home" : "Privacy Policy";

  return (
    <FooterStyled>
      <a href="#" onClick={handleClick}>{linkText}</a>
    </FooterStyled>
  );
}

export default Footer;
