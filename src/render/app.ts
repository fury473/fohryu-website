import {
  projects,
  statusLabels,
  statusNotes,
  visibilityLabels,
  type Project
} from "../data/projects";
import {
  activityItems,
  navLinks,
  nowItems,
  principles,
  spaces,
  type ActivityItem,
  type Space
} from "../data/site";
import { el, link } from "./dom";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
] as const;

const FURY_ORIGIN_TEXT = [
  "Fury est un pseudonyme créé dans les années 2000 lorsque je cherchais un nom durant mes games fun de Counter-Strike: Source (l’époque des chats vocaux ouverts sur serveurs privés).",
  "Le suffixe 473 est arrivé quasiment en même temps, sauf qu’à l’époque c’était sans doute avec une tonne de caractères Unicode / CharMap comme c’était la mode sur MSN (... bref).",
  "Toute ressemblance avec certaines communautés animalières est purement fortuite, même si les confusions me font aujourd’hui plutôt sourire."
] as const;

export function renderApp(root: HTMLElement): void {
  const sortedProjects = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  root.replaceChildren(
    renderHeader(),
    el("main", {
      attrs: { id: "contenu" },
      children: [
        renderHero(),
        renderActivity(),
        renderNow(),
        renderProjects(sortedProjects),
        renderConnections(),
        renderPrinciples(),
        renderSpaces(),
        renderFooter()
      ]
    }),
    renderFuryOriginModal()
  );

  setupRevealAnimations();
  setupKonamiCode();
}

function renderHeader(): HTMLElement {
  const nav = el("nav", {
    className: "site-nav",
    attrs: { "aria-label": "Navigation principale" },
    children: navLinks.map((item) => link(item.label, item.href))
  });

  return el("header", {
    className: "site-header",
    children: [
      el("div", {
        className: "header-shell",
        children: [
          link("Fohryu Works", "#top", "brand"),
          nav,
          link("GitHub", "https://github.com/Fury473", "header-link")
        ]
      })
    ]
  });
}

function renderHero(): HTMLElement {
  return el("section", {
    className: "hero section",
    attrs: { id: "top" },
    children: [
      el("div", {
        className: "hero__inner section__inner",
        children: [
          el("div", {
            className: "hero__content reveal",
            children: [
              el("p", { className: "eyebrow", text: "Atelier public / v0.1" }),
              el("h1", { text: "Construire, expérimenter, documenter." }),
              el("p", {
                className: "hero__intro",
                text:
                  "Fohryu Works est mon atelier vivant : logiciels, intelligence artificielle, création, explorations et outils conçus pour rendre la technologie plus humaine et moins visible."
              }),
              el("div", {
                className: "action-row",
                children: [
                  link("Voir les projets", "#projets", "button button--primary"),
                  link("Récemment", "#activite", "button button--secondary"),
                  link("Maintenant", "#maintenant", "button button--secondary")
                ]
              }),
              el("p", {
                className: "hero__quote",
                text:
                  "La meilleure technologie est celle qui devient invisible au profit de l'expérience."
              })
            ]
          }),
          el("figure", {
            className: "hero-map reveal",
            children: [
              el("img", {
                attrs: {
                  src: "/atelier-map.svg",
                  alt: "Carte stylisée reliant les projets de Fohryu Works",
                  width: 780,
                  height: 560,
                  decoding: "async"
                }
              }),
              el("figcaption", {
                text: "Une carte de travail, pas un plan figé."
              })
            ]
          })
        ]
      })
    ]
  });
}

function renderNow(): HTMLElement {
  return renderSection("maintenant", "Maintenant", "Ce qui est en cours", [
    el("div", {
      className: "now-panel reveal",
      children: [
        el("div", {
          className: "now-panel__lead",
          children: [
            el("span", { className: "signal-dot", attrs: { "aria-hidden": "true" } }),
            el("p", {
              text:
                "La réponse courte à la question : qu'est-ce que Fury construit actuellement ?"
            })
          ]
        }),
        el("ol", {
          className: "now-list",
          children: nowItems.map((item) =>
            el("li", {
              children: [
                el("h3", { text: item.title }),
                el("p", { text: item.description })
              ]
            })
          )
        })
      ]
    })
  ]);
}

function renderActivity(): HTMLElement {
  return renderSection("activite", "Récemment", "Les dernières traces publiées.", [
    el("div", {
      className: "activity-feed reveal",
      children: activityItems.map(renderActivityCard)
    })
  ]);
}

