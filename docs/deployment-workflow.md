# Workflow Git, versioning et déploiement

Ce document décrit le workflow de contribution et de déploiement du site statique
`fohryu.com`. Il complète le `README.md`, qui reste le point d'entrée pour les
commandes courantes, et sert de référence détaillée pour les règles Git,
versioning et Cloudflare.

## État inspecté

L'inspection du dépôt et des connecteurs disponibles donne l'état suivant :

- dépôt GitHub : `fury473/fohryu-website` ;
- branche par défaut : `main` ;
- aucun workflow GitHub Actions versionné dans le dépôt ;
- Worker Cloudflare existant : `fohryu-website` ;
- identifiant Worker observé : `e8351f8ab1c145829d4c8341ee1dc578` ;
- Custom Domain déclaré par `wrangler.jsonc` : `fohryu.com` ;
- Workers Builds : aucun build existant observé pour `fohryu-website` au moment
  de l'inspection ;
- variables, secrets, bindings, KV, D1 ou R2 : aucun déclaré dans le dépôt pour
  ce site.

Aucune modification hors dépôt n'a été réalisée pendant cette PR. Les
changements Cloudflare décrits plus bas sont des modifications proposées à
appliquer seulement après review et autorisation explicite.

Références Cloudflare utilisées :

- Workers Builds configuration :
  <https://developers.cloudflare.com/workers/ci-cd/builds/configuration/> ;
- builds de branches non-production :
  <https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/> ;
- Workers Preview URLs :
  <https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/>.

## Catégories de changements

Les évolutions logicielles ou d'infrastructure regroupent :

- features et hotfixes ;
- changements d'architecture ;
- modifications de rendu, composants, styles ou accessibilité ;
- évolution du modèle de données ;
- scripts, configuration de build, configuration Wrangler ou déploiement ;
- documentation qui change le fonctionnement du projet.

Ces changements utilisent le workflow complet :

1. synchroniser la branche par défaut avec `origin` ;
2. créer une branche dédiée depuis le dernier commit de `main` ;
3. produire une ou plusieurs commits ;
4. pousser la branche ;
5. ouvrir une PR ;
6. laisser la review et le merge au propriétaire du dépôt.

Les modifications purement éditoriales peuvent être faites directement sur
`main`, sans branche ni PR. Cela couvre par exemple :

- correction de texte ;
- mise à jour d'un lien ;
- mise à jour d'une donnée de contenu ;
- changement d'état dans une entrée existante de la section `Maintenant`.

Une modification éditoriale cesse d'être purement éditoriale dès qu'elle demande
de toucher au rendu, au CSS, aux types, au modèle de données, au build ou à
l'infrastructure. Dans ce cas, elle suit le workflow complet.

## Versioning

L'application utilise SemVer pour les incréments logiciels publiés depuis la
branche par défaut :

- feature : prochaine version mineure ;
- hotfix : prochaine version patch ;
- rupture ou changement majeur : prochaine version majeure.

Les tags Git réels doivent être nommés au format `MAJOR.MINOR.PATCH` sans
préfixe `v`, par exemple `0.2.0`. Le préfixe `v` est seulement une convention
d'affichage ajoutée par le site au build : le tag Git `0.2.0` est donc affiché
comme `v0.2.0`.

Les changements purement éditoriaux restent versionnés par Git, mais ne doivent
pas déclencher à eux seuls une nouvelle version SemVer.

La version logicielle publiée affichée par le site est calculée au build depuis le
dernier tag SemVer atteignable dans l'historique Git. La révision exacte affichée
séparément vient du short SHA du commit buildé.

`package.json` ne contient volontairement pas de champ `version`. Le projet est
privé côté npm et n'est pas publié comme package ; conserver une version npm
créerait une seconde source de vérité à synchroniser avec les tags Git.

Ce modèle permet de représenter correctement les cas courants :

- après un commit éditorial non taggé sur `main`, le site conserve par exemple
  `v0.2.0` comme version logicielle et affiche une nouvelle révision ;
- sur une branche de feature ou de preview, le site affiche la dernière version
  logicielle publiée et la révision exacte de la branche ;
- après un tag SemVer sans préfixe, par exemple `0.3.0`, posé sur `main`, le
  prochain build de ce commit affiche la nouvelle version logicielle sous la
  forme `v0.3.0`.

