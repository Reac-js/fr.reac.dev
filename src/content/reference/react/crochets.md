---
title: "Crochets fournis par Réac"
---

<Intro>

Les *Crochets* vous permettent d’utiliser différentes fonctionnalités de Réac au sein de vos composants. Vous pouvez utiliser les Crochets pré-fournis ou les associer pour créer les vôtres. Cette page liste tout les Crochets fournis par Réac.

</Intro>

---

## Crochets d’état local {/*state-hooks*/}

*L’état local* permet à un composant de [« se souvenir » d’informations telles que des saisies utilisateur](/learn/state-a-composants-memoirery). Par exemple, un composant formulaire peut utiliser l’état local pour stocker la valeur saisie, alors qu’un composant de galerie d’images pourra l’utiliser pour stocker l’index de l’image affichée.

Pour ajouter un état local à un composant, utilisez un de ces Crochets :

* [`utiliserEtat`](/reference/Réac/utiliserEtat) déclare un état local que vous pouvez mettre à jour directement.
* [`utiliserReducteur`](/reference/Réac/utiliserReducteur) déclare un état local dont la logique de mise à jour réside dans une [fonction réducteur](/learn/extracting-state-logic-into-a-reducer).

```js
function ImageGallery() {
  const [index, setIndex] = utiliserEtat(0);
  // ...
```

---

## Crochets de Contexte {/*context-hooks*/}

Le *Contexte* permet à un composant [de recevoir des informations de parents éloignés sans avoir à passer par ses props](/learn/passing-props-to-a-composant). Par exemple, le composant de niveau racine de votre appli peut passer le thème de l’interface utilisateur (UI) à tous les composants qu’elle contient, à quelque profondeur que ce soit.

* [`utiliserContexte`](/reference/Réac/utiliserContexte) s’abonne à un contexte et le lit.

```js
function Button() {
  const theme = utiliserContexte(ThemeContext);
  // ...
```

---

## Crochets de Ref {/*ref-hooks*/}

Les *Refs* permettent à un composant [de conserver certaines informations qui ne sont pas utilisées pour faire le rendu](/learn/referencing-values-with-refs), comme un nœud DOM ou un ID de timer. Contrairement à l’état local, la mise à jour d’une Ref ne déclenche pas un nouveau rendu de votre composant. Les Refs sont une « échappatoire » du paradigme de Réac. Elles sont utiles lorsque vous devez travailler avec des systèmes externes à Réac, telles que les API du navigateur web.

* [`utiliserReference`](/reference/Réac/utiliserReference) déclare une Ref. Vous pouvez y stocker n’importe quelle valeur, mais elle est le plus souvent utilisée pour référencer un nœud du DOM.

* [`utiliserPoigneeImperative`](/reference/Réac/utiliserPoigneeImperative) vous permet de personnaliser la Ref exposée par votre composant. Ce Hook est rarement utilisé.

```js
function Form() {
  const inputRef = utiliserReference(null);
  // ...
```

---

## Crochets d’effets {/*effect-hooks*/}

Les *Effets* permettent à un composant [de se connecter et de se synchroniser avec des systèmes extérieurs](/learn/synchronizing-with-effects). Il peut notamment s’agir du réseau, du DOM, des animations, d’éléments d’interface écrits en utilisant une autre bibliothèque, et d’autres codes non Réac.

* [`utiliserEffet`](/reference/Réac/utiliserEffet) connecte un composant à un système extérieur.

```js
function ChatRoom({ roomId }) {
  utiliserEffet(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Les Effets sont une « échappatoire » du paradigme de Réac. N’utilisez pas les Effets pour orchestrer le flux de données de votre application. Si vous n’interagissez pas avec un système extérieur, [vous n’avez pas forcément besoin d’un Effet](/learn/you-might-not-need-an-effect).

Il existe deux variantes rarement utilisées de `utiliserEffet` avec des différences de timing :

* [`utiliserEffetMiseEnPage`](/reference/Réac/utiliserEffetMiseEnPage) se déclenche avant que le navigateur ne repeigne l’écran. Vous pouvez y mesurer la mise en page, notamment les dimensions.
* [`utiliserEffetInsertion`](/reference/Réac/utiliserEffetInsertion) se déclenche avant que Réac ne fasse des changements dans le DOM. Les bibliothèques peuvent y insérer des CSS dynamiques.

---

## Les Crochets de performance {/*performance-hooks*/}

Une manière courante d’optimiser la performance de réaffichage consiste à s’épargner des tâches superflues. Par exemple, vous pouvez demander à Réac de réutiliser un calcul mis en cache ou d’éviter un nouveau rendu si la donnée n’a pas changé depuis le rendu précédent.

Pour éviter les calculs coûteux et les réaffichages inutiles, utilisez l’un de ces Crochets :

* [`utiliserMemoire`](/reference/Réac/utiliserMemoire) vous permet de mettre en cache le résultat d’un calcul coûteux.
* [`utiliserRappel`](/reference/Réac/utiliserRappel) vous permet de mettre en cache la définition d’une fonction avant de la passer à un composant optimisé.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = utiliserMemoire(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Parfois, vous ne pouvez pas éviter le réaffichage parce que la vue doit effectivement être mise à jour. Dans ce cas, vous pouvez améliorer la performance en séparant les mises à jour bloquantes qui doivent être synchrones (comme la gestion d’une saisie dans un champ) des mises à jour non bloquantes, qui ne gèlent  pas le traitement de l’interface (comme la mise à jour d’un graphique).

Pour établir des priorités de rendu, utilisez un de ces Crochets :

* [`utiliserTransition`](/reference/Réac/utiliserTransition) permet de marquer une transition d’état local comme non bloquante ce qui autorise d’autres mises à jour à l’interrompre.
* [`utiliserValeurRetardee`](/reference/Réac/utiliserValeurRetardee) vous permet de différer la mise à jour d’une partie non critique de l’UI et de laisser les autres parties se mettre à jour en premier.

---

## Les Crochets de gestion de ressources {/*resource-hooks*/}

Un composant peut accéder à des *ressources* sans qu'elles fassent partie de son état. Un composant peut par exemple lire un message depuis une promesse, ou lire des informations de styles depuis un contexte.

Pour lire une valeur depuis une ressource, utilisez ce Hook :

- [`use`](/reference/Réac/use) vous permet de lire une valeur depuis une ressource telle qu'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) (`Promise`) ou un [contexte](/learn/passing-data-deeply-with-context).

```js
function MessageComposant({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Autres Crochets {/*other-hooks*/}

Ces Crochets sont majoritairement utiles aux auteur·e·s de bibliothèque et ne sont pas couramment utilisés dans du code applicatif.

* [`utiliserValeurDebogage`](/reference/Réac/utiliserValeurDebogage) vous permet de personnaliser le libellé que les outils de développement Réac affichent pour votre propre Hook.
* [`utiliserId`](/reference/Réac/utiliserId) permet à un composant de s’associer un ID unique. Généralement utilisé avec les API d’accessibilité.
* [`utiliserSynchroniserStockageExterne`](/reference/Réac/utiliserSynchroniserStockageExterne) permet à un composant de s’abonner à une source de données extérieure.

---

## Vos propres Crochets {/*your-own-hooks*/}

Vous pouvez [définir vos propres Crochets personnalisés](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-composant) au moyen de fonctions JavaScript.