function renderActivityCard(item: ActivityItem): HTMLElement {
  const media = item.thumbnail
    ? el("a", {
        className: "activity-card__media",
        attrs: {
          href: item.url,
          target: "_blank",
          rel: "noreferrer",
          "aria-label": `Ouvrir ${item.title} sur ${item.source}`
        },
        children: [
          el("img", {
            attrs: {
              src: item.thumbnail.src,
              alt: item.thumbnail.alt,
              width: item.thumbnail.width,
              height: item.thumbnail.height,
              loading: "lazy",
              decoding: "async"
            }
          })
        ]
      })
    : null;

  return el("article", {
    className: `activity-card${item.thumbnail ? " activity-card--with-media" : ""}`,
    children: [
      media,
      el("div", {
        className: "activity-card__body",
        children: [
          el("div", {
            className: "card-meta",
            children: [
              el("span", { className: "pill", text: item.source }),
              el("time", {
                className: "activity-card__date",
                text: item.dateLabel,
                attrs: { datetime: item.datetime }
              })
            ]
          }),
          el("h3", { text: item.title }),
          el("div", {
            className: "activity-card__copy",
            children: item.body.map((paragraph) => el("p", { text: paragraph }))
          }),
          link("Ouvrir la publication", item.url, "button button--secondary activity-card__button")
        ]
      })
    ]
  });
}

function renderProjects(sortedProjects: Project[]): HTMLElement {
  const featuredProjects = sortedProjects.filter((project) => project.featured);

  return renderSection(
    "projets",
    "Projets",
    "Une sélection lisible d'abord, puis la cartographie complète.",
    [
      el("div", {
        className: "project-group reveal",
        children: [
          el("div", {
            className: "group-heading",
            children: [
              el("p", { className: "eyebrow", text: "À la une" }),
              el("h3", { text: "Les chantiers qui structurent le reste" })
            ]
          }),
          el("div", {
            className: "featured-grid",
            children: featuredProjects.map((project) => renderProjectCard(project, true))
          })
        ]
      }),
      el("div", {
        className: "project-group reveal",
        children: [
          el("div", {
            className: "group-heading",
            children: [
              el("p", { className: "eyebrow", text: "Cartographie" }),
              el("h3", { text: "Tous les projets identifiés" })
            ]
          }),
          el("div", {
            className: "project-grid",
            children: sortedProjects.map((project) => renderProjectCard(project, false))
          })
        ]
      })
    ]
  );
}

