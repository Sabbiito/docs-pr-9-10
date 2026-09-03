import React from 'react';
import AppRouter from './router/AppRouter';
import CookieConsentBanner from './components/common/CookieConsentBanner';

/**
 * Кореневий компонент застосунку. `CookieConsentBanner` рендериться поза
 * `AppRouter`, тому GDPR cookie-банер показується незалежно від
 * поточного маршруту, доки користувач не прийме рішення (див.
 * `consentStore.js`).
 */
function App() {
  return (
    <>
      <AppRouter />
      <CookieConsentBanner />
    </>
  );
}

export default App;