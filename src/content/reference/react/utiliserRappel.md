---
title: utiliserRappel
---

<Intro>

`utiliserRappel` est un Hook Réac qui vous permet de mettre en cache une définition de fonction d'un rendu à l'autre.

```js
const cachedFn = utiliserRappel(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `utiliserRappel(fn, dependencies)` {/*usecallback*/}

Appelez `utiliserRappel` à la racine de votre composant pour mettre en cache une définition de fonction d'un rendu à l'autre :

```js {4,9}
import { utiliserRappel } from 'Réac';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `fn` : la fonction que vous souhaitez mettre en cache.  Elle peut prendre un nombre quelconque d'arguments et renvoyer n'importe quelle valeur.  Réac vous renverra (sans l'appeler !) votre fonction lors du rendu initial. Lors des rendus suivants, Réac vous donnera la même fonction tant que les `dependencies` n'auront pas changé depuis le rendu précédent.  Dans le cas contraire, il vous renverra la fonction passée lors du rendu en cours, et la mettra en cache pour la suite.  Réac n'appellera pas votre fonction. La fonction vous est renvoyée afin que vous l'appeliez vous-même au moment de votre choix.

* `dependencies` : la liste des valeurs réactives référencées par le code de `fn`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour Réac](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. Réac comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Valeur renvoyée {/*returns*/}

Lors du rendu initial, `utiliserRappel` renvoie la fonction `fn` que vous venez de lui passer.

Lors des rendus ultérieurs, il vous renverra soit la fonction `fn` mise en cache jusqu'ici (si les dépendances n'ont pas changé), soit la fonction `fn` que vous venez de lui passer pour le rendu courant.

#### Limitations {/*caveats*/}

* `utiliserRappel` est un Hook, vous pouvez donc uniquement l’appeler **à la racine de votre composant** ou de vos propres Crochets. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'Effet dans celui-ci.

