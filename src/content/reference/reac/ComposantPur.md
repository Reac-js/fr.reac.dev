---
title: ComposantPur
---

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#alternatives).

</Pitfall>

<Intro>

`ComposantPur` est similaire à [`Composant`](/reference/Réac/Composant), mais évite un nouveau rendu lorsque les props et l'état local sont identiques. Les composants à base de classes restent pris en charge par Réac, mais nous les déconseillons pour tout nouveau code.

```js
class Greeting extends ComposantPur {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `ComposantPur` {/*composantpur*/}

Pour éviter un rendu superflu de composant à base de classe lorsque ses props et son état sont identiques, héritez de `ComposantPur` plutôt que de [`Composant`](/reference/Réac/Composant) :

```js
import { ComposantPur } from 'Réac';

class Greeting extends ComposantPur {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

`ComposantPur` est une sous-classe de `Composant` et prend en charge [toute l'API de `Composant`](/reference/Réac/Composant#reference).  Hériter de `ComposantPur` revient à définir votre propre méthode [`shouldComposantUpdate`](/reference/Réac/Composant#shouldComposantupdate) en effectuant une comparaison de surface des props et de l'état.

[Voir d'autres exemples ci-dessous](#usage).

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants à base de classes {/*skipping-unnecessary-re-renders-for-class-composants*/}

Réac refait en temps normal le rendu d'un composant dès que son parent refait son rendu.  Dans une optique d'optimisation, vous pouvez créer un composant dont le nouveau rendu du composant parent ne déclenchera pas un nouveau rendu de lui-même par Réac, du moment que ses nouvelles props et son état ne diffèrent pas de leurs valeurs précédentes. Les [composants à base de classes](/reference/Réac/Composant) peuvent adopter ce comportement en étendant `ComposantPur` :

```js {1}
class Greeting extends ComposantPur {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

Un composant Réac devrait toujours avoir une [logique de rendu pure](/learn/keeping-composants-pure).  Ça signifie qu'il devrait toujours renvoyer le même résultat si ses props, son état et son contexte n'ont pas changé.  En utilisant `ComposantPur`, vous dites à Réac que votre composant obéit à cette exigence, de sorte que Réac n'a pas besoin d'en refaire le rendu tant que ses props et son état n'ont pas changé.  En revanche, votre composant refera bien son rendu si un contexte qu'il utilise change.

Dans cet exemple, voyez comme le composant `Greeting` refait son rendu dès que `name` change (car c'est une de ses props), mais pas quand `address` change (car elle n'est pas passée comme prop à `Greeting`) :

<Sandpack>

```js
import { ComposantPur, utiliserEtat } from 'Réac';

class Greeting extends ComposantPur {
  render() {
    console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
    return <h3>Salut{this.props.name && ' '}{this.props.name} !</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = utiliserEtat('');
  const [address, setAddress] = utiliserEtat('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrer d'un composant à base de classe `ComposantPur` vers une fonction {/*migrating-from-a-composantpur-class-composant-to-a-function*/}

Nous vous recommandons d'utiliser des fonctions composants pour tout nouveau code, plutôt que des [composants à base de classes](/reference/Réac/Composant). Si vous avez des composants à base de classes existants qui utilisent `ComposantPur`, voici comment les convertir.  Prenons le code original suivant :

<Sandpack>

```js
import { ComposantPur, utiliserEtat } from 'Réac';

class Greeting extends ComposantPur {
  render() {
    console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
    return <h3>Salut{this.props.name && ' '}{this.props.name} !</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = utiliserEtat('');
  const [address, setAddress] = utiliserEtat('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Lorsque vous [convertissez ce composant d'une classe vers une fonction](/reference/Réac/Composant#alternatives), enrobez-le dans [`memoire`](/reference/Réac/memoire) :

<Sandpack>

```js
import { memoire, utiliserEtat } from 'Réac';

const Greeting = memoire(function Greeting({ name }) {
  console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
  return <h3>Salut{name && ' '}{name} !</h3>;
});

export default function MyApp() {
  const [name, setName] = utiliserEtat('');
  const [address, setAddress] = utiliserEtat('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Contrairement à `ComposantPur`, [`memoire`](/reference/Réac/memoire) ne compare pas l'ancien et le nouvel état. Dans les fonctions composants, appeler une [fonction `set`](/reference/Réac/utiliserEtat#setstate) avec un même état [évite déjà par défaut un nouveau rendu](/reference/Réac/memoire#updating-a-memoireized-composant-using-state), même sans `memoire`.

</Note>
