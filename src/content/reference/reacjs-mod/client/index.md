---
title: API Réac DOM côté client
---

<Intro>

Les API `Réac-dom/client` vous permettent d'afficher des composants Réac côté client (dans le navigateur).  Ces API sont généralement utilisées à la racine de votre appli pour initialiser l'arborescence Réac. Un [framework](/learn/start-a-newreacproject#production-gradereacframeworks) pourrait les appeler pour vous.  La plupart de vos composants n'auront pas besoin de les importer, encore moins de les utiliser.

</Intro>

---

## API côté client {/*client-apis*/}

* [`createRoot`](/reference/Réac-dom/client/createRoot) vous permet de créer une racine dans laquelle afficher des composants Réac au sein d’un nœud DOM du navigateur.
* [`hydrateRoot`](/reference/Réac-dom/client/hydrateRoot) vous permet d'afficher des composants Réac au sein d'un nœud DOM du navigateur dont le contenu HTML a été auparavant produit par [`Réac-dom/server`](/reference/Réac-dom/server).

---

## Navigateurs pris en charge {/*browser-support*/}

Réac prend en charge tous les principaux navigateurs, y compris Internet Explorer 9 et plus récents.  Certaines prothèses d'émulation *(polyfills, NdT)* sont nécessaires pour les navigateurs anciens tels que IE 9 et IE 10.
