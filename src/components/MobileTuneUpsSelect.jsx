import React, { useState } from "react";
import styled from "styled-components";
import ServiceBox from "./service-box";

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 0 0.75rem 0;
  max-width: 1325px;
  width: 100%;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const chevronSvg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

const StyledSelect = styled.select`
  display: block;
  width: 100%;
  max-width: 56rem;
  margin: 0 auto 0.25rem;
  padding: 0.7rem 2.75rem 0.7rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: ${chevronSvg};
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  background-size: 1.25rem;
  min-height: 3rem;
  transition: border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const DetailRegion = styled.div`
  margin-top: 0;
`;

export default function MobileTuneUpsSelect({ services }) {
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? 0);
  const selected = services.find((s) => s.id === selectedId) ?? services[0];

  if (!services?.length || !selected) {
    return null;
  }

  return (
    <Wrapper>
      <FieldLabel htmlFor="mobile-tuneup-select">Choose a tune-up</FieldLabel>
      <StyledSelect
        id="mobile-tuneup-select"
        value={selectedId}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        aria-controls="tuneup-detail-panel"
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.service} — ${s.price}
          </option>
        ))}
      </StyledSelect>
      <DetailRegion id="tuneup-detail-panel" role="region" aria-live="polite">
        <ServiceBox key={selected.id} services={selected} />
      </DetailRegion>
    </Wrapper>
  );
}