Le build Cloudflare doit avoir accès aux tags Git et à l'historique nécessaire
pour calculer cette version. Workers Builds peut cloner le dépôt avec un
historique réduit : dans ce cas, les refs de tags seules ne suffisent pas à
résoudre le dernier tag atteignable depuis un commit éditorial non taggé. La
commande `npm run build:cloudflare` prépare donc le dépôt Git avant d'exécuter le
build Vite.

## Scripts de déploiement

Les scripts distinguent explicitement la production et la preview :

```bash
npm run build:cloudflare
```

Exécute `scripts/prepare-cloudflare-git.mjs` puis `npm run build`. Cette commande
est prévue pour Workers Builds afin que le calcul de version logicielle dispose
des derniers tags SemVer sans préfixe et d'un historique Git suffisant pour
résoudre le dernier tag atteignable.

```bash
npm run deploy:production
```

Synchronise les tags Git, build le site puis exécute `wrangler deploy`. Cette
commande crée une nouvelle version du Worker et la promeut comme déploiement
actif. Elle impacte donc `fohryu.com`.

Elle peut être lancée depuis une branche lorsqu'un besoin exceptionnel l'exige :
démonstration, validation ou test particulier. Cet usage doit rester explicite,
car il publie en production le contenu de la branche courante.

```bash
npm run deploy:preview
```

Synchronise les tags Git, build le site puis exécute `wrangler versions upload`.
Cette commande crée une version du Worker et retourne une URL de preview si les
Preview URLs sont activées. Elle ne promeut pas cette version en production.

Les scripts internes ci-dessous exécutent uniquement l'étape Wrangler :

- `npm run cf:deploy:production` : `wrangler deploy` ;
- `npm run cf:deploy:preview` : `wrangler versions upload`.

Ils sont prévus pour Workers Builds, qui peut exécuter
`npm run build:cloudflare` comme commande de build séparée avant la commande de
déploiement.

## Séparation production et previews

La solution cible reste native Cloudflare Workers et repose sur un seul Worker :

- production : version promue du Worker `fohryu-website`, servie par le Custom
  Domain `fohryu.com` ;
- previews : versions non promues du même Worker, exposées par Workers Preview
  URLs sur `*.workers.dev` ;
- automatisation : Workers Builds connecté au dépôt GitHub.

Cette approche évite de créer un second Worker, un sous-domaine de preview custom,
une route Cloudflare supplémentaire ou une surcouche GitHub Actions tant que le
besoin reste de prévisualiser les branches.

## Déploiements automatiques avec Workers Builds

Le workflow cible utilise Workers Builds comme CI/CD natif Cloudflare. Une fois le
dépôt connecté au Worker, Cloudflare écoute les pushs GitHub et exécute une
commande de build suivie d'une commande de déploiement.

| Cible | Déclencheur | Build | Déploiement | Résultat |
| --- | --- | --- | --- | --- |
| Production | Merge de PR ou commit éditorial direct sur `main` | `npm run build:cloudflare` | `npm run cf:deploy:production` | `wrangler deploy` promeut la version servie sur `fohryu.com`. |
| Preview | Push sur branche non-production, si activé | `npm run build:cloudflare` | `npm run cf:deploy:preview` | `wrangler versions upload` crée une Preview URL sans promotion. |

Si le commit appartient à une PR, l'intégration GitHub de Cloudflare peut publier
un commentaire contenant les URLs de preview.

Avantages :

- le déploiement de production devient automatique à chaque évolution de `main` ;
- les modifications éditoriales directes sur `main` sont publiées sans workflow
  de release logiciel ;
- les previews de branche utilisent le même Worker et la même configuration que
  la production, sans nouveau domaine ni Worker parallèle ;
- les commandes restent proches du workflow manuel Wrangler existant ;
- les accès Cloudflare de déploiement restent centralisés dans Workers Builds.

Limites et points de vigilance :

- la configuration Workers Builds vit dans Cloudflare, pas dans le dépôt ;
- les previews Workers sont publiques sur `*.workers.dev` tant qu'aucune
  protection Cloudflare Access n'est ajoutée ;
