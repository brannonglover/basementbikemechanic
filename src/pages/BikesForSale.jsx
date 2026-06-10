import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSeo from "../components/PageSeo";
import { useLocale } from "../i18n/LocaleContext";
import { fetchBikeById, fetchBikes } from "../utils/bikesStorage";
import { SITE_URL } from "../seoConstants";

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 2rem 0 1rem;
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin-left: auto;
  margin-right: auto;
  padding: 0 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const BikesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto 3rem;
  padding: 1.5rem;

  @media screen and (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    padding: 1rem;
  }
`;

const Intro = styled.section`
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.0625rem;
  line-height: 1.65;

  p {
    margin: 0 0 0.85rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.footerLink};
    font-weight: 500;
    text-decoration: none;
    text-underline-offset: 3px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BikeTile = styled.button`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: transform ${({ theme }) => theme.transition}, box-shadow ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};
  font-family: inherit;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (hover: none) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const TileImage = styled.img`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  object-fit: cover;
  display: block;
`;

const TileContent = styled.div`
  padding: 1rem 1.1rem;
  width: 100%;
  min-width: 0;
`;

const TileName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow-wrap: anywhere;
`;

const TilePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatusMessage = styled.p`
  font-size: 1.0625rem;
  text-align: center;
  max-width: 600px;
  margin: 2rem auto 3rem;
  padding: 0 1.5rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: ${({ theme }) => theme.colors.footerLink};
    font-weight: 500;
  }
`;

const skeletonShimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const SkeletonBone = styled.div`
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgMuted} 0%,
    ${({ theme }) => theme.colors.borderStrong} 45%,
    ${({ theme }) => theme.colors.bgMuted} 90%
  );
  background-size: 200% 100%;
  animation: ${skeletonShimmer} 1.35s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${({ theme }) => theme.colors.bgMuted};
  }
`;

const SkeletonTile = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SkeletonImage = styled(SkeletonBone)`
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 0;
`;

const SkeletonContent = styled.div`
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkeletonTitle = styled(SkeletonBone)`
  height: 1.2rem;
  width: 78%;
`;

const SkeletonPrice = styled(SkeletonBone)`
  height: 1.45rem;
  width: 32%;
`;

const LoadingHint = styled.p`
  text-align: center;
  margin: -1.5rem auto 2.5rem;
  padding: 0 1.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SKELETON_TILE_COUNT = 6;

