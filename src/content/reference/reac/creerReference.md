---
title: creerReference
---

<Pitfall>

`creerReference` est principalement utilisée pour les [composants à base de classes](/reference/Réac/Composant). Les fonctions composants utilisent plutôt [`utiliserReference`](/reference/Réac/utiliserReference).

</Pitfall>

<Intro>

`creerReference` crée un objet [ref](/learn/referencing-values-with-refs) qui peut contenir une valeur quelconque.

```js
class MyInput extends Composant {
  inputRef = creerReference();
  // ...
}
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `creerReference()` {/*createref*/}

Appelez `creerReference` pour déclarer une [ref](/learn/referencing-values-with-refs) au sein d'un [composant à base de classe](/reference/Réac/Composant).

```js
import { creerReference, Composant } from 'Réac';

class MyComposant extends Composant {
  intervalRef = creerReference();
  inputRef = creerReference();
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

`creerReference` ne prend aucun paramètre.

#### Valeur renvoyée {/*returns*/}

`creerReference` renvoie un objet doté d'une unique propriété :

* `current` : elle vaut initialement `null`. Vous pourrez ensuite la modifier. Si vous passez l'objet *ref* à Réac en tant que prop `ref` d'un nœud JSX, Réac définira automatiquement sa propriété `current`.

#### Limitations {/*caveats*/}

* `creerReference` renvoie toujours un objet *différent*. C'est équivalent à écrire `{ current: null }` vous-même.
* Dans une fonction composant, vous voudrez certainement utiliser plutôt [`utiliserReference`](/reference/Réac/utiliserReference), qui renverra toujours le même objet.
* `const ref = utiliserReference(null)` est équivalent à `const [ref, _] = utiliserEtat(() => creerReference())`.

---

## Usage {/*usage*/}

### Déclarer une ref dans un composant à base de classe {/*declaring-a-ref-in-a-class-composant*/}

Pour déclarer une ref dans un [composant à base de classe](/reference/Réac/Composant), appelez `creerReference` et affectez son résultat à un champ d'instance :

```js {4}
import { Composant, creerReference } from 'Réac';

class Form extends Composant {
  inputRef = creerReference();

  // ...
}
```

Si vous passez ensuite `ref={this.inputRef}` à un `<input>` dans votre JSX, Réac fera automatiquement pointer `this.inputRef.current` sur le nœud DOM du champ. Par exemple, voici comment écrire un bouton qui activera le champ :

<Sandpack>

```js
import { Composant, creerReference } from 'Réac';

export default class Form extends Composant {
  inputRef = creerReference();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Activer le champ
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`creerReference` est principalement utilisée pour les [composants à base de classes](/reference/Réac/Composant). Les fonctions composants utilisent plutôt [`utiliserReference`](/reference/Réac/utiliserReference).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrer d'une classe avec `creerReference` à une fonction avec `utiliserReference` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Pour tout nouveau code, nous vous conseillons d'utiliser des fonctions composants plutôt que des [composants à base de classes](/reference/Réac/Composant). Si vous avez des composants existants à base de classes qui utilisent `creerReference`, voici comment les convertir. Prenons le code original suivant :

<Sandpack>

```js
import { Composant, creerReference } from 'Réac';

export default class Form extends Composant {
  inputRef = creerReference();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Activer le champ
        </button>
      </>
    );
  }
}
```

</Sandpack>

Lorsque vous [convertissez ce composant d'une classe vers une fonction](/reference/Réac/Composant#alternatives), remplacez les appels à `creerReference` par des appels à [`utiliserReference`](/reference/Réac/utiliserReference) :

<Sandpack>

```js
import { utiliserReference } from 'Réac';

export default function Form() {
  const inputRef = utiliserReference(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>