- les réglages Workers Builds modifiés dans le dashboard s'appliquent aux builds
  suivants, pas nécessairement aux builds déjà lancés ;
- le tag SemVer sans préfixe posé après un merge sur `main` peut arriver après le
  build automatique déclenché par ce merge. Dans ce cas, la production peut
  afficher la version logicielle précédente avec la nouvelle révision jusqu'au
  prochain build du commit taggé ;
- lorsqu'un tag SemVer sans préfixe doit devenir visible immédiatement après un
  merge, poser le tag sur le commit de `main`, puis relancer un build production
  du même commit ou lancer exceptionnellement `npm run deploy:production` depuis
  `main` après synchronisation des tags ;
- un déploiement manuel de production depuis une branche reste possible pour un
  besoin spécifique, mais il doit rester exceptionnel et assumé.

## Configuration Cloudflare proposée

Ressource concernée :

- Worker : `fohryu-website` ;
- Worker ID observé : `e8351f8ab1c145829d4c8341ee1dc578` ;
- route de production : Custom Domain `fohryu.com` ;
- dépôt source : `fury473/fohryu-website`.

Modifications proposées après review et autorisation explicite :

1. Conserver `workers_dev: false` dans `wrangler.jsonc` pour éviter d'exposer la
   route workers.dev principale comme une seconde URL publique de production.
2. Déclarer `preview_urls: true` dans `wrangler.jsonc` afin que les versions
   uploadées puissent être consultées en preview.
3. Connecter `fohryu-website` à Workers Builds depuis le dashboard Cloudflare.
4. Définir `main` comme branche de production.
5. Définir la commande de build Workers Builds sur `npm run build:cloudflare`.
6. Définir la commande de déploiement de production sur
   `npm run cf:deploy:production`.
7. Activer les builds de branches non-production.
8. Définir la commande de déploiement non-production sur
   `npm run cf:deploy:preview`.

Les deux champs Wrangler sont préparés dans le dépôt, mais ne modifient pas l'état
Cloudflare tant qu'aucun déploiement Wrangler ou Workers Build autorisé
n'applique cette configuration. Les commandes Workers Builds ci-dessus reprennent
les scripts définis dans la section `Scripts de déploiement`.

Justification :

- `wrangler deploy` et `wrangler versions upload` couvrent déjà les deux chemins
  production/preview sans Worker supplémentaire ;
- Workers Builds peut appliquer une commande de déploiement différente pour les
  branches non-production ;
- les commentaires de PR et URLs de branche sont gérés par l'intégration GitHub
  native de Cloudflare Workers.

Impacts attendus :

- les pushes sur `main` pourront produire un build de production si Workers
  Builds est activé, qu'ils viennent d'un merge de PR ou d'un commit éditorial
  direct ;
- les pushes sur les branches non-production pourront produire une URL de preview
  stable par branche et une URL de preview par commit ;
- les previews seront publiques sur `*.workers.dev` sauf protection Cloudflare
  Access ajoutée séparément ;
- aucune nouvelle route custom, variable, secret, KV, D1 ou R2 n'est nécessaire ;
- `fohryu.com` reste servi uniquement par le déploiement de production actif.

Étapes de mise en œuvre après validation :

1. merger la PR ;
2. synchroniser `main` localement avec le commit mergé ;
3. poser sur ce commit le tag Git SemVer réel sans préfixe `v`, par exemple
   `0.3.0` ;
4. pousser ce tag vers GitHub ;
5. ouvrir le dashboard Cloudflare sur le Worker `fohryu-website` ;
6. connecter le dépôt GitHub `fury473/fohryu-website` à Workers Builds ;
7. configurer la branche de production sur `main` ;
8. renseigner les commandes Workers Builds listées ci-dessus ;
9. activer les builds de branches non-production ;
10. déclencher ou relancer un premier build production depuis `main`, après
    synchronisation du tag, afin que la version affichée corresponde au dernier
    tag SemVer publié ;
11. vérifier qu'une PR reçoit bien un commentaire Cloudflare avec une URL de
   preview ;
12. vérifier qu'un push/merge sur `main` met à jour le déploiement actif attendu ;
13. vérifier qu'un commit éditorial direct sur `main` déclenche aussi un
    déploiement de production.

Retour arrière :

