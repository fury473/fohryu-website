# Architecture de la page d'accueil

Ce document décrit la composition de la page publique `fohryu.com`. Le `README.md`
reste le point d'entrée opérationnel pour installer, lancer, builder et déployer le
site.

## Intention

La page est pensée comme une vitrine d'atelier vivant, pas comme un site corporate
ou un blog complet. Elle doit :

- présenter rapidement l'identité publique Fohryu Works ;
- montrer ce que Fury construit ou explore actuellement ;
- exposer une cartographie lisible des projets ;
- donner accès aux espaces publics, prévus ou protégés ;
- rester statique, simple à maintenir et facile à faire évoluer.

Le site n'embarque pas de CMS, de backend ni de widget tiers. Les contenus affichés
sont déclarés dans des fichiers TypeScript versionnés.

## Pipeline de rendu

Le point d'entrée HTML est `index.html`. Il fournit les métadonnées publiques, le
lien d'évitement, le conteneur `#app`, le fallback `noscript` et charge
`src/main.ts`.

`src/main.ts` ajoute la classe `js` au document, récupère `#app`, puis appelle
`renderApp(root)`.

`vite.config.ts` calcule au build les métadonnées Git publiques injectées dans le
bundle : URL d'historique des commits et date ISO du dernier commit. Si Git ou
`.git` n'est pas disponible dans l'environnement de build, la date injectée vaut
`null` et le rendu affiche un fallback explicite.

`src/render/app.ts` construit l'intégralité de la page en TypeScript avec des
fonctions de rendu. Le DOM initial est remplacé via `root.replaceChildren(...)`.
La modale de l'easter egg est ajoutée au même niveau que le contenu principal afin
de rester indépendante du flux de page.

`src/render/dom.ts` contient les primitives minimales de création DOM :

- `el(...)` pour créer un élément avec classes, texte, attributs et enfants ;
- `append(...)` pour ajouter proprement des noeuds optionnels ;
- `link(...)` pour créer un lien interne ou externe avec les attributs attendus.

## Sources de contenu

Les données éditoriales sont séparées du rendu.

`src/data/site.ts` contient :

- `navLinks` : liens affichés dans la navigation principale ;
- `nowItems` : sujets de travail en cours, en pause ou terminés ;
- `activityItems` : flux d'activité récent, conçu pour accueillir Instagram,
  Journal, YouTube ou GitHub ;
- `principles` : principes éditoriaux et techniques ;
- `spaces` : points d'accès publics, prévus ou protégés.

`src/data/build.ts` expose les métadonnées statiques injectées par Vite. Elles ne
dépendent d'aucun backend et servent uniquement à afficher la date du dernier
commit Git lorsqu'elle est connue.

`src/data/projects.ts` contient :

- les types de statut et de visibilité ;
- les libellés affichés dans les cartes ;
- les notes explicatives associées aux statuts ;
- la liste des projets.

Chaque projet possède un `id`, un `title`, une description courte, une catégorie,
un statut, une visibilité, une liste de liens, un booléen `featured` et un
`sortOrder`. Le `sortOrder` sert à ordonner la cartographie et à générer l'index
visuel discret des cartes, par exemple `P-010`.

## Ordre des sections

`renderApp(...)` assemble la page dans cet ordre :

1. `renderHeader()`
2. `renderHero()`
3. `renderActivity()`
4. `renderNow()`
5. `renderProjects(sortedProjects)`
6. `renderConnections()`
7. `renderPrinciples()`
8. `renderSpaces()`
9. `renderFooter()`
10. `renderFuryOriginModal()`

Les sections du `main` partagent le helper `renderSection(...)`, qui impose une
structure commune : `section`, conteneur `.section__inner`, titre court en
`.eyebrow`, puis titre descriptif en `h2`.

## Sections principales

### Entête

L'entête est volontairement compact et sticky. Il contient :

- le lien de marque `Fohryu Works` vers le haut de page ;
- les liens de navigation déclarés dans `navLinks` ;
- un lien GitHub externe.

Les entrées privées ou non finalisées ne sont pas exposées dans ce menu.

### Hero

Le hero pose l'identité : atelier public, phrase principale, introduction, appels
à l'action et citation. La carte visuelle est rendue comme une surface de travail :

