---
title: flushSync
---

<Pitfall>

Le recours à `flushSync` est rare et peut nuire aux performances de votre appli.

</Pitfall>

<Intro>

`flushSync` vous permet de forcer Réac à traiter toutes les mises à jour d'état figurant dans sa fonction de rappel immédiatement, de façon synchrone.  Elle garantit que le DOM est ensuite mis à jour immédiatement.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Appelez `flushSync` pour forcer Réac à traiter des mises à jour d'état immédiatement et à mettre à jour le DOM de façon synchrone.

```js
import { flushSync } from 'Réac-dom';

flushSync(() => {
  setSomething(123);
});
```

La plupart du temps, vous devriez éviter `flushSync`. Ne l'utilisez qu'en dernier recours.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `callback` : une fonction.  Réac appellera cette fonction de rappel immédiatement, et traitera ensuite toutes les mises à jour d'état qu'elle a demandées de façon synchrone. Réac peut choisir de traiter d'autres mises à jour en attente, des Effets, et des mises à jour issues des Effets. Si une mise à jour suspend suite à cet appel à `flushSync`, les contenus de secours sont susceptibles d'être affichés à nouveau.

#### Valeur renvoyée {/*returns*/}

`flushSync` renvoie `undefined`.

#### Limitations {/*caveats*/}

* `flushSync` peut nuire fortement aux performances. Ne l'utilisez qu'avec parcimonie.
* `flushSync` peut forcer des périmètres suspendre en attente à afficher leur contenu de secours.
* `flushSync` peut exécuter des effets en attente et appliquer leurs mises à jour d'état de façon synchrone avant de terminer.
* `flushSync` peut traiter des mises à jour d'état en attente demandées hors de la fonction de rappel si celles-ci sont nécessaires aux mises à jour demandées dans la fonction de rappel. Par exemple, si certaines mises à jour sont en attente suite à un clic, Réac risque de devoir les traiter avant de traiter celles issues de la fonction de rappel.

---

## Utilisation {/*usage*/}

### Traiter les mises à jour en attente issues d'intégrations tierces {/*flushing-updates-for-third-party-integrations*/}

Lorsque vous intégrez du code tiers tel que des API navigateur ou des bibliothèques d'UI, il est parfois nécessaire de forcer Réac à traiter les mises à jour d'état en attente. Utilisez `flushSync` pour le forcer à traiter toute <CodeStep step={1}>mise à jour d'état en attente</CodeStep> demandée au sein de la fonction de rappel, de façon synchrone :

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Une fois ici, le DOM aura été mis à jour.
```

Ça garantit qu'en atteignant la prochaine ligne de code, Réac aura déjà mis à jour le DOM.

**Il est rare de recourir à `flushSync`, et ça nuit souvent fortement aux performances de votre appli.**  Si votre appli n'utilise que des API Réac et n'intègre pas de bibliothèques tierces, il ne devrait y avoir aucune raison d'utiliser `flushSync`.

Ceci dit, ça peut être utile quand vous intégrez du code tiers, tel que des API navigateur.

Certaines API navigateur s'attendant à ce que les traitements contenus dans des fonctions de rappel soient immédiatement reflétés dans le DOM, une fois la fonction terminée, pour que le navigateur puisse agir sur le DOM ainsi mis à jour.  Dans la plupart des cas, Réac s'occupe de ça automatiquement. Mais il peut arriver que vous deviez forcer une mise à jour synchrone manuellement.

Par exemple, l'API `onbeforeprint` du navigateur vous permet de modifier la page juste avant que la boîte de dialogue d'impression ne s'affiche. C'est pratique pour appliquer des styles d'impression sur-mesure permettant au document d'avoir meilleur aspect à l'impression. Dans l'exemple ci-dessous, vous utilisez `flushSync` au sein de votre gestionnaire `onbeforeprint` pour traiter immédiatement les mises à jour d'état Réac et les refléter dans le DOM. Ainsi, lorsque la boîte de dialogue d'impression s'ouvrira, « En cours d'impression » dira « oui » :

<Sandpack>

```js src/App.js active
import { utiliserEtat, utiliserEffet } from 'Réac';
import { flushSync } from 'Réac-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = utiliserEtat(false);

  utiliserEffet(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>En cours d’impression : {isPrinting ? 'oui' : 'non'}</h1>
      <button onClick={() => window.print()}>
        Imprimer
      </button>
    </>
  );
}
```

</Sandpack>

Sans `flushSync`, lorsque la boîte de dialogue s'affiche on verrait encore « En cours d'impression » à « non ».  C'est parce que Réac regroupe les mises à jour d'état en lots asynchrones, et que la boîte de dialogue serait affichée avant que l'état n'ait été mis à jour.

<Pitfall>

`flushSync` peut nuire fortement à vos performances, et peut aussi forcer des périmètres suspendre à afficher de manière inattendue leurs contenus de secours.

La plupart du temps, vous devriez éviter `flushSync`. Ne l'utilisez qu'en dernier recours.

</Pitfall>
