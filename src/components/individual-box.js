import React from "react";
import { styled } from "styled-components";

const IndividualBoxWrapper = styled.div`
  display: grid;
  align-items: stretch;
  grid-template-columns: 1fr 5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: box-shadow ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  @media screen and (min-width: 1000px) {
    grid-template-columns: minmax(0, 23rem) 5rem;
    justify-content: center;
  }
`;

const ServiceBoxName = styled.span`
  padding: 1rem 1rem;
  font-size: 1rem;
  line-height: 1.45;
  background-color: ${({ theme }) => theme.colors.bgMuted};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ServicePrice = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  padding: 1rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primaryDark};
  align-items: center;
`;

const ServiceBox = ({ services }) => {
  return (
    <IndividualBoxWrapper>
      <ServiceBoxName>{services.service}</ServiceBoxName>
      <ServicePrice>${services.price}</ServicePrice>
    </IndividualBoxWrapper>
  );
};

export default ServiceBox;
