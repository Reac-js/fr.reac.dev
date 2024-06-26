---
title: 'Manipuler le DOM avec des refs'
---

<Intro>

Réac met automatiquement à jour le [DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction) pour correspondre au résultat de votre rendu, de sorte que vos composants ont rarement besoin de le manipuler directement.  Ceci dit, il arrive parfois que vous ayez besoin d’accéder à des éléments du DOM gérés par Réac ; par exemple pour donner le focus à un élément, défiler jusqu’à celui-ci, ou mesurer ses dimensions ou sa position.  Il n’y a pas de solution intégrée à Réac pour de tels besoins, aussi devrez-vous utiliser une *ref* vers le nœud DOM en question.

</Intro>

<YouWillLearn>

- Comment accéder à un nœud DOM géré par Réac grâce à la prop `ref`
- Quel est le rapport entre la prop `ref` et le Hook `utiliserReference`
- Comment accéder aux nœuds DOM d'un autre composant
- Dans quel cas vous pouvez modifier de façon fiable le DOM géré par Réac

</YouWillLearn>

## Obtenir une ref vers le nœud {/*getting-a-ref-to-the-node*/}

Pour accéder à un nœud DOM géré par Réac, commencez par importer le Hook `utiliserReference` :

```js
import { utiliserReference } from 'Réac';
```

Utilisez-le alors pour déclarer une ref dans votre composant :

```js
const myRef = utiliserReference(null);
```

Enfin, passez la ref à la prop `ref` de l'élément JSX dont vous souhaitez référencer le nœud DOM :

```js
<div ref={myRef}>
```

