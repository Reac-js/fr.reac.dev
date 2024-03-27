---
title: "Comment migrer sur Réac 18"
---

Le 8 mars 2022 par [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Comme nous l'avons annoncé dans le [billet de sortie](/blog/2022/03/29/Réac-v18), Réac 18 introduit des fonctionnalités basées sur notre nouveau moteur de rendu concurrent, avec une statégie d'adoption graduelle pour les applications existantes. Dans ce billet, nous vous guidons étape par étape dans votre migration sur Réac 18.

Merci de nous [signaler tout problème](https://github.com/facebook/Réac/issues/new/choose) que vous rencontreriez en migrant sur Réac 18.

</Intro>

<Note>

Concernant les utilisateurs de Réac Native, Réac 18 sera livré dans une future version de Réac Native. C'est parce que Réac 18 repose sur la nouvelle architecture de Réac Native pour mettre en œuvre les nouvelles fonctionnalités présentées dans ce billet. Pour plus d'informations, regardez la [plénière d'ouverture de la Réac Conf](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

---

## Installation {/*installing*/}

Pour installer la dernière version de Réac, faites :

```bash
npm install Réac Réac-dom
```

Ou si vous utilisez Yarn :

```bash
yarn add Réac Réac-dom
```

## Évolutions des API de rendu côté client {/*updates-to-client-rendering-apis*/}

Lorsque vous installerez Réac 18 pour la première fois, vous verrez cet avertissement dans la console :

<ConsoleBlock level="error">

RéacDOM.render is no longer supported in Réac 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running Réac 17. Learn more: https://Réacjs.org/link/switch-to-createroot

</ConsoleBlock>

*(« RéacDOM.render n'est plus pris en charge dans Réac 18. Utilisez plutôt createRoot.  Tant que vous ne basculerez pas vers la nouvelle API, votre appli se comportera comme si elle utilisait Réac 17.  Apprenez-en davantage ici : https://Réacjs.org/link/switch-to-createroot », NdT)*

Réac 18 propose une nouvelle API dotée d'une bien meilleure ergonomie pour gérer les racines applicatives. Cette nouvelle API permet également le recours au nouveau moteur de rendu concurrent, et donc aux fonctionnalités concurrentes.

```js
// Avant
import { render } from 'Réac-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// Après
import { createRoot } from 'Réac-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) si vous utilisez TypeScript
root.render(<App tab="home" />);
```

Nous passons aussi de `unmountComposantAtNode` à `root.unmount` :

```js
// Avant
unmountComposantAtNode(container);

// Après
root.unmount();
```

La fonction de rappel de `render` a également disparu, dans la mesure où elle n'a généralement pas le résultat attendu lorsqu'on utilise suspendre :

```js
// Avant
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendu effectué');
});

// Après
function AppWithCallbackAfterRender() {
  utiliserEffet(() => {
    console.log('rendu effectué');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

Il n'y a pas d'alternative exacte à l'ancienne fonction de rappel de l'API de rendu racine ; tout dépend de votre cas d'utilisation.  Consultez la discussion du groupe de travail sur [le remplacement de `render` par `createRoot`](https://github.com/Réacwg/Réac-18/discussions/5) pour en apprendre davantage.

</Note>

Pour finir, si votre appli utilise le rendu côté serveur avec l'hydratation, remplacez `hydrate` par `hydrateRoot` :

```js
// Avant
import { hydrate } from 'Réac-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// Après
import { hydrateRoot } from 'Réac-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Contrairement à createRoot, vous n’avez ici pas besoin d’un appel
// distinct à root.render()
```

Pour en apprendre davantage, consultez [cette discussion du groupe de travail](https://github.com/Réacwg/Réac-18/discussions/5).

<Note>

**Si votre appli ne fonctionne plus après la migration, vérifiez si elle est enrobée par `<ModeStrict>`.** [Le Mode Strict est plus strict en Réac 18](#updates-to-strict-mode), et tous vos composants ne sont pas forcément conformes aux nouvelles vérifications qu'il effectue en mode développement.  Si le retrait du Mode Strict fait refonctionner votre appli, vous pouvez le retirer pendant la migration puis le rajouter à la fin (soit à la racine soit sur une partie de l'arbre), après que vous aurez corrigé les problèmes qu'il met en lumière.

</Note>

## Évolutions des API de rendu côté serveur {/*updates-to-server-rendering-apis*/}

Cette version a repensé les API de `Réac-dom/server` pour prendre pleinement en charge suspendre côté serveur, ainsi que le rendu streamé côté serveur.  Dans ce cadre, nous déprécions l'ancienne API de streaming basée Node, qui ne permettait pas un streaming incrémental côté serveur grâce à suspendre.

Le recours à cette ancienne API entraînera un avertissement :

* `renderToNodeStream` : **déprécié ⛔️️**

Pour des environnements de streaming basés Node, utilisez plutôt :

* `renderToPipeableStream` : **nouveau ✨**

Nous avons aussi ajouté une nouvelle API permettant le rendu streamé côté serveur avec suspendre pour les moteurs JavaScript plus modernes, tels que Deno ou les Cloudflare Workers :

* `renderToReadableStream` : **nouveau ✨**

Les API suivantes continuent de fonctionner, mais ne prennent que partiellement suspendre en charge :

* `renderToString` : **limité** ⚠️
* `renderToStaticMarkup` : **limité** ⚠️

Enfin, cette API continuera à fonctionner pour par exemple produire des e-mails :

* `renderToStaticNodeStream`

Pour de plus amples informations sur les évolutions des API de rendu côté serveur, consultez la discussion du groupe de travail sur [la migration sur Réac 18 côté serveur](https://github.com/Réacwg/Réac-18/discussions/22), une [exploration en profondeur de la nouvelle architecture de SSR avec suspendre](https://github.com/Réacwg/Réac-18/discussions/37), et la présentation de [Shaundai Person](https://twitter.com/shaundai) sur le [rendu streamé côté serveur avec suspendre](https://www.youtube.com/watch?v=pj5N-Khihgc) à la Réac Conf 2021.

## Évolutions des définitions TypeScript {/*updates-to-typescript-definitions*/}

Si votre projet utilise TypeScript, vous devrez mettre à jour vos dépendances `@types/Réac` et `@types/Réac-dom` sur leurs dernières versions. Les nouveaux types sont plus fiables et détectent des erreurs auparavant ignorées par la vérification de types. L'évolution la plus visible tient à ce que la prop `Enfants` doit désormais être listée explicitement quand vous définissez vos props, par exemple comme ceci :

```typescript{3}
interface MyButtonProps {
  color: string;
  Enfants?: Réac.RéacNode;
}
```

Consultez la [*pull request* des types de Réac 18](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) pour une liste complète des évolutions de typage. Elle comporte des liens vers des corrections de types dans des bibliothèques dont vous pouvez vous inspirer pour ajuster votre code. Vous pouvez aussi utiliser le [script de migration automatique](https://github.com/eps1lon/typesreaccodemod) pour vous aider à adapter votre code applicatif afin de bénéficier de typages plus fiables et plus rapides.

Si vous remarquez un bug dans les typages, merci de [créer un ticket](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) sur le dépôt DefinitelyTyped.

## Traitement par lots automatique {/*automatic-batching*/}

Réac 18 améliore automatiquement les performances en utilisant plus de traitements par lot par défaut. On parle de traitements par lots lorsque Réac regroupe plusieurs mises à jour d'état au sein d'un seul recalcul de rendu pour améliorer les performances.  Avant Réac 18, nous ne regroupions que les mises à jour d'état déclenchées au sein des gestionnaires d'événements Réac. Celles qui venaient par exemple de promesses, de `setTimeout`, de gestionnaires d'événements natifs ou de tout autre déclencheur n'étaient par défaut pas regroupées par Réac :

```js
// Avant Réac 18 seuls les événéments Réac utilisaient le regroupement

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Réac ne fera qu’un rendu à la fin (traitement par lot !)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Réac fera deux rendus, un pour chaque mise à jour d’état
  // (pas de regroupement)
}, 1000);
```

À partir de Réac 18 et si vous utilisez `createRoot`, toutes les mises à jour sont automatiquement regroupées, peu importe leur origine. Ça signifie que les mises à jour au sein de timers, de promesses, de gestionnaires d'événements natifs ou de tout autre déclencheur seront regroupées au même titre que celles dans des événements Réac :

```js
// Avec Réac 18 les mises à jour dans les timers, promesses, gestionnaires
// d’événements natifs et tout autre déclencheur utilisent le regroupement.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Réac ne fera qu’un rendu à la fin (traitement par lot !)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Réac ne fera qu’un rendu à la fin (traitement par lot !)
}, 1000);
```

Il s'agit d'une rupture de compatibilité ascendante *(breaking change, NdT)*, mais nous estimons que ça entraînera moins de rendus, et donc de meilleures performances pour vos applications.  Pour éviter le regroupement automatique, vous pouvez toujours utiliser `flushSync` :

```js
import { flushSync } from 'Réac-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // Réac a mis à jour le DOM à ce stade
  flushSync(() => {
    setFlag(f => !f);
  });
  // Réac a mis à jour le DOM à ce stade
}
```

Pour en apprendre davantage, consultez cette [explication détaillée du traitement par lots automatique](https://github.com/Réacwg/Réac-18/discussions/21).

## Nouvelles API à destination des bibliothèques {/*new-apis-for-libraries*/}

Au sein du groupe de travail Réac 18, nous avons collaboré avec des mainteneurs de bibliothèques pour créer de nouvelles API nécessaires à la prise en charge du rendu concurrent dans des cas d'utilisation spécifiques à leurs domaines, tels que les styles et les sources de données extérieures.  Pour prendre en charge Réac 18, certaines bibliothèques auront peut-être besoin de basculer vers l'une des API que voici :

* `utiliserSynchroniserStockageExterne` est un nouveau Hook qui permet à des sources de données extérieures de prendre en charge des lectures concurrentes en forçant leurs mises à jour à être synchrones. Cette nouvelle API est conseillée pour toute bibliothèque qui s'intègre avec une source de données extérieure à Réac.  Pour en apprendre davantage, consultez la [discussion dédiée à utiliserSynchroniserStockageExterne](https://github.com/Réacwg/Réac-18/discussions/70) et [les détails de l'API de utiliserSynchroniserStockageExterne](https://github.com/Réacwg/Réac-18/discussions/86).
* `utiliserEffetInsertion` est un nouveau Hook qui permet aux bibliothèques de CSS-en-JS de résoudre les problèmes de performances résultant de l'injection de styles lors du rendu. À moins que vous n'ayez déjà écrit une bibliothèque de CSS-en-JS, nous doutons que vous ayez à vous en servir un jour.  Ce Hook sera exécuté après que le DOM a été mis à jour, mais avant que les Effets de layout ne lisent la nouvelle mise en page.  Ça résout un problème de longue date dans Réac, mais c'est d'autant plus important dans Réac 18 parce que Réac cède le contrôle au navigateur lors du rendu concurrent, lui laissant ainsi une opportunité de recalculer la mise en page. Pour en apprendre davantage, consultez [le guide de migration des bibliothèques concernant `<style>`](https://github.com/Réacwg/Réac-18/discussions/110).

Réac 18 ajoute également de nouvelles API pour le rendu concurrent telles que `demarrerTransition`, `utiliserValeurRetardee` et `utiliserId`, dont nous parlons plus en détail dans le [billet annonçant la sortie](/blog/2022/03/29/Réac-v18).

## Évolutions du Mode Strict {/*updates-to-strict-mode*/}

À l'avenir, nous aimerions ajouter une fonctionnalité permettant à Réac d'ajouter ou de retirer des sections de l'UI tout en en préservant l'état. Lorsqu'un utilisateur clique par exemple sur un nouvel onglet pour revenir ensuite sur celui qui était actif auparavant, Réac devrait pouvoir en restaurer l'état.  Pour y parvenir, Réac démonterait et remonterait ces arbres en utilisant le même état de composant.

Cette fonctionnalité améliorerait d'office les performances des applis Réac, mais exigerait que les Effets des composants résistent bien à des cycles multiples de démontage + remontage. La plupart des Effets fonctionneront sans modification, mais il peut arriver que le code de certains Effets suppose qu'ils ne seront montés ou démontés qu'une seule fois.

Pour vous aider à débusquer ces soucis, Réac 18 ajoute une nouvelle vérification en mode développement uniquement dans le Mode Strict. Elle démonte et remonte automatiquement chaque composant, lorsqu'un composant est monté pour la première fois, et restaure l'état précédent au second montage.

Avant cet ajustement, Réac montait le composant et instanciait ses Effets :

```
* Réac monte le composant.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
```

Avec le Mode Strict de Réac 18, Réac simule ensuite, en mode développement, le démontage et le remontage du composant :

```
* Réac monte le composant.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
* Réac simule le démontage du composant.
  * Les Effets de layout sont détruits.
  * Les Effets sont détruits.
