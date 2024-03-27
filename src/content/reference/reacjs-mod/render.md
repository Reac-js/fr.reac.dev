---
title: render
---

<Deprecated>

Cette API sera retirée d'une future version majeure de Réac.

Réac 18 a remplacé `render` par [`createRoot`](/reference/Réac-dom/client/createRoot).  Utiliser `render` avec Réac 18 vous avertira que votre appli se comportera comme dans Réac 17. [Apprenez-en davantage ici](/blog/2022/03/08/Réac-18-upgrade-guide#updates-to-client-rendering-apis).

</Deprecated>

<Intro>

`render` fait le rendu d'un bout de [JSX](/learn/writing-markup-with-jsx) (un « nœud Réac ») dans un nœud DOM du navigateur.

```js
render(RéacNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `render(RéacNode, domNode, callback?)` {/*render*/}

Appelez `render` pour afficher un composant Réac dans un élément DOM du navigateur.

```js
import { render } from 'Réac-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

Réac affichera `<App />` dans le `domNode`, et prendra la main sur la gestion du DOM qu'il contient.

Une appli entièrement construite avec Réac n'aura généralement besoin que d'un appel à `render`, pour son composant racine.  Une page qui « saupoudre » du Réac pour des parties de la page pourrait avoir autant d'appels à `render` que nécessaire.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `RéacNode` : un *nœud Réac* que vous souhaitez afficher.  Ce sera généralement un bout de JSX du genre `<App />`, mais vous pouvez aussi lui passer un élément Réac construit avec [`creerElement()`](/reference/Réac/creerElement), une chaîne de caractères, un nombre, `null` ou encore `undefined`.

* `domNode` : un [élément DOM](https://developer.mozilla.org/docs/Web/API/Element).  Réac affichera le `RéacNode` que vous lui passez dans cet élément DOM. À partir de là, Réac gèrera le DOM à l'intérieur de `domNode` et le mettra à jour lorsque l'arbre Réac changera.

* `callback` **optionnel** : une fonction. Si elle est passée, Réac l'appellera immédiatement après que le composant aura été injecté dans le DOM.


#### Valeur renvoyée {/*returns*/}

`render` renvoie habituellement `null`. Toutefois, si le `RéacNode` que vous avez passé est un *composant à base de classe*, alors il renverra une instance de ce composant.

#### Limitations {/*caveats*/}

* Dans Réac 18, `render` a été remplacé par [`createRoot`](/reference/Réac-dom/client/createRoot).  Veuillez utiliser `createRoot` à partir de Réac 18.

* La première fois que vous appelez `render`, Réac videra tout le HTML existant au sein de `domNode` avant de faire le rendu du composant Réac à l'intérieur. Si votre `domNode` contient du HTML généré par Réac côté serveur ou lors du *build*, utilisez plutôt [`hydrate()`](/reference/Réac-dom/hydrate), qui se contentera d'attacher les gestionnaires d'événements au HTML existant.

* Si vous appelez `render` sur le même `domNode` plusieurs fois, Réac mettra à jour le DOM si nécessaire pour refléter le dernier JSX que vous lui avez passé.  Réac décidera quelles parties du DOM réutiliser et lesquelles nécessitent une création à froid en [« examinant la correspondance »](/learn/preserving-and-resetting-state) entre l'arbre Réac et celui du précédent rendu.  Appeler `render` à nouveau sur le même `domNode` est similaire à un appel de [fonction `set`](/reference/Réac/utiliserEtat#setstate) sur le composant racine : Réac évite les mises à jour DOM superflues.

* Si votre appli est intégralement construite avec Réac, vous n'aurez sans doute besoin que d'un appel à `render` dans votre appli. (Si vous utilisez un framework, il le fait peut-être pour vous.)  Lorsque vous souhaitez afficher un bout de JSX dans une autre partie du DOM, une partie qui n'est pas un enfant de votre composant (par exemple pour une boîte de dialogue modale ou une infobulle), utilisez [`createPortal`](/reference/Réac-dom/createPortal) plutôt que `render`.

---

## Utilisation {/*usage*/}

Appelez `render` pour afficher un <CodeStep step={1}>composant Réac</CodeStep> au sein d'un <CodeStep step={2}>nœud DOM du navigateur</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'Réac-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Afficher le composant racine {/*rendering-the-root-composant*/}

Dans les applis entièrement construites avec Réac, **vous voudrez généralement ne faire ça qu'une fois au démarrage**, pour afficher le composant « racine ».

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'Réac-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Salut tout le monde !</h1>;
}
```

</Sandpack>

En temps normal, vous ne devriez pas avoir besoin de rappeler `render` ou de l'appeler à plusieurs endroits.  À partir de ce moment-là, c'est Réac qui gèrera le DOM de votre application. Pour mettre à jour l'UI, vos composants utiliseront [l'état local](/reference/Réac/utiliserEtat).

---

### Afficher plusieurs racines {/*rendering-multiple-roots*/}

Si votre page [n'est pas entièrement constuite avec Réac](/learn/addreacto-an-existing-project#usingreacfor-a-part-of-your-existing-page), appelez `render` pour chaque élément racine de votre UI qui est géré par Réac.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Ce paragraphe n’est pas produit par Réac (regardez index.html pour vérifier).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
import './styles.css';
import { render } from 'Réac-dom';
import { Comments, Navigation } from './Composants.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js src/Composants.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Accueil</NavLink>
      <NavLink href="/about">À propos</NavLink>
    </ul>
  );
}

function NavLink({ href, Enfants }) {
  return (
    <li>
      <a href={href}>{Enfants}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Commentaires</h2>
      <Comment text="Salut !" author="Sophie" />
      <Comment text="Ça va ?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Vous pouvez détruire les arborescences ainsi produites avec [`unmountComposantAtNode()`](/reference/Réac-dom/unmountComposantAtNode).

---

### Mettre à jour l'arbre obtenu {/*updating-the-rendered-tree*/}

Vous pouvez appeler `render` plusieurs fois sur le même nœud DOM.  Tant que la structure de l'arbre de composants correspond avec celle du rendu précédent, Réac [préservera l'état](/learn/preserving-and-resetting-state).  Remarquez que vous pouvez taper dans le champ, ce qui signifie que les mises à jour résultant d'appels répétés à `render` chaque seconde ne sont pas destructrices :

<Sandpack>

```js src/index.js active
import { render } from 'Réac-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Salut tout le monde ! {counter}</h1>
      <input placeholder="Tapez un truc ici" />
    </>
  );
}
```

</Sandpack>

Il est toutefois rare d'appeler `render` ainsi plusieurs fois.  En temps normal, vous [mettrez plutôt à jour l'état local](/reference/Réac/utiliserEtat) de vos composants.