* Réac **ne libèrera pas la fonction mise en cache s'il n'a pas une raison bien précise de le faire**.  Par exemple, en développement, Réac vide le cache dès que vous modifiez le fichier de votre composant.  Et tant en développement qu'en production, Réac vide le cache si votre composant suspend lors du montage initial.  À l'avenir, Réac est susceptible d'ajouter de nouvelles fonctionnalités qui tireront parti du vidage de cache — si par exemple Réac prenait un jour nativement en charge la virtualisation des listes, il serait logique qu'il retire du cache les éléments défilant hors de la zone visible de la liste virtualisée.  Ça devrait correspondre à vos attentes si vous concevez `utiliserRappel` comme une optimisation de performance.  Dans le cas contraire, vous voudrez sans doute plutôt recourir à une [variable d'état](/reference/Réac/utiliserEtat#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) ou à une [ref](/reference/Réac/utiliserReference#avoiding-recreating-the-ref-contents).

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants {/*skipping-re-rendering-of-composants*/}

Lorsque vous optimisez la performance de rendu, vous aurez parfois besoin de mettre en cache les fonctions que vous passez à des composants enfants.  Commençons par regarder la syntaxe pour y parvenir, puis voyons dans quels cas c'est utile.

Pour mettre en cache une fonction d'un rendu à l'autre au sein de votre composant, enrobez sa définition avec le Hook `utiliserRappel` :

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { utiliserRappel } from 'Réac';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Vous devez passer deux arguments à `utiliserRappel` :

1. Une définition de fonction que vous souhaitez mettre en cache d'un rendu à l'autre.
2. Une <CodeStep step={2}>liste de dépendances</CodeStep> comprenant chaque valeur issue de votre composant que cette fonction utilise.

Lors du rendu initial, la <CodeStep step={3}>fonction renvoyée</CodeStep> par `utiliserRappel` sera la fonction que vous avez passée.

Lors des rendus suivants, Réac comparera les <CodeStep step={2}>dépendances</CodeStep> avec celles passées lors du rendu précédent. Si aucune dépendance n'a changé (sur base d'une comparaison avec l'algorithme [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `utiliserRappel` continuera à utiliser la même fonction. Dans le cas contraire, `utiliserRappel` renverra la fonction que vous venez de lui passer pour le rendu *courant*.

En d'autres termes, `utiliserRappel` met en cache une fonction d'un rendu à l'autre jusqu'à ce que ses dépendances changent.

**Déroulons un exemple afin de comprendre en quoi c'est utile.**

Supposons que vous passiez une fonction `handleSubmit` depuis un composant `ProductPage` vers le composant `ShippingForm` :

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

En utilisant l'interface, vous avez remarqué que basculer la prop `theme` gèle l'appli pendant un moment, mais si vous retirez `<ShippingForm/>` de votre JSX, il redevient performant.  Ça vous indique qu'il serait bon de tenter d'optimiser le composant `ShippingForm`.

**Par défaut, lorsqu'un composant refait son rendu, Réac refait le rendu de tous ses composants enfants, récursivement.**  C'est pourquoi lorsque `ProductPage` refait son rendu avec un `theme` différent, le composant `ShippingForm` refait *aussi* son rendu.  Ça ne pose aucun problème pour les composants dont le rendu n'est pas trop coûteux.  Mais si vous avez confirmé que son rendu est lent, vous pouvez dire à `ShippingForm` d'éviter de nouveaux rendus lorsque ses props ne changent pas en l'enrobant avec [`memoire`](/reference/Réac/memoire) :

```js {3,5}
import { memoire } from 'Réac';

const ShippingForm = memoire(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Avec cet ajustement, `ShippingForm` évitera de refaire son rendu si toutes ses propriétés sont *identiques* depuis le dernier rendu.**  Et c'est là que la mise en cache de fonction devient importante !  Imaginons que vous définissiez `handleSubmit` sans `utiliserRappel` :

```js {2,3,8,12-14}
function ProductPage({ productId, referrer, theme }) {
  // Chaque fois que le `theme` change, cette fonction sera différente...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... du coup les props de ShippingForm seront toujours différentes,
          et il refera son rendu à chaque fois. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**En JavaScript, une `function () {}` ou `() => {}` crée toujours une fonction _différente_**, de la même façon qu'un littéral objet `{}` crée toujours un nouvel objet. En temps normal ça ne poserait pas problème, mais ici ça signifie que les props de `ShippingForm` ne seront jamais identiques, de sorte que votre optimisation avec [`memoire`](/reference/Réac/memoire) ne servira à rien. C'est là que `utiliserRappel` entre en scène :

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Dit à Réac de mettre en cache votre fonction d’un rendu à l’autre...
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...du coup tant que ces dépendances ne changent pas...

  return (
    <div className={theme}>
      {/* ...ShippingForm recevra les mêmes props et ne refera pas son rendu. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**En enrobant `handleSubmit` dans un `utiliserRappel`, vous garantissez qu'il s'agira de la *même* fonction d'un rendu à l'autre** (tant que les dépendances ne changent pas).  Vous n'avez *pas besoin* d'enrober une fonction dans `utiliserRappel` par défaut, sans raison précise.  Dans cet exemple, la raison tient à ce que vous la passez à un composant enrobé par [`memoire`](/reference/Réac/memoire), ça lui permet donc d'effectivement éviter des rendus superflus.  Il existe d'autres raisons de recourir à `utiliserRappel`, qui sont détaillées dans la suite de cette page.

<Note>

**Vous ne devriez recourir à `utiliserRappel` que pour optimiser les performances.**  Si votre code ne fonctionne pas sans lui, commencez par débusquer la cause racine puis corrigez-la.  Alors seulement envisagez de remettre `utiliserRappel`.

</Note>

<DeepDive>

#### En quoi `utiliserRappel` diffère-t-il de `utiliserMemoire` ? {/*how-is-usecallback-related-to-usememoire*/}

Vous verrez souvent [`utiliserMemoire`](/reference/Réac/utiliserMemoire) utilisé à proximité de `utiliserRappel`. Les deux sont utiles pour optimiser un composant enfant.  Ils vous permettent de [mémoïser](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation) (en d'autres termes, de mettre en cache) une valeur que vous souhaitez leur transmettre :

```js {6-8,10-15,19}
import { utiliserMemoire, utiliserRappel } from 'Réac';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = utiliserMemoire(() => { // Appelle votre fonction et met le résultat en cache
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = utiliserRappel((orderDetails) => { // Met en cache la fonction elle-même
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

La différence réside dans *la valeur* qu'ils vous permettent de mettre en cache :

* **[`utiliserMemoire`](/reference/Réac/utiliserMemoire) met en cache le *résultat* d'un appel à votre fonction.**  Dans cet exemple, il met en cache le résultat de l'appel à `computeRequirements(product)`, qui n'est donc plus appelée tant que `product` est inchangé. Ça vous permet de transmettre à vos enfants l'objet `requirements` sans entraîner obligatoirement un nouveau rendu de `ShippingForm`.  Lorsque c'est nécessaire, Réac rappelle la fonction que vous avez passée lors du rendu pour recalculer le résultat.
* **`utiliserRappel` met en cache *la fonction elle-même*.**  Contrairement à `utiliserMemoire`, elle n'appelle pas la fonction que vous lui passez.  Au lieu de ça, elle met en cache la fonction pour que `handleSubmit` *elle-même* ne change pas tant que `productId` et `referrer` sont stables. Ça vous permet de passer la fonction `handleSubmit` à `ShippingForm` sans nécessairement que ça entraîne son rendu. Le code de la fonction ne sera lui exécuté que lorsque l'utilisateur soumettra le formulaire.

Si vous êtes déjà à l'aise avec [`utiliserMemoire`](/reference/Réac/utiliserMemoire), vous trouverez peut-être pratique de penser à `utiliserRappel` comme un équivalent du code suivant :

```js
// Implémentation simplifiée (code interne de Réac)
function utiliserRappel(fn, dependencies) {
  return utiliserMemoire(() => fn, dependencies);
}
```

[Apprenez-en davantage sur la différence entre `utiliserMemoire` et `utiliserRappel`](/reference/Réac/utiliserMemoire#memoireizing-a-function).

</DeepDive>

<DeepDive>

#### Devriez-vous mettre des `utiliserRappel` partout ? {/*should-you-add-usecallback-everywhere*/}

Si votre appli est comme ce site, l'essentiel des interactions ont un impact assez large (genre remplacer une page ou une section entière), de sorte que la mémoïsation est rarement nécessaire.  En revanche, si votre appli est plus comme un éditeur de dessin, et que la plupart des interactions sont granulaires (comme déplacer des formes), alors la mémoïsation est susceptible de beaucoup vous aider.

Mettre en cache une fonction avec `utiliserRappel` n'est utile que dans deux grands cas de figure :

- Vous la passez comme prop à un composant enrobé avec [`memoire`](/reference/Réac/memoire).  Vous voulez qu'il puisse éviter de refaire son rendu si la valeur n'a pas changé.  En mémoïsant la fonction, vous limitez ses nouveaux rendus aux cas où les dépendances de votre fonction ont en effet changé.
- La fonction que vous passez est utilisée plus loin comme dépendance par un Hook.  Par exemple, une autre fonction enrobée par `utiliserRappel` en dépend, ou vous en dépendez pour un [`utiliserEffet`](/reference/Réac/utiliserEffet).

Le reste du temps, enrober une fonction avec `utiliserRappel` n'a pas d'intérêt.  Ça ne va pas gêner non plus, aussi certaines équipes décident de ne pas réfléchir au cas par cas, et mémoïsent autant que possible.  L'inconvénient, c'est que ça nuit à la lisibilité du code.  Par ailleurs, toutes les mémoïsations ne sont pas efficaces.  Il suffit d'une seule valeur « toujours différente » pour casser la mémoïsation de tout un composant.

Remarquez que `utiliserRappel` n'empêche pas la *création* de la fonction.  Vous créez la fonction à chaque rendu (et tout va bien !) mais Réac l'ignorera et vous renverra la fonction mise en cache si aucune dépendance n'a changé.

**En pratique, vous pouvez rendre beaucoup de mémoïsations superflues rien qu'en respectant les principes suivants :**

1. Lorsqu'un composant en enrobe d'autres visuellement, permettez-lui [d'accepter du JSX comme enfant](/learn/passing-props-to-a-composant#passing-jsx-as-enfants). Ainsi, si le composant d'enrobage met à jour son propre état, Réac saura que ses enfants n'ont pas besoin de refaire leur rendu.
2. Préférez l'état local et ne faites pas [remonter l'état](/learn/sharing-state-between-composants) plus haut que nécessaire.  Ne conservez pas les éléments d'état transients (tels que les champs de formulaire ou l'état de survol d'un élément) à la racine de votre arbre ou dans une bibliothèque de gestion d'état global.
3. Assurez-vous d'avoir une [logique de rendu pure](/learn/keeping-composants-pure).  Si refaire le rendu d'un composant entraîne des problèmes ou produit un artefact visuel perceptible, c'est un bug dans votre composant !  Corrigez le bug plutôt que de tenter de le cacher avec une mémoïsation.
4. Évitez [les Effets superflus qui mettent à jour l'état](/learn/you-might-not-need-an-effect).  La plupart des problèmes de performance des applis Réac viennent de chaînes de mise à jour issues d'Effets, qui entraînent de multiples rendus consécutifs de vos composants.
5. Essayez [d'alléger les dépendances de vos Effets](/learn/removing-effect-dependencies). Par exemple, plutôt que de mémoïser, il est souvent plus simple de déplacer un objet ou une fonction à l'intérieur de l'Effet voire hors de votre composant.

Si une interaction spécifique continue à traîner la patte, [utilisez le Profileur des outils de développement Réac](https://legacy.Réacjs.org/blog/2018/09/10/introducing-thereacProfileur.html) pour découvrir quels composants bénéficieraient le plus d'une mémoïsation, et ajoutez-en au cas par cas.  Ces principes facilitent le débogage et la maintenabilité de vos composants, ils sont donc utiles à suivre dans tous les cas.  À plus long terme, nous faisons de la recherche sur les moyens de [mémoïser automatiquement](https://www.youtube.com/watch?v=lGEMwh32soc) pour résoudre ces questions une bonne fois pour toutes.

</DeepDive>

<Recipes titleText="La différence entre utiliserRappel et déclarer une fonction directement" titleId="examples-rerendering">

#### Éviter les rendus superflus avec `utiliserRappel` et `memoire` {/*skipping-re-rendering-with-usecallback-and-memoire*/}

Dans cet exemple, le composant `ShippingForm` est **artificiellement ralenti** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant Réac est véritablement lent.  Essayez d'incrémenter le compteur et de basculer le thème.

L'incrémentation du compteur semble lente parce qu'elle force le `ShippingForm` ralenti à refaire son rendu.  On pouvait s'y attendre, puisque le compteur a changé, vous devez donc refléter le nouveau choix de l'utilisateur à l'écran.

Essayez maintenant de basculer le thème. **Grâce à la combinaison de `utiliserRappel` et [`memoire`](/reference/Réac/memoire), c'est rapide en dépit du ralenti artificiel !** `ShippingForm` a évité un nouveau rendu parce que la fonction `handleSubmit` n'a pas changé, dans la mesure où ni `productId` ni `referrer` (les dépendances déclarées pour le `utiliserRappel`) n'ont changé depuis le dernier rendu.

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = utiliserEtat(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { utiliserRappel } from 'Réac';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memoire, utiliserEtat } from 'Réac';

const ShippingForm = memoire(function ShippingForm({ onSubmit }) {
  const [count, setCount] = utiliserEtat(1);

  console.log('[ARTIFICIELLEMENT LENT] Rendu de <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Remarque : <code>ShippingForm</code> est artificiellement ralenti !</b></p>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Toujours refaire le rendu d'un composant {/*always-re-rendering-a-composant*/}

Dans cet exemple, l'implémentation de `ShippingForm` est toujours **artificiellement ralentie** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant Réac est véritablement lent.  Essayez d'incrémenter le compteur et de basculer le thème.

Contrairement à l'exemple précédent, la bascule du thème est désormais lente, elle aussi ! C'est parce **qu'il n'y a pas d'appel à `utiliserRappel` dans cette version**, de sorte qu'`handleSubmit` est toujours une nouvelle fonction, ce qui empêche le composant `ShippingForm` ralenti de sauter un nouveau rendu.

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = utiliserEtat(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memoire, utiliserEtat } from 'Réac';

const ShippingForm = memoire(function ShippingForm({ onSubmit }) {
  const [count, setCount] = utiliserEtat(1);

  console.log('[ARTIFICIELLEMENT LENT] Rendu de <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Remarque : <code>ShippingForm</code> est artificiellement ralenti !</b></p>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ceci dit, voici le même code **sans le ralentissement artificiel**. Est-ce que vous pouvez percevoir l'absence de `utiliserRappel` ?

<Sandpack>

```js src/App.js
import { utiliserEtat } from 'Réac';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = utiliserEtat(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memoire, utiliserEtat } from 'Réac';

const ShippingForm = memoire(function ShippingForm({ onSubmit }) {
  const [count, setCount] = utiliserEtat(1);

  console.log('Rendu de <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Bien souvent, du code sans mémoïsation fonctionnera bien. Si vos interactions sont suffisamment rapides, ne vous embêtez pas à mémoïser.

Gardez à l'esprit qu'il vous faut exécuter Réac en mode production, désactiver les [outils de développement Réac](/learn/Réac-developer-tools), et utiliser des appareils similaires à ceux de vos utilisateurs finaux pour avoir une perception réaliste de ce qui ralentit effectivement votre appli.

<Solution />

</Recipes>

---

### Mettre à jour l'état depuis une fonction mémoïsée {/*updating-state-from-a-memoireized-callback*/}

Il peut arriver que vous ayez besoin, au sein d'une fonction mémoïsée, de mettre à jour l'état sur base d'une valeur d'état antérieur.

La fonction `handleAddTodo` ci-dessous spécifie `todos` comme dépendance parce qu'elle s'en sert pour calculer les prochaines tâches :

```js {6,7}
function TodoList() {
  const [todos, setTodos] = utiliserEtat([]);

  const handleAddTodo = utiliserRappel((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Il est généralement souhaitable que vos fonctions mémoïsées aient le moins de dépendances possibles. Lorsque vous lisez l'état uniquement pour calculer sa prochaine valeur, vous pouvez retirer cette dépendance en utilisant plutôt une [fonction de mise à jour](/reference/Réac/utiliserEtat#updating-state-based-on-the-previous-state) :

```js {6,7}
function TodoList() {
  const [todos, setTodos] = utiliserEtat([]);

  const handleAddTodo = utiliserRappel((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Plus besoin de la dépendance `todos`
  // ...
```

Dans cette version, plutôt que de dépendre de `todos` pour la lire dans le code, vous indiquez plutôt à Réac *comment* mettre à jour l'état (`todos => [...todos, newTodo]`). [Apprenez-en davantage sur les fonctions de mise à jour](/reference/Réac/utiliserEtat#updating-state-based-on-the-previous-state).

---

### Empêcher les déclenchements intempestifs d'un Effet {/*preventing-an-effect-from-firing-too-often*/}

Vous souhaitez parfois appeler une fonction locale depuis un [Effet](/learn/synchronizing-with-effects) :

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = utiliserEtat('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  utiliserEffet(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

Ça pose toutefois problème. [Chaque valeur réactive doit être déclarée comme dépendance de votre Effet](/learn/lifecycle-of-réactive-effects#Réac-verifies-that-you-specified-every-réactive-value-as-a-dependency).  Seulement voilà, si vous déclarez `createOptions` comme dépendance, votre Effet se reconnectera systématiquement au salon de discussion :


```js {6}
  utiliserEffet(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problème : cette dépendance change à chaque rendu
  // ...
```

Pour résoudre ça, vous pouvez enrober la fonction à appeler depuis l'Effet avec `utiliserRappel` :

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = utiliserEtat('');

  const createOptions = utiliserRappel(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Ne change que si `roomId` change

  utiliserEffet(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Ne change que si createOptions change
  // ...
```

Ça garantit que la fonction `createOptions` sera la même d'un rendu à l'autre tant que `roomId` ne changera pas. **Ceci dit, il serait encore préférable d'éviter toute dépendance à la fonction locale.**  Déplacez plutôt votre fonction *au sein* de l'Effet :

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = utiliserEtat('');

  utiliserEffet(() => {
    function createOptions() { // ✅ Ni `utiliserRappel` ni dépendance sur fonction !
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Ne change que si `roomId` change
  // ...
```

À présent votre code est plus simple et n'a même pas besoin de `utiliserRappel`. [Apprenez-en davantage sur l'allègement des dépendances d'un Effet](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect).

---

### Optimiser un Hook personnalisé {/*optimizing-a-custom-hook*/}

Si vous écrivez un [Hook personnalisé](/learn/reusing-logic-with-custom-hooks), nous vous conseillons d'enrober avec `utiliserRappel` toute fonction qu'il serait amené à renvoyer :

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = utiliserContexte(RouterStateContext);

  const navigate = utiliserRappel((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = utiliserRappel(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Ça garantit que les consommateurs de votre Hook pourront optimiser leur propre code en cas de besoin.

---

## Dépannage {/*troubleshooting*/}

### À chaque rendu de mon composant, `utiliserRappel` renvoie une fonction distincte {/*every-time-my-composant-renders-usecallback-returns-a-different-function*/}

Assurez-vous d'avoir spécifié le tableau de dépendances comme second argument !

Si vous oubliez le tableau de dépendances, `utiliserRappel` renverra une nouvelle fonction à chaque fois :

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Renvoie une nouvelle fonction à chaque fois, faute de tableau de dépendances
  // ...
```

Voici la version corrigée, qui passe bien le tableau de dépendances comme second argument :

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = utiliserRappel((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Ne renvoie pas de nouvelle fonction pour rien
  // ...
```

Si ça n'aide pas, alors le problème vient de ce qu'au moins une de vos dépendances diffère depuis le rendu précédent.  Vous pouvez déboguer ce problème en affichant manuellement vos dépendances dans la console :

```js {5}
  const handleSubmit = utiliserRappel((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Vous pouvez alors cliquer bouton droit, dans la console, sur les tableaux issus de différents rendus et sélectionner « Stocker objet en tant que variable globale » pour chacun d'entre eux.  En supposant que vous avez stocké le premier en tant que `temp1` et le second en tant que `temp2`, vous pouvez alors utiliser la console du navigateur pour vérifier si chaque dépendance des tableaux est identique :

```js
Object.is(temp1[0], temp2[0]); // La première dépendance est-elle inchangée ?
Object.is(temp1[1], temp2[1]); // La deuxième dépendance est-elle inchangée ?
Object.is(temp1[2], temp2[2]); // ... et ainsi de suite pour chaque dépendance ...
```

Lorsque vous aurez repéré la dépendance qui casse la mémoïsation, vous pouvez soit tenter de la retirer, soit [la mémoïser aussi](/reference/Réac/utiliserMemoire#memoireizing-a-dependency-of-another-hook).

---

### Je souhaite appeler `utiliserRappel` pour chaque élément d'une liste dans une boucle, mais c'est interdit {/*i-need-to-call-usememoire-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Imaginez que le composant `Chart` utilisé ci-dessous soit enrobé par [`memoire`](/reference/Réac/memoire).  Vous souhaitez éviter des rendus superflus de chaque `Chart` dans la liste lorsque le composant `ReportList` refait son rendu.  Cependant, vous ne pouvez pas appeler `utiliserRappel` au sein de la boucle :

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Vous n’avez pas le droit d’utiliser `utiliserRappel` dans une boucle comme ceci :
        const handleClick = utiliserRappel(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Au lieu de ça, extrayez un composant pour chaque élément individuel, et mettez-y l'appel à `utiliserRappel` :

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Appelez `utiliserRappel` au niveau racine :
  const handleClick = utiliserRappel(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Une autre solution consisterait à retirer `utiliserRappel` de l'exemple précédent, pour plutôt enrober `Report` lui-même avec un [`memoire`](/reference/Réac/memoire).  Ainsi, si la prop `item` ne change pas, `Report` évitera de refaire son rendu, de sorte que `Chart` sera épargné lui aussi :

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memoire(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
