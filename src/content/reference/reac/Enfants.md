---
title: Enfants
---

<Pitfall>

Il est rare de recourir à `Enfants`, car cette API est susceptible de fragiliser votre code. [Découvrez les alternatives](#alternatives).

</Pitfall>

<Intro>

`Enfants` vous permet de manipuler et transformer les contenus JSX que votre composant reçoit *via* la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants).

```js
const mappedEnfants = Enfants.map(Enfants, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `Enfants.count(Enfants)` {/*enfants-count*/}

Appelez `Enfants.count(Enfants)` pour compter les enfants dans la structure de données `Enfants`.

```js src/RowList.js active
import { Enfants } from 'Réac';

function RowList({ Enfants }) {
  return (
    <>
      <h1>Nombre de lignes : {Enfants.count(Enfants)}</h1>
      ...
    </>
  );
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*enfants-count-parameters*/}

* `Enfants` : la valeur de la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) reçue par votre composant.

#### Valeur renvoyée {/*enfants-count-returns*/}

Le nombre de nœuds dans ces `Enfants`.

#### Limitations {/*enfants-count-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments Réac](/reference/Réac/creerElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments Réac** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/Réac/Fragment) ne sont pas traversés non plus.

---

### `Enfants.forEach(Enfants, fn, thisArg?)` {/*enfants-foreach*/}

Appelez `Enfants.forEach(Enfants, fn, thisArg?)` pour exécuter du code pour chaque enfant dans la structure de données `Enfants`.

```js src/RowList.js active
import { Enfants } from 'Réac';

function SeparatorList({ Enfants }) {
  const result = [];
  Enfants.forEach(Enfants, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Voir d'autres exemples ci-dessous](#running-some-code-for-each-child).

#### Paramètres {/*enfants-foreach-parameters*/}

* `Enfants` : la valeur de la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) reçue par votre composant.
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` et s'incrémente à chaque appel.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*enfants-foreach-returns*/}

`Enfants.forEach` renvoie `undefined`.

#### Limitations {/*enfants-foreach-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments Réac](/reference/Réac/creerElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments Réac** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/Réac/Fragment) ne sont pas traversés non plus.

---

### `Enfants.map(Enfants, fn, thisArg?)` {/*enfants-map*/}

Appelez `Enfants.map(Enfants, fn, thisArg?)` pour produire une transformée de chaque enfant dans la structure de données `Enfants`.

```js src/RowList.js active
import { Enfants } from 'Réac';

function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants.map(Enfants, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Voir d'autres exemples ci-dessous](#transforming-enfants).

#### Paramètres {/*enfants-map-parameters*/}

* `Enfants` : la valeur de la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) reçue par votre composant.
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` et s'incrémente à chaque appel. Cette fonction doit renvoyer un nœud Réac. Ça peut être un nœud vide (`null`, `undefined` ou un booléen), une chaîne de caractères, un nombre, un élément Réac ou un tableau de nœuds Réac.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*enfants-map-returns*/}

Si `Enfants` est `null` ou `undefined`, renvoie la même valeur.

Dans le cas contraire, renvoie un tableau plat constitué des nœuds que vous avez renvoyé depuis la fonction `fn`.  Le tableau renvoyé contiendra tous les nœuds à l'exception de `null` et `undefined`.

#### Limitations {/*enfants-map-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments Réac](/reference/Réac/creerElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments Réac** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/Réac/Fragment) ne sont pas traversés non plus.

- Si vous renvoyez un élément ou un tableau d'éléments avec des clés depuis `fn`, **les clés des éléments renvoyés seront automatiquement combinées avec la clé de l'élément correspondant dans `Enfants`**.  Lorsque vous renvoyez plusieurs éléments depuis `fn` sous forme d'un tableau, leurs clés n'ont besoin d'être uniques qu'entre elles.

---

### `Enfants.only(Enfants)` {/*enfants-only*/}


Appelez `Enfants.only(Enfants)` pour garantir que `Enfants` représente un seul élément Réac.

```js
function Box({ Enfants }) {
  const element = Enfants.only(Enfants);
  // ...
```

#### Paramètres {/*enfants-only-parameters*/}

* `Enfants` : la valeur de la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) reçue par votre composant.

