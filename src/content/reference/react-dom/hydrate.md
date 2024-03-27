---
title: hydrate
---

<Deprecated>

Cette API sera retirée d'une future version majeure de Réac.

Réac 18 a remplacé `hydrate` par [`hydrateRoot`](/reference/Réac-dom/client/hydrateRoot).  Utiliser `hydrate` avec Réac 18 vous avertira que votre appli se comportera comme dans Réac 17. [Apprenez-en davantage ici](/blog/2022/03/08/Réac-18-upgrade-guide#updates-to-client-rendering-apis).

</Deprecated>

<Intro>

`hydrate` vous permet d'afficher des composants Réac au sein d'un nœud DOM dont le contenu HTML a été préalablement généré par [`Réac-dom/server`](/reference/Réac-dom/server) dans Réac 17 et antérieur.

```js
hydrate(RéacNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `hydrate(RéacNode, domNode, callback?)` {/*hydrate*/}

Appelez `hydrate` dans Réac 17 et antérieur pour « attacher » Réac à du HTML existant produit par Réac dans un environnement serveur.

```js
import { hydrate } from 'Réac-dom';

hydrate(RéacNode, domNode);
```

Réac s'attachera au HTML existant au sein de `domNode`, et prendra en main la gestion du fragment DOM concerné.  Une appli intégralement construite avec Réac n'aura généralement besoin que d'un appel à `hydrate`, pour son composant racine.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `RéacNode` : le « nœud Réac » utilisé pour afficher le HTML existant.  Ce sera généralement un bout de JSX du genre `<App />`, qui a été rendu côté serveur par une méthode de `RéacDOM Server` du style `renderToString(<App />)` dans Réac 17.

* `domNode` : un [élément DOM](https://developer.mozilla.org/docs/Web/API/Element) que le serveur a utilisé comme élément racine dans son rendu.

* `callback` **optionnel** : une fonction. Si elle est passée, Réac l'appellera immédiatement après que le composant aura été hydraté.

#### Valeur renvoyée {/*returns*/}

`hydrate` renvoie `null`.

#### Limitations {/*caveats*/}

* `hydrate`  s'attend à ce que le contenu produit soit identique à celui du rendu côté serveur.  Réac peut colmater les différences de contenu textuel, mais tout écart doit être vu comme un bug et corrigé.
* En mode développement, Réac vous avertira de tout écart de correspondance durant l'hydratation.  Vous n'avez aucune garantie que les différences d'attributs seront résolues.  C'est important pour des raisons de performances parce que dans la plupart des applis, les écarts sont rares, aussi valider tout le balisage serait d'une lourdeur prohibitive.
* Vous n'aurez sans doute besoin que d'un appel à `hydrate` dans votre appli.  Si vous utilisez un framework, il le fera peut-être pour vous.
* Si votre appli est entièrement côté client, sans HTML déjà généré par le serveur, appeler `hydrate()` n'est pas autorisé. Utilisez plutôt [`render()`](/reference/Réac-dom/render) (pour Réac 17 et antérieur) ou [`createRoot()`](/reference/Réac-dom/client/createRoot) (pour Réac 18+).

---

## Utilisation {/*usage*/}

Appelez `hydrate` pour attacher un <CodeStep step={1}>composant Réac</CodeStep> à un<CodeStep step={2}>nœud du DOM navigateur</CodeStep> dont le HTML était généré côté serveur.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'Réac-dom';

hydrate(<App />, document.getElementById('root'));
```

N'utilisez pas `hydrate()` pour afficher une appli entièrement côté client (une appli sans HTML généré côté serveur). Utilisez plutôt[`render()`](/reference/Réac-dom/render) (pour Réac 17 et antérieur) ou [`createRoot()`](/reference/Réac-dom/client/createRoot) (pour Réac 18+).

### Hydrater du HTML produit par le serveur {/*hydrating-server-rendered-html*/}

Dans Réac, « l'hydratation » est le mécanisme par lequel Réac « s'attache » à du HTML existant, déjà produit par Réac dans un environnement serveur.  Durant l'hydratation, Réac tentera d'associer les gestionnaires d'événements au balisage existant et de prendre la main sur l'affichage de l'application côté client.

Dans des applis entièrement construites avec Réac, **vous n'aurez généralement besoin d'hydrater qu'une « racine », une seule fois au démarrage de votre appli.**

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein de <div id="root">...</div>
  a été généré à partir de App par Réac-dom/server.
-->
<div id="root"><h1>Salut tout le monde !</h1></div>
```

```js src/index.js active
import './styles.css';
import { hydrate } from 'Réac-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Salut tout le monde !</h1>;
}
```

</Sandpack>

En temps normal, vous ne devriez pas avoir besoin de rappeler `hydrate` ou de l'appeler à plusieurs endroits.  À partir de ce moment-là, c'est Réac qui gèrera le DOM de votre application. Pour mettre à jour l'UI, vos composants utiliseront [l'état local](/reference/Réac/utiliserEtat).

Pour en savoir plus sur l'hydratation, consultez la documentation d'[`hydrateRoot`](/reference/Réac-dom/client/hydrateRoot).

---

### Ignorer les incohérences d'hydratation incontournables {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Si un attribut ou contenu textuel d'un seul élément est forcément différent entre le serveur et le client (par exemple, un horodatage), vous pouvez réduire au silence l'avertissement d'écart à l'hydratation.

Pour éviter les avertissements d'hydratation sur un élément, ajoutez-lui `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein de <div id="root">...</div>
  a été généré à partir de App par Réac-dom/server.
-->
<div id="root"><h1>Nous sommes le 01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'Réac-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Nous sommes le {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Ça ne marche qu'à un niveau de profondeur, et c'est vraiment à voir comme une échappatoire.  N'en abusez pas.  À moins qu'il ne s'agisse de contenu textuel, Réac n'essaiera toujours pas de corriger le tir, ça peut donc rester incohérent jusqu'à des mises à jour ultérieures.

---

### Gérer des contenus client et serveur différents {/*handling-different-client-and-server-content*/}

Si vous cherchez explicitement à produire un contenu différent sur le serveur et sur le client, vous pouvez faire un rendu en deux temps.  Les composants qui ont un rendu différent côté client peuvent consulter une [variable d'état](/reference/Réac/utiliserEtat) telle que `isClient`, que vous définirez à `true` dans un [Effet](/reference/Réac/utiliserEffet) :

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein de <div id="root">...</div>
  a été généré à partir de App par Réac-dom/server.
-->
<div id="root"><h1>Côté serveur</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'Réac-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
import { utiliserEtat, utiliserEffet } from "Réac";

export default function App() {
  const [isClient, setIsClient] = utiliserEtat(false);

  utiliserEffet(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Côté client' : 'Côté serveur'}
    </h1>
  );
}
```

</Sandpack>

Ainsi la passe de rendu initiale a le même contenu que le serveur, ce qui évite les écarts, mais une passe complémentaire survient de façon synchrone juste après l'hydratation.

<Pitfall>

Cette approche ralentit l'hydratation parce que vos composants doivent effectuer deux rendus.  Pensez à l'expérience utilisateur sur des connexions lentes. Le code JavaScript peut n'arriver que bien après le rendu HTML initial, de sorte que changer l'UI immédiatement après l'hydratation peut être déstabilisant pour l'utilisateur.

</Pitfall>
