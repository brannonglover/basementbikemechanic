import React from "react";
import styled from "styled-components";

const EbikeBadge = styled.span`
  display: inline-block;
  padding: 0.05rem 0.38rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-weight: 800;
  white-space: nowrap;
`;

const ServiceName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const ebikePattern = /\(?\be-?bike\b\)?/gi;

export default function ServiceNameWithEmphasis({ children }) {
  if (typeof children !== "string") {
    return children;
  }

  const ebikeMatch = children.match(ebikePattern)?.[0];

  if (!ebikeMatch) {
    return children;
  }

  const badgeText = "ebike";
  const serviceName = children
    .replace(ebikePattern, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\)/g, ")")
    .replace(/\(\s+/g, "(")
    .trim();

  return (
    <ServiceName>
      <span>{serviceName}</span>
      <EbikeBadge>{badgeText}</EbikeBadge>
    </ServiceName>
  );
}
