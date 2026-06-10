import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import PageSeo from './components/PageSeo';
import { useLocale } from './i18n/LocaleContext';

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const PrivacyContent = styled.section`
  font-size: 1.0625rem;
  max-width: ${({ theme }) => theme.maxWidth.prose};
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: clamp(1.5rem, 3vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h2 {
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.colors.footerLink};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

function Privacy() {
  const navigate = useNavigate();
  const { t, seo } = useLocale();
  return (
    <PageWrapper>
      <PageSeo
        title={seo.privacyTitle}
        description={seo.privacyDescription}
        path="/privacy"
      />
      <Header />
      <PrivacyContent>
        <h1>{t("privacy.title")}</h1>
        <p>{t("privacy.intro")}</p>

        <h2>{t("privacy.optInTitle")}</h2>
        <p>{t("privacy.optInP1")}</p>
        <ul>
          <li>{t("privacy.optInLi1")}</li>
          <li>{t("privacy.optInLi2")}</li>
        </ul>
        <p><em>{t("privacy.optInP2")}</em></p>
        <p>{t("privacy.optInP3")}</p>

        <h2>{t("privacy.useTitle")}</h2>
        <p>{t("privacy.useP1")}</p>
        <ul>
          <li>{t("privacy.useLi1")}</li>
          <li>{t("privacy.useLi2")}</li>
          <li>{t("privacy.useLi3")}</li>
          <li>{t("privacy.useLi4")}</li>
        </ul>

        <h2>{t("privacy.optOutTitle")}</h2>
        <p>{t("privacy.optOutP")}</p>

        <h2>{t("privacy.noSpamTitle")}</h2>
        <p>{t("privacy.noSpamP1")}</p>
        <ul>
          <li>{t("privacy.noSpamLi1")}</li>
          <li>{t("privacy.noSpamLi2")}</li>
        </ul>
        <p>{t("privacy.noSpamP2")}</p>
        
        <p>
          {t("privacy.questionsPrefix")}{" "}
          <a href="mailto:support@basementbikemechanic.com">{t("privacy.emailUs")}</a>.
        </p>
      </PrivacyContent>
      <Footer onBack={() => navigate('/')} />
    </PageWrapper>
  );
}

export default Privacy;
