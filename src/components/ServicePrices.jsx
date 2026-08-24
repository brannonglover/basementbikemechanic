import React from "react";
import styled from "styled-components";
import { useLocale } from "../i18n/LocaleContext";

const hasPrice = (value) => value != null && value !== "";

export function hasTieredPrices({ roadPrice, ebikePrice } = {}) {
  return hasPrice(roadPrice) || hasPrice(ebikePrice);
}

const SinglePrice = styled.div`
  text-align: center;
  font-size: ${({ $compact }) => ($compact ? "0.92rem" : "1.25rem")};
  font-weight: ${({ $compact }) => ($compact ? 800 : 700)};
  line-height: ${({ $compact }) => ($compact ? 1 : 1.2)};
  background-color: ${({ theme, $compact, $selected }) => {
    if (!$compact) return theme.colors.servicePriceBg;
    return $selected ? theme.colors.servicePriceBg : theme.colors.bgMuted;
  }};
  margin: 0;
  padding: ${({ $compact }) => ($compact ? "0.35rem 0.55rem" : "0.65rem 0")};
  color: ${({ theme, $compact, $selected }) => {
    if (!$compact) return theme.colors.servicePriceText;
    return $selected ? theme.colors.servicePriceText : theme.colors.text;
  }};
  border-radius: ${({ theme, $compact }) => ($compact ? theme.radius.full : "0")};
  white-space: nowrap;
`;

const PriceRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  margin: 0;
  background-color: ${({ theme, $compact, $selected }) => {
    if (!$compact) return theme.colors.servicePriceBg;
    return $selected ? theme.colors.servicePriceBg : theme.colors.bgMuted;
  }};
  color: ${({ theme, $compact, $selected }) => {
    if (!$compact) return theme.colors.servicePriceText;
    return $selected ? theme.colors.servicePriceText : theme.colors.text;
  }};
  border-radius: ${({ theme, $compact }) => ($compact ? theme.radius.sm : "0")};
  overflow: hidden;
`;

const PriceCell = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ $compact }) => ($compact ? "0.1rem" : "0.1rem")};
  padding: ${({ $compact }) => ($compact ? "0.28rem 0.3rem" : "0.45rem 0.4rem")};
  min-width: 0;

  & + & {
    border-left: 1px solid
      ${({ theme, $compact, $selected }) => {
        if ($compact && $selected) return "rgba(15, 23, 42, 0.18)";
        return theme.colors.borderStrong;
      }};
  }
`;

const PriceLabel = styled.span`
  font-size: ${({ $compact }) => ($compact ? "0.58rem" : "0.68rem")};
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1.1;
  opacity: 0.78;
`;

const PriceAmount = styled.span`
  font-size: ${({ $compact }) => ($compact ? "0.86rem" : "1.2rem")};
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
`;

export default function ServicePrices({
  price,
  roadPrice,
  ebikePrice,
  compact = false,
  selected = false,
}) {
  const { t } = useLocale();
  const tiers = [];

  if (hasTieredPrices({ roadPrice, ebikePrice })) {
    tiers.push({
      key: "standard",
      label: t("servicePrice.standard"),
      amount: price,
    });
    if (hasPrice(roadPrice)) {
      tiers.push({
        key: "road",
        label: t("servicePrice.road"),
        amount: roadPrice,
      });
    }
    if (hasPrice(ebikePrice)) {
      tiers.push({
        key: "ebike",
        label: t("servicePrice.ebike"),
        amount: ebikePrice,
      });
    }
  }

  if (tiers.length === 0) {
    return (
      <SinglePrice $compact={compact} $selected={selected}>
        ${price}
      </SinglePrice>
    );
  }

  return (
    <PriceRow
      $columns={tiers.length}
      $compact={compact}
      $selected={selected}
      role="group"
      aria-label={tiers.map((tier) => `${tier.label} $${tier.amount}`).join(", ")}
    >
      {tiers.map((tier) => (
        <PriceCell key={tier.key} $compact={compact} $selected={selected}>
          <PriceLabel $compact={compact} aria-hidden="true">
            {tier.label}
          </PriceLabel>
          <PriceAmount $compact={compact}>${tier.amount}</PriceAmount>
        </PriceCell>
      ))}
    </PriceRow>
  );
}