1. désactiver les builds de branches non-production dans Workers Builds ;
2. remettre `preview_urls` à `false` dans `wrangler.jsonc` puis redéployer, ou
   désactiver les Preview URLs dans le dashboard ;
3. désactiver ou déconnecter Workers Builds si l'automatisation n'est plus
   souhaitée ;
4. revenir à un déploiement manuel avec `npm run deploy:production` ;
5. utiliser `wrangler rollback` si un déploiement de production doit être annulé.

## Journal des modifications hors dépôt

### 2026-07-19 - Activation Workers Builds et premier déploiement `0.3.0`

- Auteur : Fury via le dashboard Cloudflare ; vérification par Codex via le MCP
  Cloudflare Workers Builds et une requête publique sur `fohryu.com`.
- Ressources concernées : Worker `fohryu-website`
  (`e8351f8ab1c145829d4c8341ee1dc578`), dépôt GitHub
  `fury473/fohryu-website`, Custom Domain `fohryu.com`, Workers Builds, Deploy
  Hook production.
- État avant : la PR #2 était mergée dans `main`, le tag Git `0.3.0` était posé
  sur le merge commit `8d1efba`, mais Workers Builds n'avait encore aucun build
  enregistré pour `fohryu-website`.
- Changements effectués : connexion du dépôt GitHub à Workers Builds,
  configuration de `main` comme branche de production, activation des builds de
  branches non-production, remplacement du token de build hors scope par un token
  dédié à `fohryu-website`, création d'un Deploy Hook production sur `main`, puis
  déclenchement manuel de ce hook. L'URL du Deploy Hook n'est pas stockée dans le
  dépôt, car elle permet de déclencher des builds.
- Configuration observée : build command `npm run build:cloudflare`, deploy
  command `npm run cf:deploy:production`, preview/non-production command
  `npm run cf:deploy:preview`, root directory `/`.
- Résultat : build Workers Builds
  `28940b0e-ad76-431e-9058-aebf94de8b81` terminé avec succès ; `git fetch
  --tags` a récupéré les tags `0.1.0`, `0.2.0` et `0.3.0` ; Wrangler a déployé
  le Worker sur `fohryu.com` avec la version Cloudflare
  `e52ce593-cab7-4ed2-863a-5eb05fcf848a`.
- Vérification publique : `fohryu.com` sert le bundle déployé avec
  `softwareVersion: "v0.3.0"` et `revision: "8d1efba"`.
- Retour arrière : désactiver ou supprimer le Deploy Hook, désactiver les builds
  de branches non-production ou déconnecter Workers Builds si nécessaire, puis
  utiliser `wrangler rollback` ou le dashboard Cloudflare pour revenir à une
  version de production antérieure.

### 2026-07-19 - Déploiement automatique après commit éditorial

- Auteur : Workers Builds déclenché automatiquement par un push direct sur
  `main`.
- Ressources concernées : Worker `fohryu-website`, commit Git
  `1b89e296fc8f91b42de1f3c34951191f03041125`, Workers Builds.
- État avant : le premier déploiement production manuel via Deploy Hook servait
  `softwareVersion: "v0.3.0"` et `revision: "8d1efba"`.
- Changements effectués : le commit éditorial `Document Cloudflare rollout` a été
  poussé directement sur `main`, ce qui a déclenché automatiquement Workers
  Builds. Le build `e86250ae-9904-43f5-8046-1b1d3418dc38` a été annulé après être
  resté bloqué en initialisation pendant l'incident Cloudflare ; le retry
  `31f78b44-e812-4c2b-9199-5b024b34c549` a terminé avec succès et déployé la
  version Cloudflare `f8083adb-9295-44f3-89d4-4e5187bc6d8f`.
- Constat : le déploiement automatique a servi `revision: "1b89e29"` mais
  `softwareVersion: "dev"`. Les logs montraient pourtant que les tags Git avaient
  été récupérés. Le diagnostic retenu est un clone Workers Builds à historique
  réduit : les refs de tags étaient présentes, mais `git describe` ne pouvait pas
  remonter du commit éditorial non taggé jusqu'au tag `0.3.0`.
- Correction prévue : faire approfondir l'historique Git par
  `npm run build:cloudflare` avant le build Vite.
