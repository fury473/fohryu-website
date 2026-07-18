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

Tout nouvel incrément part du dernier commit de la branche par défaut. Le flux
attendu est :

1. synchroniser la branche par défaut avec `origin` ;
2. créer une branche dédiée depuis ce commit, par exemple `feature/...`,
   `hotfix/...` ou `docs/...` selon l'intention ;
3. produire une ou plusieurs commits sur cette branche ;
4. pousser la branche et ouvrir une PR.

La review et le merge des PR restent faits manuellement. Sauf demande explicite,
les changements ne se font donc pas directement sur `main`.

L'application suit SemVer via les tags posés sur la branche par défaut. Une
feature prépare normalement la prochaine version mineure, un hotfix la prochaine
version patch, et une évolution majeure la prochaine version majeure. Si le commit
buildé n'a pas de tag SemVer exact, la version affichée utilise le short SHA.

## Build

```bash
npm run build
```

La sortie statique est produite dans `dist/`. Pendant le build, Vite tente de lire
la date du dernier commit Git pour afficher la mention `Dernière modification`
dans le footer. Si les métadonnées Git ne sont pas disponibles, le site reste
buildable et affiche un fallback explicite. La version affichée sur la page vient
du tag SemVer exact du commit courant, par exemple `0.2.0`, ou du short SHA si le
commit n'est pas taggé.

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
