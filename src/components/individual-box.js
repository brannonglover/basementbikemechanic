import React from 'react';
import { styled } from 'styled-components';

const IndividualBoxWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 5rem;
  border-bottom: 1px solid gray;

  @media screen and (min-width: 1000px) {
    grid-template-columns: 23rem 5rem;
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
  display: flex;
  justify-content: center;
  font-size: 1.1875rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  padding: 1rem 2rem;
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