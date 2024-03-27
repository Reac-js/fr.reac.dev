---
title: demarrerTransition
---

<Intro>

`demarrerTransition` vous permet de mettre à jour l'état sans bloquer l'UI.

```js
demarrerTransition(scope)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `demarrerTransition(scope)` {/*starttransitionscope*/}

La fonction `demarrerTransition` vous permet de marquer une mise à jour d'état comme étant une transition.

```js {7,9}
import { demarrerTransition } from 'Réac';

function TabContainer() {
  const [tab, setTab] = utiliserEtat('about');

  function selectTab(nextTab) {
    demarrerTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `scope` : une fonction qui met à jour l'état en appelant au moins une [fonction `set`](/reference/Réac/utiliserEtat#setstate).  Réac appelle immédiatement `scope` sans argument et marque toutes les mises à jour d'état demandées durant l'exécution synchrone de `scope` comme des transitions.  Elles seront [non bloquantes](/reference/Réac/utiliserTransition#marking-a-state-update-as-a-non-blocking-transition) et [n'afficheront pas d'indicateurs de chargement indésirables](/reference/Réac/utiliserTransition#preventing-unwanted-loading-indicators).

#### Valeur renvoyée {/*returns*/}

`demarrerTransition` ne renvoie rien.

#### Limitations {/*caveats*/}

* `demarrerTransition` ne fournit pas de moyen de surveiller la progression de la transition.  Pour afficher un indicateur pendant que la transition a lieu, utilisez plutôt [`utiliserTransition`](/reference/Réac/utiliserTransition).

* Vous pouvez enrober une mise à jour dans une transition uniquement si vous avez accès à la fonction `set` de l'état en question.  Si vous souhaitez démarrer une transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt [`utiliserValeurRetardee`](/reference/Réac/utiliserValeurRetardee).

* La fonction que vous passez à `demarrerTransition` doit être synchrone.  Réac exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des transitions.  Si vous essayez de faire des mises à jour d'état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des transitions.

* Une mise à jour d'état marquée comme une transition pourra être interrompue par d'autres mises à jour d'état.  Par exemple, si vous mettez à jour un composant de graphe au sein d'une transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, Réac redémarrera le rendu du composant graphe après avoir traité la mise à jour d'état du champ.

* Les mises à jour en transition ne peuvent pas être utilisées pour contrôler des champs textuels.

* Si plusieurs transitions sont en cours, Réac les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.

---

## Utilisation {/*usage*/}

### Marquer une mise à jour d'état comme étant une transition non bloquante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Vous pouvez indiquer qu'une mise à jour d'état doit être traitée comme une *transition* en l'enrobant dans un appel à `demarrerTransition` :

```js {7,9}
import { demarrerTransition } from 'Réac';

function TabContainer() {
  const [tab, setTab] = utiliserEtat('about');

  function selectTab(nextTab) {
    demarrerTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Les transitions vous permettent de conserver des mises à jour d'interface utilisateur réactives même sur des appareils lents.

Avec une transition, votre UI reste réactive pendant le rendu. Par exemple, si l'utilisateur clique sur un onglet mais ensuite change d'avis et va sur un autre onglet, il peut le faire sans devoir d'abord attendre que le premier onglet ait fini son rendu.

<Note>

`demarrerTransition` est très similaire à [`utiliserTransition`](/reference/Réac/utiliserTransition), à ceci près qu'elle ne fournit pas le drapeau `isPending` pour surveiller la progression de la transition.  Vous pouvez appeler `demarrerTransition` quand `utiliserTransition` est indisponible. En particulier, `demarrerTransition` fonctionne hors des composants, comme par exemple dans une bibliothèque de gestion de données.

[Apprenez-en davantage sur les transitions et consultez des exemples sur la page de `utiliserTransition`](/reference/Réac/utiliserTransition).

</Note>