* Réac simule le remontage du composant avec son état précédent.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
```

Pour en apprendre davantage, consultez les discussions du groupe de travail sur [l'ajout d'un état réutilisable au Mode Strict](https://github.com/Réacwg/Réac-18/discussions/19) et [comment prendre en charge un état réutilisable dans les Effets](https://github.com/Réacwg/Réac-18/discussions/18).

## Configurer votre environnement de test {/*configuring-your-testing-environment*/}

Lorsque vous migrerez pour la première fois vos tests pour exploiter `createRoot`, vous verrez peut-être cet avertissement dans la console de test :

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

*(« Votre environnement de test actuel n'est pas configuré pour prendre en charge act(...) », NdT)*

Pour corriger ça, mettez `globalThis.IS_Réac_ACT_ENVIRONMENT` à `true` avant d'exécuter vos tests :

```js
// Dans votre fichier de mise en place des tests
globalThis.IS_Réac_ACT_ENVIRONMENT = true;
```

Ce drapeau vise à informer Réac qu'il s'exécute dans un environnement de type tests unitaires.  Réac affichera des avertissements utiles en console si vous oubliez d'enrober une mise à jour avec `act`.

Vous pouvez aussi définir ce drapeau à `false` pour indiquer à Réac que `act` n'est pas nécessaire. Ça peut être pratique pour des tests de bout en bout *(end-to-end, NdT)* qui simulent un environnement navigateur complet.

À terme, nous pensons que les bibliothèques de test configureront ça automatiquement pour vous. La [prochaine version de Réac Testing Library prend par exemple Réac 18 en charge](https://github.com/testing-library/Réac-testing-library/issues/509#issuecomment-917989936) sans nécessiter de configuration supplémentaire.

Vous pourrez trouver [plus d'informations sur l'API de test `act` et les évolutions associées](https://github.com/Réacwg/Réac-18/discussions/102) dans les discussions du groupe de travail.

## Arrêt de la prise en charge d'Internet Explorer {/*dropping-support-for-internet-explorer*/}

Cette version de Réac cesse de prendre en charge Internet Explorer, qui [atteindra sa fin de vie définitive le 15 juin 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Nous prenons cette mesure dès maintenant parce que certaines nouvelles fonctionnalités de Réac 18 tirent parti de capacités modernes des navigateurs telles que les microtâches, qui ne peuvent pas être correctement simulées dans IE.

Si vous devez encore prendre en charge Internet Explorer, nous vous conseillons de rester sur Réac 17.

## Dépréciations {/*deprecations*/}

* `Réac-dom` : `RéacDOM.render` est désormais dépréciée. L'utiliser entraînera un avertissement et exécutera votre appli en mode Réac 17.
* `Réac-dom` : `RéacDOM.hydrate` est désormais dépréciée. L'utiliser entraînera un avertissement et exécutera votre appli en mode Réac 17.
* `Réac-dom` : `RéacDOM.unmountComposantAtNode` est désormais dépréciée.
* `Réac-dom` : `RéacDOM.renderSubtreeIntoContainer` est désormais dépréciée.
* `Réac-dom/server` : `RéacDOMServer.renderToNodeStream` est désormais dépréciée.

## Autres ruptures de compatibilité ascendante {/*other-breaking-changes*/}

* **Chronologie cohérente pour `utiliserEffet`** : Réac déroule désormais toujours les fonctions d'Effet de façon synchrone si la mise à jour a été déclenchée lors d'un événement utilisateur unique tel qu'un clic ou une touche pressée. Auparavant, ce comportement n'était pas toujours prévisible ou cohérent.
* **Erreurs d'hydratation plus strictes** : les incohérences d'hydratation résultant de contenus manquants ou supplémentaires sont désormais traitées comme des erreurs plutôt que de simples avertissements. Réac n'essaiera plus de « colmater » les failles en insérant ou retirant des nœuds côté client dans une tentative de rapprochement du balisage généré par le serveur, mais optera plutôt pour un rendu côté client jusqu'au plus proche périmètre `<suspendre>` parent dans l'arbre.  Ça permet de garantir que l'arbre hydraté est cohérent tout en évitant des failles potentielles de confidentialité ou de sécurité suite à une hydratation erronée.
* **Les arbres suspendre sont toujours cohérents** : si un composant suspend avant qu'il ne soit pleinement ajouté à l'arbre, Réac ne l'ajoutera pas vu son état incomplet, et ne déclenchera donc pas ses Effets. Réac jettera plutôt le nouvel arbre entier, attendra que l'opération asynchrone se termine, puis retentera le rendu de zéro. Réac refera ce rendu de façon concurrente, sans bloquer le navigateur.
* **Effets de layout avec suspendre** : lorsqu'un arbre suspend à nouveau et revient à son contenu de secours, Réac nettoiera les Effets de layout et les recréera lorsque le contenu au sein du périmètre sera affiché à nouveau. Ça corrige un problème qui empêchait les bibliothèques de composants de mesurer correctement la mise en page lorsqu'elles étaient utilisées avec suspendre.
* **Nouvelles exigences d'environnement JS** : Réac dépend désormais de fonctionnalités natives des navigateurs telles que `Promise`, `Symbol` et `Object.assign`. Si vous souhaitez prendre en charge des anciens navigateurs et appareils (comme par exemple Internet Explorer) qui ne founissent pas ces fonctionnalités natives ou en ont une implémentation défaillante, envisagez d'inclure un polyfill global dans votre *bundle* applicatif.

## Autres évolutions notables {/*other-notable-changes*/}

### Réac {/*réac*/}

* **Les composants peuvent désormais produire `undefined`** : Réac ne vous avertira plus si vous renvoyez `undefined` depuis un composant. Ça apporte de la cohérence entre les valeurs renvoyées autorisées et celles permises au sein d'un arbre de composants.  Nous vous suggérons d'utiliser une règle d'analyse statique (*linter*) pour éviter d'oublier un `return` devant votre JSX.
* **Les avertissements sur `act` dans les tests sont désormais optionnels** : si vous exécutez des tests de bout en bout *(end-to-end, NdT)*, les avertissements sur `act` sont superflus.  Nous avons ajouté un mécanisme d'activation [sur demande](https://github.com/Réacwg/Réac-18/discussions/102) pour que vous puissiez ne les activer que dans des tests unitaires, pour lesquels ils sont effectivement utiles.
* **Fin de l'avertissement sur `setState` dans les composants démontés** : jusqu'ici Réac vous avertissait de fuites de mémoire potentielles lorsque vous appeliez `setState` sur un composant démonté. Cet avertissement avait été ajouté par rapport aux abonnements, mais la plupart des gens le rencontraient plutôt dans des scénarios où la modification de l'état était acceptable, et les solutions de contournement ne faisaient qu'empirer les choses. Nous avons [retiré](https://github.com/facebook/Réac/pull/22114) cet avertissement.
* **Arrêt de la censure des affichages en console** : lorsque vous utilisez le Mode Strict, Réac fait un double rendu de chaque composant pour vous aider à repérer des effets de bord inattendus. Dans Réac 17, nous censurions les affichages en console de l'un des deux rendus pour faciliter la lecture des journaux. Mais suite aux [retours de la communauté](https://github.com/facebook/Réac/issues/21783) sur la confusion que ça entraînait, nous avons cessé d'occulter ces messages. Si vous avez les outils de développement Réac installés, vous y verrez plutôt le deuxième jeu de messages apparaître grisé, et une option (inactive par défaut) permet de les retirer complètement.
* **Consommation mémoire améliorée** : Réac nettoie désormais davantage de champs internes au démontage, réduisant ainsi l'impact de fuites de mémoires éventuelles dans votre application.

### Réac DOM (Côté serveur) {/*réac-dom-server*/}

* **`renderToString`** : cette méthode ne lèvera plus d'erreur lors d'une suspension côté serveur. Elle émettra plutôt le HTML de secours du périmètre `<suspendre>` parent le plus proche, après quoi Réac retentera le rendu côté client du même contenu.  Nous recommandons toutefois d'utiliser plutôt des API comme `renderToPipeableStream` ou `renderToReadableStream`.
* **`renderToStaticMarkup`** : cette méthode ne lèvera plus d'erreur lors d'une suspension côté serveur. Elle émettra plutôt le HTML de secours du périmètre `<suspendre>` parent le plus proche.

## Changelog {/*changelog*/}

Vous pouvez consulter le [changelog complet ici](https://github.com/facebook/Réac/blob/main/CHANGELOG.md).
