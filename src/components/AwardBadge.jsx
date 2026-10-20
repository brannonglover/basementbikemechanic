import React from "react";
import styled from "styled-components";
import { usePostHog } from "@posthog/react";
import { useLocale } from "../i18n/LocaleContext";

const AWARD_URL =
  "https://businessrate.com/report/8882931?geocatSerial=1437282490&scoreType=br";

const Badge = styled.a`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.9rem;
  margin: 2.5rem auto 0;
  padding: 0.75rem 1.25rem 0.75rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  line-height: 1.3;
  max-width: 100%;
  text-decoration: none;
  transition: box-shadow ${({ theme }) => theme.transition},
    transform ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }

  svg {
    flex: 0 0 auto;
    width: 3.25rem;
    height: 3.25rem;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentText};
`;

const Title = styled.strong`
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Source = styled.span`
  display: block;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LEAF_ANGLES = [115, 140, 165, 190, 215, 240];

function Laurel() {
  const cx = 24;
  const cy = 25;
  const r = 17;
  const leaf = (angle, tilt, key) => {
    const rad = (angle * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return (
      <ellipse
        key={key}
        cx={x}
        cy={y}
        rx="2.4"
        ry="5"
        transform={`rotate(${angle + tilt} ${x} ${y})`}
        fill="currentColor"
      />
    );
  };

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {LEAF_ANGLES.map((a) => leaf(a, 25, `l${a}`))}
      {LEAF_ANGLES.map((a) => leaf(180 - a, -25, `r${a}`))}
      <path
        d="M24 15.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AwardBadge() {
  const { t } = useLocale();
  const posthog = usePostHog();
  return (
    <Badge
      href={AWARD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("home.awardAriaLabel")}
      onClick={() => posthog.capture("award_badge_clicked")}
    >
      <Laurel />
      <span>
        <Eyebrow>{t("home.awardEyebrow")}</Eyebrow>
        <Title>{t("home.awardTitle")}</Title>
        <Source>{t("home.awardSource")}</Source>
      </span>
    </Badge>
  );
}
