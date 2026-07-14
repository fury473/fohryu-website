export type ProjectStatus = "active" | "experiment" | "planned" | "idea" | "usable";
export type ProjectVisibility = "public" | "private" | "mixed";

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  links: ProjectLink[];
  featured: boolean;
  sortOrder: number;
};

export const statusLabels: Record<ProjectStatus, string> = {
  active: "Actif",
  experiment: "Expérimental",
  planned: "Planifié",
  idea: "Exploratoire",
  usable: "Utilisable"
};

export const statusNotes: Record<ProjectStatus, string> = {
  active: "En construction ou en usage régulier.",
  experiment: "Prototype vivant, encore mouvant.",
  planned: "Intention claire, implémentation à venir.",
  idea: "Piste ouverte, pas encore stabilisée.",
  usable: "Déjà exploitable dans son état actuel."
};

export const visibilityLabels: Record<ProjectVisibility, string> = {
  public: "Public",
  private: "Privé",
  mixed: "Mixte"
};

export const projects: Project[] = [
  {
    id: "fohryu-works",
    title: "Fohryu Works",
    shortDescription:
      "Le point de convergence de mes projets, expérimentations, contenus et futurs produits.",
    category: "Identité / atelier",
    status: "active",
    visibility: "public",
    links: [{ label: "fohryu.com", url: "https://fohryu.com/" }],
    featured: true,
    sortOrder: 10
  },
  {
    id: "fohryu-hub",
    title: "Fohryu Hub",
    shortDescription:
      "Une base documentaire versionnée regroupant décisions, architectures, procédures, recherches et projets personnels.",
    category: "Documentation",
    status: "usable",
    visibility: "private",
    links: [{ label: "hub.fohryu.com", url: "https://hub.fohryu.com/" }],
    featured: true,
    sortOrder: 20
  },
  {
    id: "journal",
    title: "Journal",
    shortDescription:
      "Un journal quotidien enrichi de synthèses humaines et techniques, conçu comme une mémoire structurée des expériences et projets.",
    category: "Documentation / création",
    status: "active",
    visibility: "mixed",
    links: [],
    featured: true,
    sortOrder: 30
  },
  {
    id: "explorations-ai",
    title: "Explorations w/ AI",
    shortDescription:
      "Marcher, courir, observer et réfléchir avec une IA comme compagnon de route, puis transformer l'expérience en récits, photos et contenus.",
    category: "Expérimentation / création",
    status: "experiment",
    visibility: "mixed",
    links: [],
    featured: true,
    sortOrder: 40
  },
  {
    id: "ai-stream-cohost",
    title: "AI Stream Co-host",
    shortDescription:
      "Une co-animatrice IA avec voix, personnalité, avatar et capacité d'interagir avec le stream et son audience.",
    category: "IA / streaming",
    status: "planned",
    visibility: "mixed",
    links: [],
    featured: false,
    sortOrder: 50
  },
  {
    id: "creator-pipeline",
    title: "Creator Pipeline",
    shortDescription:
      "Une source textuelle unique déclinée en récit audio, vidéo minimaliste, vidéo illustrée, article, publication sociale et documentation.",
    category: "Création / automatisation",
    status: "idea",
    visibility: "mixed",
    links: [],
    featured: false,
    sortOrder: 60
  },
  {
    id: "lost-found-nfc",
    title: "Lost & Found NFC",
    shortDescription:
      "Des étiquettes QR et NFC permettant de restituer un objet perdu sans exposer directement les coordonnées de son propriétaire.",
    category: "Produit / web",
    status: "planned",
    visibility: "public",
    links: [],
    featured: false,
    sortOrder: 70
  },
  {
    id: "music-graph",
    title: "Music Graph",
    shortDescription:
      "Une bibliothèque musicale indépendante des plateformes reliant artistes, morceaux, compositeurs, œuvres et services de streaming.",
    category: "Musique / données",
    status: "idea",
    visibility: "public",
    links: [],
    featured: false,
    sortOrder: 80
  },
  {
    id: "ha-config",
    title: "Home Assistant / HA Config",
    shortDescription:
      "Configuration, documentation et expérimentations autour de Home Assistant.",
    category: "Domotique / documentation",
    status: "usable",
    visibility: "mixed",
    links: [],
    featured: false,
    sortOrder: 90
  },
  {
    id: "public-private-hub",
    title: "Public / Private Hub",
    shortDescription:
      "Une séparation claire entre les contenus publics de Fohryu Works et les espaces privés protégés par Cloudflare Access.",
    category: "Infrastructure",
    status: "planned",
    visibility: "mixed",
    links: [],
    featured: false,
    sortOrder: 100
  },
  {
    id: "photo-exploration-archive",
    title: "Photo & Exploration Archive",
    shortDescription:
      "Une archive personnelle et publique sélectionnée de mes explorations, servant de source canonique avant déclinaison sur les réseaux sociaux.",
    category: "Photographie / contenu",
    status: "idea",
    visibility: "public",
    links: [],
    featured: false,
    sortOrder: 110
  }
];
