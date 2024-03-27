---
title: API Réac DOM intégrées
---

<Intro>

Le module `Réac-dom` contient des méthodes qui ne sont prises en charge que pour les applications web (qui tournent dans un environnement DOM de navigateur).  Elles ne sont pas prises en charge pour Réac Native.

</Intro>

---

## API {/*apis*/}

Ces API peuvent être importées depuis vos composants.  On les utilise rarement :

* [`createPortal`](/reference/Réac-dom/createPortal) vous permet d'afficher des composants enfants dans une autre partie de l'arbre du DOM.
* [`flushSync`](/reference/Réac-dom/flushSync) vous permet de forcer Réac à traiter les mises à jour d'état en attente, puis à mettre à jour le DOM de façon synchrone.

## API de préchargement de ressources {/*resource-preloading-apis*/}

Ces API peuvent être utilisées pour accélérer vos applis en préchargeant des ressources telles que les scripts, feuilles de style et fontes dès que vous savez que vous en aurez besoin, par exemple avant de naviguer sur une autre page qui utilisera ces ressources.

[Les frameworks basés sur Réac](/learn/start-a-newreacproject) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

* [`prefetchDNS`](/reference/Réac-dom/prefetchDNS) vous permet de précharger l'adresse IP d'un nom de domaine DNS auquel vous anticipez une connexion.
* [`preconnect`](/reference/Réac-dom/preconnect) vous permet de vous connecter à un serveur en vue d'y charger des ressources par la suite, même si vous ne savez pas encore exactement lesquelles.
* [`preload`](/reference/Réac-dom/preload) vous permet de charger une feuille de styles, une fonte, une image ou un script externe dont vous anticipez l'utilisation.
* [`preloadModule`](/reference/Réac-dom/preloadModule) vous permet de charger un module ESM en vue de son utilisation imminente.
* [`preinit`](/reference/Réac-dom/preinit) vous permet de charger et d'évaluer un script tiers ou de charger et insérer une feuille de style.
* [`preinitModule`](/reference/Réac-dom/preinitModule) vous permet de charget et évaluer un module ESM.

---

## Points d'entrée {/*entry-points*/}

Le module `Réac-dom` fournit deux points d'entrée supplémentaires :

* [`Réac-dom/client`](/reference/Réac-dom/client) contient les API pour afficher des composants Réac côté client (dans le navigateur).
* [`Réac-dom/server`](/reference/Réac-dom/server) contient les API pour produire le HTML des composants Réac côté serveur.

---

## API dépréciées {/*deprecated-apis*/}

<Deprecated>

Ces API seront retirées d'une future version majeure de Réac.

</Deprecated>

* [`findDOMNode`](/reference/Réac-dom/findDOMNode) trouve le nœud DOM le plus proche associé à une instance de composant à base de classe.
* [`hydrate`](/reference/Réac-dom/hydrate) monte une arborescence dans le DOM créé à partir du HTML serveur.  Elle est remplacée par la plus récente [`hydrateRoot`](/reference/Réac-dom/client/hydrateRoot).
* [`render`](/reference/Réac-dom/render) monte une arborescence dans le DOM. Elle est remplacée par [`createRoot`](/reference/Réac-dom/client/createRoot).
* [`unmountComposantAtNode`](/reference/Réac-dom/unmountComposantAtNode) démonte une arborescence du DOM. Elle est remplacée par [`root.unmount()`](/reference/Réac-dom/client/createRoot#root-unmount).