- barre décorative `Workbench map / FW-01` ;
- image `/atelier-map.svg` ;
- watermark Ryūko en surimpression discrète ;
- mention `Atelier vivant` ;
- légende `Une carte de travail, pas un plan figé.`

L'objectif est de donner une première impression plus incarnée sans faire basculer
la palette générale vers le rose de l'asset Ryūko.

### Récemment

La section `Récemment` est un flux d'activité natif au site. Elle n'utilise pas le
widget officiel Instagram. Chaque entrée est une carte éditoriale issue de
`activityItems`, avec source, date, titre, extrait et lien externe.

La structure est prévue pour évoluer vers un flux plus large : publications
Instagram, entrées Journal, vidéos YouTube, commits ou sorties GitHub.

### Maintenant

La section `Maintenant` répond à la question : qu'est-ce qui est en cours ? Elle
affiche les entrées de `nowItems` dans un panneau unique afin de rester synthétique
et plus temporelle que la cartographie des projets. Chaque entrée représente un
sujet de travail et porte un `status` maintenu dans `src/data/site.ts` :
`active`, `paused` ou `completed`. Le rendu génère automatiquement le libellé et
la classe visuelle associée ; ajouter ou déplacer un sujet ne demande donc pas de
modifier `src/render/` ou `src/styles/`. Les sujets actifs utilisent l'état le
plus visible, avec une bordure animée lorsque les préférences de mouvement le
permettent ; les sujets en pause et terminés gardent des couleurs distinctes plus
discrètes.

### Projets

La section Projets est découpée en deux groupes :

- `À la une` : projets dont `featured` vaut `true` ;
- `Cartographie` : tous les projets, triés par `sortOrder`.

Les cartes affichent le statut, la visibilité, le titre, la catégorie, la
description courte, une note de statut et les liens disponibles. L'index `P-xxx`
est décoratif et sert de repère visuel discret, sans être lu par les technologies
d'assistance.

### Relations

`Comment tout est relié` décrit la logique de transformation entre exploration,
journal, vidéo, outil et produit. Cette section explique le modèle mental de
Fohryu Works : les projets ne sont pas isolés, ils se nourrissent les uns les
autres.

### Principes

Les principes définissent les contraintes de design et de production : priorité à
l'expérience, documentation du chemin, réutilisation de la matière source et usage
supervisé de l'IA.

### Espaces

La section Espaces liste les points d'accès :

- publics ;
- prévus ;
- protégés.

Le Hub est affiché comme protégé. Les espaces non disponibles publiquement sont
marqués comme prévus plutôt que présentés comme accessibles.

### Footer

Le footer reprend la marque, la mention de site expérimental et quelques liens
externes. Le watermark Ryūko y sert de signature visuelle plus visible que dans le
hero, tout en restant secondaire par rapport au contenu. Il affiche aussi une
mention `Dernière modification` calculée depuis le dernier commit Git disponible
au build. La date et l'heure sont directement liées à l'historique public des
commits. Si les métadonnées Git ne sont pas disponibles, le footer garde un
fallback explicite lié au même historique.

## Easter egg Fury

L'easter egg peut être déclenché de deux manières :

- au clavier, par le Konami Code ;
- sur mobile ou à la souris, par 7 activations rapides de la signature Ryūko du
  footer.

Le Konami Code attendu est :

```text
↑ ↑ ↓ ↓ ← → ← → B A
```

Le mécanisme est géré par `setupFuryOriginEasterEgg()` :

- un index suit la progression dans `KONAMI_SEQUENCE` ;
- les touches alphabétiques sont normalisées en minuscules ;
- une mauvaise touche remet la séquence à zéro, sauf si elle correspond au début
  de la séquence ;
- le déclencheur tactile compte les activations de la signature Ryūko et remet la
  séquence à zéro après un court délai ;
- lorsque l'une des séquences est complète, la modale `#fury-origin-modal`
  s'ouvre.

La modale contient l'image
`/ryuuko/exports/origin-of-fury-card-900x957.png`. L'image garde son ratio, n'est
pas recadrée et peut défiler verticalement sur petits écrans.

## Accessibilité

Les principaux choix d'accessibilité sont :

- structure sémantique avec `header`, `main`, `section`, `article`, `figure`,
  `figcaption`, `footer` ;
