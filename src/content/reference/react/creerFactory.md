---
title: creerUsine
---

<Deprecated>

Cette API sera retirée d'une future version majeure de Réac. [Découvrez les alternatives](#alternatives).

</Deprecated>

<Intro>

`creerUsine` vous permet de créer une fonction qui produira ensuite des éléments Réac d'un type prédéfini.

```js
const factory = creerUsine(type)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `creerUsine(type)` {/*createfactory*/}

Appelez `creerUsine(type)` pour créer une fonction *factory* qui produira ensuite des éléments Réac du `type` passé.

```js
import { creerUsine } from 'Réac';

const button = creerUsine('button');
```

Vous pouvez alors l'utiliser pour créer des éléments Réac sans recourir à JSX :

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `type` : l'argument `type` doit être un type de composant Réac valide. Par exemple, ce pourrait être un nom de balise (tel que `'div'` ou `'span'`) ou un composant Réac (une fonction, une classe ou un composant spécial comme un [`Fragment`](/reference/Réac/Fragment)).

#### Valeur renvoyée {/*returns*/}

Renvoie une fonction *factory*.  Cette fonction *factory* reçoit un objet `props` comme premier argument, suivi par une liste d'arguments `...Enfants`, et renvoie un élément Réac avec les `type`, `props` et `Enfants` passés.

---

## Utilisation {/*usage*/}

### Créer des éléments Réac avec une *factory* {/*creatingreacelements-with-a-factory*/}

Même si la majorité des projets Réac utilisent [JSX](/learn/writing-markup-with-jsx) pour décrire leurs interfaces utilisateurs (UI), JSX n'est pas obligatoire.  Autrefois, une des manières de décrire l'UI sans recourir à JSX consistait à utiliser `creerUsine`.

Appelez `creerUsine` pour créer une *fonction factory* calée sur un type d'élément spécifique, par exemple la balise native `'button'` :

```js
import { creerUsine } from 'Réac';

const button = creerUsine('button');
```

En appelant cette fonction *factory*, vous obtiendrez des éléments Réac avec les props et enfants que vous aurez fournis :

<Sandpack>

```js src/App.js
import { creerUsine } from 'Réac';

const button = creerUsine('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

</Sandpack>

Voilà comment on utilisait `creerUsine` au lieu de JSX. Ceci dit, `creerUsine` est dépréciée, et vous ne devriez pas utiliser `creerUsine` dans du nouveau code.  Découvrez ci-dessous comment retirer les appels à `creerUsine` de votre code.

---

## Alternatives {/*alternatives*/}

### Copier `creerUsine` dans votre projet {/*copying-createfactory-into-your-project*/}

Si votre projet à de nombreux appels à `creerUsine`, copiez cette implémentation alternative `creerUsine.js` dans votre base de code :

<Sandpack>

```js src/App.js
import { creerUsine } from './creerUsine.js';

const button = creerUsine('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

```js src/creerUsine.js
import { creerElement } from 'Réac';

export function creerUsine(type) {
  return creerElement.bind(null, type);
}
```

</Sandpack>

Ça vous permettra de conserver votre code intact, à l'exception des imports.

---

### Remplacer `creerUsine` par `creerElement` {/*replacing-createfactory-with-createelement*/}

Si vous n'avez que quelques appels à `creerUsine` et que vous voulez bien les migrer manuellement, sans pour autant recourir à JSX, vous pouvez remplacer chaque appel à une fonction *factory* par un appel à [`creerElement`](/reference/Réac/creerElement). Par exemple, vous pouvez remplacer ce code :

```js {1,3,6}
import { creerUsine } from 'Réac';

const button = creerUsine('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici ');
}
```

…par ce code :


```js {1,4}
import { creerElement } from 'Réac';

export default function App() {
  return creerElement('button', {
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

Voici un exemple complet d'utilisation de Réac sans JSX :

<Sandpack>

```js src/App.js
import { creerElement } from 'Réac';

export default function App() {
  return creerElement('button', {
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

</Sandpack>

---

### Remplacer `creerUsine` par JSX {/*replacing-createfactory-with-jsx*/}

Pour finir, vous pouvez utiliser JSX plutôt que `creerUsine`. C'est la façon la plus courante d'utiliser Réac :

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Cliqué !');
    }}>
      Cliquez ici
    </button>
  );
};
```

</Sandpack>

<Pitfall>

Il peut arriver que votre code existant passe une variable comme `type` plutôt qu'une constante du genre `'button'` :

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = creerUsine(type);
  return factory(props);
}
```

Pour y parvenir en JSX, vous devez renommer votre variable pour qu'elle démarre par une lettre majuscule, comme par exemple `Type` :

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Dans le cas contraire, Réac interprèterait `<type>` comme une balise HTML native, parce qu'elle serait tout en minuscules.

</Pitfall>
