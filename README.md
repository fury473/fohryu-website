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

Le projet distingue deux catégories de changements.

Les évolutions logicielles ou d'infrastructure regroupent les features, hotfixes,
changements d'architecture, composants, styles, modèle de données, scripts, build
et déploiement. Elles partent du dernier commit de la branche par défaut, passent
par une branche dédiée (`feature/...`, `hotfix/...`, `docs/...` selon
l'intention), une ou plusieurs commits, un push, puis une PR. La review et le
merge restent manuels.

Les modifications purement éditoriales peuvent être faites directement sur
`main`, sans branche ni PR : correction de texte, mise à jour d'un lien, donnée
de contenu ou état existant dans `Maintenant`. Elles restent versionnées par Git,
mais ne constituent pas un incrément logiciel et ne déclenchent pas à elles seules
une nouvelle version SemVer.

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

Le fichier `wrangler.jsonc` pointe vers `./dist` et attache le Worker
`fohryu-website` au domaine racine `fohryu.com` via un Custom Domain Cloudflare.
Le déploiement de production et les previews de branche sont volontairement
séparés.

```bash
npm run deploy:production
```

Cette commande build le site puis exécute `wrangler deploy`. Elle met à jour le
déploiement actif servi sur `fohryu.com`.

Pour produire une preview de branche sans promouvoir le résultat en production :

```bash
npm run deploy:preview
```

Cette commande build le site puis exécute `wrangler versions upload`. Elle crée
une version Cloudflare Workers avec URL de preview, sans modifier le déploiement
actif de production.

Les commandes internes `cf:deploy:production` et `cf:deploy:preview` exécutent
uniquement l'étape Wrangler. Elles sont prévues pour Workers Builds lorsque le
build Cloudflare exécute déjà `npm run build` séparément.

La configuration détaillée du workflow Git, du versioning et des déploiements est
documentée dans [`docs/deployment-workflow.md`](docs/deployment-workflow.md).

Au premier déploiement, Wrangler crée ou met à jour le Worker `fohryu-website` et
demande à Cloudflare d'attacher `fohryu.com` à ce Worker. Le domaine `fohryu.com`
doit être une zone active dans le compte Cloudflare utilisé par Wrangler.

Si Cloudflare refuse l'ajout du Custom Domain, vérifier dans le dashboard
qu'aucun enregistrement DNS incompatible n'existe déjà pour `fohryu.com`, puis
relancer le déploiement.

Le projet ne contient pas de backend, de base de données, d'authentification ou de CMS. La mention `Private Workspace` est seulement un lien public vers un espace protégé et ne contient aucune donnée privée.