- lien d'évitement vers `#contenu` ;
- textes injectés via `textContent`, pas via HTML brut ;
- liens externes ouverts avec `target="_blank"` et `rel="noreferrer"` ;
- états de focus visibles ;
- animation de bordure de l'état actif limitée par `prefers-reduced-motion` ;
- modale avec `role="dialog"`, `aria-modal`, titre et description associés ;
- texte complet de l'easter egg disponible en `.sr-only`, sans dupliquer la
  lecture de l'image ;
- déclencheur mobile exposé comme bouton discret autour de la signature Ryūko du
  footer ;
- bouton de fermeture indépendant de l'image ;
- fermeture par Échap et clic hors panneau ;
- focus replacé sur l'élément précédemment actif après fermeture ;
- piège de focus dans la modale ;
- blocage du scroll de la page avec `body.modal-open`.

Les images décoratives utilisent `alt=""` et `aria-hidden="true"` lorsque
nécessaire. L'illustration principale de l'easter egg conserve un `alt` bref et ne
répète pas le texte déjà disponible dans la description masquée.

## Système visuel

Le système visuel est centralisé dans `src/styles/main.css`.

Les tokens CSS sont déclarés dans `:root` :

- fonds sombres : `--bg`, `--bg-2` ;
- surfaces : `--surface`, `--surface-2`, `--surface-3` ;
- bordures : `--line`, `--line-strong`, `--line-warm` ;
- texte : `--text`, `--muted`, `--soft` ;
- accents : `--accent`, `--accent-2`, `--signal` ;
- états : `--usable`, `--planned`, `--paused`, `--completed` ;
- dimensions partagées : `--radius`, `--max-width`, `--shadow`.

Le fond de page combine une grille très légère et des halos chauds. Les sections
ajoutent des nappes visuelles sobres via pseudo-éléments, mais les cartes gardent
des bordures et surfaces distinctes pour préserver la lisibilité.

La palette doit rester sombre, chaude et technique. Les tons roses de Ryūko sont
utilisés comme signature ponctuelle, pas comme couleur dominante du site.

## Responsive

La mise en page s'appuie sur des grilles fluides et des contraintes de largeur :

- `.section__inner` limite la largeur globale ;
- le hero passe de deux colonnes à une colonne selon la largeur disponible ;
- les grilles de cartes utilisent `auto-fit` et `minmax(...)` ;
- la modale de l'easter egg limite l'image sur desktop, puis autorise le scroll
  vertical sur mobile pour préserver la lisibilité du texte intégré à l'image.

Les animations de révélation reposent sur `IntersectionObserver` et la classe
`.reveal`. Si l'API n'est pas disponible, les éléments sont affichés directement.
`prefers-reduced-motion` réduit les transitions et animations.

## Ajouter du contenu

Pour ajouter une activité récente :

1. Ajouter une entrée dans `activityItems`.
2. Choisir une source parmi les valeurs prévues par `ActivityItem`.
3. Renseigner une date machine `datetime` et une date lisible `dateLabel`.
4. Garder l'extrait court pour que la carte reste scannable.

Pour ajouter ou modifier un sujet `Maintenant` :

1. Mettre à jour une entrée dans `nowItems`.
2. Utiliser un `id` stable, exposé comme ancre `#now-{id}`.
3. Choisir `status` parmi `active`, `paused` ou `completed`.
4. Garder la description courte pour conserver le rôle de synthèse de la section.

Pour ajouter un projet :

1. Ajouter une entrée dans `projects`.
2. Choisir un `id` stable, utilisé comme ancre `#project-{id}`.
3. Définir `status`, `visibility`, `featured` et `sortOrder`.
4. Ajouter les liens publics uniquement lorsqu'ils sont prêts.

Pour ajouter un espace :

1. Ajouter une entrée dans `spaces`.
2. Utiliser `public`, `planned` ou `protected`.
3. Ne renseigner `url` que si le point d'accès doit réellement être cliquable.

## Points d'attention

- Ne pas dupliquer du contenu entre `site.ts` et `projects.ts` sans intention
  claire : `site.ts` décrit les sections éditoriales, `projects.ts` décrit la
  cartographie projet.
- Ne pas intégrer de widget social officiel tant que l'objectif reste un flux
  natif et maîtrisé.
- Ne pas exposer dans la navigation principale des espaces privés ou non prêts.
- Garder les assets sources lourds hors de `public/`; `public/` doit contenir les
  exports réellement servis par le site.
- Préserver la séparation entre contenu, rendu et styles pour faciliter les
  futures évolutions.
