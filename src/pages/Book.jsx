import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSeo from "../components/PageSeo";
import BookServicePicker from "../components/BookServicePicker";
import { useLocale } from "../i18n/LocaleContext";
import { localizeBikeOpsServices } from "../i18n/localizeServices";

function normalizeBikeOpsOrigin(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (host === "bikeops.co" || host === "www.bikeops.co") {
      url.hostname = "bbm.bikeops.co";
    }
    return url.origin;
  } catch {
    return value;
  }
}

const BIKEOPS_BASE_URL =
  normalizeBikeOpsOrigin(process.env.REACT_APP_BIKEOPS_URL) || "https://bbm.bikeops.co";

const BIKEOPS_BASE_CANDIDATES = [
  "https://bbm.bikeops.co",
  process.env.REACT_APP_BIKEOPS_URL,
  "https://www.bikeops.co",
]
  .map(normalizeBikeOpsOrigin)
  .filter(Boolean)
  // De-dupe while preserving order.
  .filter((v, i, arr) => arr.indexOf(v) === i);

// Prefer non-widget endpoints first (desktop ad-blockers/privacy tools sometimes block "widget" URLs).
// Fall back to /api/widget for older BikeOps deployments.
const BIKEOPS_API_BASE_PATHS = ["/api/booking", "/api/widget"];

function buildScheduleDateTime(date, time) {
  const dateValue = String(date || "").trim();
  if (!dateValue) return null;

  const timeValue = String(time || "").trim();
  return timeValue ? `${dateValue}T${timeValue}` : dateValue;
}

function buildOptionalScheduleField(date, time) {
  return buildScheduleDateTime(date, time) || undefined;
}

function formatPhoneInputUS(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const normalized = digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length <= 3) return normalized;
  if (normalized.length <= 6) {
    return `(${normalized.slice(0, 3)}) ${normalized.slice(3)}`;
  }
  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6, 10)}`;
}

function isBikeEmpty(bike) {
  return !bike.make.trim() && !bike.model.trim() && bike.bikeType === "AUTO";
}

function formatMiles(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return value < 10 ? value.toFixed(1) : Math.round(value).toString();
}

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const BookContent = styled.section`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;

  @media (max-width: 640px) {
    padding: 1.5rem 1rem 2.5rem;
  }

  h1 {
    font-size: clamp(1.35rem, 2.5vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0 0 1.5rem;
    line-height: 1.6;
  }
`;

const FormCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(30, 41, 59, 0.98)" : theme.colors.surface} 0%,
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(15, 23, 42, 0.98)" : theme.colors.bgMuted} 100%
  );
  box-shadow: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e"
      ? "0 18px 48px rgba(2, 6, 23, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.04)"
      : theme.shadow.md};
  padding: 1.4rem;

  @media (max-width: 640px) {
    padding: 1.1rem 0.95rem;
    border-radius: 16px;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DateTimeGroup = styled.div`
  display: grid;
  gap: 0.65rem;
  grid-template-columns: 1fr;

  @media (min-width: 480px) and (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
`;

const DateTimeFieldWrap = styled.div`
  position: relative;

  input[type="date"],
  input[type="time"] {
    color-scheme: ${({ theme }) => (theme.colors.bg === "#1a1a1e" ? "dark" : "light")};
  }

  ${({ $empty }) =>
    $empty &&
    css`
      input[type="date"]:not(:focus)::-webkit-datetime-edit,
      input[type="time"]:not(:focus)::-webkit-datetime-edit {
        color: transparent;
      }
    `}
`;

const FieldPlaceholder = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  line-height: 1.4;
  font-size: inherit;
`;

const OptionalHint = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85em;
`;

const Field = styled.div`
  min-width: 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "#cbd5e1" : theme.colors.text};
`;

const sharedInputStyles = css`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(30, 41, 59, 0.96)" : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.7rem 1rem;
  min-height: 48px;
  font: inherit;
  line-height: 1.4;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
  box-shadow: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e"
      ? "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 0 1px rgba(255, 255, 255, 0.04)"
      : "0 0 0 1px rgba(24, 24, 27, 0.02)"};
  appearance: none;
  -webkit-appearance: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 0 1px rgba(255, 255, 255, 0.06)"
        : "0 0 0 1px rgba(24, 24, 27, 0.04)"};
  }

  &[readonly] {
    opacity: 1;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: default;
  }
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Select = styled.select`
  ${sharedInputStyles}
  padding-right: 2.6rem;
  background-image: ${({ theme }) =>
    `linear-gradient(45deg, transparent 50%, ${
      theme.colors.bg === "#1a1a1e" ? "#94a3b8" : "#64748b"
    } 50%), linear-gradient(135deg, ${
      theme.colors.bg === "#1a1a1e" ? "#94a3b8" : "#64748b"
    } 50%, transparent 50%)`};
  background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
`;

