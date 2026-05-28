import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { SERVICE_QUICK_PICKS } from "../config/bookingServices";
import {
  buildPopularServiceIds,
  getHighlightedNameSegments,
  partitionServicesForDisplay,
} from "../utils/serviceSearch";

function getServiceDescriptionItems(description) {
  if (!description) return [];

  return description
    .split(/\r?\n|•/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[-*]\s*/, "").trim());
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const QuickPickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 0.85rem;
`;

const QuickPickChip = styled.button`
  min-height: 44px;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.borderStrong};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentHover : theme.colors.text};
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const SearchMeta = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ServiceSectionLabel = styled.h3`
  margin: 0 0 0.45rem;
  padding: 0 0.15rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ServicesPanel = styled.div`
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(24, 24, 27, 0.08)"};
  border-radius: 16px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(30, 41, 59, 0.82)" : theme.colors.surface};
  padding: 0.35rem;
  box-shadow: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e"
      ? "inset 0 1px 0 rgba(255, 255, 255, 0.03)"
      : "none"};

  max-height: 260px;
  overflow-y: auto;

  @media (max-width: 640px) {
    max-height: min(52vh, 420px);
  }
`;

const ServiceRow = styled.label`
  display: grid;
  grid-template-columns: auto 1fr minmax(56px, auto);
  gap: 0.75rem;
  align-items: center;
  min-height: 48px;
  padding: 0.85rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(51, 65, 85, 0.5)" : theme.colors.bgMuted};
  }

  @media (max-width: 640px) {
    min-height: 52px;
    padding: 0.95rem 0.8rem;
  }
`;

const ServiceCheckbox = styled.input`
  width: 22px;
  height: 22px;
  margin: 0;
  flex-shrink: 0;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  @media (max-width: 640px) {
    width: 24px;
    height: 24px;
  }
`;

const ServiceName = styled.span`
  display: block;
  font-weight: 600;
  color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "#e2e8f0" : theme.colors.text};
`;

const HighlightedMatch = styled.mark`
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e"
      ? "rgba(245, 158, 11, 0.28)"
      : "rgba(245, 158, 11, 0.35)"};
  color: inherit;
  padding: 0 0.05em;
  border-radius: 2px;
`;

const ServiceDescription = styled.span`
  display: block;
  margin-top: 0.1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ServiceSummary = styled.div`
  min-width: 0;
`;

const ServiceNameLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
`;

const ServiceExpandButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font: inherit;
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s ease, transform 0.15s ease;
  flex: 0 0 auto;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ChevronIcon = styled.svg`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  line-height: 1;
  transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
  transition: transform 0.15s ease;
`;

const ServiceDetails = styled.div`
  grid-column: 2 / 4;
  margin-top: -0.15rem;
  padding: 0 0 0.1rem;
`;

const ServiceBulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  color: ${({ theme }) => theme.colors.textMuted};

  li + li {
    margin-top: 0.28rem;
  }

  li {
    font-size: 0.85rem;
    line-height: 1.45;
  }
`;

const ServicePrice = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "#f8fafc" : theme.colors.text};
  grid-column: 3;
  justify-self: end;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const ShowAllButton = styled.button`
  display: block;
  width: 100%;
  margin: 0.5rem 0 0;
  min-height: 44px;
  padding: 0.65rem 1rem;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const PanelStack = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorAlert = styled.div`
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.9rem 1rem;
  font-size: 0.92rem;
  line-height: 1.5;
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.24)" : "rgba(220, 38, 38, 0.24)"};
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(127, 29, 29, 0.34)" : "rgba(220, 38, 38, 0.1)"};
  color: ${({ theme }) => (theme.colors.bg === "#1a1a1e" ? "#fecaca" : "#991b1b")};
`;

const Field = styled.div`
  display: grid;
  gap: 0.45rem;
`;

const Label = styled.label`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0.65rem 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 1rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

