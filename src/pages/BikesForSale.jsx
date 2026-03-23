import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import config from "../assets/siteConfig.json";
import { getBikes } from "../utils/bikesStorage";

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const PageTitle = styled.h1`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2rem;
  text-align: center;
  margin: 2rem 0 1rem;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
`;

const BikesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto 3rem;
  padding: 2rem;
`;

const BikeTile = styled.button`
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: Arial, Helvetica, sans-serif;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: #3A8BC5;
  }
`;

const TileImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #cee3f0;
  background-size: cover;
  background-position: center;
  background-image: ${(p) => (p.$src ? `url("${p.$src}")` : "none")};
`;

const TileContent = styled.div`
  padding: 1rem;
`;

const TileName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
`;

const TilePrice = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #3A8BC5;
`;

const EmptyState = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 2rem auto 3rem;
  padding: 0 2rem;
  line-height: 1.6;
  color: #666;
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
    background: #fecf11;
    border: 1px solid #b90000;
    color: #000;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 4px;

    &:hover {
      background: #f9a61c;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.95rem;
  }
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
`;

const ModalPrice = styled.div`
  color: #8bbe45;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: inline-block;
  background-color: #fecf11;
  border: 1px solid #b90000;
  color: #000;
  text-decoration: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f9a61c;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
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
