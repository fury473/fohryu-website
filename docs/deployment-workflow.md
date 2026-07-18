# Workflow Git, versioning et déploiement

Ce document décrit le workflow de contribution et de déploiement du site statique
`fohryu.com`. Il complète le `README.md`, qui reste le point d'entrée pour les
commandes courantes.

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

Les changements purement éditoriaux restent versionnés par Git, mais ne doivent
pas déclencher à eux seuls une nouvelle version SemVer.

La version affichée par le site est calculée au build depuis le tag SemVer exact
du commit courant. Tant que le commit buildé n'est pas taggé, le site affiche le
short SHA du commit.

## Scripts de déploiement

Les scripts distinguent explicitement la production et la preview :

```bash
npm run deploy:production
```

Build le site puis exécute `wrangler deploy`. Cette commande crée une nouvelle
version du Worker et la promeut comme déploiement actif. Elle impacte donc
`fohryu.com`.

```bash
npm run deploy:preview
```

Build le site puis exécute `wrangler versions upload`. Cette commande crée une
version du Worker et retourne une URL de preview si les Preview URLs sont
activées. Elle ne promeut pas cette version en production.

Les scripts internes ci-dessous exécutent uniquement l'étape Wrangler :

- `npm run cf:deploy:production` : `wrangler deploy` ;
- `npm run cf:deploy:preview` : `wrangler versions upload`.

Ils sont prévus pour Workers Builds, qui peut exécuter `npm run build` comme
commande de build séparée avant la commande de déploiement.

## Séparation production et previews

La solution cible reste native Cloudflare Workers :

- production : Worker `fohryu-website`, route Custom Domain `fohryu.com`,
  promotion via `wrangler deploy` ;
- previews : versions non promues du même Worker, exposées via Workers Preview
  URLs sur `*.workers.dev`, produites via `wrangler versions upload` ;
- automatisation proposée : Workers Builds connecté au dépôt GitHub.

Cette approche évite de créer un second Worker, un sous-domaine de preview custom,
une route Cloudflare supplémentaire ou une surcouche GitHub Actions tant que le
besoin reste de prévisualiser les branches.

## Configuration Cloudflare proposée

Ressource concernée :

- Worker : `fohryu-website` ;
- Worker ID observé : `e8351f8ab1c145829d4c8341ee1dc578` ;
- route de production : Custom Domain `fohryu.com` ;
- dépôt source : `fury473/fohryu-website`.

Modifications proposées :

1. Conserver `workers_dev: false` dans `wrangler.jsonc` pour éviter d'exposer la
   route workers.dev principale comme une seconde URL publique de production.
2. Déclarer `preview_urls: true` dans `wrangler.jsonc` afin que les versions
   uploadées puissent être consultées en preview.
3. Connecter `fohryu-website` à Workers Builds depuis le dashboard Cloudflare.
4. Définir `main` comme branche de production.
5. Définir la commande de build Workers Builds sur `npm run build`.
6. Définir la commande de déploiement de production sur
   `npm run cf:deploy:production`.
7. Activer les builds de branches non-production.
8. Définir la commande de déploiement non-production sur
   `npm run cf:deploy:preview`.

Les deux champs `workers_dev` et `preview_urls` sont préparés dans le dépôt, mais
ne modifient pas l'état Cloudflare tant qu'aucun déploiement Wrangler ou Workers
Build autorisé n'applique cette configuration.

Justification :

- `wrangler deploy` est la commande qui promeut une version en production ;
- `wrangler versions upload` crée une version et une URL de preview sans modifier
  le déploiement actif ;
- Workers Builds sait remplacer la commande de déploiement par une commande de
  preview pour les branches non-production ;
- les commentaires de PR et URLs de branche sont gérés nativement par
  l'intégration GitHub de Cloudflare Workers.

Impacts attendus :

- les pushes sur `main` pourront produire un build de production si Workers
  Builds est activé ;
- les pushes sur les branches non-production pourront produire une URL de preview
  stable par branche et une URL de preview par commit ;
- les previews seront publiques sur `*.workers.dev` sauf protection Cloudflare
  Access ajoutée séparément ;
- aucune nouvelle route custom, variable, secret, KV, D1 ou R2 n'est nécessaire ;
- `fohryu.com` reste servi uniquement par le déploiement de production actif.

Étapes de mise en œuvre après validation :

1. merger la PR ;
2. ouvrir le dashboard Cloudflare sur le Worker `fohryu-website` ;
3. connecter le dépôt GitHub `fury473/fohryu-website` à Workers Builds ;
4. configurer la branche de production sur `main` ;
5. renseigner les commandes Workers Builds listées ci-dessus ;
6. activer les builds de branches non-production ;
7. vérifier qu'une PR reçoit bien un commentaire Cloudflare avec une URL de
   preview ;
8. vérifier qu'un push/merge sur `main` met à jour le déploiement actif attendu.

Retour arrière :

1. désactiver les builds de branches non-production dans Workers Builds ;
2. remettre `preview_urls` à `false` dans `wrangler.jsonc` puis redéployer, ou
   désactiver les Preview URLs dans le dashboard ;
3. désactiver ou déconnecter Workers Builds si l'automatisation n'est plus
   souhaitée ;
4. revenir à un déploiement manuel avec `npm run deploy:production` ;
5. utiliser `wrangler rollback` si un déploiement de production doit être annulé.

## Journal des modifications hors dépôt

Aucune modification hors dépôt n'a été effectuée pour cette PR.

Lorsqu'une modification Cloudflare est autorisée et réalisée, documenter ici :

- date et auteur de l'opération ;
- ressource concernée ;
- état avant ;
- changement effectué ;
- état après ;
- commande ou écran utilisé ;
- méthode de retour arrière.
