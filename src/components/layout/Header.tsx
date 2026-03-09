"use client";

import React, { useEffect, useState } from "react";

export default function Header() {
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setIsOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="awcmr-header">
      <div className="awcmr-header__inner">
        <a href="/" className="awcmr-header__logo" onClick={closeMenu}>
          ApiWorking
        </a>

        <nav className="awcmr-header__nav">
          <a href="/resto" className="awcmr-header__link">Restaurantes</a>
          <a href="/sistema-para-hoteles" className="awcmr-header__link">Hoteles</a>
          <a href="/contacto" className="awcmr-header__link">Contacto XD</a>
        </nav>

        <div className="awcmr-header__actions">
          <a href="/demo" className="awcmr-header__btnPrimary">Solicitar demo V1</a>
        </div>

        <button
          type="button"
          className="awcmr-header__burger"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="awcmr-mobile-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="awcmr-header__burgerLine" />
          <span className="awcmr-header__burgerLine" />
          <span className="awcmr-header__burgerLine" />
        </button>
      </div>

      <div
        id="awcmr-mobile-menu"
        className={`awcmr-header__mobilePanel ${isOpen ? "is-open" : ""}`}
      >
        <div className="awcmr-header__mobileInner">
          <a href="/resto" className="awcmr-header__mobileLink" onClick={closeMenu}>
            Restaurantes
          </a>
          <a href="/sistema-para-hoteles" className="awcmr-header__mobileLink" onClick={closeMenu}>
            Hoteles
          </a>
          <a href="/contacto" className="awcmr-header__mobileLink" onClick={closeMenu}>
            Contacto
          </a>
          <a href="/demo" className="awcmr-header__mobileBtn" onClick={closeMenu}>
            Solicitar demo
          </a>
        </div>
      </div>

      {isOpen ? (
        <button
          type="button"
          className="awcmr-header__backdrop"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      ) : null}
    </header>
  );
}