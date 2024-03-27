---
title: utiliserPoigneeImperative
---

<Intro>

`utiliserPoigneeImperative` est un Hook Réac qui vous permet de personnaliser la référence exposée comme [ref](/learn/manipulating-the-dom-with-refs).

```js
utiliserPoigneeImperative(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `utiliserPoigneeImperative(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Appelez `utiliserPoigneeImperative` au niveau racine de votre composant pour personnaliser la ref qu'il expose :

```js
import { avancerReference, utiliserPoigneeImperative } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  utiliserPoigneeImperative(ref, () => {
    return {
      // ... vos méthodes ...
    };
  }, []);
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `ref` : la `ref` que vous avez reçue comme second argument depuis la [fonction de rendu de `avancerReference`](/reference/Réac/avancerReference#render-function).

* `createHandle` : une fonction ne prenant aucun argument, qui renvoie la ref que vous souhaitez effectivement exposer.  Cette ref peut être de n'importe quel type.  En général, vous renverrez un objet avec les méthodes que vous souhaitez exposer.

* `dependencies` **optionnelles** : la liste des valeurs réactives référencées par le code de `createHandle`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour Réac](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. Réac comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si un nouveau rendu résulte d'une modification à une dépendance, ou si vous avez omis cet argument, la fonction `createHandle` sera réexécutée et la référence fraîchement créée sera affectée à la ref.

#### Valeur renvoyée {/*returns*/}

`utiliserPoigneeImperative` renvoie `undefined`.

---

## Utilisation {/*usage*/}

### Fournir une référence personnalisée au composant parent {/*exposing-a-custom-ref-handle-to-the-parent-composant*/}

Par défaut, les composants n'exposent pas leurs nœuds DOM aux composants parents. Par exemple, si vous souhaitez que le composant parent de `MyInput` [ait accès](/learn/manipulating-the-dom-with-refs) au nœud DOM `<input>`, vous devez le permettre explicitement avec [`avancerReference`](/reference/Réac/avancerReference) :

```js {4}
import { avancerReference } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Dans le code ci-avant, [une ref à `MyInput` recevra le nœud DOM `<input>`](/reference/Réac/avancerReference#exposing-a-dom-node-to-the-parent-composant).  Cependant, vous pouvez plutôt exposer une valeur personnalisée. Pour définir vous-même la référence à exposer, appelez `utiliserPoigneeImperative` au niveau racine de votre composant :

```js {4-8}
import { avancerReference, utiliserPoigneeImperative } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  utiliserPoigneeImperative(ref, () => {
    return {
      // ... vos méthodes ...
    };
  }, []);

  return <input {...props} />;
});
```

Remarquez que dans le code ci-avant, la `ref` n'est plus transmise au `<input>`.

Supposons par exemple que vous ne souhaitiez pas exposer l'intégralité du nœud DOM `<input>`, mais seulement deux de ses méthodes : `focus` et `scrollIntoView`. Pour y parvenir, conservez le véritable nœud DOM dans une ref distincte, puis utilisez `utiliserPoigneeImperative` pour exposer un objet avec seulement les méthodes que vous souhaitez permettre au composant parent d'appeler :

```js {7-14}
import { avancerReference, utiliserReference, utiliserPoigneeImperative } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  const inputRef = utiliserReference(null);

  utiliserPoigneeImperative(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Désormais, si le composant parent récupère une ref sur `MyInput`, il ne pourra plus appeler que ses méthodes `focus` et `scrollIntoView`.  Il n'aura pas un accès complet au nœud DOM `<input>` sous-jacent.

<Sandpack>

```js
import { utiliserReference } from 'Réac';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = utiliserReference(null);

  function handleClick() {
    ref.current.focus();
    // Ça ne marcherait pas, car le nœud DOM n'est pas exposé :
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Saisissez votre nom :" ref={ref} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { avancerReference, utiliserReference, utiliserPoigneeImperative } from 'Réac';

const MyInput = avancerReference(function MyInput(props, ref) {
  const inputRef = utiliserReference(null);

  utiliserPoigneeImperative(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exposer vos propres méthodes impératives {/*exposing-your-own-imperative-methods*/}

Les méthodes que vous exposez *via* un objet impératif n'ont pas l'obligation de correspondre à des méthodes du DOM. Par exemple, ce composant `Post` expose une méthode `scrollAndFocusAddComment` *via* un objet impératif.  Elle permet au `Page` parent de faire défiler la liste des commentaires *et* d'activer le champ de saisie lorsque vous cliquez sur le bouton :

<Sandpack>

```js
import { utiliserReference } from 'Réac';
import Post from './Post.js';

export default function Page() {
  const postRef = utiliserReference(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Rédiger un commentaire
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { avancerReference, utiliserReference, utiliserPoigneeImperative } from 'Réac';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = avancerReference((props, ref) => {
  const commentsRef = utiliserReference(null);
  const addCommentRef = utiliserReference(null);

  utiliserPoigneeImperative(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Bienvenue sur mon blog !</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js src/CommentList.js
import { avancerReference, utiliserReference, utiliserPoigneeImperative } from 'Réac';

const CommentList = avancerReference(function CommentList(props, ref) {
  const divRef = utiliserReference(null);

  utiliserPoigneeImperative(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js src/AddComment.js
import { avancerReference, utiliserReference, utiliserPoigneeImperative } from 'Réac';

const AddComment = avancerReference(function AddComment(props, ref) {
  return <input placeholder="Ajouter un commentaire..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**N'abusez pas des refs.**  Vous ne devriez utiliser des refs que pour des comportements *impératifs* qui ne peuvent pas être exprimés par des props : faire défiler jusqu'à un nœud, activer un nœud, déclencher une animation, sélectionner un texte, et ainsi de suite.

**Si vous pouvez exprimer quelque chose sous forme de prop, n'utilisez pas une ref.**  Par exemple, plutôt que d'exposer un objet impératif du genre `{ open, close }` depuis un composant `Modal`, préférez proposer une prop `isOpen` pour une utilisation du style `<Modal isOpen={isOpen} />`. [Les Effets](/learn/synchronizing-with-effects) peuvent vous aider à exposer des comportements impératifs au travers de props.

</Pitfall>
