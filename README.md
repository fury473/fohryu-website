# Fohryu Website

Première version statique de la page d'accueil publique de `fohryu.com`.

## Stack

- Vite
- TypeScript strict
- HTML sémantique rendu par fonctions TypeScript
- CSS custom, sans framework UI
- Assets statiques dans `public/`

## Installation

```bash
npm install
```

Le projet inclut `.npmrc` avec `bin-links=false` pour fonctionner sur un montage Windows/WSL qui refuse parfois les symlinks npm. Les scripts appellent donc directement les binaires JavaScript installés dans `node_modules`.

## Développement

```bash
npm run dev
```

Le serveur Vite expose le site en local. Les contenus principaux sont dans :

- `src/data/projects.ts` pour la cartographie des projets ;
- `src/data/site.ts` pour la navigation, la section Maintenant, les principes et les espaces ;
- `src/render/` pour les fonctions de rendu ;
- `src/styles/main.css` pour l'identité visuelle.

Une documentation plus détaillée de la composition de la page est disponible dans
[`docs/homepage-architecture.md`](docs/homepage-architecture.md).

## Build

```bash
npm run build
```

La sortie statique est produite dans `dist/`.

## Preview

```bash
npm run preview
```

## Déploiement Cloudflare Workers Static Assets

Le fichier `wrangler.jsonc` pointe vers `./dist` et attache le Worker au domaine racine `fohryu.com` via un Custom Domain Cloudflare.

```bash
npm run deploy
```

Au premier déploiement, Wrangler crée ou met à jour le Worker `fohryu-website` et demande à Cloudflare d'attacher `fohryu.com` à ce Worker. Le domaine `fohryu.com` doit être une zone active dans le compte Cloudflare utilisé par Wrangler.

Si Cloudflare refuse l'ajout du Custom Domain, vérifier dans le dashboard qu'aucun enregistrement DNS incompatible n'existe déjà pour `fohryu.com`, puis relancer le déploiement.

Le projet ne contient pas de backend, de base de données, d'authentification ou de CMS. La mention `Private Workspace` est seulement un lien public vers un espace protégé et ne contient aucune donnée privée.