const Textarea = styled.textarea`
  ${sharedInputStyles}
  resize: vertical;
  min-height: 110px;
`;

const invalidFieldStyles = css`
  border-color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.55)" : "rgba(220, 38, 38, 0.5)"};
  box-shadow: inset 0 0 0 1px
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.15)" : "rgba(220, 38, 38, 0.1)"};

  &:hover,
  &:focus {
    border-color: ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.55)" : "rgba(220, 38, 38, 0.5)"};
    box-shadow: inset 0 0 0 1px
      ${({ theme }) =>
        theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.15)" : "rgba(220, 38, 38, 0.1)"};
  }
`;

const ValidatedInput = styled(Input)`
  ${({ $invalid }) => $invalid && invalidFieldStyles}
`;

const ValidatedSelect = styled(Select)`
  ${({ $invalid }) => $invalid && invalidFieldStyles}
`;

const ValidatedTextarea = styled(Textarea)`
  ${({ $invalid }) => $invalid && invalidFieldStyles}
`;

const Section = styled.section`
  display: grid;
  gap: 0.85rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

const BikeCard = styled.div`
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(24, 24, 27, 0.08)"};
  border-radius: 16px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(51, 65, 85, 0.42)" : theme.colors.bgMuted};
`;

const BikeCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const BikeTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "#e2e8f0" : theme.colors.text};
`;

const InlineButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AddBikeButton = styled.button`
  border: 2px dashed
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(24, 24, 27, 0.12)"};
  border-radius: 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font: inherit;
  font-weight: 600;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentHover};
    background: ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(245, 158, 11, 0.12)"
        : theme.colors.accentMuted};
  }
`;

const ConsentCard = styled.label`
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(24, 24, 27, 0.08)"};
  border-radius: 16px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(51, 65, 85, 0.42)" : theme.colors.bgMuted};
  cursor: pointer;

  ${({ $invalid }) => $invalid && invalidFieldStyles}
`;

const Checkbox = styled.input`
  margin-top: 0.2rem;
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const ConsentText = styled.div`
  font-size: 0.92rem;
  line-height: 1.55;
  color: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "#cbd5e1" : theme.colors.text};
`;

const HelperText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SavedBikesPanel = styled.div`
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(51, 65, 85, 0.35)" : theme.colors.bgMuted};
`;

const SavedBikesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const SavedBikesTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SavedBikesGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const SavedBikeButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgMuted};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.colors.accent};
      background: ${theme.colors.accentMuted};
      box-shadow: inset 0 0 0 1px
        ${theme.colors.bg === "#1a1a1e"
          ? "rgba(245, 158, 11, 0.18)"
          : "rgba(245, 158, 11, 0.12)"};
    `}
`;

const SavedBikeName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SavedBikeMeta = styled.div`
  margin-top: 0.18rem;
  font-size: 0.84rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Alert = styled.div`
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.9rem 1rem;
  font-size: 0.92rem;
  line-height: 1.5;
`;

const ErrorAlert = styled(Alert)`
  border: 1px solid ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(248, 113, 113, 0.24)" : "rgba(220, 38, 38, 0.24)"};
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(127, 29, 29, 0.34)" : "rgba(220, 38, 38, 0.1)"};
  color: ${({ theme }) => (theme.colors.bg === "#1a1a1e" ? "#fecaca" : "#991b1b")};
`;

const WarningAlert = styled(Alert)`
  border: 1px solid ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(251, 191, 36, 0.28)" : "rgba(245, 158, 11, 0.28)"};
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(120, 53, 15, 0.28)" : "rgba(245, 158, 11, 0.1)"};
  color: ${({ theme }) => (theme.colors.bg === "#1a1a1e" ? "#fde68a" : "#92400e")};
`;

const SuccessAlert = styled(Alert)`
  border: 1px solid ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(52, 211, 153, 0.24)" : "rgba(16, 185, 129, 0.22)"};
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(6, 78, 59, 0.28)" : "rgba(16, 185, 129, 0.1)"};
  color: ${({ theme }) => (theme.colors.bg === "#1a1a1e" ? "#a7f3d0" : "#065f46")};
`;

