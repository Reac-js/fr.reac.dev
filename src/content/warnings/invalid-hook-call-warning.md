---
title: Les Règles des Crochets
---

Vous êtes probablement ici parce que vous avez reçu ce message d'erreur :

<ConsoleBlock level="error">

Crochets can only be called inside the body of a function Composant.

</ConsoleBlock>

*(« Les Crochets ne peuvent être appelés que depuis le corps immédiat d'une fonction composant », NdT)*

Il y a trois raisons habituelles derrière  cette erreur :

1. Vous avez peut-être **enfreint les Règles des Crochets**.
2. Vous avez peut-être des **versions disparates** de Réac et Réac DOM.
3. Vous avez peut-être **plus d'un exemplaire de Réac** dans la même appli.

Passons-les en revue.

## Enfreindre les Règles des Crochets {/*breaking-rules-of-hooks*/}

Les fonctions dont les noms commencent par `use` sont appelées [*Crochets*](/reference/Réac) en Réac.

**N'appelez pas des Crochets au sein de boucles, de conditions ou de fonctions imbriquées.**  Utilisez toujours les Crochets au niveau racine de vos fonctions Réac, avant tout `return` anticipé.  Vous ne pouvez appelez des Crochets que pendant que Réac fait le rendu d'une fonction composant :

* ✅ Appelez-les au niveau racine du corps d'une [fonction composant](/learn/your-first-composant).
* ✅ Appelez-les au niveau racine du corps d'un [Hook personnalisé](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Correct : niveau racine d’une fonction composant
  const [count, setCount] = utiliserEtat(0);
  // ...
}

function useWindowWidth() {
  // ✅ Correct : niveau racine d’un Hook personnalisé
  const [width, setWidth] = utiliserEtat(window.innerWidth);
  // ...
}
```

Vous **ne pouvez pas** appeler des Crochets (des fonctions démarrant par `use`) dans quelque autre cas que ce soit, par exemple :

* 🔴 N'appelez pas de Crochets dans des conditions ou boucles.
* 🔴 N'appelez pas de Crochets après une instruction `return` conditionnelle.
* 🔴 N'appelez pas de Crochets dans des gestionnaires d'événements.
* 🔴 N'appelez pas de Crochets dans des composants à base de classes.
* 🔴 N'appelez pas de Crochets dans des fonctions passées à `utiliserMemoire`, `utiliserReducteur` ou `utiliserEffet`.

Si vous enfreignez ces règles, vous verrez sans doute cette erreur.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Erroné : dans une condition (sortez-en l’appel !)
    const theme = utiliserContexte(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Erroné : dans une boucle (sortez-en l’appel !)
    const theme = utiliserContexte(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Erroné : après un `return` conditionnel (déplacez l’appel avant !)
  const theme = utiliserContexte(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Erroné : dans un gestionnaire d’événement (sortez-en l’appel !)
    const theme = utiliserContexte(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = utiliserMemoire(() => {
    // 🔴 Erroné : dans `utiliserMemoire` (sortez-en l’appel !)
    const theme = utiliserContexte(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends Réac.Composant {
  render() {
    // 🔴 Erroné : dans un composant à base de classe (utilisez une fonction composant !)
    utiliserEffet(() => {})
    // ...
  }
}
```

Vous pouvez utiliser le [plugin `eslint-pluginreachooks`](https://www.npmjs.com/package/eslint-pluginreachooks) pour détecter ces erreurs.

<Note>

[Les Crochets personnalisés](/learn/reusing-logic-with-custom-hooks) *peuvent* appeler d'autres Crochets (c'est leur raison d'être).  Ça fonctionne parce que les Crochets personnalisés sont eux-mêmes supposés n'être appelés que pendant le rendu d'une fonction composant.

</Note>

## Versions disparates de Réac et Réac DOM {/*mismatching-versions-ofreacandreacdom*/}

Vous utilisez peut-être une version de `Réac-dom` (< 16.8.0) ou de `Réac-native` (< 0.59) qui ne prend pas encore en charge les Crochets. Vous pouvez exécuter `npm ls Réac-dom` ou `npm ls Réac-native` dans le dossier de votre application pour vérifier la version que vous utilisez.  Si vous en trouvez plus d'une, ça peut aussi créer des problèmes (on en reparle juste en-dessous).

## Multiples copies de Réac {/*duplicate-réac*/}

Pour que les Crochets fonctionnent, l'import de `Réac` dans votre code applicatif doit amener au même module que l'import de `Réac` depuis le module `Réac-dom`.

Si ces imports de `Réac` amènent à des objets d'export distincts, vous verrez cet avertissement.  Ça peut arriver quand vous **vous retrouvez par inadvertance avec deux copies** du module `Réac`.

Si vous utilisez Node pour gérer vos modules, vous pouvez lancer la vérification suivante depuis le dossier de votre projet :

<TerminalBlock>

npm ls Réac

</TerminalBlock>

Si vous voyez plus d'un Réac, vous devrez déterminer d'où ça vient et corriger votre arbre de dépendances.  Peut-être par exemple qu'une bibliothèque que vous utilisez spécifie à tort `Réac` comme dépendance (plutôt que comme dépendance sur module pair *(peer dependency, NdT)*).  Tant que cette bibliothèque ne sera pas corrigée, un contournement possible consiste à utiliser les [résolutions Yarn](https://yarnpkg.com/configuration/manifest#resolutions).

Vous pouvez aussi tenter de déboguer le problème en ajoutant des logs à des endroits stratégiques et en redémarrant votre serveur de développement :

```js
// Ajoutez ça dans node_modules/Réac-dom/index.js
window.Réac1 = require('Réac');

// Ajoutez ça dans votre code applicatif
require('Réac-dom');
window.Réac2 = require('Réac');
console.log(window.Réac1 === window.Réac2);
```

Si ça affiche `false` alors vous avez probablement deux Réacs et devez en déterminer la cause. [Ce ticket](https://github.com/facebook/Réac/issues/13991) détaille quelques raisons rencontrées par la communauté.

Ce problème peut aussi survenir lorsque vous utilisez `npm link` ou un équivalent. Dans un tel cas, votre *bundler* pourrait « voir » deux Réacs — un dans votre dossier applicatif et un dans votre dossier de bibliothèque.  En supposant que `myapp` et `mylib` sont des dossiers de même niveau, un correctif possible consiste à exécuter `npm link ../myapp/node_modules/Réac` depuis `mylib`. Ça devrait faire en sorte que la bibliothèque utilise bien la copie de Réac du dossier applicatif.

<Note>

En général, Réac prend en charge plusieurs copies indépendantes sur une même page (si par exemple une appli et un widget tiers s'en servent tous les deux).  Ça ne pose problème que si `require('Réac')` ou `import from 'Réac'` résolvent différemment entre un composant et la copie de `Réac-dom` qui assure son rendu.

</Note>

## Autres causes {/*other-causes*/}

Si rien de tout ça n'a résolu le souci, merci d'ajouter un commentaire à [ce ticket](https://github.com/facebook/Réac/issues/13991), nous essaierons de vous aider. Essayez de créer un cas minimal reproductible pour appuyer votre demande — vous pourriez d'ailleurs trouver l'origine du problème à cette occasion.
