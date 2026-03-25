import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import GlobalStyle from './GlobalStyle';
import { ThemeModeProvider } from './ThemeModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeModeProvider>
        <GlobalStyle />
        <App />
      </ThemeModeProvider>
    </BrowserRouter>
  </HelmetProvider>
);