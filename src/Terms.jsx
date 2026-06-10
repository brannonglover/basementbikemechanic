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

const TermsContent = styled.section`
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

function Terms() {
  const navigate = useNavigate();
  const { t, seo } = useLocale();
  return (
    <PageWrapper>
      <PageSeo
        title={seo.termsTitle}
        description={seo.termsDescription}
        path="/terms"
      />
      <Header />
      <TermsContent>
        <h1>{t("terms.title")}</h1>
        <p>{t("terms.intro")}</p>

        <h2>{t("terms.smsTitle")}</h2>
        <p>{t("terms.smsP1")}</p>
        <ul>
          <li>{t("terms.smsLi1")}</li>
          <li>{t("terms.smsLi2")}</li>
          <li>{t("terms.smsLi3")}</li>
          <li>{t("terms.smsLi4")}</li>
        </ul>
        <p>{t("terms.smsP2")}</p>

        <h2>{t("terms.consentTitle")}</h2>
        <p>{t("terms.consentP1")}</p>
        <ul>
          <li>{t("terms.consentLi1")}</li>
          <li>{t("terms.consentLi2")}</li>
        </ul>
        <p><em>{t("terms.consentP2")}</em></p>
        <p>
          {t("terms.consentP3Prefix")}{" "}
          <a href="mailto:support@basementbikemechanic.com">support@basementbikemechanic.com</a>
          {t("terms.consentP3Suffix")}
        </p>

        <h2>{t("terms.servicesTitle")}</h2>
        <p>{t("terms.servicesP")}</p>

        <h2>{t("terms.liabilityTitle")}</h2>
        <p>{t("terms.liabilityP")}</p>

        <h2>{t("terms.generalTitle")}</h2>
        <p>
          {t("terms.generalP1")}{" "}
          <a href="mailto:support@basementbikemechanic.com">{t("terms.emailUs")}</a>.
        </p>
      </TermsContent>
      <Footer onBack={() => navigate('/')} />
    </PageWrapper>
  );
}

export default Terms;