function ServiceNameHighlight({ name, query }) {
  const segments = getHighlightedNameSegments(name, query);

  return (
    <ServiceName>
      {segments.map((segment, index) =>
        segment.highlight ? (
          <HighlightedMatch key={`${segment.text}-${index}`}>{segment.text}</HighlightedMatch>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </ServiceName>
  );
}

function ServiceListItem({
  service,
  selected,
  expanded,
  highlightQuery,
  onToggle,
  onToggleDetails,
}) {
  const descriptionItems = getServiceDescriptionItems(service.description);
  const hasDescription = descriptionItems.length > 0;

  return (
    <ServiceRow>
      <ServiceCheckbox
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(service.id)}
        aria-label={`Select ${service.name}`}
      />
      <ServiceSummary>
        <ServiceNameLine>
          {highlightQuery ? (
            <ServiceNameHighlight name={service.name} query={highlightQuery} />
          ) : (
            <ServiceName>{service.name}</ServiceName>
          )}
          {hasDescription && (
            <ServiceExpandButton
              type="button"
              aria-label={
                expanded
                  ? `Hide details for ${service.name}`
                  : `Show details for ${service.name}`
              }
              aria-expanded={expanded}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggleDetails(service.id);
              }}
            >
              <ChevronIcon $expanded={expanded} viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M2.25 4.5 6 8.25 9.75 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </ChevronIcon>
            </ServiceExpandButton>
          )}
        </ServiceNameLine>
        {!hasDescription && service.description && (
          <ServiceDescription>{service.description}</ServiceDescription>
        )}
      </ServiceSummary>
      <ServicePrice>{formatCurrency(service.price)}</ServicePrice>
      {hasDescription && expanded && (
        <ServiceDetails>
          <ServiceBulletList>
            {descriptionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ServiceBulletList>
        </ServiceDetails>
      )}
    </ServiceRow>
  );
}

function ServiceList({
  services,
  highlightQuery,
  selectedIds,
  expandedServices,
  onToggle,
  onToggleDetails,
}) {
  if (!services.length) return null;

  return services.map((service) => (
    <ServiceListItem
      key={service.id}
      service={service}
      selected={selectedIds.includes(service.id)}
      expanded={Boolean(expandedServices[service.id])}
      highlightQuery={highlightQuery}
      onToggle={onToggle}
      onToggleDetails={onToggleDetails}
    />
  ));
}

export default function BookServicePicker({
  services,
  loadingServices,
  serviceLoadError,
  selectedServiceIds,
  onToggleService,
}) {
  const [serviceSearch, setServiceSearch] = useState("");
  const [activeQuickPick, setActiveQuickPick] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [expandedServices, setExpandedServices] = useState({});

  const popularIds = useMemo(() => buildPopularServiceIds(services), [services]);

  const trimmedSearch = serviceSearch.trim();
  const isSearching = trimmedSearch.length > 0;

  const display = useMemo(
    () => partitionServicesForDisplay(services, trimmedSearch, popularIds),
    [services, trimmedSearch, popularIds]
  );

  const handleQuickPick = (chip) => {
    setActiveQuickPick(chip.id);
    setServiceSearch(chip.searchQuery);
    setShowAllServices(true);
  };

  const handleSearchChange = (value) => {
    setServiceSearch(value);
    const chip = SERVICE_QUICK_PICKS.find((item) => item.id === activeQuickPick);
    if (chip && value.trim() !== chip.searchQuery) {
      setActiveQuickPick(null);
    }
    if (!value.trim()) {
      setShowAllServices(false);
    }
  };

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((previous) => ({
      ...previous,
      [serviceId]: !previous[serviceId],
    }));
  };

  const browsePopular = display.mode === "browse" ? display.popular : [];
  const browseRest = display.mode === "browse" ? display.rest : [];
  const showBrowseRest =
    display.mode === "browse" && (showAllServices || browsePopular.length === 0);

  const searchList =
    display.mode === "search"
      ? [...display.popular, ...display.rest]
      : [...browsePopular, ...(showBrowseRest ? browseRest : [])];

  const matchLabel =
    display.mode === "search" && display.matchCount > 0
      ? `${display.matchCount} service${display.matchCount === 1 ? "" : "s"} match “${trimmedSearch}”`
      : null;

  const hiddenBrowseCount =
    display.mode === "browse" && browsePopular.length > 0 && !showBrowseRest
      ? browseRest.length
      : 0;

  return (
    <>
      <QuickPickRow role="group" aria-label="Filter by common service type">
        {SERVICE_QUICK_PICKS.map((chip) => (
          <QuickPickChip
            key={chip.id}
            type="button"
            $active={activeQuickPick === chip.id}
            aria-pressed={activeQuickPick === chip.id}
            onClick={() => handleQuickPick(chip)}
          >
            {chip.label}
          </QuickPickChip>
        ))}
      </QuickPickRow>

      <Field>
        <Label htmlFor="serviceSearch">Search services</Label>
        <Input
          id="serviceSearch"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={serviceSearch}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Try: tune-up, brakes, flat tire, wheel true"
        />
      </Field>

      {matchLabel && <SearchMeta>{matchLabel}</SearchMeta>}

      <PanelStack>
        {loadingServices ? (
          <HelperText>Loading services...</HelperText>
        ) : serviceLoadError ? (
          <ErrorAlert>{serviceLoadError}</ErrorAlert>
        ) : searchList.length > 0 ? (
          <>
            {display.mode === "browse" && browsePopular.length > 0 && (
              <>
                <ServiceSectionLabel>Common requests</ServiceSectionLabel>
                <ServicesPanel>
                  <ServiceList
                    services={browsePopular}
                    highlightQuery={isSearching ? trimmedSearch : ""}
                    selectedIds={selectedServiceIds}
                    expandedServices={expandedServices}
                    onToggle={onToggleService}
                    onToggleDetails={toggleServiceDetails}
                  />
                </ServicesPanel>
              </>
            )}

            {display.mode === "search" && (
              <>
                <ServiceSectionLabel>Best matches</ServiceSectionLabel>
                <ServicesPanel>
                  <ServiceList
                    services={searchList}
                    highlightQuery={trimmedSearch}
                    selectedIds={selectedServiceIds}
                    expandedServices={expandedServices}
                    onToggle={onToggleService}
                    onToggleDetails={toggleServiceDetails}
                  />
                </ServicesPanel>
              </>
            )}

            {display.mode === "browse" && showBrowseRest && browseRest.length > 0 && (
              <>
                <ServiceSectionLabel>All services</ServiceSectionLabel>
                <ServicesPanel>
                  <ServiceList
                    services={browseRest}
                    selectedIds={selectedServiceIds}
                    expandedServices={expandedServices}
                    onToggle={onToggleService}
                    onToggleDetails={toggleServiceDetails}
                  />
                </ServicesPanel>
              </>
            )}

            {hiddenBrowseCount > 0 && (
              <ShowAllButton type="button" onClick={() => setShowAllServices(true)}>
                Show all services ({services.length})
              </ShowAllButton>
            )}
          </>
        ) : (
          <HelperText>No services match your search.</HelperText>
        )}
      </PanelStack>
    </>
  );
}
