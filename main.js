/* ========================================
   Delcloup Simon — main.js
======================================== */

(() => {
  const root = document.documentElement;
  const langSwitch = document.getElementById("langSwitch");
  let currentLang = "fr";

  /* LANGUE (mémorisée d'une page à l'autre) */

  function setLanguage(lang) {
    currentLang = lang;
    root.lang = lang;

    document.querySelectorAll("[data-fr][data-en]").forEach((el) => {
      el.innerHTML = el.dataset[lang];
    });

    if (langSwitch) {
      langSwitch.innerHTML = lang === "fr" ? "EN <span>↗</span>" : "FR <span>↗</span>";
      langSwitch.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en français");
    }

    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  if (langSwitch) {
    langSwitch.addEventListener("click", () => {
      setLanguage(currentLang === "fr" ? "en" : "fr");
    });
  }

  try {
    if (localStorage.getItem("lang") === "en") setLanguage("en");
  } catch (e) {}


  /* RETOUR EN HAUT */

  const backTop = document.getElementById("backTop");

  if (backTop) {
    backTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* HEADER : MASQUÉ EN DESCENDANT, VISIBLE EN REMONTANT */

  const header = document.querySelector(".site-header");

  if (header) {
    let previous = window.scrollY;
    let ticking = false;

    const update = () => {
      const current = window.scrollY;

      if (current <= 80 || current < previous - 5) {
        header.classList.remove("header-hidden");
      } else if (current > previous + 5) {
        header.classList.add("header-hidden");
      }

      previous = current;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }
})();
