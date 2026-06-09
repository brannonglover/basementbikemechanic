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

const ServicePickerCard = styled.div`
  display: grid;
  gap: 0.85rem;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

const IntroText = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 640px) {
    font-size: 0.9rem;
  }
`;

const SelectionSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(245, 158, 11, 0.14)" : theme.colors.accentMuted};
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(245, 158, 11, 0.28)"
        : "rgba(245, 158, 11, 0.35)"};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
`;

const FilterBox = styled.div`
  display: grid;
  gap: 0;
  padding: 0.85rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};

  @media (max-width: 640px) {
    padding: 0.85rem 0.75rem;
  }
`;

const StepOneSection = styled.div`
  display: block;
`;

const FilterControls = styled.div`
  display: grid;
  gap: 0.65rem;
  margin: -0.35rem 0 0;
  padding: 0;

  @media (max-width: 640px) {
    gap: 0.45rem;
    margin-top: -0.5rem;
  }
`;

const ServiceListSection = styled.div`
  display: grid;
  gap: 0;
  padding-top: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    padding-top: 0.75rem;
  }
`;

const StepHeading = styled.p`
  margin: 0;
  padding: 0;
  font-size: 0.88rem;
  line-height: 1;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  strong {
    font-weight: 700;
  }

  @media (max-width: 640px) {
    font-size: 0.85rem;
  }
`;

const QuickPickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
`;

const QuickPickChip = styled.button`
  min-height: 44px;
  margin: 0;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.borderStrong};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : theme.colors.bgMuted};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentHover : theme.colors.text};
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    padding: 0.55rem 0.65rem;
    font-size: 0.86rem;
  }
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.45rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0.65rem 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgMuted};
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
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ClearSearchButton = styled.button`
  min-height: 44px;
  padding: 0 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 640px) {
    width: 100%;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 2px;
  padding: 0;

  @media (max-width: 640px) {
    display: grid;
    gap: 0;
    align-items: start;
    justify-content: start;
  }
`;

const ListHint = styled.p`
  margin: 0;
  padding: 0;
  font-size: 0.82rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
    font-size: 0.8rem;
    margin-top: -0.3rem;
  }
`;

const ServicesPanel = styled.div`
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(24, 24, 27, 0.08)"};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgMuted};
  padding: 0.5rem 0.45rem;
  max-height: 260px;
  overflow-y: auto;

  @media (max-width: 640px) {
    max-height: min(42vh, 340px);
    border-radius: 10px;
    padding: 0.1rem 0.45rem 0.35rem;
    margin-top: 0;
  }
`;

const InPanelDivider = styled.hr`
  margin: 0.35rem 0.75rem;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InPanelLabel = styled.p`
  margin: 0.35rem 0.75rem 0.15rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 640px) {
    margin: 0.1rem 0.45rem 0.05rem;
    font-size: 0.72rem;
    line-height: 1.2;
  }
`;

const ServiceRow = styled.label`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
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
    gap: 0.4rem 0.45rem;
    min-height: 38px;
    padding: 0.45rem 0.5rem;
    font-size: 0.84rem;
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
    width: 18px;
    height: 18px;
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

  @media (max-width: 640px) {
    font-size: 0.78rem;
    line-height: 1.4;
  }
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

  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
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

  @media (max-width: 640px) {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 0;
    padding-left: calc(18px + 0.5rem);
  }
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

  @media (max-width: 640px) {
    li {
      font-size: 0.78rem;
      line-height: 1.4;
    }
  }
`;

const ServicePrice = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  align-self: center;
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media (max-width: 640px) {
    font-size: 0.8rem;
  }