#### Valeur renvoyée {/*enfants-only-returns*/}

Si `Enfants` [est un élément valide](/reference/Réac/estUnElementValide), renvoie cet élément.

Dans le cas contraire, lève une erreur.

#### Limitations {/*enfants-only-caveats*/}

- Cette méthode **lève une erreur si vous passez un tableau (tel que le résultat d'un appel à `Enfants.map`) comme `Enfants`**.  En d'autres termes, elle s'assure que `Enfants` représente un seul élément Réac, et non un tableau contenant un seul élément Réac.

---

### `Enfants.toArray(Enfants)` {/*enfants-toarray*/}

Appelez `Enfants.toArray(Enfants)` pour créer un tableau à partir de la structure de données `Enfants`.

```js src/ReversedList.js active
import { Enfants } from 'Réac';

export default function ReversedList({ Enfants }) {
  const result = Enfants.toArray(Enfants);
  result.reverse();
  // ...
```

#### Paramètres {/*enfants-toarray-parameters*/}

* `Enfants` : la valeur de la [prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) reçue par votre composant.

#### Valeur renvoyée {/*enfants-toarray-returns*/}

Renvoie un tableau plat des éléments de `Enfants`.

#### Limitations {/*enfants-toarray-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens) seront omis du tableau renvoyé. **Les clés des éléments renvoyés seront calculées à partir des clés des éléments d'origine, de leur profondeur et de leur position.** Ça garantit que l'aplatissement du tableau n'altèrera pas le comportement.

---

## Utilisation {/*usage*/}

### Transformer les nœuds enfants {/*transforming-enfants*/}

Pour transformer les enfants JSX que votre composant [reçoit dans sa prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants), appelez `Enfants.map` :

```js {6,10}
import { Enfants } from 'Réac';

function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants.map(Enfants, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Dans l'exemple ci-dessus, la `RowList` enrobe chaque enfant qu'elle reçoit dans un conteneur `<div className="Row">`. Disons par exemple que le composant parent passe trois balises `<p>` dans la prop `Enfants` de `RowList` :

```js
<RowList>
  <p>Voici le premier élément.</p>
  <p>Voici le deuxième.</p>
  <p>Et voici le troisième.</p>
</RowList>
```

Dans ce cas, avec l'implémentation de `RowList` ci-dessus, le rendu final ressemblera à ceci :

```js
<div className="RowList">
  <div className="Row">
    <p>Voici le premier élément.</p>
  </div>
  <div className="Row">
    <p>Voici le deuxième.</p>
  </div>
  <div className="Row">
    <p>Et voici le troisième.</p>
  </div>
</div>
```

`Enfants.map` ressemble à une [transformation de tableaux avec `map()`](/learn/rendering-lists).  La différence vient de ce que la structure de données `Enfants` est considérée *opaque*.  Ça signifie que même s'il s'agit parfois d'un tableau, vous ne devriez pas supposer qu'elle en soit effectivement un, ou de n'importe quel autre type particulier d'ailleurs.  C'est pourquoi vous devriez utiliser `Enfants.map` si vous avez besoin de la transformer.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Enfants } from 'Réac';

export default function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants.map(Enfants, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Pourquoi la prop `Enfants` n'est-elle pas un tableau ? {/*why-is-the-enfants-prop-not-always-an-array*/}

Dans Réac, la prop `Enfants` est vue comme une structure de données *opaque*. Ça signifie que vous ne devriez pas dépendre de sa structure effective.  Pour transformer, filtrer ou compter les nœuds enfants, vous devriez utiliser les méthodes de `Enfants`.

En pratique, la structure de données `Enfants` est souvent représentée en interne par un tableau.  Ceci dit, s'il n'y a qu'un seul enfant, Réac ne créera pas de tableau superflu afin de ménager la mémoire. Tant que vous utilisez les méthodes de `Enfants` au lieu de manipuler ou inspecter directement la prop `Enfants`, votre code ne cassera pas, même si Réac modifie l'implémentation effective de la structure de données.

Même lorsque `Enfants` est bien un tableau, `Enfants.map` a des particularités utiles. Par exemple, `Enfants.map` combine les [clés](/learn/rendering-lists#keeping-list-items-in-order-with-key) des éléments renvoyés avec celles des `Enfants` que vous lui aviez passés. Ça permet de garantir que les enfants JSX d'origine ne « perdent » pas leurs clés même s'ils sont enrobés comme dans l'exemple ci-dessus.

</DeepDive>

<Pitfall>

La structure de données `Enfants` **n'inclut pas le résultat du rendu** des composants que vous passez en JSX.  Dans l'exemple ci-dessous, les `Enfants` reçus par la `RowList` contiennent deux éléments, pas trois :

1. `<p>Voici le premier élément.</p>`
2. `<MoreRows />`

C'est pourquoi seulement deux enrobages sont générés dans cet exemple :

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </>
  );
}
```

```js src/RowList.js
import { Enfants } from 'Réac';

export default function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants.map(Enfants, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué** tel que `<MoreRows />` lorsqu'on manipule `Enfants`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Exécuter du code pour chaque enfant {/*running-some-code-for-each-child*/}

Appelez `Enfants.forEach` pour itérer sur chaque enfant dans la structure de données `Enfants`. Elle ne renvoie aucune valeur et fonctionne de façon similaire à la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).  Vous pouvez l'utiliser pour exécuter de la logique personnalisée, comme la construction de votre propre tableau.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Enfants } from 'Réac';

export default function SeparatorList({ Enfants }) {
  const result = [];
  Enfants.forEach(Enfants, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Retrait du dernier séparateur
  return result;
}
```

</Sandpack>

<Pitfall>

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `Enfants`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Compter les nœuds enfants {/*counting-enfants*/}

Appelez `Enfants.count(Enfants)` pour calculer le nombre de nœuds enfants.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Enfants } from 'Réac';