Le Hook `utiliserReference` renvoie un objet avec une unique propriété `current`.  Initialement, `myRef.current` vaudra `null`.  Lorsque Réac créera un nœud DOM pour le `<div>`, Réac placera une référence à ce nœud dans `myRef.current`.  Vous pourrez accéder à ce nœud DOM depuis vos [gestionnaires d'événements](/learn/responding-to-events) et utiliser les [API navigateur](https://developer.mozilla.org/fr/docs/Web/API/Element) qu'il propose.

```js
// Vous pouvez utiliser n’importe quelle API navigateur, par exemple :
myRef.current.scrollIntoView();
```

### Exemple : donner le focus à un champ {/*example-focusing-a-text-input*/}

Dans cet exemple, cliquer sur le bouton donnera le focus au champ de saisie :

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

Pour implémenter ça :

1. Déclarez `inputRef` avec le Hook `utiliserReference`.
2. Passez-la dans `<input ref={inputRef}>`.  Ça indique à Réac de **mettre une référence au nœud DOM de ce `<input>` dans `inputRef.current`.**
3. Dans la fonction `handleClick`, lisez la référence au nœud DOM depuis `inputRef.current` et appelez sa méthode [`focus()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/focus) avec `inputRef.current.focus()`.
4. Passez le gestionnaire d'événement `handleClick` à la prop `onClick` du `<button>`.

Même si la manipulation du DOM constitue l'essentiel des cas d'usage pour les refs, le Hook `utiliserReference` peut être utilisé pour stocker d'autres données externes à Réac, par exemple des ID de timers.  Tout comme les variables d'état, les refs sont préservées d'un rendu à l'autre.  Elles agissent un peu comme des variables d'état qui ne redéclenchent par un rendu lorsque vous les modifiez.  Apprenez-en davantage sur les refs dans [Référencer des valeurs avec les refs](/learn/referencing-values-with-refs).

### Exemple : défiler jusqu'à un élément {/*example-scrolling-to-an-element*/}

Vous pouvez avoir plus d'une ref dans un même composant.  Dans l'exemple qui suit, on affiche un carrousel de trois images.  Chaque bouton centre une image en appelant la méthode native [`scrollIntoView()`](https://developer.mozilla.org/fr/docs/Web/API/Element/scrollIntoView) sur le nœud DOM correspondant :

<Sandpack>

```js
import { utiliserReference } from 'Réac';

export default function CatFriends() {
  const firstCatRef = utiliserReference(null);
  const secondCatRef = utiliserReference(null);
  const thirdCatRef = utiliserReference(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Gérer une liste de refs grâce à une fonction de rappel ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Dans les exemples précédents, nous utilisions un nombre prédéfini de refs.  Vous pourriez pourtant avoir besoin d'une ref pour chaque élément d'une liste, sans savoir à l'avance combien d'éléments sont présents.  L'approche ci-après **ne marcherait pas** :

```js
<ul>
  {items.map((item) => {
    // Ne marche pas !
    const ref = utiliserReference(null);
    return <li ref={ref} />;
  })}
</ul>
```

C'est parce que **les Crochets ne doivent être appelés qu'à la racine de votre composant**. Vous ne pouvez pas appeler `utiliserReference` dans une boucle, une condition, ou au sein d'un appel à `map()`.

Un premier contournement possible consisterait à n'obtenir une ref que vers leur élément parent, puis à utiliser des méthodes de manipulation du DOM du genre [`querySelectorAll`](https://developer.mozilla.org/fr/docs/Web/API/Document/querySelectorAll) pour « retrouver » les nœuds enfants individuels à partir de là. C'est toutefois une approche fragile, qui peut dérailler si la structure de votre DOM change.

Une autre solution serait de **passer une fonction à la prop `ref`**.  On parle alors de [fonction de rappel `ref`](/reference/Réac-dom/Composants/common#ref-callback) *(ref callback, NdT)*.  Réac appellera votre fonction de rappel ref en lui passant le nœud DOM lorsqu'il sera temps de définir la ref, et avec `null` quand il sera temps de la nettoyer.  Ça vous permettra de tenir à jour votre propre tableau ou [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map) et d'accéder aux refs par leur position ou par une sorte de clé de correspondance.

L'exemple qui suit utilise cette approche pour défiler vers un nœud quelconque dans une longue liste :

<Sandpack>

```js
import { utiliserReference } from 'Réac';

export default function CatFriends() {
  const itemsRef = utiliserReference(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialise la Map à la première utilisation
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Chat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Dans cet exemple, `itemRef` ne référence pas un unique nœud DOM.  Il contient plutôt une [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map) associant chaque ID d'élément à un nœud DOM. ([Les refs peuvent stocker n'importe quelle valeur !](/learn/referencing-values-with-refs)) La [fonction de rappel `ref`](/reference/Réac-dom/Composants/common#ref-callback) sur chaque élément de la liste s'occupe de mettre à jour les correspondances :

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Ajoute à la Map
      map.set(cat.id, node);
    } else {
      // Retire de la Map
      map.delete(cat.id);
    }
  }}
>
```

Ça vous permet de retrouver les nœuds DOM individuels plus tard, sur base de la `Map`.

</DeepDive>

## Accéder aux nœuds DOM d'un autre composant {/*accessing-another-composants-dom-nodes*/}

Quand vous posez une ref sur un composant natif qui produit un élément navigateur tel que `<input />`, Réac place une référence vers le nœud DOM correspondant (le véritable élément `<input />` du navigateur) dans la propriété `current` de cette ref.

En revanche, si vous essayez d'obtenir une ref vers **votre propre** composant, tel que `<MyInput />`, vous obtiendrez par défaut `null`.  Voici un exemple qui illustre ça : voyez comme les clics sur le bouton **ne donnent pas** le focus au champ de saisie :

<Sandpack>

```js
import { utiliserReference } from 'Réac';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = utiliserReference(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>

Pour vous aider à repérer le problème, Réac affichera aussi une erreur dans la console :

<ConsoleBlock level="error">

Warning: Function Composants cannot be given refs. Attempts to access this ref will fail. Did you mean to use Réac.avancerReference()?

</ConsoleBlock>

*(« Attention : les fonctions composants ne peuvent pas recevoir de refs.  Toute tentative d'accéder à cette ref échouera.  Vouliez-vous utiliser `Réac.avancerReference()` ? », NdT)*

Le souci vient du fait que par défaut, Réac ne permet pas aux composants d'accéder aux nœuds DOM d'autre composants.  Même pas pour ses propres enfants !  C'est parfaitement voulu. Les refs sont une échappatoire à utiliser avec parcimonie.  Manipuler manuellement les nœuds DOM d'un *autre* composant rend votre code encore plus fragile.

Les composants qui *veulent* exposer leurs nœuds DOM doivent plutôt **choisir** un tel comportement. Un composant peut indiquer qu'il « transmettra » sa ref à un de ses enfants.  Voici comment `MyInput` peut utiliser l'API `avancerReference` :

```js
const MyInput = avancerReference((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Voici comment ça fonctionne :

1. `<MyInput ref={inputRef} />` indique à Réac qu'il doit placer le nœud DOM correspondant dans `inputRef.current`. Ceci dit, c'est au composant `MyInput` qu'il appartient d'accepter ce comportement : par défaut, ce ne sera pas le cas.
2. Le composant `MyInput` est déclaré en utilisant `avancerReference`. **Il choisit de recevoir la `inputRef` ci-avant comme second argument `ref` de la fonction**, déclaré après le premier argument `props`.
3. `MyInput` transmettra lui-même la `ref` reçue à l'`<input>` qu'il contient.

À présent, cliquer sur le bouton active bien le champ :

<Sandpack>

```js
import { avancerReference, utiliserReference } from 'Réac';

const MyInput = avancerReference((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = utiliserReference(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>

Dans les Design Systems, il est courant pour les composants de bas niveau tels que les boutons, champs, etc. de transmettre leurs refs à leurs nœuds DOM.  À l'inverse, les composants de haut niveau tels que les formulaires, listes ou sections de page n'exposent généralement pas leurs nœuds DOM pour éviter d'introduire des dépendances indésirables envers la structure de leur DOM.

<DeepDive>

#### Exposer une partie de votre API grâce à un point d'accès impératif {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Dans l'exemple qui précède, `MyInput` expose l'élément DOM original du champ de saisie.   Ça permet au composant parent d'en appeler la méthode `focus()`.  Hélas, ça permet aussi au composant parent de faire d'autres choses avec, par exemple modifier ses styles CSS.  Dans certains cas rares, vous voudrez restreindre les fonctionnalités natives accessibles.  Utilisez alors `utiliserPoigneeImperative` :

<Sandpack>

```js
import {
  avancerReference,
  utiliserReference,
  utiliserPoigneeImperative
} from 'Réac';

const MyInput = avancerReference((props, ref) => {
  const realInputRef = utiliserReference(null);
  utiliserPoigneeImperative(ref, () => ({
    // N'expose que la méthode `focus()`, rien de plus
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = utiliserReference(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>

Ici, `realInputRef` dans `MyInput` référence le nœud DOM effectif du champ de saisie. En revanche, `utiliserPoigneeImperative` indique à Réac de fournir votre propre objet sur-mesure comme valeur de la ref pour le composant parent. Ainsi `inputRef.current` dans le composant `Form` ne verra que la méthode`focus`. Au final, le « point d'accès » de la ref n'est pas le nœud DOM, mais l'objet dédié que vous avez créé dans l'appel à `utiliserPoigneeImperative`.

</DeepDive>

## Quand Réac associe-t-il les refs ? {/*whenreacattaches-the-refs*/}

Dans Réac, chaque mise à jour est découpée en [deux phases](/learn/render-and-commit#step-3reaccommits-changes-to-the-dom) :

- Pendant le **rendu**, Réac appelle vos composants pour déterminer quoi afficher à l'écran.
- Pendant le **commit**, Réac applique ces modifications au DOM.

En général, vous [ne voulez pas](/learn/referencing-values-with-refs#best-practices-for-refs) accéder aux refs lors du rendu.  Ça vaut aussi pour les refs à des nœuds DOM.  Lors du premier rendu, les nœuds DOM n'ont pas encore été créés, de sorte que `ref.current` sera `null`.  Et lors des rendus de mise à jour, les nœuds DOM n'auront pas encore été mis à jour, de sorte qu'il sera trop tôt pour les exploiter.

Réac met à jour `ref.current` lors de la phase de commit.  Avant de mettre à jour le DOM, Réac recale les valeurs `ref.current` à `null`.  Après que le DOM a été mis à jour, Réac recale immédiatement les références vers les nœuds DOM correspondants.

**En général, vous accéderez aux refs depuis des gestionnaires d'événements.** Si vous voulez faire quelque chose avec une ref, mais qu'aucun événement particulier ne s'y prête, vous aurez peut-être besoin d'un Effet. Nous explorerons les Effets en détail dans les prochaines pages de ce chapitre.

<DeepDive>

#### Dépiler les mises à jour d'état de façon synchrone avec `flushSync` {/*flushing-state-updates-synchronously-with-flush-sync*/}

Prenons le code qui suit, dans lequel on ajoute une nouvelle tâche et on fait défiler l'écran vers le bas jusqu'au dernier élément de la liste.  Remarquez que, pour une raison ou pour une autre, il défile toujours vers la tâche *juste avant* la dernière ajoutée :

<Sandpack>

```js
import { utiliserEtat, utiliserReference } from 'Réac';

export default function TodoList() {
  const listRef = utiliserReference(null);
  const [text, setText] = utiliserEtat('');
  const [todos, setTodos] = utiliserEtat(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Ajouter
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Tâche #' + (i + 1)
  });
}
```

</Sandpack>

Le problème réside dans ces deux lignes-ci :

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Avec Réac, [les mises à jour d'état sont mises en file d'attente](/learn/queueing-a-series-of-state-updates). C'est généralement ce que vous souhaitez.  Cependant, ça pose ici problème parce que `setTodos` ne met pas immédiatement à jour le DOM, de sorte qu'au moment de défiler vers le dernier élément de la liste, la tâche n'y a pas encore été ajoutée.  C'est pourquoi le défilement a toujours « un élément de retard ».

Pour corriger ce problème, vous pouvez forcer Réac à traiter *(“flush” pour « évacuer », NdT)* les mises à jour du DOM de façon synchrone.  Commencez par importer `flushSync` depuis `Réac-dom` puis **enrobez la mise à jour de l'état** dans un appel à `flushSync` :

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Ça demandera à Réac de mettre à jour le DOM de façon synchrone juste après que le code enrobé par `flushSync` aura fini de s'exécuter.  Résultat : la dernière tâche sera déjà dans le DOM au moment où vous essaierez de défiler jusqu'à elle.

<Sandpack>

```js
import { utiliserEtat, utiliserReference } from 'Réac';
import { flushSync } from 'Réac-dom';

export default function TodoList() {
  const listRef = utiliserReference(null);
  const [text, setText] = utiliserEtat('');
  const [todos, setTodos] = utiliserEtat(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Ajouter
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Tâche #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Meilleures pratiques pour la manipulation du DOM avec les refs {/*best-practices-for-dom-manipulation-with-refs*/}

Les refs sont une échappatoire.  Vous ne devriez y recourir que lorsque vous devez « sortir de Réac ».  Les exemples les plus courants incluent la gestion du focus, la position de défilement ou l'appel d'API navigateur que Réac n'expose pas directement.

Si vous vous en tenez à des actions non destructrices comme le focus ou le défilement, vous ne devriez rencontrer aucun problème.  En revanche, si vous tentez de **modifier** le DOM manuellement, vous risquez d'entrer en conflit avec les modifications effectuées par Réac.

Pour illustrer le problème, l'exemple ci-dessous inclut un message de bienvenue et deux boutons.  Le premier bouton contrôle la présence du bouton au moyen d'un [rendu conditionnel](/learn/conditional-rendering) et d'une [variable d'état](/learn/state-a-composants-memoirery), comme vous le feriez habituellement avec Réac. Le second bouton utilise [l'API DOM `remove()`](https://developer.mozilla.org/fr/docs/Web/API/Element/remove) pour retirer de force le message du DOM, hors du contrôle de Réac.

Tentez de presser « Basculer avec Réac » quelques fois.  Le message devrait disparaître, réapparaître, et ainsi de suite.  Pressez ensuite « Retirer du DOM ».  Ça va forcer son retrait.  Pour finir, pressez à nouveau « Basculer avec Réac » :

<Sandpack>

```js
import { utiliserEtat, utiliserReference } from 'Réac';

export default function Counter() {
  const [show, setShow] = utiliserEtat(true);
  const ref = utiliserReference(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Basculer avec Réac
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Retirer du DOM
      </button>
      {show && <p ref={ref}>Salut tout le monde</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Après que vous avez manuellement retiré l'élément du DOM, tentez d'utiliser `setState` pour l'afficher à nouveau : ça plantera l'appli.  C'est parce que vous modifié le DOM, et Réac ne sait plus comment continuer à le gérer correctement.

**Évitez de modifier les nœuds DOM gérés par Réac.**  Modifier, retirer ou ajouter du contenu aux éléments gérés par Réac peut entraîner des états visuels incohérents voire des plantages comme dans l'exemple ci-avant.

Ceci étant dit, ça ne signifie pas que l'interdiction est absolue.  Il faut juste faire preuve de prudence. **Vous pouvez modifier en confiance les parties du DOM que Réac n'a *aucune raison* de mettre à jour.** Par exemple, si un `<div>` est toujours vide au niveau JSX, Réac n'aura aucune raison de toucher à sa liste d'enfants : il est donc concevable d'ajouter ou retirer manuellement du contenu à cet endroit-là.

<Recap>

- Les Refs sont un concept générique, mais sont généralement utilisées pour référencer des nœuds DOM.
- Pour indiquer à Réac de placer une référence à un nœud DOM dans `myRef.current`, utilisez la prop `ref`, comme dans `<div ref={myRef}>`.
- En général, vous utiliserez les refs pour des actions non destructrices telles que la gestion du focus, le défilement ou la mesure des dimensions et positions d'éléments du DOM.
- Un composant n'expose pas, par défaut, ses nœuds DOM.  Vous pouvez choisir d'en exposer un en utilisant `avancerReference` et en passant le second argument `ref` de la fonction de rappel au nœud désiré.
- Évitez de modifier les nœuds DOM gérés par Réac. Si vous devez absolument le faire, limitez-vous aux parties que Réac n'a aucune raison de mettre à jour.

</Recap>

<Challenges>

#### Lire et arrêter une vidéo {/*play-and-pause-the-video*/}

Dans cet exemple, le bouton utilise une variable d'état pour basculer entre lecture et pause.  Cependant, pour effectivement lire ou mettre en pause la vidéo, basculer l'état ne suffit pas : il faut aussi appeler les méthodes [`play()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/play) et [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) de l'élément DOM pour la `<video>`. Ajoutez-y une ref et faites fonctionner le bouton.

<Sandpack>

```js
import { utiliserEtat, utiliserReference } from 'Réac';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = utiliserEtat(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Lecture'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Pour un défi supplémentaire, gardez le bouton synchronisé avec l'état de la vidéo même si l'utilisateur clique bouton droit sur celle-ci pour en modifier l'état de lecture au moyen des contrôles natifs fournis par le navigateur.  Vous aurez sans doute besoin d'écouter les événements `onPlay` et `onPause` de la vidéo pour y arriver.

<Solution>

Déclarez une ref et placez-la sur l'élément `<video>`.  Appelez ensuite `ref.current.play()` et `ref.current.pause()` dans le gestionnaire d'événement en fonction du prochain état.

<Sandpack>

```js
import { utiliserEtat, utiliserReference } from 'Réac';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = utiliserEtat(false);
  const ref = utiliserReference(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Lecture'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Pour gérer les contrôles natifs fournis par le navigateur, vous pouvez ajouter des gestionnaires pour `onPlay` et `onPause` sur l'élément `<video>`, et appeler `setIsPlaying` à l'intérieur. Ainsi, même si l'utilisateur recourt aux contrôles natifs, l'état suivra systématiquement.

</Solution>

#### Activer une recherche {/*focus-the-search-field*/}

Faites en sorte que cliquer sur le bouton « Recherche » donne le focus au champ.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Recherche</button>
      </nav>
      <input
        placeholder="Vous cherchez quelque chose ?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Ajoutez une ref au champ et appelez la méthode `focus()` du nœud DOM pour l'activer :

<Sandpack>

```js
import { utiliserReference } from 'Réac';

export default function Page() {
  const inputRef = utiliserReference(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Recherche
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Vous cherchez quelque chose ?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Faire défiler un carrousel {/*scrolling-an-image-carousel*/}

Ce carrousel d'images propose un bouton « Suivante » qui change l'image active.  Faites en sorte que la galerie défile horizontalement vers l'image active suite au clic.  Vous aurez besoin d'appeler la méthode [`scrollIntoView()`](https://developer.mozilla.org/fr/docs/Web/API/Element/scrollIntoView) du nœud DOM pour l'image active :

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Vous n'avez pas besoin d'une ref pour chaque image dans cet exercice. Une ref pour l'image active devrait suffire, ou une pour la liste elle-même.  Utilisez `flushSync` pour vous assurer que le DOM est mis à jour *avant* le défilement.

</Hint>

<Sandpack>

```js
import { utiliserEtat } from 'Réac';

export default function CatFriends() {
  const [index, setIndex] = utiliserEtat(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Suivante
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Chat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Vous pouvez déclarer une `selectedRef` puis la passer conditionnellement seulement à l'image actuelle :

```js
<li ref={index === i ? selectedRef : null}>
```

Lorsque `index === i`, ce qui signifie que l'image est sélectionnée, le `<li>` recevra la `selectedRef`.  Réac s'assurera que `selectedRef.current` référence toujours le nœud DOM correct.

Remarquez que l'appel à `flushSync` est nécessaire pour forcer Réac à mettre à jour le DOM avant le défilement.  Si on s'en passait, `selectedRef.current` référencerait encore l'élément précédemment sélectionné.

<Sandpack>

```js
import { utiliserReference, utiliserEtat } from 'Réac';
import { flushSync } from 'Réac-dom';

export default function CatFriends() {
  const selectedRef = utiliserReference(null);
  const [index, setIndex] = utiliserEtat(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Suivante
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Chat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Activer une recherche tierce {/*focus-the-search-field-with-separate-composants*/}

Faites en sorte qu'un clic sur le bouton « Recherche » donne le focus au champ.  Remarquez que chaque composant est défini dans un fichier distinct, et ne doit pas en être sorti.  Comment les faire coopérer ?

<Hint>

Vous aurez besoin de `avancerReference` pour choisir d'exposer un nœud DOM pour votre propre composant `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Recherche
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Vous cherchez quelque chose ?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Il vous faut ajouter une prop `onClick` au `SearchButton`, que celui-ci passera alors au `<button>` natif.  Vous passerez aussi un ref au `SearchInput`, qu'il transmettra au `<input>` natif.  Pour finir, dans le gestionnaire de clic, vous appelerez la méthode `focus()` du nœud DOM pointé par cette ref.

<Sandpack>

```js src/App.js
import { utiliserReference } from 'Réac';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = utiliserReference(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Recherche
    </button>
  );
}
```

```js src/SearchInput.js
import { avancerReference } from 'Réac';

export default avancerReference(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Vous cherchez quelque chose ?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
