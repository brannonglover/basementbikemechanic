import React from "react";
import { styled } from "styled-components";

const ServiceBoxWrapper = styled.div`
  width: 100%;
  padding-top: 1rem;

  @media screen and (min-width: 1000px) {
    width: calc(50% - 0.5rem);
  }
`;

const ServiceBoxName = styled.h3`
  padding: 0.9rem 1rem;
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textInverse};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primaryDark} 100%
  );
  border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
`;

const ServicePrice = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  margin: 0;
  padding: 0.65rem 0;
  color: ${({ theme }) => theme.colors.primaryDark};
`;

const ServiceList = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};

  ul {
    margin: 0;
    padding: 1rem 1rem 1rem 1.75rem;
  }

  li {
    font-size: 1.05rem;
    line-height: 1.5;
    padding-bottom: 0.65rem;
    color: ${({ theme }) => theme.colors.text};

    &:last-child {
      padding-bottom: 0;
    }
  }
`;

const ServiceBox = ({ services }) => {
  return (
    <ServiceBoxWrapper>
      <ServiceBoxName>{services.service}</ServiceBoxName>
      <ServicePrice>${services.price}</ServicePrice>
      <ServiceList>
        <ul>
          {services.list?.map((item) => (
            <li key={item.id}>{item.task}</li>
          ))}
        </ul>
      </ServiceList>
    </ServiceBoxWrapper>
  );
};

export default ServiceBox;
