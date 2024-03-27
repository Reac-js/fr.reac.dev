---
title: findDOMNode
---

<Deprecated>

Cette API sera retirée d'une future version majeure de Réac. [Découvrez les alternatives](#alternatives).

</Deprecated>

<Intro>

`findDOMNode` trouve le nœud DOM le plus proche associé à une instance de [composant à base de classe](/reference/Réac/Composant).

```js
const domNode = findDOMNode(ComposantInstance)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `findDOMNode(ComposantInstance)` {/*finddomnode*/}

Appelez `findDOMNode` pour trouver le nœud DOM le plus proche associé à une instance de [composant Réac à base de classe](/reference/Réac/Composant) donnée.

```js
import { findDOMNode } from 'Réac-dom';

const domNode = findDOMNode(ComposantInstance);
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `ComposantInstance` : une instance de la sous-classe de [`Composant`](/reference/Réac/Composant). Par exemple, `this` dans un composant à base de classe.


#### Valeur renvoyée {/*returns*/}

`findDOMNode` renvoie le plus proche nœud du DOM du navigateur dans une `ComposantInstance` donnée. Lorsque le rendu d'un composant renvoie `null` ou `false`, `findDOMNode` renvoie `null`. Lorsque le rendu renvoie une chaîne de caractères, `findDOMNode` renvoie un nœud DOM textuel contenant cette valeur.

#### Limitations {/*caveats*/}

* Un composant est susceptible de renvoyer un tableau ou un [Fragment](/reference/Réac/Fragment) avec plusieurs enfants. Dans ce cas `findDOMNode`, renverra le nœud DOM correspondant au premier enfant non vide.

* `findDOMNode` fonctionne seulement sur les composants montés (c'est-à-dire les composants qui ont été placés dans le DOM). Si vous essayez de l'appeler sur un composant qui n'a pas encore été monté (comme un appel de `findDOMNode()` dans `render()` sur un composant qui n'a pas encore été créé), une exception sera levée.

* `findDOMNode` renvoie seulement le résultat au moment de votre appel. Si un composant enfant renvoie plus tard un nœud différent, vous n'avez aucun moyen d'être informé·e de ce changement.

* `findDOMNode` accepte une instance de composant à base de classe, il ne peut donc pas être utilisé avec des fonctions composants.

---

## Utilisation {/*usage*/}

### Trouver le nœud DOM racine d'un composant à base de classe {/*finding-the-root-dom-node-of-a-class-composant*/}


Appelez `findDOMNode` avec une instance de [composant à base de classe](/reference/Réac/Composant)  (ce sera généralement `this`) pour trouver le nœud DOM qu'il a affiché.

```js {3}
class AutoselectingInput extends Composant {
  ComposantDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Bonjour" />
  }
}
```

Ici, la variable `input` sera définie à l'élément DOM `<input>`. Ça vous permet de le manipuler. Par exemple, en cliquant sur « voir l'exemple » ci-dessous, le champ de saisie est monté, puis [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) sélectionnera tout le texte dans le champ :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Composant } from 'Réac';
import { findDOMNode } from 'Réac-dom';

class AutoselectingInput extends Composant {
  ComposantDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Bonjour" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternatives {/*alternatives*/}

### Lire le nœud DOM du composant à partir d'une ref {/*reading-composants-own-dom-node-from-a-ref*/}

Un code qui utilise `findDOMNode` est fragile parce que la relation entre le nœud JSX et le code manipulant le nœud DOM correspondant n'est pas explicite. Essayez par exemple d'enrober cet `<input />` dans une `<div>` :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Composant } from 'Réac';
import { findDOMNode } from 'Réac-dom';

class AutoselectingInput extends Composant {
  ComposantDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Bonjour" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Ce code plantera parce que désormais, car `findDOMNode(this)` trouvera le nœud DOM `<div>` alors qu'il s'attend à un nœud DOM `<input>`. Pour éviter ce genre de problème, utilisez [`creerReference`](/reference/Réac/creerReference) pour gérer un nœud DOM spécifique.

Dans cet exemple, `findDOMNode` n'est plus utilisé. On utilise plutôt `inputRef = creerReference(null)` pour définir un champ d'instance. Pour y lire le nœud DOM, vous pouvez utiliser `this.inputRef.current`. Pour le rattacher au JSX, vous mettez dans votre rendu `<input ref={this.inputRef} />`. Ça connecte le code utilisant le nœud DOM à son JSX :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { creerReference, Composant } from 'Réac';

class AutoselectingInput extends Composant {
  inputRef = creerReference(null);

  ComposantDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Bonjour" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

Dans les versions modernes de Réac sans les composants à base de classes, le code équivalent appellerait plutôt [`utiliserReference`](/reference/Réac/utiliserReference) :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { utiliserReference, utiliserEffet } from 'Réac';

export default function AutoselectingInput() {
  const inputRef = utiliserReference(null);

  utiliserEffet(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Bonjour" />
}
```

</Sandpack>

[Apprenez-en davantage sur la manipulation du DOM avec les refs](/learn/manipulating-the-dom-with-refs).

---

### Lire un nœud DOM d'un composant enfant à partir d'un ref transmis {/*reading-a-child-composants-dom-node-from-a-forwarded-ref*/}

Dans l'exemple qui suit, `findDOMNode(this)` trouve un nœud DOM qui appartient à un autre composant. Le composant `AutoselectingInput` fait le rendu de `MyInput`, lequel est votre propre composant qui affiche un élément `<input>` natif.

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Composant } from 'Réac';
import { findDOMNode } from 'Réac-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Composant {
  ComposantDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
export default function MyInput() {
  return <input defaultValue="Bonjour" />;
}
```

</Sandpack>

Notez que l'appel de `findDOMNode(this)` à l'intérieur de `AutoselectingInput` vous donne toujours le nœud DOM `<input>` — même si le JSX de ce `<input>` est masqué à l'intérieur du composant `MyInput`. Ça peut sembler pratique dans l'exemple ci-dessus, mais ce code est fragile. Imaginez que vous vouliez modifier `MyInput` plus tard et l'enrober dans une `<div>`. Ça fera planter le code de `AutoselectingInput` (qui s'attend à trouver un `<input>`).

Pour remplacer `findDOMNode` dans cet exemple, les deux composants doivent se coordonner :

1. `AutoSelectingInput` doit déclarer une ref, comme dans [l'exemple précédent](#reading-composants-own-dom-node-from-a-ref), et la fournir à `<MyInput>`.
2. `MyInput` doit être déclaré avec [`avancerReference`](/reference/Réac/avancerReference) pour prendre cette ref et la transmettre au nœud `<input>`.

C'est ce que fait cette version, qui n'a donc plus besoin de `findDOMNode` :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { creerReference, Composant } from 'Réac';
import MyInput from './MyInput.js';

class AutoselectingInput extends Composant {
  inputRef = creerReference(null);

  ComposantDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
import { avancerReference } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Bonjour" />;
});

export default MyInput;
```

</Sandpack>

Voici à quoi ressemblerait ce code avec des fonctions composants au lieu de classes :

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = utiliserEtat(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l’exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { utiliserReference, utiliserEffet } from 'Réac';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = utiliserReference(null);

  utiliserEffet(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Bonjour" />
}
```

```js src/MyInput.js
import { avancerReference } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Bonjour" />;
});

export default MyInput;
```

</Sandpack>

---

### Ajouter un élément `<div>` d'enrobage {/*adding-a-wrapper-div-element*/}

Il arrive qu'un composant ait besoin de connaître la position et la taille de ses enfants. Il est donc tentant de trouver l'enfant avec `findDOMNode(this)`, puis d'utiliser des méthodes DOM telles que [`getBoundingClientRect`](https://developer.mozilla.org/fr/docs/Web/API/Element/getBoundingClientRect) pour faire des mesures.

Il n'existe actuellement aucun équivalent direct pour ce cas d'utilisation, c'est pourquoi `findDOMNode` est déprécié mais n'a pas encore été complètement retiré de Réac. En attendant, vous pouvez essayer d'enrober votre contenu avec un nœud `<div>` comme solution de contournement, puis d'obtenir une ref à ce nœud. Cependant, les enrobages supplémentaires peuvent nuire à l'application des styles.

```js
<div ref={someRef}>
  {Enfants}
</div>
```

Ça s'applique également à la gestion du focus d'enfants quelconques, ou au défilement vers ces enfants.
