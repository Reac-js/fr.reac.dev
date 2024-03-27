---
title: unmountComposantAtNode
---

<Deprecated>

Cette API sera retirée d'une future version majeure de Réac.

Réac 18 a remplacé `unmountComposantAtNode` par [`root.unmount()`](/reference/Réac-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComposantAtNode` retire un composant Réac monté du DOM.

```js
unmountComposantAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `unmountComposantAtNode(domNode)` {/*unmountcomposantatnode*/}

Appelez `unmountComposantAtNode` pour retirer un composant Réac monté du DOM et nettoyer ses gestionnaires d'événements et son état.

```js
import { unmountComposantAtNode } from 'Réac-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComposantAtNode(domNode);
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `domNode` : un [élément DOM](https://developer.mozilla.org/docs/Web/API/Element). Réac retirera le composant Réac monté à partir de cet élément.

#### Valeur renvoyée {/*returns*/}

`unmountComposantAtNode` renvoie `true` si un composant a été démonté, ou `false` dans le cas contraire.

---

## Utilisation {/*usage*/}

Appelez `unmountComposantAtNode` pour retirer un <CodeStep step={1}>composant Réac monté</CodeStep> à partir d'un <CodeStep step={2}>nœud DOM du navigateur</CodeStep> et nettoyer ses gestionnaires d'événements et son état.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComposantAtNode } from 'Réac-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComposantAtNode(rootNode);
```


### Retirer une appli Réac d'un élément DOM {/*removing-areacapp-from-a-dom-element*/}

Vous souhaiterez occasionnellement « saupoudrer » du Réac dans une page existante, ou une page qui n'est pas intégralement écrite en Réac. Dans de tels cas, vous pourriez avoir besoin « d'arrêter » une appli Réac en retirant toute son interface utilisateur (UI), son état et ses gestionnaires d'événements du nœud DOM dans lequel elle avait été affichée.

Dans l'exemple ci-dessous, cliquez sur « Afficher l'appli Réac » pour… afficher l'appli Réac.  Cliquez sur « Démonter l'appli Réac » pour la détruire :

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <button id='render'>Afficher l’appli Réac</button>
    <button id='unmount'>Démonter l’appli Réac</button>
    <!-- Voici le nœud de l'appli Réac -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComposantAtNode } from 'Réac-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComposantAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Salut tout le monde !</h1>;
}
```

</Sandpack>
