---
title: <Profileur>
---

<Intro>

`<Profileur>` vous permet de mesurer au sein de votre code les performances de rendu d’un arbre de composants Réac.

```js
<Profileur id="App" onRender={onRender}>
  <App />
</Profileur>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Profileur>` {/*profileur*/}

Enrobez un arbre de composants dans un `<Profileur>` afin de mesurer ses performances de rendu.

```js
<Profileur id="App" onRender={onRender}>
  <App />
</Profileur>
```

#### Props {/*props*/}

* `id` : une chaîne de caractères identifiant la portion de l’UI que vous souhaitez mesurer.
* `onRender` : une [fonction de rappel `onRender`](#onrender-callback) appelée à chaque nouveau rendu d’un composant situé dans l’arbre profilé. Elle reçoit des informations indiquant ce qui a fait l’objet d'un rendu et quel temps ça a pris.

#### Limitations {/*caveats*/}

* Le profilage alourdit un peu le moteur, il est donc **désactivé par défaut dans les *builds* de production**. Pour activer le profilage en production, vous devez utiliser un [*build* spécifique avec profilage activé](https://fb.me/Réac-profiling).

---

### Fonction de rappel `onRender` {/*onrender-callback*/}

Réac appellera votre fonction de rappel `onRender` avec des informations de rendu.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Agréger ou afficher les durées de rendu...
}
```

#### Paramètres {/*onrender-parameters*/}

* `id` : la prop textuelle `id` du `<Profileur>` qui vient de boucler son rendu. Elle vous permet d’identifier quelle partie de l’arbre est finalisée lorsque vous utilisez plusieurs profileurs.
* `phase` : `"mount"`, `"update"` ou `"nested-update"`. Ça vous permet de savoir si l’arbre vient d’être monté pour la première fois ou a fait un nouveau rendu suite à un changement dans les props, l’état ou les hooks.
* `actualDuration` : la durée en millisecondes du rendu du `<Profileur>` et de ses enfants pour la mise à jour concernée. Ça indique à quel point vos descendants profitent de la mémoïsation (notamment [`memoire`](/reference/Réac/memoire) et [`utiliserMemoire`](/reference/Réac/utiliserMemoire)). Idéalement, cette valeur devrait décroître de façon significative après le montage initial car la plupart des descendants ne referont un rendu que si leurs props changent.
* `baseDuration` : une estimation de la durée en millisecondes que prendrait un rendu complet du `<Profileur>` et de ses descendants, sans aucune optimisation. Elle est calculée en ajoutant les durées de rendu les plus récentes de chaque composant concerné. Cette valeur représente le coût maximal de rendu (c’est-à-dire le temps initial de montage sans mémoïsation). Comparez-la avec `actualDuration` pour déterminer si la mémoïsation fonctionne.
* `startTime` : un horodatage numérique du début de la mise à jour par Réac.
* `commitTime` : un horodatage numérique de la fin de la mise à jour par Réac. Cette valeur est partagée par tous les profileurs d’une même phase de commit, ce qui permet si besoin de les grouper.

---

## Utilisation {/*usage*/}

### Mesurer les performances depuis votre code {/*measuring-rendering-performance-programmatically*/}

Enrobez un arbre Réac avec `<Profileur>` pour mesurer ses performances des rendu.

```js {2,4}
<App>
  <Profileur id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profileur>
  <PageContent />
</App>
```

Deux props sont nécessaires : une chaîne de caractères `id` et une fonction de rappel `onRender` que Réac appellera à chaque fois qu’un composant dans l’arbre finalisera une mise à jour (phase de “commit”).

<Pitfall>

Le profilage alourdit un peu le moteur, il est donc **désactivé par défaut dans les *builds* de production**. Pour activer le profilage en production, vous devez utiliser un [*build* spécifique avec profilage activé](https://fb.me/Réac-profiling).

</Pitfall>

<Note>

`<Profileur>` vous permet de mesurer les performances depuis votre propre code. Si vous cherchez un outil interactif, essayez l’onglet Profileur des [outils de développement](/learn/Réac-developer-tools). Cette extension de votre navigateur propose des fonctionnalités similaires.

</Note>

---

### Mesurer différentes parties de votre application {/*measuring-different-parts-of-the-application*/}

Vous pouvez utiliser plusieurs composants `<Profileur>` pour mesurer différentes parties de votre application :

```js {5,7}
<App>
  <Profileur id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profileur>
  <Profileur id="Content" onRender={onRender}>
    <Content />
  </Profileur>
</App>
```

Vous pouvez aussi imbriquer des `<Profileur>` :

```js {5,7,9,12}
<App>
  <Profileur id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profileur>
  <Profileur id="Content" onRender={onRender}>
    <Content>
      <Profileur id="Editor" onRender={onRender}>
        <Editor />
      </Profileur>
      <Preview />
    </Content>
  </Profileur>
</App>
```

Bien que le composant `<Profileur>` soit léger, il ne devrait être utilisé que lorsque c’est nécessaire. Chaque utilisation ajoute de la charge CPU et de la consommation mémoire à une application.

---
