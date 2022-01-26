module.exports = () => {return `
  <div id="cookieConsent">
      <div id="closeCookieConsent">X</div>
      <div class="columns is-centered">
        <p class="column is-5 has-text-centered" style="font-size: 15px;">
          Nous utilisons des cookies et d'autres technologies de suivi pour améliorer votre expérience de navigation sur notre site, pour vous montrer un contenu personnalisé et des publicités ciblées, pour analyser le trafic de notre site et pour comprendre la provenance de nos visiteurs.
        </p>
      </div>
      <div class="columns is-centered">
        <div class="column is-5 has-text-centered">
          <button id="closeCookieConsentBut" class="button is-warning cookieConsentOK">
          J'accepte
          </button>
        </div>
      </div>
  </div>
  `}
