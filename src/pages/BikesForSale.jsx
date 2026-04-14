import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSeo from "../components/PageSeo";
import config from "../assets/siteConfig.json";
import { getBikes } from "../utils/bikesStorage";

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
  max-width: ${({ theme }) => theme.maxWidth.content};
  margin: 0 auto 3rem;
  padding: 1.5rem;
`;

const BikeTile = styled.button`
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
`;

const TileImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  background-size: cover;
  background-position: center;
  background-image: ${(p) => (p.$src ? `url("${p.$src}")` : "none")};
`;

const TileContent = styled.div`
  padding: 1rem 1.1rem;
`;

const TileName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TilePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.p`
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
`;

const SlideshowContainer = styled.div`
  max-width: 90vw;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const SlideshowImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
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

function BikesForSale() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setBikes(getBikes(config.bikes));
  }, []);

  const handleTileClick = (bike) => {
    setSelectedBike(bike);
    setSlideIndex(0);
  };

  const handleClose = () => {
    setSelectedBike(null);
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

  return (
    <PageWrapper>
      <PageSeo
        title="Used Bikes for Sale in Atlanta | Basement Bike Mechanic"
        description="Browse quality used bicycles for sale from Basement Bike Mechanic in Atlanta. Contact us about availability and pricing."
        path="/bikes-for-sale"
      />
      <Header />
      <PageTitle>Bikes for Sale</PageTitle>
      {bikes.length === 0 ? (
        <EmptyState>
          No bikes are currently listed for sale. Check back soon or contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to inquire about availability.
        </EmptyState>
      ) : (
        <BikesGrid>
          {bikes.map((bike) => (
            <BikeTile key={bike.id} onClick={() => handleTileClick(bike)} type="button">
              <TileImage $src={bike.images[0]} />
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
          <CloseButton onClick={handleClose} aria-label="Close">
            ×
          </CloseButton>
          <SlideshowContainer>
            <SlideshowImage
              src={selectedBike.images[slideIndex]}
              alt={`${selectedBike.name} - image ${slideIndex + 1}`}
            />
          </SlideshowContainer>
          {selectedBike.images.length > 1 && (
            <SlideshowNav>
              <button onClick={prevSlide} disabled={selectedBike.images.length <= 1}>
                ← Prev
              </button>
              <span>
                {slideIndex + 1} / {selectedBike.images.length}
              </span>
              <button onClick={nextSlide} disabled={selectedBike.images.length <= 1}>
                Next →
              </button>
            </SlideshowNav>
          )}
          <ModalTitle>{selectedBike.name}</ModalTitle>
          <ModalPrice>${selectedBike.price}</ModalPrice>
          <ContactButton href={`mailto:${CONTACT_EMAIL}?subject=Inquiry about ${encodeURIComponent(selectedBike.name)}`}>
            Contact Me
          </ContactButton>
        </ModalOverlay>
      )}
      <Footer onNavigatePrivacy={() => navigate("/privacy")} onNavigateTerms={() => navigate("/terms")} />
    </PageWrapper>
  );
}

export default BikesForSale;
