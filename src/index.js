import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import App from './App';
import GlobalStyle from './GlobalStyle';
import { ThemeModeProvider } from './ThemeModeContext';
import { LocaleProvider } from './i18n/LocaleContext';

const POSTHOG_OPT_OUT_KEY = 'bbm_posthog_opt_out';
const POSTHOG_PROJECT_KEY = process.env.REACT_APP_PUBLIC_POSTHOG_KEY || 'phc_vKDFFaTih87w8hxDjhefDEiTtJBNdBqkKcB7Hc5SToT4';
const POSTHOG_API_HOST = process.env.REACT_APP_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const POSTHOG_SITE = 'basementbikemechanic';

function shouldOptOutPostHog() {
  if (typeof window === 'undefined') {
    return false;
  }

  const analyticsSetting = new URLSearchParams(window.location.search).get('bbm_analytics');

  try {
    if (analyticsSetting === 'off') {
      window.localStorage.setItem(POSTHOG_OPT_OUT_KEY, 'true');
    }

    if (analyticsSetting === 'on') {
      window.localStorage.removeItem(POSTHOG_OPT_OUT_KEY);
    }

    return (
      window.localStorage.getItem(POSTHOG_OPT_OUT_KEY) === 'true' ||
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
    );
  } catch {
    return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  }
}

posthog.init(POSTHOG_PROJECT_KEY, {
  api_host: POSTHOG_API_HOST,
  person_profiles: 'identified_only',
  capture_pageview: false,
  opt_out_capturing_by_default: shouldOptOutPostHog(),
});

posthog.register({ site: POSTHOG_SITE });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PostHogProvider client={posthog}>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeModeProvider>
          <LocaleProvider>
            <GlobalStyle />
            <App />
          </LocaleProvider>
        </ThemeModeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </PostHogProvider>
);