`;

const ShowAllButton = styled.button`
  display: block;
  width: calc(100% - 1rem);
  margin: 0.35rem auto 0.5rem;
  min-height: 44px;
  padding: 0.65rem 1rem;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgMuted};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
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
  const selectedCount = selectedServiceIds.length;

  const display = useMemo(
    () => partitionServicesForDisplay(services, trimmedSearch, popularIds),
    [services, trimmedSearch, popularIds]
  );

  const resetFilters = () => {
    setServiceSearch("");
    setActiveQuickPick(null);
    setShowAllServices(false);
  };

  const handleQuickPick = (chip) => {
    if (activeQuickPick === chip.id) {
      resetFilters();
      return;
    }

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
    } else {
      setShowAllServices(true);
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
    display.mode === "search" ? [...display.popular, ...display.rest] : [];

  const hiddenBrowseCount =
    display.mode === "browse" && browsePopular.length > 0 && !showBrowseRest
      ? browseRest.length
      : 0;

  const hasVisibleServices =
    display.mode === "search"
      ? searchList.length > 0
      : browsePopular.length > 0 || (showBrowseRest && browseRest.length > 0);

  const step2Label = isSearching ? "Matching services" : "Choose your services";
  const listHint = isSearching
    ? `${display.matchCount} result${display.matchCount === 1 ? "" : "s"}`
    : "Check each one you need";

  return (
    <ServicePickerCard aria-labelledby="requested-services-heading">
      <IntroText>
        Tap a category or search to find services, then check every repair or
        maintenance item you want on this visit.
      </IntroText>

      {selectedCount > 0 && (
        <SelectionSummary aria-live="polite">
          <span>
            {selectedCount} service{selectedCount === 1 ? "" : "s"} selected
          </span>
        </SelectionSummary>
      )}

      <FilterBox>
        <StepOneSection>
          <StepHeading>
            <strong>Step 1:</strong> Narrow the list (optional)
          </StepHeading>
          <FilterControls>
            <QuickPickRow role="group" aria-label="Filter services by type">
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
            <SearchRow>
              <SearchInput
                id="serviceSearch"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                value={serviceSearch}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Or search by name…"
                aria-label="Search services by name"
              />
              {isSearching && (
                <ClearSearchButton type="button" onClick={resetFilters}>
                  Clear
                </ClearSearchButton>
              )}
            </SearchRow>
          </FilterControls>
        </StepOneSection>

        <ServiceListSection>
          <ListHeader>
            <StepHeading>
              <strong>Step 2:</strong> {step2Label}
            </StepHeading>
            {!loadingServices && !serviceLoadError && hasVisibleServices && (
              <ListHint>{listHint}</ListHint>
            )}
          </ListHeader>

          {loadingServices ? (
            <HelperText>Loading services...</HelperText>
          ) : serviceLoadError ? (
            <ErrorAlert>{serviceLoadError}</ErrorAlert>
          ) : hasVisibleServices ? (
            <ServicesPanel>
              {display.mode === "search" ? (
                <ServiceList
                  services={searchList}
                  highlightQuery={trimmedSearch}
                  selectedIds={selectedServiceIds}
                  expandedServices={expandedServices}
                  onToggle={onToggleService}
                  onToggleDetails={toggleServiceDetails}
                />
              ) : (
                <>
                  {browsePopular.length > 0 && (
                    <>
                      {!showBrowseRest && <InPanelLabel>Most requested</InPanelLabel>}
                      <ServiceList
                        services={browsePopular}
                        selectedIds={selectedServiceIds}
                        expandedServices={expandedServices}
                        onToggle={onToggleService}
                        onToggleDetails={toggleServiceDetails}
                      />
                    </>
                  )}

                  {hiddenBrowseCount > 0 && (
                    <ShowAllButton type="button" onClick={() => setShowAllServices(true)}>
                      Show all {services.length} services
                    </ShowAllButton>
                  )}

                  {showBrowseRest && browseRest.length > 0 && (
                    <>
                      {browsePopular.length > 0 && <InPanelDivider />}
                      {browsePopular.length > 0 && (
                        <InPanelLabel>More services</InPanelLabel>
                      )}
                      <ServiceList
                        services={browseRest}
                        selectedIds={selectedServiceIds}
                        expandedServices={expandedServices}
                        onToggle={onToggleService}
                        onToggleDetails={toggleServiceDetails}
                      />
                    </>
                  )}
                </>
              )}
            </ServicesPanel>
          ) : (
            <HelperText>
              No services match your search. Try a different category or clear the
              search.
            </HelperText>
          )}
        </ServiceListSection>
      </FilterBox>
    </ServicePickerCard>
  );
}