function renderProjectCard(project: Project, featured: boolean): HTMLElement {
  const classes = [
    "project-card",
    `project-card--${project.status}`,
    featured ? "project-card--featured" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const children = [
    el("div", {
      className: "card-meta",
      children: [
        el("span", { className: "pill", text: statusLabels[project.status] }),
        el("span", {
          className: "visibility",
          text: visibilityLabels[project.visibility]
        })
      ]
    }),
    el("h4", { text: project.title }),
    el("p", { className: "project-card__category", text: project.category }),
    el("p", { className: "project-card__description", text: project.shortDescription }),
    el("p", { className: "project-card__note", text: statusNotes[project.status] })
  ];

  if (project.links.length > 0) {
    children.push(
      el("div", {
        className: "project-links",
        children: project.links.map((projectLink) =>
          link(projectLink.label, projectLink.url, "text-link")
        )
      })
    );
  }

  return el("article", {
    className: classes,
    attrs: { id: `project-${project.id}` },
    children
  });
}

function renderConnections(): HTMLElement {
  const steps = ["Exploration", "Journal", "Vidéo", "Outil", "Produit"];

  return renderSection(
    "relations",
    "Comment tout est relié",
    "Les projets ne sont pas des îlots. Ils se nourrissent les uns les autres.",
    [
      el("div", {
        className: "connection-flow reveal",
        children: [
          el("p", {
            text:
              "Une exploration peut devenir une entrée de journal. Le journal peut devenir une vidéo. La vidéo peut documenter un outil. L'outil peut ensuite devenir un produit."
          }),
          el("ol", {
            className: "flow-steps",
            children: steps.map((step) =>
              el("li", {
                children: [el("span", { text: step })]
              })
            )
          })
        ]
      })
    ]
  );
}

function renderPrinciples(): HTMLElement {
  return renderSection("principes", "Principes", "Quelques contraintes utiles pour garder le cap.", [
    el("div", {
      className: "principles-grid reveal",
      children: principles.map((principle) =>
        el("article", {
          className: "principle-card",
          children: [el("h3", { text: principle.title }), el("p", { text: principle.description })]
        })
      )
    })
  ]);
}

function renderSpaces(): HTMLElement {
  return renderSection("espaces", "Espaces", "Les points d'accès existants ou prévus.", [
    el("div", {
      className: "spaces-grid reveal",
      children: spaces.map(renderSpaceCard)
    })
  ]);
}

function renderSpaceCard(space: Space): HTMLElement {
  const access =
    space.url && space.label
      ? link(space.label, space.url, "text-link")
      : el("span", { className: "space-card__placeholder", text: space.label ?? "À venir" });

  return el("article", {
    className: `space-card space-card--${space.access}`,
    children: [
      el("div", {
        className: "card-meta",
        children: [
          el("span", {
            className: "pill",
            text:
              space.access === "protected"
                ? "Protégé"
                : space.access === "planned"
                  ? "Prévu"
                  : "Public"
          })
        ]
      }),
      el("h3", { text: space.title }),
      el("p", { text: space.description }),
      access
    ]
  });
}

function renderFooter(): HTMLElement {
  const year = String(new Date().getFullYear());

  return el("footer", {
    className: "site-footer",
    children: [
      el("div", {
        className: "footer-shell",
        children: [
          el("div", {
            className: "footer-brand",
            children: [
              el("img", {
                className: "footer-brand__mark",
                attrs: {
                  src: "/ryuuko/exports/ryuuko-watermark-150.png",
                  alt: "",
                  width: 150,
                  height: 150,
                  loading: "lazy",
                  decoding: "async"
                }
              }),
              el("div", {
                children: [
                  el("strong", { text: "Fohryu Works" }),
                  el("p", {
                    text: `© ${year}. Site expérimental, statique, et volontairement en évolution.`
                  })
                ]
              })
            ]
          }),
          el("div", {
            className: "footer-links",
            children: [
              link("Hub", "https://hub.fohryu.com/"),
              link("GitHub", "https://github.com/Fury473"),
              link("YouTube", "https://www.youtube.com/@Fury473"),
              link("Twitch", "https://www.twitch.tv/fury473")
            ]
          })
        ]
      })
    ]
  });
}

function renderFuryOriginModal(): HTMLElement {
  return el("div", {
    className: "easter-egg-modal",
    attrs: {
      id: "fury-origin-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "fury-origin-title",
      "aria-describedby": "fury-origin-description",
      hidden: true
    },
    children: [
      el("div", {
        className: "easter-egg-modal__panel",
        attrs: { tabindex: "-1" },
        children: [
          el("h2", {
            className: "sr-only",
            text: "L'origine du pseudo Fury",
            attrs: { id: "fury-origin-title" }
          }),
          el("div", {
            className: "sr-only",
            attrs: { id: "fury-origin-description" },
            children: FURY_ORIGIN_TEXT.map((paragraph) => el("p", { text: paragraph }))
          }),
          el("div", {
            className: "easter-egg-modal__card",
            children: [
              el("button", {
                className: "easter-egg-modal__close",
                text: "×",
                attrs: {
                  type: "button",
                  "aria-label": "Fermer l'easter egg"
                }
              }),
              el("img", {
                className: "easter-egg-modal__image",
                attrs: {
                  src: "/ryuuko/exports/origin-of-fury-card-900x957.png",
                  alt: "Illustration de Ryūko sur l'origine du pseudo Fury.",
                  width: 900,
                  height: 957,
                  decoding: "async"
                }
              })
            ]
          })
        ]
      })
    ]
  });
}

function renderSection(
  id: string,
  title: string,
  description: string,
  children: HTMLElement[]
): HTMLElement {
  return el("section", {
    className: `section section--${id}`,
    attrs: { id },
    children: [
      el("div", {
        className: "section__inner",
        children: [
          el("div", {
            className: "section-heading reveal",
            children: [
              el("p", { className: "eyebrow", text: title }),
              el("h2", { text: description })
            ]
          }),
          ...children
        ]
      })
    ]
  });
}

function setupRevealAnimations(): void {
  const targets = [...document.querySelectorAll<HTMLElement>(".reveal")];

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupKonamiCode(): void {
  const modal = document.querySelector<HTMLElement>("#fury-origin-modal");
  const panel = modal?.querySelector<HTMLElement>(".easter-egg-modal__panel");
  const closeButton = modal?.querySelector<HTMLButtonElement>(".easter-egg-modal__close");

  if (!modal || !panel || !closeButton) {
    return;
  }

  let sequenceIndex = 0;
  let previouslyFocused: HTMLElement | null = null;

  const openModal = (): void => {
    if (!modal.hidden) {
      return;
    }

    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.hidden = false;
    document.body.classList.add("modal-open");

    window.requestAnimationFrame(() => {
      modal.classList.add("is-open");
      closeButton.focus({ preventScroll: true });
    });
  };

  const closeModal = (): void => {
    if (modal.hidden) {
      return;
    }

    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    const finishClose = (): void => {
      modal.hidden = true;
      previouslyFocused?.focus({ preventScroll: true });
      previouslyFocused = null;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    window.setTimeout(finishClose, 180);
  };

  const trapFocus = (event: KeyboardEvent): void => {
    const focusableElements = getFocusableElements(modal);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }

      return;
    }

    const expectedKey = KONAMI_SEQUENCE[sequenceIndex];
    const pressedKey = getKonamiKey(event);

    if (pressedKey === expectedKey) {
      sequenceIndex += 1;
    } else {
      sequenceIndex = pressedKey === KONAMI_SEQUENCE[0] ? 1 : 0;
    }

    if (sequenceIndex === KONAMI_SEQUENCE.length) {
      sequenceIndex = 0;
      openModal();
    }
  });
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  return [...container.querySelectorAll<HTMLElement>(selector)].filter(
    (element) => !element.hasAttribute("hidden") && element.offsetParent !== null
  );
}

function getKonamiKey(event: KeyboardEvent): string {
  if (event.key.length === 1) {
    return event.key.toLowerCase();
  }

  return event.key;
}
