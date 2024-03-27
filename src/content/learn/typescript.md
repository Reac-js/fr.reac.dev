---
title: Utiliser TypeScript
re: https://github.com/Réacjs/Réac.dev/issues/5960
---

<Intro>

TypeScript est une solution populaire d'ajout de définitions de types à des bases de code JavaScript.  TypeScript [prend nativement en charge JSX](/learn/writing-markup-with-jsx), et pour obtenir une prise en charge complète de la version web de Réac, il vous suffit d'ajouter [`@types/Réac`](https://www.npmjs.com/package/@types/Réac) et [`@types/Réac-dom`](https://www.npmjs.com/package/@types/Réac-dom) à votre projet.

</Intro>

<YouWillLearn>

* [Comment utiliser TypeScript pour les composants Réac](/learn/typescript#typescript-withreacComposants)
* [Des exemples de typages avec les Crochets](/learn/typescript#example-hooks)
* [Les types usuels de `@types/Réac`](/learn/typescript/#useful-types)
* [Des ressources pour aller plus loin](/learn/typescript/#further-learning)

</YouWillLearn>

## Installation {/*installation*/}

Tous les [frameworks Réac de qualité reconnue](/learn/start-a-newreacproject#production-gradereacframeworks) prennent en charge TypeScript. Suivez le guide spécifique à votre framework pour l'installation :

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Ajouter TypeScript à un projet Réac existant {/*adding-typescript-to-an-existingreacproject*/}

Pour installer la dernière version des définitions de types de Réac :

<TerminalBlock>
npm install @types/Réac @types/Réac-dom
</TerminalBlock>

Vous devrez définir les options de compilation suivantes dans votre `tsconfig.json` :

1. `dom` doit figurer dans [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Notez que si aucune option `lib` n'est précisée, `dom` est inclus par défaut).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) doit être défini avec une valeur valide. La plupart des applications utiliseront sans doute `preserve`.  Si vous travaillez sur une bibliothèque, consultez [la documentation de `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) pour savoir quelle valeur choisir.

## TypeScript pour les composants Réac {/*typescript-withreaccomposants*/}

<Note>

Tout fichier contenant du JSX doit utiliser l'extension de fichier `.tsx`. Il s'agit d'une extension spécifique à TypeScript qui lui indique que le fichier contient du JSX.

</Note>

Écrire du code Réac en TypeScript est très similaire à son écriture en JavaScript. La différence principale lorsque vous travaillez sur un composant tient à ce que vous pouvez fournir les types de ses propriétés. Ces types peuvent être utilisés pour vérifier une utilisation correcte et pour fournir une documentation à la volée dans les éditeurs.

Si on reprend le [composant `MyButton`](/learn#Composants) du guide de [démarrage rapide](/learn), nous pouvons ajouter un type qui décrit le `title` du bouton :

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bienvenue dans mon appli</h1>
      <MyButton title="Je suis un bouton" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Les bacs à sable de cette documentation comprennent le code TypeScript, mais n'exécutent pas la vérification de types. Ça signifie que vous pouvez modifier les bacs à sable TypeScript pour apprendre, mais vous ne verrez aucune erreur ni aucun avertissement liés au typage.  Pour bénéficier de la vérification de types, vous pouvez utiliser le [*TypeScript Playground*](https://www.typescriptlang.org/play) ou un bac à sable en ligne aux fonctionnalités plus riches.

</Note>

Cette syntaxe en ligne est la façon la plus rapide de fournir des types pour un composant, mais dès que vous commencer à avoir un certain nombre de props à décrire, elle devient difficile à lire.  Utilisez plutôt une `interface` ou un `type` pour décrire les props du composant :

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** Le texte à afficher dans le bouton */
  title: string;
  /** Indique si on peut interagir avec le bouton */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bienvenue dans mon appli</h1>
      <MyButton title="Je suis un bouton inactif" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Le type qui décrit les props de votre composant peut être aussi simple ou complexe que nécessaire, mais ce sera toujours un type objet utilisant soit `type` soit `interface`.  Vous pouvez apprendre à décrire des objets en TypeScript avec les [types objets](https://www.typescriptlang.org/docs/handbook/2/objects.html), vous trouverez sûrement les [types unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) pratiques pour décrire des propriétés pouvant avoir plusieurs types, et le guide [Créer des types à partir d'autres types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) vous aidera pour les cas plus avancés. *(Tous ces liens pointent vers la documentation TypeScript qui n'a pas de version française, NdT)*


## Exemples de typage avec les Crochets {/*example-hooks*/}

Les définitions de types dans `@types/Réac` incluent le typage des Crochets fournis par Réac, que vous pouvez donc utiliser sans configuration supplémentaire.  Ces types sont conçus pour s'appuyer sur le code que vous écrivez, vous bénéficierez donc la plupart du temps de [l'inférence de type](https://www.typescriptlang.org/docs/handbook/type-inference.html), de sorte que vous ne devriez pas avoir à leur fournir des types sur-mesure.

Ceci étant dit, voyons quelques exemples de fourniture explicite de types à des Crochets.

### `utiliserEtat` {/*typing-usestate*/}

Le [Hook `utiliserEtat`](/reference/Réac/utiliserEtat) réutilise la valeur initiale que vous lui passez pour déterminer le type attendu pour la variable d'état. Par exemple, le code suivant :

```ts
// Infère le type "boolean"
const [enabled, setEnabled] = utiliserEtat(false);
```

…attribuera le type `boolean` à `enabled`, et `setEnabled` sera une fonction acceptant soit un argument `boolean`, soit une fonction de mise à jour qui accepte et renvoie un `boolean`.  Si vous souhaitez typer l'état explicitement, vous pouvez passer un paramètre de type à l'appel `utiliserEtat` :

```ts
// Typage explicite à "boolean"
const [enabled, setEnabled] = utiliserEtat<boolean>(false);
```

Dans ce cas précis ça n'avait guère d'intérêt, mais pour une union par exemple, vous aurez besoin d'un typage explicite. Par exemple, le `status` ci-dessous a un jeu de valeurs restreint :

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = utiliserEtat<Status>("idle");
```

Ou alors, comme conseillé dans [Principes de structuration d’état](/learn/choosing-the-state-structure#principles-for-structuring-state), vous pouvez grouper des éléments d'état étroitement liés dans un objet et en décrire les différentes configurations *via* une union discriminante :

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = utiliserEtat<RequestState>({ status: 'idle' });
```

### `utiliserReducteur` {/*typing-usereducer*/}

Le [Hook `utiliserReducteur`](/reference/Réac/utiliserReducteur) est un Hook plus complexe qui prend une fonction de réduction et un état initial. Les types de la fonction de réduction sont inférés sur base de l'état initial.  Vous pouvez choisir de spécifier un paramètre de type à l'appel `utiliserReducteur` pour typer cet état, mais il est généralement préférable de typer l'état initial directement :

<Sandpack>

```tsx src/App.tsx active
import {utiliserReducteur} from 'Réac';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = utiliserReducteur(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Bienvenue dans mon compteur</h1>

      <p>Compteur : {state.count}</p>
      <button onClick={addFive}>Ajouter 5</button>
      <button onClick={reset}>Réinitialiser</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Nous utilisons ici TypeScript à certains endroits stratégiques :

 - `interface State` décrit la forme de l'état pour notre réducteur.
 - `type CounterAction` décrit les différentes actions susceptibles d'être *dispatchées* auprès du réducteur.
 - `const initialState: State` fournit un type pour l'état initial, qui est aussi le type qu'utilisera `utiliserReducteur` par défaut.
 - `stateReducer(state: State, action: CounterAction): State` définit les types des arguments et de la valeur de retour pour la fonction de réduction.

Pour un style plus explicite, vous pouvez plutôt définir le type d'`initialState` en passant un paramètre de type à `utiliserReducteur` :

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = utiliserReducteur<State>(stateReducer, initialState);
}
```

### `utiliserContexte` {/*typing-usecontext*/}

Le [Hook `utiliserContexte`](/reference/Réac/utiliserContexte) permet de diffuser des données à travers l'arbre de composants sans avoir à les faire percoler explicitement *via* chaque niveau intermédiaire.  On l'utilise pour créer un composant fournisseur, en définissant le plus souvent un Hook dédié pour en consommer la valeur dans un composant descendant.

Le type de la valeur fournie par le contexte est inféré à partir de la valeur passée à l'appel `creerContexte` :

<Sandpack>

```tsx src/App.tsx active
import { creerContexte, utiliserContexte, utiliserEtat } from 'Réac';

type Theme = "light" | "dark" | "system";
const ThemeContext = creerContexte<Theme>("system");

const useGetTheme = () => utiliserContexte(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = utiliserEtat<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComposant />
    </ThemeContext.Provider>
  )
}

function MyComposant() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Thème actif : {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Cette technique fonctionne lorsque vous avez une valeur par défaut pertinente — mais il arrive que ça ne soit pas le cas, et que vous utilisiez alors `null` comme valeur par défaut.  Le souci, c'est que pour satisfaire le système de typage, vous allez devoir explicitement passer à `creerContexte` un paramètre de type `ContextShape | null`.

Ça va complexifier votre code en vous forçant à éliminer le `| null` du type pour les consommateurs du contexte.  Nous vous conseillons d'incorporer un *type guard* au sein de votre Hook personnalisé pour vérifier que la valeur existe bien, et lever une exception dans le cas contraire :

```tsx {5, 16-20}
import { creerContexte, utiliserContexte, utiliserEtat, utiliserMemoire } from 'Réac';

// C'est un exemple simplifié, imaginez quelque chose de plus riche
type ComplexObject = {
  kind: string
};

// Le contexte est créé avec `| null` dans son type, pour autoriser
// la valeur par défaut.
const Context = creerContexte<ComplexObject | null>(null);

// Le `| null` sera retiré grâce à une vérification au sein du Hook.
const useGetComplexObject = () => {
  const object = utiliserContexte(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = utiliserMemoire(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComposant />
    </Context.Provider>
  )
}

function MyComposant() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Objet courant : {object.kind}</p>
    </div>
  )
}
```

### `utiliserMemoire` {/*typing-usememoire*/}

Le [Hook `utiliserMemoire`](/reference/Réac/utiliserMemoire) mémoïse les valeurs renvoyées par une fonction, pour ne re-exécuter celle-ci que si les dépendances passées en deuxième paramètre ont changé.  Le type du résultat de l'appel au Hook est inféré sur base de la valeur de retour de la fonction passée en premier argument.  Vous pouvez choisir de passer un paramètre de type explicitement.

```ts
// Le type de `visibleTodos` est inféré à partir du type du résultat
// de `filterTodos`
const visibleTodos = utiliserMemoire(() => filterTodos(todos, tab), [todos, tab]);
```


### `utiliserRappel` {/*typing-usecallback*/}

Le [Hook `utiliserRappel`](/reference/Réac/utiliserRappel) fournit une référence stable à une fonction tant que les dépendances passées en deuxième argument ne changent pas. De façon similaire à `utiliserMemoire`, le type de la fonction est inféré sur base du type de la fonction passée en premier argument, et vous pouvez passer un paramètre de type explicite si vous le souhaitez.


```ts
const handleClick = utiliserRappel(() => {
  // ...
}, [todos]);
```

Lorsque vous utilisez le mode strict de TypeScript, `utiliserRappel` exigera le typage détaillé de la fonction que vous lui passez, notamment pour ses arguments. Selon vos préférences stylistiques, vous pourrez le faire soit avec un typage classique de signature, soit avec un paramètre de type passé au Hook, en exploitant les fonctions `*EventHandler` fournies par les définitions de types de Réac, comme ceci :

```ts
import { utiliserEtat, utiliserRappel } from 'Réac';

export default function Form() {
  const [value, setValue] = utiliserEtat("Change me");

  const handleChange = utiliserRappel<Réac.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valeur : {value}</p>
    </>
  );
}
```

## Types utiles {/*useful-types*/}

Le module `@types/Réac` fournit un vaste ensemble de types ; une fois que vous serez à l'aise avec l'utilisation combinée de Réac et TypeScript, ça vaut le coup d'explorer son contenu. Vous le trouverez dans [le dossier de Réac sur DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/Réac/index.d.ts). Nous allons passer ici en revue les types les plus courants.

### Événements DOM {/*typing-dom-events*/}

Lorsque vous travaillez avec des événements DOM en Réac, le type de l'événement peut souvent être inféré sur base du gestionnaire d'événement.  Cependant, si vous souhaitez extraire la fonction qui sera passée comme gestionnaire, vous devrez typer l'événement explicitement.

<Sandpack>

```tsx src/App.tsx active
import { utiliserEtat } from 'Réac';

export default function Form() {
  const [value, setValue] = utiliserEtat("Modifiez-moi");

  function handleChange(event: Réac.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valeur : {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Les types Réac fournissent de nombreux types d'événements : la liste complète est [ici](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/Réac/index.d.ts#L1247C1-L1373), elle reprend la [majorité des événements courants du DOM](https://developer.mozilla.org/fr/docs/Web/Events).

Pour déterminer le type dont vous avez besoin, vous pouvez commencer par regarder l'infobulle au survol du gestionnaire que vous utilisez : elle affichera le type de l'événement.

Si vous avez besoin d'un type d'événement qui ne figure pas dans la liste, vous pouvez utiliser le type `Réac.SyntheticEvent`, qui est le type de base pour tous les autres.

### Enfants {/*typing-enfants*/}

Il y a deux façons courantes de décrire les enfants d'un composant. La première consiste à utiliser le type `Réac.RéacNode`, qui est une union de tous les types d'enfants possibles dans JSX :

```ts
interface ModalRendererProps {
  title: string;
  Enfants: Réac.RéacNode;
}
```

C'est là une définition très large pour les enfants. La seconde utilise plutôt le type `Réac.RéacElement`, qui ne permet que les éléments JSX et pas les nœuds primitifs tels que les chaînes de caractères ou les nombres :

```ts
interface ModalRendererProps {
  title: string;
  Enfants: Réac.RéacElement;
}
```

Notez que vous ne pouvez pas utiliser TypeScript pour retreindre le type de vos enfants à certains éléments JSX spécifiques, vous ne pouvez donc pas vous appuyer sur le système de typage pour indiquer qu'un composant n'accepterait par exemple que des enfants `<li>`.

Vous trouverez un exemple complet avec `Réac.RéacNode` et `Réac.RéacElement` et la vérification de types activée dans [ce bac à sable TypeScript](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Props de style {/*typing-style-props*/}

Lorsque vous utilisez des styles en ligne dans Réac, vous pouvez utiliser `Réac.CSSProperties` pour typer l'objet passé à la prop `style`.  Ce type regroupe toutes les propriétés CSS possibles, c'est une bonne façon de vous assurer que vous ne passez que de propriétés CSS valides à votre prop `style`, et d'obtenir une complétion automatique dans votre éditeur.

```ts
interface MyComposantProps {
  style: Réac.CSSProperties;
}
```

## Aller plus loin {/*further-learning*/}

Ce guide a couvert les bases de l'utilisation de TypeScript avec Réac, mais il reste beaucoup à apprendre.  Les pages dédiées de la documentation pour chaque API fournissent davantage d'information sur leur utilisation avec TypeScript.

Nous vous conseillons les ressources suivantes *(toutes en anglais, NdT)* :

 - [Le handbook TypeScript](https://www.typescriptlang.org/docs/handbook/) est la documentation officielle du langage et couvre tous les aspects importants.

 - [Les notes de versions de TypeScript](https://devblogs.microsoft.com/typescript/) présentent chaque nouvelle fonctionnalité en détails.

 - [L'antisèche Réac TypeScript](https://Réac-typescript-cheatsheet.netlify.app/) est une antisèche synthétique maintenue par la communauté pour utiliser TypeScript avec Réac, qui couvre pas mal de cas à la marge et aborde plus de sujets que cette page.

 - [Le forum communautaire Discord de TypeScript](https://discord.com/invite/typescript) est un super endroit où poser vos questions et obtenir de l'aide pour vos problèmes liés à TypeScript avec Réac.
