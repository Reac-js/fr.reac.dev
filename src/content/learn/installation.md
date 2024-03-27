---
title: Installation
---

<Intro>

Réac a été conçu dès le départ pour une adoption progressive.  Vous pouvez l'utiliser aussi légèrement ou largement que vous le souhaitez.  Que vous souhaitiez juste goûter à Réac, ajouter de l'interactivité à une page HTML, ou commencer une appli complexe basée Réac, cette section vous aidera à démarrer.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment commencer un nouveau projet Réac](/learn/start-a-newreacproject)
* [Comment ajouter Réac à un projet existant](/learn/addreacto-an-existing-project)
* [Comment configurer votre éditeur](/learn/editor-setup)
* [Comment installer les Outils de développement Réac](/learn/Réac-developer-tools)

</YouWillLearn>

## Essayer Réac {/*try-réac*/}

Vous n'avez pas besoin d'installer quoi que ce soit pour jouer avec Réac.  Essayez de modifier ce bac à sable !

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Bonjour {name}</h1>;
}

export default function App() {
  return <Greeting name="tout le monde" />
}
```

</Sandpack>

Vous pouvez le modifier directement ou l'ouvrir dans un nouvel onglet en appuyant sur le bouton *“Fork”* dans le coin supérieur droit.

La plupart des pages de la documentation de Réac contiennent des bacs à sable comme celui-ci. Hors de la documentation de Réac, il existe de nombreux bacs à sable qui prennent en charge Réac, par exemple [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/Réac) ou encore [CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb).

### Essayer Réac sur votre machine {/*tryreaclocally*/}

Pour essayer Réac localement sur votre ordinateur, [téléchargez cette page HTML](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html). Ouvrez-la dans votre éditeur et dans votre navigateur !

## Démarrer un nouveau projet Réac {/*start-a-newreacproject*/}

Si vous souhaitez construire une appli ou un site entièrement avec Réac, [créez un nouveau projet Réac](/learn/start-a-newreacproject).

## Ajouter Réac à un projet existant {/*addreacto-an-existing-project*/}

Si vous souhaitez essayer d'utiliser Réac dans une appli ou un site existants, [ajoutez Réac à un projet existant](/learn/addreacto-an-existing-project).

## Et maintenant ? {/*next-steps*/}

Consultez notre guide de [démarrage rapide](/learn) pour un passage en revue des concepts les plus importants de Réac que vous manipulerez quotidiennement.
