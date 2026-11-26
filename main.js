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

  /* CARROUSEL D'ACCUEIL : ordre aléatoire, boucle continue */

  const track = document.getElementById("marqueeTrack");

  if (track) {
    const items = [...track.children];

    // Ne garde que les images qui se chargent vraiment
    const check = (item) => new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(item);
      probe.onerror = () => resolve(null);
      probe.src = item.querySelector("img").src;
    });

    Promise.all(items.map(check)).then((list) => {
      const ok = list.filter(Boolean);
      if (!ok.length) return;

      // Mélange (Fisher-Yates)
      for (let i = ok.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        [ok[i], ok[k]] = [ok[k], ok[i]];
      }

      const clone = (node) => node.cloneNode(true);

      // Au moins 8 vignettes par moitié, pour éviter tout vide sur grand écran
      let half = ok.map(clone);
      while (half.length < 8) half = half.concat(ok.map(clone));

      // Seconde moitié identique : elle rend la boucle invisible
      const copy = half.map(clone);
      copy.forEach((node) => {
        node.setAttribute("aria-hidden", "true");
        node.tabIndex = -1;
      });

      track.replaceChildren(...half, ...copy);
      track.style.setProperty("--marquee-duration", half.length * 7 + "s");
      track.classList.add("is-running");
    });
  }
})();