function BikesLoadingSkeleton({ t }) {
  return (
    <>
      <BikesGrid aria-busy="true" aria-label={t("bikes.loadingLabel")}>
        {Array.from({ length: SKELETON_TILE_COUNT }, (_, index) => (
          <SkeletonTile key={index} aria-hidden="true">
            <SkeletonImage />
            <SkeletonContent>
              <SkeletonTitle />
              <SkeletonPrice />
            </SkeletonContent>
          </SkeletonTile>
        ))}
      </BikesGrid>
      <LoadingHint>{t("bikes.loadingHint")}</LoadingHint>
    </>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media screen and (max-width: 640px) {
    padding: 1rem;
  }
`;

const SlideshowContainer = styled.div`
  max-width: 90vw;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  @media screen and (max-width: 640px) {
    max-width: 100%;
    max-height: 62vh;
  }
`;

const SlideshowImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;

  @media screen and (max-width: 640px) {
    max-height: 62vh;
  }
`;

const SlideshowNav = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;

  button {
    background: ${({ theme }) => theme.colors.accent};
    border: none;
    color: ${({ theme }) => theme.colors.textOnAccent};
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radius.sm};
    transition: background ${({ theme }) => theme.transition};

    &:hover {
      background: ${({ theme }) => theme.colors.accentHover};
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  span {
    color: #fff;
    font-size: 0.95rem;
  }
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

const ModalPrice = styled.div`
  color: ${({ theme }) => theme.colors.brandGreen};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.accent};
  border: none;
  color: ${({ theme }) => theme.colors.textOnAccent};
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  line-height: 1;
  transition: background ${({ theme }) => theme.transition};

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

const CONTACT_EMAIL = "support@basementbikemechanic.com";

function getBikeIdFromHash(hash) {
  const value = (hash || "").replace(/^#/, "");
  const match = value.match(/^bike-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

function toAbsoluteUrl(src) {
  if (!src || typeof src !== "string") return null;
  if (src.startsWith("https://") || src.startsWith("http://")) return src;
  if (src.startsWith("data:")) return null;
  if (src.startsWith("/")) return `${SITE_URL}${src}`;
  return `${SITE_URL}/${src}`;
}

function BikesForSale() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, siteConfig: config, seo } = useLocale();
  const [bikes, setBikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const bikesPageUrl = `${SITE_URL}/bikes-for-sale`;
  const bikesListJsonLdId = `${bikesPageUrl}#itemlist`;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(false);

    fetchBikes(config.bikes)
      .then((loadedBikes) => {
        if (!isMounted) return;
        setBikes(loadedBikes);
      })
      .catch(() => {
        if (!isMounted) return;
        setBikes([]);
        setLoadError(true);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadBikeDetails = useCallback(async (bike) => {
    try {
      const fullBike = await fetchBikeById(bike.id);
      if (fullBike) {
        setSelectedBike(fullBike);
      }
    } catch (e) {
      console.warn("Failed to load full bike details", e);
    }
  }, []);

  const handleTileClick = (bike) => {
    navigate(
      { pathname: location.pathname, search: location.search, hash: `#bike-${bike.id}` },
      { replace: true }
    );
  };

  const handleClose = () => {
    setSelectedBike(null);
    navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
  };

  const nextSlide = () => {
    setSlideIndex((i) => (i + 1) % selectedBike.images.length);
  };

  const prevSlide = () => {
    setSlideIndex((i) => (i - 1 + selectedBike.images.length) % selectedBike.images.length);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    const id = getBikeIdFromHash(location.hash);
    if (id === null) {
      setSelectedBike(null);
      return;
    }
    const bike = bikes.find((b) => b.id === id);
    if (!bike) return;
    setSelectedBike(bike);
    setSlideIndex(0);
    loadBikeDetails(bike);
  }, [location.hash, bikes, loadBikeDetails]);

  return (
    <PageWrapper>
      <PageSeo
        title={seo.bikesTitle}
        description={seo.bikesDescription}
        path="/bikes-for-sale"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${bikesPageUrl}#webpage`,
              url: bikesPageUrl,
              name: t("bikes.jsonLdName"),
              description: seo.bikesDescription,
              about: { "@id": `${SITE_URL}/#business` },
              mainEntity: { "@id": bikesListJsonLdId },
            },
            {
              "@type": "ItemList",
              "@id": bikesListJsonLdId,
              name: t("bikes.jsonLdListName"),
              url: bikesPageUrl,
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: bikes.length,
              itemListElement: bikes.map((bike, index) => {
                const images = (bike.images || []).map(toAbsoluteUrl).filter(Boolean);
                return {
                  "@type": "ListItem",
                  position: index + 1,
                  url: `${bikesPageUrl}#bike-${bike.id}`,
                  item: {
                    "@type": "Product",
                    "@id": `${bikesPageUrl}#product-${bike.id}`,
                    name: bike.name,
                    ...(images.length ? { image: images } : {}),
                    category: "Bicycle",
                    offers: {
                      "@type": "Offer",
                      url: `${bikesPageUrl}#bike-${bike.id}`,
                      priceCurrency: "USD",
                      price: bike.price,
                      availability: "https://schema.org/InStock",
                      itemCondition: "https://schema.org/UsedCondition",
                      seller: { "@id": `${SITE_URL}/#business` },
                    },
                  },
                };
              }),
            },
          ],
        }}
      />
      <Header />
      <PageTitle>{t("bikes.pageTitle")}</PageTitle>
      <Intro>
        <p>
          {t("bikes.introP1Prefix")}{" "}
          <a href={`tel:${config.phone}`}>{config.phone}</a> {t("bikes.introP1Middle")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>{t("bikes.introP2")}</p>
      </Intro>
      {isLoading ? (
        <BikesLoadingSkeleton t={t} />
      ) : loadError || bikes.length === 0 ? (
        <StatusMessage>
          {loadError ? t("bikes.loadError") : t("bikes.noBikes")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {loadError ? t("bikes.loadErrorSuffix") : t("bikes.inquireSuffix")}
        </StatusMessage>
      ) : (
        <BikesGrid>
          {bikes.map((bike) => (
            <BikeTile key={bike.id} id={`bike-${bike.id}`} onClick={() => handleTileClick(bike)} type="button">
              <TileImage
                src={bike.images[0]}
                alt={t("bikes.tileAlt", { name: bike.name })}
                loading="lazy"
                decoding="async"
              />
              <TileContent>
                <TileName>{bike.name}</TileName>
                <TilePrice>${bike.price}</TilePrice>
              </TileContent>
            </BikeTile>
          ))}
        </BikesGrid>
      )}
      {selectedBike && (
        <ModalOverlay onClick={handleBackdropClick}>
          <CloseButton onClick={handleClose} aria-label={t("bikes.close")}>
            ×
          </CloseButton>
          <SlideshowContainer>
            <SlideshowImage
              src={selectedBike.images[slideIndex]}
              alt={t("bikes.imageAlt", { name: selectedBike.name, index: slideIndex + 1 })}
              loading="eager"
            />
          </SlideshowContainer>
          {selectedBike.images.length > 1 && (
            <SlideshowNav>
              <button onClick={prevSlide} disabled={selectedBike.images.length <= 1}>
                {t("bikes.prev")}
              </button>
              <span>
                {slideIndex + 1} / {selectedBike.images.length}
              </span>
              <button onClick={nextSlide} disabled={selectedBike.images.length <= 1}>
                {t("bikes.next")}
              </button>
            </SlideshowNav>
          )}
          <ModalTitle>{selectedBike.name}</ModalTitle>
          <ModalPrice>${selectedBike.price}</ModalPrice>
          <ContactButton href={`mailto:${CONTACT_EMAIL}?subject=Inquiry about ${encodeURIComponent(selectedBike.name)}`}>
            {t("bikes.contactMe")}
          </ContactButton>
        </ModalOverlay>
      )}
      <Footer onNavigatePrivacy={() => navigate("/privacy")} onNavigateTerms={() => navigate("/terms")} />
    </PageWrapper>
  );
}

export default BikesForSale;
