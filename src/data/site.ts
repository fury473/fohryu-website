export type NowStatus = "active" | "next" | "completed";

export type NowItem = {
  id: string;
  title: string;
  description: string;
  status: NowStatus;
};

export type Principle = {
  title: string;
  description: string;
};

export type Space = {
  title: string;
  description: string;
  url?: string;
  label?: string;
  access: "public" | "planned" | "protected";
};

export type ActivityItem = {
  id: string;
  source: "Instagram" | "Journal" | "YouTube" | "GitHub";
  title: string;
  dateLabel: string;
  datetime: string;
  body: string[];
  url: string;
  thumbnail?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const navLinks = [
  { label: "Projets", href: "#projets" },
  { label: "Explorations", href: "#project-explorations-ai" }
] as const;

export const nowStatusLabels: Record<NowStatus, string> = {
  active: "Actif",
  next: "À suivre",
  completed: "Terminé"
};

export const nowStatusOrder: NowStatus[] = ["active", "next", "completed"];

export const nowItems: NowItem[] = [
  {
    id: "journal",
    title: "Journal quotidien assisté par IA",
    description: "Transformer les expériences et décisions du quotidien en mémoire structurée.",
    status: "active"
  },
  {
    id: "fohryu-com-maintenance",
    title: "Maintenance de fohryu.com",
    description: "Maintenir la page publique, corriger les détails et faire évoluer les contenus.",
    status: "next"
  },
  {
    id: "personal-bug-watch",
    title: "Suivi personnel de bugs",
    description:
      "Structurer un carnet d'analyses de bugs, avec une première entrée sur les artefacts audio ChatGPT pendant la lecture des messages.",
    status: "next"
  },
  {
    id: "moving-ai",
    title: "Explorations en mouvement",
    description: "Marcher, courir, observer et dialoguer avec une IA comme compagnon de route.",
    status: "next"
  },
  {
    id: "hub-structure",
    title: "Structuration du Hub",
    description:
      "Consolider un espace privé où je documente mes idées de manière détaillée. Une version publique viendra en cours de route, le temps de stabiliser mes priorités.",
    status: "next"
  },
  {
    id: "youtube-refresh",
    title: "Mise à jour de la chaîne YouTube",
    description:
      "Faire le ménage, clarifier le branding, retravailler la description, préparer l'intro et poser les premières vidéos de contenu.",
    status: "next"
  },
  {
    id: "stream-cohost",
    title: "AI co-host pour le streaming",
    description: "Préparer une présence IA capable d'accompagner le direct et son audience.",
    status: "next"
  },
  {
    id: "fohryu-com-launch",
    title: "Lancement de fohryu.com",
    description:
      "La première porte d'entrée publique est en ligne : statique, sobre et facile à faire évoluer.",
    status: "completed"
  }
];

export const activityItems: ActivityItem[] = [
  {
    id: "instagram-urban-exploration",
    source: "Instagram",
    title: "Balade vide-méninges, IA et exploration urbaine.",
    dateLabel: "9 juillet 2026",
    datetime: "2026-07-09",
    body: [
      "Parti pour courir quelques kilomètres afin de me vider l'esprit. Finalement, la sortie s'est transformée en près de trois heures de marche, de discussions avec ChatGPT, d'exploration du parc de Gerland, de photos... et de quelques rencontres imprévues.",
      "Parfois, les meilleures idées naissent simplement lorsqu'on laisse le temps au temps."
    ],
    url: "https://www.instagram.com/p/DayjM9-jUZX/"
  }
];

export const principles: Principle[] = [
  {
    title: "Experience first",
    description: "La technologie doit servir l'expérience, pas devenir l'expérience."
  },
  {
    title: "Build in public",
    description: "Documenter le chemin, y compris les hésitations, les prototypes et les échecs."
  },
  {
    title: "One source, many formats",
    description:
      "Une même matière peut devenir documentation, vidéo, audio, article ou publication sociale."
  },
  {
    title: "Human-controlled AI",
    description:
      "Utiliser l'IA comme multiplicateur, tout en conservant transparence, limites et supervision humaine."
  }
];

export const spaces: Space[] = [
  {
    title: "Hub",
    description: "Base documentaire protégée : décisions, procédures et architecture personnelle.",
    url: "https://hub.fohryu.com/",
    label: "hub.fohryu.com",
    access: "protected"
  },
  {
    title: "Journal",
    description: "Mémoire quotidienne et matière première pour les contenus futurs.",
    url: "https://journal.fohryu.com/",
    label: "journal.fohryu.com",
    access: "planned"
  },
  {
    title: "YouTube",
    description: "Vidéos, formats expérimentaux et contenus issus des explorations.",
    url: "https://www.youtube.com/@Fury473",
    label: "@Fury473",
    access: "public"
  },
  {
    title: "Twitch",
    description: "Streaming, essais en direct et futurs formats avec co-animation IA.",
    url: "https://www.twitch.tv/fury473",
    label: "twitch.tv/fury473",
    access: "public"
  },
  {
    title: "Instagram",
    description: "Photos, traces visuelles et fragments issus des explorations.",
    url: "https://www.instagram.com/fury473",
    label: "instagram.com/fury473",
    access: "public"
  },
  {
    title: "GitHub",
    description: "Code, prototypes et projets publics lorsqu'ils sont prêts à être partagés.",
    url: "https://github.com/Fury473",
    label: "github.com/Fury473",
    access: "public"
  },
  {
    title: "Private Workspace",
    description: "Espace prévu pour les notes, journaux et outils qui ne sont pas publics.",
    label: "Pas encore en ligne",
    access: "planned"
  }
];
