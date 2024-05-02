import React from 'react';
import { styled } from 'styled-components';

const IndividualBoxWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3rem;
  border-bottom: 1px solid gray;

  @media screen and (min-width: 1000px) {
    grid-template-columns: 23rem 3rem;
    justify-content: center;
  }
`;

const ServiceBoxName = styled.span`
  padding: 1.1rem 1rem;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  background-color: #faf7f7;
`;

const ServicePrice = styled.span`
  font-size: 19px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  padding: 1rem 0.5rem;
  background-color: #cee3f0;
`;

const ServiceBox = ({ services }) => {
  return (
    <IndividualBoxWrapper>
      <ServiceBoxName>{services.service}</ServiceBoxName>
      <ServicePrice>${ services.price }</ServicePrice>
    </IndividualBoxWrapper>
  )
}

export default ServiceBox;