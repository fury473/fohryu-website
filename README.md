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

- `src/data/` pour les contenus structurés ;
- `src/render/` pour le rendu DOM ;
- `src/styles/` pour l'identité visuelle.

Le watcher du serveur de développement utilise un polling raisonnable afin de
détecter les modifications faites depuis Windows/VS Code sur le dépôt monté sous
WSL. Cette configuration ne concerne pas le build de production.

Pour comprendre la composition de la page, voir
[`docs/homepage-architecture.md`](docs/homepage-architecture.md). Pour les
consignes destinées aux agents de maintenance, voir [`AGENTS.md`](AGENTS.md).

## Workflow Git et versioning

Le détail du workflow Git, du versioning SemVer et de la séparation
production/previews vit dans
[`docs/deployment-workflow.md`](docs/deployment-workflow.md).

Résumé opérationnel :

- les évolutions logicielles ou d'infrastructure passent par une branche dédiée,
  une PR et une review manuelle ;
- les modifications purement éditoriales peuvent aller directement sur `main`
  lorsqu'elles ne touchent ni au rendu, ni au CSS, ni au modèle, ni au build ;
- les versions logicielles publiques viennent des tags Git SemVer sans préfixe
  `v`, affichés ensuite avec ce préfixe sur le site ;
- `package.json` n'a pas de champ `version`, afin d'éviter une seconde source de
  vérité.

## Build

```bash
npm run build
```

La sortie statique est produite dans `dist/`. Pendant le build, Vite injecte les
métadonnées Git publiques utilisées par le footer et le hero : dernière
modification, version logicielle publiée et révision exacte. Si les métadonnées
Git ne sont pas disponibles, le site reste buildable et affiche un fallback
explicite. Le modèle détaillé de version/révision est décrit dans
[`docs/deployment-workflow.md`](docs/deployment-workflow.md#versioning).

## Preview

```bash
npm run preview
```

## Déploiement Cloudflare Workers Static Assets

Le fichier `wrangler.jsonc` pointe vers `./dist` et attache le Worker
`fohryu-website` au domaine racine `fohryu.com` via un Custom Domain Cloudflare.
Les commandes manuelles principales sont :

```bash
npm run deploy:production
```

Cette commande synchronise les tags Git, build le site puis exécute
`wrangler deploy`. Elle met à jour le déploiement actif servi sur `fohryu.com`.

```bash
npm run deploy:preview
```

Cette commande synchronise les tags Git, build le site puis exécute
`wrangler versions upload`. Elle crée une version Cloudflare Workers avec URL de
preview, sans modifier le déploiement actif de production.

Les commandes internes `cf:deploy:production`, `cf:deploy:preview` et
`build:cloudflare` sont prévues pour Workers Builds. Leur rôle exact, le
déclenchement automatique sur `main` et les previews de branche sont documentés
dans [`docs/deployment-workflow.md`](docs/deployment-workflow.md#scripts-de-déploiement).

Au premier déploiement, Wrangler crée ou met à jour le Worker `fohryu-website` et
demande à Cloudflare d'attacher `fohryu.com` à ce Worker. Le domaine `fohryu.com`
doit être une zone active dans le compte Cloudflare utilisé par Wrangler.

Si Cloudflare refuse l'ajout du Custom Domain, vérifier dans le dashboard
qu'aucun enregistrement DNS incompatible n'existe déjà pour `fohryu.com`, puis
relancer le déploiement.

Le projet ne contient pas de backend, de base de données, d'authentification ou de CMS. La mention `Private Workspace` est seulement un lien public vers un espace protégé et ne contient aucune donnée privée.