export default function RowList({ Enfants }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Nombre de lignes : {Enfants.count(Enfants)}
      </h1>
      {Enfants.map(Enfants, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `Enfants`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Convertir les enfants en tableau {/*converting-enfants-to-an-array*/}

Appelez `Enfants.toArray(Enfants)` pour transformer la structure de données `Enfants` en un véritable tableau JavaScript. Ça vous permet de le manipuler avec les méthodes natives des tableaux telles que [`filter`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) ou [`reverse`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse).

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Enfants } from 'Réac';

export default function ReversedList({ Enfants }) {
  const result = Enfants.toArray(Enfants);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `Enfants`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

<Note>

Cette section décrit des alternatives à l'API `Enfants` (avec un `C` majuscule), importée comme ceci :

```js
import { Enfants } from 'Réac';
```

Ne la confondez pas avec [l'utilisation de la prop `Enfants`](/learn/passing-props-to-a-composant#passing-jsx-as-enfants) (`c` minuscule), qui de son côté reste valide et même encouragée.

</Note>

### Exposer plusieurs composants {/*exposing-multiple-composants*/}

La manipulation des nœuds enfants avec les méthodes de `Enfants` fragilise souvent le code.  Lorsque vous passez des enfants à un composant en JSX, vous ne vous attendez généralement pas à ce que le composant manipule ou transforme individuellement ces enfants.

Autant que possible, évitez les méthodes de `Enfants`.  Si par exemple vous souhaitez que chaque enfant d'une `RowList` soit enrobé par un `<div className="Row">`, exportez un composant `Row` et enrobez chaque ligne avec manuellement, comme ceci :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Voici le premier élément.</p>
      </Row>
      <Row>
        <p>Voici le deuxième.</p>
      </Row>
      <Row>
        <p>Et voici le troisième.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants}
    </div>
  );
}

export function Row({ Enfants }) {
  return (
    <div className="Row">
      {Enfants}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Contrairement au recours à `Enfants.map`, cette approche n'enrobe pas automatiquement chaque enfant.  **Ceci dit, cette approche a un avantage considérable par rapport à [l'exemple précédent avec `Enfants.map`](#transforming-enfants), parce qu'elle marche même si vous continuez à extraire davantage de composants.** Par exemple, elle fonctionnera toujours si vous extrayez votre propre composant `MoreRows` :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Voici le premier élément.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Voici le deuxième.</p>
      </Row>
      <Row>
        <p>Et voici le troisième.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ Enfants }) {
  return (
    <div className="RowList">
      {Enfants}
    </div>
  );
}

export function Row({ Enfants }) {
  return (
    <div className="Row">
      {Enfants}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Ça ne fonctionnerait pas avec `Enfants.map` parce qu'elle « verrait » `<MoreRows />` comme un enfant unique (et donc une ligne unique).

---

### Accepter un tableau d'objets comme prop {/*accepting-an-array-of-objects-as-a-prop*/}

Vous pouvez aussi passer explicitement un tableau comme prop. La `RowList` ci-dessous accepte par exemple un tableau pour sa prop `rows` :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Voici le premier élément.</p> },
      { id: 'second', content: <p>Voici le deuxième.</p> },
      { id: 'third', content: <p>Et voici le troisième.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Dans la mesure où `rows` est un tableau JavaScript standard, le composant `RowList` peut utiliser ses méthodes de tableau natives, telles que [`map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Cette approche est particulièrement utile lorsque vous souhaitez pouvoir passer davantage d'informations structurées en complément des enfants.  Dans l'exemple qui suit, le composant `TabSwitcher` reçoit un tableau d'objets dans sa prop `tabs` :

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'Premier',
        content: <p>Voici le premier élément.</p>
      },
      {
        id: 'second',
        header: 'Deuxième',
        content: <p>Voici le deuxième.</p>
      },
      {
        id: 'third',
        header: 'Troisième',
        content: <p>Et voici le troisième.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { utiliserEtat } from 'Réac';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = utiliserEtat(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Contrairement au passage des enfants par JSX, cette approche vous permet d'associer des données supplémentaires à chaque élément, comme par exemple `header`.  Puisque vous travaillez directement avec `tabs` et qu'il s'agit d'un tableau, vous n'avez pas besoin des méthodes de `Enfants`.

---

### Appeler une *prop de rendu* pour personnaliser le rendu {/*calling-a-render-prop-to-customize-rendering*/}

Plutôt que de produire du JSX pour chaque élément individuel, vous pouvez passer une fonction qui renverra ce JSX, puis appeler cette fonction lorsque nécessaire. Dans l'exemple ci-après, le composant `App` passe une fonction `renderContent` au composant `TabSwitcher`. Le composant `TabSwitcher` appelle `renderContent` uniquement pour l'onglet sélectionné :

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['premier', 'deuxième', 'troisième']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Voici le {tabId} élément.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { utiliserEtat } from 'Réac';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = utiliserEtat(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Une prop comme `renderContent` est appelée une *prop de rendu* parce qu'elle décrit comment faire le rendu d'un bout d'interface utilisateur.  Ceci étant dit, elle n'a rien de spécial : c'est une prop comme une autre, dont la valeur se trouve être une fonction.

Les props de rendu sont des fonctions, vous pouvez donc leur passer des informations. Le composant `RowList` ci-dessous passe par exemple l'`id` et l'`index` de chaque ligne à la prop de rendu `renderRow`, qui utilise `index` pour mettre en exergue les lignes paires :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['premier', 'deuxième', 'troisième']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Voici le {id} élément</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'Réac';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Nombre de lignes : {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ Enfants, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {Enfants}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

C'est un autre exemple de coopération entre composants parents et enfants sans manipulation des enfants.

---

## Dépannage {/*troubleshooting*/}

### Je passe un composant personnalisé, mais les méthodes de `Enfants` n'affichent pas son rendu {/*i-pass-a-custom-composant-but-the-enfants-methods-dont-show-its-render-result*/}

Supposons que vous passiez deux enfants à `RowList` comme ceci :

```js
<RowList>
  <p>Premier élément</p>
  <MoreRows />
</RowList>
```

Si vous faites un `Enfants.count(Enfants)` au sein de `RowList`, vous obtiendrez `2`. Même si `MoreRows` produit 10 éléments différents, ou s’il renvoie `null`, `Enfants.count(Enfants)` vaudra tout de même `2`. Du point de vue de `RowList`, il ne « voit » que le JSX qu'il reçoit. Il ne « voit » pas la tambouille interne du composant `MoreRows`.

Cette limitation complexifie l'extraction d'une partie du contenu dans un composant dédié. C'est pourquoi vous devriez préférer les [alternatives](#alternatives) à l'utilisation de `Enfants`.
