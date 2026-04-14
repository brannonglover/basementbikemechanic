import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import App from './App';
import GlobalStyle from './GlobalStyle';
import { ThemeModeProvider } from './ThemeModeContext';

posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PostHogProvider client={posthog}>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeModeProvider>
          <GlobalStyle />
          <App />
        </ThemeModeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </PostHogProvider>
);