const InfoCallout = styled(Alert)`
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(245, 158, 11, 0.28)"
        : "rgba(245, 158, 11, 0.35)"};
  background: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e" ? "rgba(245, 158, 11, 0.14)" : theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.text};
`;

const InfoCalloutIcon = styled.span`
  flex: 0 0 auto;
  width: 1.35rem;
  height: 1.35rem;
  margin-top: 0.1rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1;
`;

const SuccessCard = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(24, 24, 27, 0.08)"};
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(30, 41, 59, 0.98)" : theme.colors.surface} 0%,
    ${({ theme }) =>
      theme.colors.bg === "#1a1a1e" ? "rgba(15, 23, 42, 0.98)" : theme.colors.bgMuted} 100%
  );
  box-shadow: ${({ theme }) =>
    theme.colors.bg === "#1a1a1e"
      ? "0 18px 48px rgba(2, 6, 23, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.04)"
      : theme.shadow.md};
  text-align: center;
`;

const SuccessMark = styled.div`
  width: 54px;
  height: 54px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-size: 1.5rem;
  font-weight: 700;
`;

const SubmitButton = styled.button`
  border: 0;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font: inherit;
  font-weight: 700;
  padding: 0.95rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusLink = styled.a`
  display: inline-block;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-weight: 700;
  padding: 0.9rem 1.2rem;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

function Book() {
  const navigate = useNavigate();
  const { t, seo, locale } = useLocale();
  const [services, setServices] = useState([]);
  const localizedServices = useMemo(
    () => localizeBikeOpsServices(services, locale),
    [services, locale]
  );
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceLoadError, setServiceLoadError] = useState("");
  const [savedBikes, setSavedBikes] = useState([]);
  const [savedBikeCustomer, setSavedBikeCustomer] = useState(null);
  const [lookingUpBikes, setLookingUpBikes] = useState(false);
  const [selectedSavedBikeId, setSelectedSavedBikeId] = useState(null);
  const [shouldLookupSavedBikes, setShouldLookupSavedBikes] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [resolvedApiBase, setResolvedApiBase] = useState(BIKEOPS_BASE_URL);
  const [collectionEligibility, setCollectionEligibility] = useState({
    status: "idle", // idle | checking | ok | error
    result: null,
  });
  const [bikes, setBikes] = useState([{ make: "", model: "", bikeType: "AUTO" }]);
  const dateFieldTouched = useRef({
    dropOffDate: false,
    pickupDate: false,
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    deliveryType: "DROP_OFF_AT_SHOP",
    dropOffDate: "",
    dropOffTime: "",
    pickupDate: "",
    pickupTime: "",
    collectionAddress: "",
    collectionWindowStart: "",
    collectionWindowEnd: "",
    customerNotes: "",
    serviceIds: [],
    smsConsent: false,
  });

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      const checked = [];
      for (const baseUrl of BIKEOPS_BASE_CANDIDATES) {
        for (const apiBasePath of BIKEOPS_API_BASE_PATHS) {
          const url = `${baseUrl}${apiBasePath}/services`;
          checked.push(url);
          try {
            const response = await fetch(url);
            if (!response.ok) {
              continue;
            }
            const data = await response.json().catch(() => null);
            if (cancelled) return;
            if (Array.isArray(data)) {
              setServices(data);
              setResolvedApiBase(baseUrl);
              setServiceLoadError("");
              setLoadingServices(false);
              return;
            }
          } catch (fetchError) {
            // Try the next configured BikeOps endpoint.
          }
        }
      }

      if (!cancelled) {
        setServices([]);
        console.warn("[Book] Couldn't load services from BikeOps", { checked });
        setServiceLoadError(t("book.servicesLoadError"));
        setLoadingServices(false);
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleOptionalDateFocus = (dateField) => () => {
    dateFieldTouched.current[dateField] = true;
  };

  const handleOptionalDateChange = (dateField, timeField) => (event) => {
    if (!dateFieldTouched.current[dateField]) {
      return;
    }

    const value = event.target.value;
    if (!value) {
      dateFieldTouched.current[dateField] = false;
      setForm((previous) => ({
        ...previous,
        [dateField]: "",
        [timeField]: "",
      }));
      return;
    }

    updateForm(dateField, value);
  };

  const updateBike = (index, field, value) => {
    setBikes((previous) =>
      previous.map((bike, bikeIndex) =>
        bikeIndex === index ? { ...bike, [field]: value } : bike
      )
    );
  };

  const addBike = () => {
    setBikes((previous) => [...previous, { make: "", model: "", bikeType: "AUTO" }]);
  };

  const removeBike = (index) => {
    setBikes((previous) => previous.filter((_, bikeIndex) => bikeIndex !== index));
  };

  const toggleService = (serviceId) => {
    setForm((previous) => ({
      ...previous,
      serviceIds: previous.serviceIds.includes(serviceId)
        ? previous.serviceIds.filter((id) => id !== serviceId)
        : [...previous.serviceIds, serviceId],
    }));
  };

  const checkCollectionAddress = useCallback(async () => {
    if (form.deliveryType !== "COLLECTION_SERVICE") {
      setCollectionEligibility({ status: "idle", result: null });
      return;
    }

    const address = form.collectionAddress.trim();
    if (!address) {
      setCollectionEligibility({ status: "idle", result: null });
      return;
    }

    setCollectionEligibility((p) => ({ ...p, status: "checking" }));
    for (const apiBasePath of BIKEOPS_API_BASE_PATHS) {
      try {
        const res = await fetch(
          `${resolvedApiBase}${apiBasePath}/collection-eligibility?address=${encodeURIComponent(address)}`
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          continue;
        }
        setCollectionEligibility({ status: "ok", result: data });
        return;
      } catch {
        // Try the next endpoint.
      }
    }
    setCollectionEligibility({ status: "error", result: null });
  }, [form.collectionAddress, form.deliveryType, resolvedApiBase]);

  useEffect(() => {
    if (form.deliveryType !== "COLLECTION_SERVICE") return undefined;
    const address = form.collectionAddress.trim();
    if (!address) {
      setCollectionEligibility({ status: "idle", result: null });
      return undefined;
    }
    const timer = setTimeout(() => {
      checkCollectionAddress();
    }, 450);
    return () => clearTimeout(timer);
  }, [form.collectionAddress, form.deliveryType, checkCollectionAddress]);

  const lookupSavedBikes = useCallback(async (identityOverride) => {
    const identity = identityOverride || {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    };

    const firstName = identity.firstName.trim();
    const lastName = identity.lastName.trim();
    const email = identity.email.trim();

    if (!firstName || (!lastName && !email)) {
      setSavedBikes([]);
      setSavedBikeCustomer(null);
      return;
    }

    setLookingUpBikes(true);

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("firstName", firstName);
      if (lastName) searchParams.set("lastName", lastName);
      if (email) searchParams.set("email", email);

      let data = null;
      for (const apiBasePath of BIKEOPS_API_BASE_PATHS) {
        try {
          const response = await fetch(
            `${resolvedApiBase}${apiBasePath}/customer-bikes?${searchParams.toString()}`
          );
          if (!response.ok) {
            continue;
          }
          data = await response.json().catch(() => null);
          if (data && typeof data === "object") {
            break;
          }
        } catch (fetchError) {
          // Try the next endpoint.
        }
      }

      if (!data || typeof data !== "object") {
        throw new Error("Failed to fetch saved bikes");
      }

      setSavedBikes(Array.isArray(data.bikes) ? data.bikes : []);
      setSavedBikeCustomer(data.customer ?? null);
    } catch (lookupError) {
      setSavedBikes([]);
      setSavedBikeCustomer(null);
    } finally {
      setLookingUpBikes(false);
    }
  }, [form.email, form.firstName, form.lastName, resolvedApiBase]);

  useEffect(() => {
    if (!shouldLookupSavedBikes) return undefined;

    const timer = setTimeout(() => {
      lookupSavedBikes();
    }, 150);

    return () => clearTimeout(timer);
  }, [form.firstName, form.lastName, form.email, shouldLookupSavedBikes, lookupSavedBikes]);

  const applySavedBike = (savedBike) => {
    setSelectedSavedBikeId(savedBike?.id ?? null);

    const nextBike = {
      make: savedBike.make || "",
      model: savedBike.model || "",
      bikeType: savedBike.bikeType || "AUTO",
    };

    setBikes((previous) => {
      const duplicateIndex = previous.findIndex(
        (bike) =>
          bike.make.trim().toLowerCase() === nextBike.make.trim().toLowerCase() &&
          (bike.model || "").trim().toLowerCase() ===
            (nextBike.model || "").trim().toLowerCase()
      );

      if (duplicateIndex >= 0) {
        return previous;
      }

      if (previous.length === 1 && isBikeEmpty(previous[0])) {
        return [nextBike];
      }

      return [...previous, nextBike];
    });
  };

  useEffect(() => {
    if (!selectedSavedBikeId) return;
    if (savedBikes.some((b) => b.id === selectedSavedBikeId)) return;
    setSelectedSavedBikeId(null);
  }, [savedBikes, selectedSavedBikeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setAttemptedSubmit(true);

    if (form.deliveryType === "COLLECTION_SERVICE") {
      const r = collectionEligibility.result;
      if (collectionEligibility.status === "checking") {
        setError(t("book.checkingAddress"));
        return;
      }
      if (r && r.enabled === true) {
        if (r.ok === true && r.eligible === false) {
          setError(t("book.outsideRadius"));
          return;
        }
        if (r.ok === false) {
          setError(r.error || t("book.verifyFailed"));
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const dropOffSchedule = buildOptionalScheduleField(
        form.dropOffDate,
        form.dropOffTime
      );
      const pickupSchedule = buildOptionalScheduleField(
        form.pickupDate,
        form.pickupTime
      );

      const payload = {
        customerId: savedBikeCustomer?.id || null,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        smsConsent: form.smsConsent,
        address: form.address.trim() || null,
        bikes: bikes.map((bike) => ({
          make: bike.make.trim(),
          model: bike.model.trim() || null,
          bikeType: bike.bikeType === "AUTO" ? undefined : bike.bikeType,
        })),
        deliveryType: form.deliveryType,
        ...(dropOffSchedule ? { dropOffDate: dropOffSchedule } : {}),
        ...(pickupSchedule ? { pickupDate: pickupSchedule } : {}),
        collectionAddress:
          form.deliveryType === "COLLECTION_SERVICE"
            ? form.collectionAddress.trim() || null
            : null,
        collectionWindowStart:
          form.deliveryType === "COLLECTION_SERVICE"
            ? form.collectionWindowStart || null
            : null,
        collectionWindowEnd:
          form.deliveryType === "COLLECTION_SERVICE"
            ? form.collectionWindowEnd || null
            : null,
        customerNotes: form.customerNotes.trim() || null,
        serviceIds: form.serviceIds,
      };

      for (const apiBasePath of BIKEOPS_API_BASE_PATHS) {
        try {
          const response = await fetch(`${resolvedApiBase}${apiBasePath}/book`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => ({}));

          if (response.ok) {
            setSuccess({
              ...data,
              statusUrl: data.statusUrl || `${resolvedApiBase}/status/${data.id}`,
            });
            return;
          }

          // Only fall back when the endpoint isn't available; avoid double-submitting
          // when BikeOps is returning a real validation/error response.
          if (response.status === 404 || response.status === 405) {
            continue;
          }

          setError(data.error || t("book.submitFailed"));
          return;
        } catch (submitError) {
          // Try the next endpoint.
        }
      }

      setError(t("book.connectionFailed"));
    } catch (submitError) {
      setError(t("book.connectionFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <PageWrapper>
        <PageSeo
          title={seo.bookTitle}
          description={seo.bookDescription}
          path="/book"
        />
        <Header />
        <BookContent>
          <SuccessCard>
            <SuccessMark>✓</SuccessMark>
            <div>
              <h1>{t("book.successTitle")}</h1>
              <p>{t("book.successBody")}</p>
            </div>
            <StatusLink href={success.statusUrl} target="_blank" rel="noreferrer">
              {t("book.trackStatus")}
            </StatusLink>
          </SuccessCard>
        </BookContent>
        <Footer onBack={() => navigate("/")} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageSeo
        title={seo.bookTitle}
        description={seo.bookDescription}
        path="/book"
      />
      <Header />
      <BookContent>
        <h1>{t("book.pageTitle")}</h1>
        <p>{t("book.intro")}</p>
        <FormCard>
          <Form onSubmit={handleSubmit} onInvalidCapture={() => setAttemptedSubmit(true)}>
            <Grid>
              <Field>
                <Label htmlFor="firstName">{t("book.firstName")}</Label>
                <ValidatedInput
                  id="firstName"
                  type="text"
                  required
                  $invalid={attemptedSubmit && !form.firstName.trim()}
                  value={form.firstName}
                  onChange={(event) => updateForm("firstName", event.target.value)}
                  onBlur={() => setShouldLookupSavedBikes(true)}
                  placeholder="John"
                />
              </Field>
              <Field>
                <Label htmlFor="lastName">{t("book.lastName")}</Label>
                <ValidatedInput
                  id="lastName"
                  type="text"
                  required
                  $invalid={attemptedSubmit && !form.lastName.trim()}
                  value={form.lastName}
                  onChange={(event) => updateForm("lastName", event.target.value)}
                  onBlur={() => setShouldLookupSavedBikes(true)}
                  placeholder="Smith"
                />
              </Field>
            </Grid>

            <Grid>
              <Field>
                <Label htmlFor="email">{t("book.email")}</Label>
                <ValidatedInput
                  id="email"
                  type="email"
                  required
                  $invalid={attemptedSubmit && !form.email.trim()}
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  onBlur={() => setShouldLookupSavedBikes(true)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field>
                <Label htmlFor="phone">{t("book.phone")}</Label>
                <ValidatedInput
                  id="phone"
                  type="tel"
                  required
                  $invalid={attemptedSubmit && !form.phone.trim()}
                  value={form.phone}
                  onChange={(event) =>
                    updateForm("phone", formatPhoneInputUS(event.target.value))
                  }
                  placeholder="(404) 555-1234"
                  autoComplete="tel"
                />
              </Field>
            </Grid>

            <Field>
              <Label htmlFor="address">{t("book.address")}</Label>
              <Input
                id="address"
                type="text"
                value={form.address}
                onChange={(event) => updateForm("address", event.target.value)}
                placeholder={t("book.addressPlaceholder")}
              />
            </Field>

            <ConsentCard htmlFor="smsConsent">
              <Checkbox
                id="smsConsent"
                type="checkbox"
                checked={form.smsConsent}
                onChange={(event) => updateForm("smsConsent", event.target.checked)}
              />
              <ConsentText>
                {t("book.smsConsent")}{" "}
                <a href="https://basementbikemechanic.com/terms">
                  {t("book.termsLink")}
                </a>{" "}
                {t("home.smsAnd")}{" "}
                <a href="https://basementbikemechanic.com/privacy">
                  {t("book.privacyLink")}
                </a>
                .
              </ConsentText>
            </ConsentCard>

            <Section>
              <SectionTitle>{t("book.bikeDetails")}</SectionTitle>
              {(lookingUpBikes || savedBikes.length > 0) && (
                <SavedBikesPanel>
                  <SavedBikesHeader>
                    <SavedBikesTitle>
                      {lookingUpBikes
                        ? t("book.lookingUpBikes")
                        : savedBikeCustomer
                          ? t("book.savedBikesFor", {
                              name: `${savedBikeCustomer.firstName}${
                                savedBikeCustomer.lastName ? ` ${savedBikeCustomer.lastName}` : ""
                              }`,
                            })
                          : t("book.savedBikes")}
                    </SavedBikesTitle>
                  </SavedBikesHeader>
                  {!lookingUpBikes && savedBikes.length > 0 && (
                    <SavedBikesGrid>
                      {savedBikes.map((bike) => (
                        <SavedBikeButton
                          key={bike.id}
                          type="button"
                          onClick={() => applySavedBike(bike)}
                          $selected={bike.id === selectedSavedBikeId}
                        >
                          <SavedBikeName>
                            {[bike.nickname, bike.make, bike.model].filter(Boolean).join(" · ")}
                          </SavedBikeName>
                          <SavedBikeMeta>
                            {bike.bikeType === "E_BIKE"
                              ? t("book.eBike")
                              : bike.bikeType === "REGULAR"
                                ? t("book.standardBike")
                                : t("book.bikeTypeAuto")}
                          </SavedBikeMeta>
                        </SavedBikeButton>
                      ))}
                    </SavedBikesGrid>
                  )}
                </SavedBikesPanel>
              )}
              {bikes.map((bike, index) => (
                <BikeCard key={index}>
                  <BikeCardHeader>
                    <BikeTitle>
                      {bikes.length > 1 ? t("book.bikeN", { n: index + 1 }) : t("book.bike")}
                    </BikeTitle>
                    {bikes.length > 1 && (
                      <InlineButton type="button" onClick={() => removeBike(index)}>
                        {t("book.remove")}
                      </InlineButton>
                    )}
                  </BikeCardHeader>
                  <Grid>
                    <Field>
                      <Label htmlFor={`bike-make-${index}`}>{t("book.make")}</Label>
                      <ValidatedInput
                        id={`bike-make-${index}`}
                        type="text"
                        required
                        $invalid={attemptedSubmit && !bike.make.trim()}
                        value={bike.make}
                        onChange={(event) => updateBike(index, "make", event.target.value)}
                        placeholder="Trek, Specialized..."
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`bike-model-${index}`}>{t("book.model")}</Label>
                      <Input
                        id={`bike-model-${index}`}
                        type="text"
                        value={bike.model}
                        onChange={(event) => updateBike(index, "model", event.target.value)}
                        placeholder={t("book.optionalOnly")}
                      />
                    </Field>
                  </Grid>
                  <Field>
                    <Label htmlFor={`bike-type-${index}`}>{t("book.type")}</Label>
                    <ValidatedSelect
                      id={`bike-type-${index}`}
                      value={bike.bikeType}
                      onChange={(event) => updateBike(index, "bikeType", event.target.value)}
                    >
                      <option value="AUTO">{t("book.autoDetect")}</option>
                      <option value="REGULAR">{t("book.standardBike")}</option>
                      <option value="E_BIKE">{t("book.eBike")}</option>
                    </ValidatedSelect>
                  </Field>
                </BikeCard>
              ))}
              <AddBikeButton type="button" onClick={addBike}>
                {t("book.addAnotherBike")}
              </AddBikeButton>
              <HelperText>{t("book.collectionPricingHint")}</HelperText>
            </Section>

            <Section>
              <SectionTitle id="requested-services-heading">{t("book.requestedServices")}</SectionTitle>
              <BookServicePicker
                services={localizedServices}
                loadingServices={loadingServices}
                serviceLoadError={serviceLoadError}
                selectedServiceIds={form.serviceIds}
                onToggleService={toggleService}
              />
            </Section>

            <Field>
              <Label htmlFor="deliveryType">{t("book.deliveryOption")}</Label>
              <ValidatedSelect
                id="deliveryType"
                value={form.deliveryType}
                onChange={(event) => updateForm("deliveryType", event.target.value)}
              >
                <option value="DROP_OFF_AT_SHOP">{t("book.dropOffAtShop")}</option>
                <option value="COLLECTION_SERVICE">{t("book.collectionService")}</option>
              </ValidatedSelect>
            </Field>

            <Grid>
              <DateTimeGroup>
                <Field>
                  <Label htmlFor="dropOffDate">
                    {form.deliveryType === "COLLECTION_SERVICE"
                      ? t("book.preferredCollectionPickup")
                      : t("book.preferredDropOff")}
                  </Label>
                  <DateTimeFieldWrap $empty={!form.dropOffDate}>
                    <ValidatedInput
                      id="dropOffDate"
                      type="date"
                      autoComplete="off"
                      value={form.dropOffDate}
                      onFocus={handleOptionalDateFocus("dropOffDate")}
                      onChange={handleOptionalDateChange("dropOffDate", "dropOffTime")}
                    />
                    {!form.dropOffDate && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectDate")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
                <Field>
                  <Label htmlFor="dropOffTime">
                    {t("book.time")} <OptionalHint>{t("book.optional")}</OptionalHint>
                  </Label>
                  <DateTimeFieldWrap $empty={!form.dropOffTime}>
                    <ValidatedInput
                      id="dropOffTime"
                      type="time"
                      value={form.dropOffTime}
                      onChange={(event) => updateForm("dropOffTime", event.target.value)}
                    />
                    {!form.dropOffTime && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectTime")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
              </DateTimeGroup>
              <DateTimeGroup>
                <Field>
                  <Label htmlFor="pickupDate">
                    {form.deliveryType === "COLLECTION_SERVICE"
                      ? t("book.preferredCollectionReturn")
                      : t("book.preferredPickup")}
                  </Label>
                  <DateTimeFieldWrap $empty={!form.pickupDate}>
                    <ValidatedInput
                      id="pickupDate"
                      type="date"
                      autoComplete="off"
                      value={form.pickupDate}
                      onFocus={handleOptionalDateFocus("pickupDate")}
                      onChange={handleOptionalDateChange("pickupDate", "pickupTime")}
                    />
                    {!form.pickupDate && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectDate")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
                <Field>
                  <Label htmlFor="pickupTime">
                    {t("book.time")} <OptionalHint>{t("book.optional")}</OptionalHint>
                  </Label>
                  <DateTimeFieldWrap $empty={!form.pickupTime}>
                    <ValidatedInput
                      id="pickupTime"
                      type="time"
                      value={form.pickupTime}
                      onChange={(event) => updateForm("pickupTime", event.target.value)}
                    />
                    {!form.pickupTime && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectTime")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
              </DateTimeGroup>
            </Grid>
            <InfoCallout role="note">
              <InfoCalloutIcon aria-hidden="true">i</InfoCalloutIcon>
              <span>
                <strong>{t("book.datesOptionalTitle")}</strong> {t("book.datesOptionalBody")}
              </span>
            </InfoCallout>

            {form.deliveryType === "COLLECTION_SERVICE" && (
              <Grid>
                <Field>
                  <Label htmlFor="collectionAddress">{t("book.collectionAddress")}</Label>
                  <ValidatedInput
                    id="collectionAddress"
                    type="text"
                    required
                    value={form.collectionAddress}
                    onChange={(event) =>
                      updateForm("collectionAddress", event.target.value)
                    }
                    $invalid={
                      attemptedSubmit &&
                      (form.deliveryType === "COLLECTION_SERVICE" &&
                        (!form.collectionAddress.trim() ||
                          (collectionEligibility.result &&
                            collectionEligibility.result.enabled === true &&
                            collectionEligibility.result.ok === true &&
                            collectionEligibility.result.eligible === false)))
                    }
                    placeholder={t("book.collectionAddressPlaceholder")}
                  />
                  {collectionEligibility.status === "checking" && (
                    <HelperText>{t("book.checkingCollection")}</HelperText>
                  )}
                  {collectionEligibility.status === "error" && (
                    <HelperText>{t("book.verifyAddressError")}</HelperText>
                  )}
                  {collectionEligibility.status === "ok" &&
                    collectionEligibility.result &&
                    collectionEligibility.result.enabled === true &&
                    collectionEligibility.result.ok === true &&
                    collectionEligibility.result.eligible === false && (
                      <WarningAlert>
                        {t("book.collectionUnavailable")}
                        {typeof collectionEligibility.result.distanceMiles === "number" && (
                          <> {t("book.milesAway", { miles: formatMiles(collectionEligibility.result.distanceMiles) })}</>
                        )}{" "}
                        {t("book.collectWithin", { radius: collectionEligibility.result.radiusMiles })}
                      </WarningAlert>
                    )}
                  {collectionEligibility.status === "ok" &&
                    collectionEligibility.result &&
                    collectionEligibility.result.enabled === true &&
                    collectionEligibility.result.ok === true &&
                    collectionEligibility.result.eligible === true && (
                      <SuccessAlert>
                        {t("book.collectionAvailable", { radius: collectionEligibility.result.radiusMiles })}
                      </SuccessAlert>
                    )}
                </Field>
                <Field>
                  <Label htmlFor="collectionWindowStart">{t("book.collectionWindowStart")}</Label>
                  <DateTimeFieldWrap $empty={!form.collectionWindowStart}>
                    <ValidatedInput
                      id="collectionWindowStart"
                      type="time"
                      value={form.collectionWindowStart}
                      onChange={(event) =>
                        updateForm("collectionWindowStart", event.target.value)
                      }
                    />
                    {!form.collectionWindowStart && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectTime")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
                <Field>
                  <Label htmlFor="collectionWindowEnd">{t("book.collectionWindowEnd")}</Label>
                  <DateTimeFieldWrap $empty={!form.collectionWindowEnd}>
                    <ValidatedInput
                      id="collectionWindowEnd"
                      type="time"
                      value={form.collectionWindowEnd}
                      onChange={(event) =>
                        updateForm("collectionWindowEnd", event.target.value)
                      }
                    />
                    {!form.collectionWindowEnd && (
                      <FieldPlaceholder aria-hidden="true">{t("book.selectTime")}</FieldPlaceholder>
                    )}
                  </DateTimeFieldWrap>
                </Field>
              </Grid>
            )}

            {form.deliveryType === "COLLECTION_SERVICE" && (
              <HelperText>{t("book.collectionHelper")}</HelperText>
            )}

            <Field>
              <Label htmlFor="notesTextarea">{t("book.notesLabel")}</Label>
              <ValidatedTextarea
                id="notesTextarea"
                value={form.customerNotes}
                onChange={(event) => updateForm("customerNotes", event.target.value)}
                placeholder={t("book.notesPlaceholder")}
              />
            </Field>

            {error && <ErrorAlert>{error}</ErrorAlert>}

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? t("book.submitting") : t("book.bookNow")}
            </SubmitButton>
          </Form>
        </FormCard>
      </BookContent>
      <Footer onBack={() => navigate("/")} />
    </PageWrapper>
  );
}

export default Book;
