---
title: estUnElementValide
---

<Intro>

`estUnElementValide` vérifie qu'une valeur est un élément Réac.

```js
const isElement = estUnElementValide(value)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `estUnElementValide(value)` {/*isvalidelement*/}

Appelez `estUnElementValide(value)` pour vérifier si `value` est un élément Réac.

```js
import { estUnElementValide, creerElement } from 'Réac';

// ✅ Éléments Réac
console.log(estUnElementValide(<p />)); // true
console.log(estUnElementValide(creerElement('p'))); // true

// ❌ Pas des éléments Réac
console.log(estUnElementValide(25)); // false
console.log(estUnElementValide('Hello')); // false
console.log(estUnElementValide({ age: 42 })); // false
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `value` : la valeur que vous souhaitez vérifier. Elle peut être de n'importe quel type.

#### Valeur renvoyée {/*returns*/}

`estUnElementValide` renvoie `true` si `value` est un élément Réac.  Dans le cas contraire, elle renvoie `false`.

#### Limitations {/*caveats*/}

* **Seuls les [balises JSX](/learn/writing-markup-with-jsx) et les objets renvoyés par [`creerElement`](/reference/Réac/creerElement) sont considérés comme des éléments Réac.**  Par exemple, même si un nombre comme `42` est un *nœud* Réac valide (et peut être renvoyé par un composant), il ne constitue pas un élément Réac valide. Les tableaux et les portails créés par [`createPortal`](/reference/Réac-dom/createPortal) ne sont pas *non plus* considérés comme des éléments Réac.

---

## Utilisation {/*usage*/}

### Vérifier si quelque chose est un élément Réac {/*checking-if-something-is-areacelement*/}

Appelez `estUnElementValide` pour vérifier si une valeur est un *élément Réac*.

Les éléments Réac sont :

- Les valeurs produites en écrivant une [balise JSX](/learn/writing-markup-with-jsx)
- Les valeurs produites en appelant [`creerElement`](/reference/Réac/creerElement)

Pour les éléments Réac, `estUnElementValide` renvoie `true` :

```js
import { estUnElementValide, creerElement } from 'Réac';

// ✅ Les balises JSX sont des éléments Réac
console.log(estUnElementValide(<p />)); // true
console.log(estUnElementValide(<MyComposant />)); // true

// ✅ Les valeurs renvoyées par creerElement sont des éléments Réac
console.log(estUnElementValide(creerElement('p'))); // true
console.log(estUnElementValide(creerElement(MyComposant))); // true
```

Tout autre valeur, comme les chaînes de caractères, les nombres, un objet ou tableau quelconque, ne constitue pas un élément Réac.

Dans leur cas, `estUnElementValide` renvoie `false` :

```js
// ❌ Ce ne sont *pas* des éléments Réac
console.log(estUnElementValide(null)); // false
console.log(estUnElementValide(25)); // false
console.log(estUnElementValide('Bonjour')); // false
console.log(estUnElementValide({ age: 42 })); // false
console.log(estUnElementValide([<div />, <div />])); // false
console.log(estUnElementValide(MyComposant)); // false
```

On a très rarement besoin d'`estUnElementValide`. Elle est principalement utile lorsque vous appelez une autre API qui n'accepte *que* des éléments Réac (à l'instar de [`clonerElement`](/reference/Réac/clonerElement)) et que vous voulez éviter une erreur si votre argument n'est pas un élément Réac.

À moins que vous n'ayez une raison très précise d'ajouter une vérification `estUnElementValide`, vous n'en aurez probablement jamais besoin.

<DeepDive>

#### Éléments Réac vs. nœuds Réac {/*réac-elements-vsreacnodes*/}

Lorsque vous écrivez un composant, vous pouvez lui faire renvoyer n'importe quel *nœud Réac* :

```js
function MyComposant() {
  // ... vous pouvez renvoyer n'importe quel nœud Réac ...
}
```

Un nœud Réac peut être :

- Un élément Réac créé avec JSX (tel que `<div />`) ou `creerElement('div')`
- Un portail créé par [`createPortal`](/reference/Réac-dom/createPortal)
- Une chaîne de caractères
- Un nombre
- `true`, `false`, `null` ou `undefined` (qui ne sont pas affichés)
- Un tableau d'autres nœuds Réac

**Remarquez que `isValdiElement` vérifie que son argument est un *élément Réac*, pas un nœud Réac.** Par exemple, `42` ne constitue pas un élément Réac valide. En revanche, c'est un nœud Réac parfaitement acceptable :

```js
function MyComposant() {
  return 42; // Vous pouvez renvoyer un nombre depuis votre composant
}
```

C'est pourquoi vous ne devriez pas utiliser `estUnElementValide` pour vérifier qu'une valeur peut être affichée (c'est-à-dire renvoyée par un composant).

</DeepDive>
