/**
 * @file NotFound.tsx
 * @description BSOD-style 404 page with glitch effects and navigation back to home.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

/**
 * Not Found (404) page component.
 * Displays a Windows-style blue screen error with home navigation.
 */
function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        container.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
          container.style.transform = 'translate(0, 0)';
        }, 50);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="not-found">
      <div className="not-found__scanlines" />

      <div className="not-found__container" ref={containerRef}>
        <div className="not-found__emoticon">:(</div>
        <h1 className="not-found__title">
          Votre navigation a rencontré un problème et doit redémarrer.
          <br />
          La page que vous cherchez n'existe pas.
        </h1>

        <p className="not-found__code">Erreur 404 - Page non trouvée</p>

        {/* Loading progress bar */}
        <div className="not-found__progress">
          <p className="not-found__progress-text">Recherche de la page en cours...</p>
          <div className="not-found__progress-bar">
            <div className="not-found__progress-fill" />
          </div>
        </div>

        {/* QR section with home icon */}
        <div className="not-found__qr-section">
          <div className="not-found__qr-code">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0078d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="not-found__qr-text">
            <p>
              Si vous souhaitez en savoir plus sur cette erreur, vous pouvez effectuer une recherche
              en ligne avec le code : <strong>PAGE_NOT_FOUND_EXCEPTION</strong>
            </p>
            <p>
              Ou mieux encore, retournez sur{' '}
              <button onClick={handleGoHome} className="not-found__link">
                la page d'accueil
              </button>{' '}
              pour explorer mon portfolio !
            </p>
          </div>
        </div>
        <p className="not-found__stop-code">Stop code: PORTFOLIO_PAGE_NOT_FOUND</p>
        <button onClick={handleGoHome} className="not-found__home-button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default NotFound;
