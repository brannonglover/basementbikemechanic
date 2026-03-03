import React from "react";
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
      <button onClick={handleClick}>{linkText}</button>
    </FooterStyled>
  );
}

export default Footer;
