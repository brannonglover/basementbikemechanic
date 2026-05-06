import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ServiceNameWithEmphasis from "./ServiceNameWithEmphasis";

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 0.75rem 0.75rem 0;
  max-width: 56rem;
  width: 100%;
`;

const FieldLabel = styled.div`
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const OptionList = styled.div`
  width: 100%;
  display: grid;
  gap: 0.5rem;
`;

const expandedHeaderStart = (theme) =>
  theme.mode === "light" ? "#64748b" : theme.colors.serviceHeader;

const expandedHeaderEnd = (theme) =>
  theme.mode === "light" ? "#475569" : theme.colors.serviceHeaderDark;

const OptionItem = styled.div`
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.serviceHeader : theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme, $selected }) =>
    $selected ? theme.shadow.md : theme.shadow.sm};
  transition: border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  ${({ $selected, theme }) =>
    $selected &&
    `
      background: ${theme.colors.surface};
    `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const OptionButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.65rem;
  min-height: 3.25rem;
  padding: 0.75rem 0.85rem;
  text-align: left;
  font: inherit;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.textInverse : theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 0;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  ${({ $selected, theme }) =>
    $selected &&
    `
      background: linear-gradient(
        135deg,
        ${expandedHeaderStart(theme)} 0%,
        ${expandedHeaderEnd(theme)} 100%
      );
    `}

  &:focus-visible {
    outline: none;
  }
`;

const OptionText = styled.span`
  display: grid;
  gap: 0.15rem;
  min-width: 0;
`;

const OptionName = styled.span`
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.2;
`;

const OptionStatus = styled.span`
  font-size: 0.78rem;
  line-height: 1.2;
  color: ${({ theme, $selected }) =>
    $selected ? "rgba(250, 250, 250, 0.78)" : theme.colors.textMuted};
`;

const OptionPrice = styled.span`
  justify-self: end;
  padding: 0.35rem 0.55rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.servicePriceText : theme.colors.text};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.servicePriceBg : theme.colors.bgMuted};
`;

const Chevron = styled.span`
  width: 0.62rem;
  height: 0.62rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $expanded }) =>
    $expanded ? "rotate(225deg) translate(-1px, -1px)" : "rotate(45deg)"};
  opacity: 0.75;
  transition: transform ${({ theme }) => theme.transition};
`;

const Details = styled.div`
  display: ${({ $expanded }) => ($expanded ? "block" : "none")};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  ul {
    margin: 0;
    padding: 0.85rem 1rem 1rem 1.65rem;
  }

  li {
    font-size: 0.98rem;
    line-height: 1.45;
    padding-bottom: 0.55rem;
    color: ${({ theme }) => theme.colors.text};

    &:last-child {
      padding-bottom: 0;
    }
  }
`;

export default function MobileTuneUpsSelect({ services }) {
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? 0);

  useEffect(() => {
    if (!services?.length) return;
    if (selectedId === null) return;
    if (services.some((s) => s.id === selectedId)) return;
    setSelectedId(null);
  }, [services, selectedId]);

  if (!services?.length) {
    return null;
  }

  return (
    <Wrapper>
      <FieldLabel id="mobile-tuneup-options-label">Choose a tune-up</FieldLabel>
      <OptionList
        role="list"
        aria-labelledby="mobile-tuneup-options-label"
      >
        {services.map((s) => (
          <OptionItem key={s.id} role="listitem" $selected={s.id === selectedId}>
            <OptionButton
              type="button"
              aria-expanded={s.id === selectedId}
              aria-controls={`mobile-tuneup-details-${s.id}`}
              data-tuneup-id={s.id}
              $selected={s.id === selectedId}
              onClick={() =>
                setSelectedId((currentId) => (currentId === s.id ? null : s.id))
              }
            >
              <OptionText>
                <OptionName>
                  <ServiceNameWithEmphasis>{s.service}</ServiceNameWithEmphasis>
                </OptionName>
                <OptionStatus $selected={s.id === selectedId}>
                  {s.id === selectedId ? "Details open" : "Tap to view details"}
                </OptionStatus>
              </OptionText>
              <OptionPrice $selected={s.id === selectedId}>${s.price}</OptionPrice>
              <Chevron $expanded={s.id === selectedId} aria-hidden="true" />
            </OptionButton>
            <Details
              id={`mobile-tuneup-details-${s.id}`}
              $expanded={s.id === selectedId}
            >
              <ul>
                {s.list?.map((item) => (
                  <li key={item.id}>{item.task}</li>
                ))}
              </ul>
            </Details>
          </OptionItem>
        ))}
      </OptionList>
    </Wrapper>
  );
}
