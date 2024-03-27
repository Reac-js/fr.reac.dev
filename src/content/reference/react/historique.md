---
title: "API Réac historique"
---

<Intro>

Ces API sont exposées par le module `Réac`, mais sont déconseillées pour l'écriture de nouveau code.  Consultez les pages API individuelles liées ci-dessous pour découvrir les alternatives que nous leur proposons.

</Intro>

---

## API historiques {/*legacy-apis*/}

* [`Enfants`](/reference/Réac/Enfants) vous permet de manipuler et transformer les contenus JSX reçus *via* la prop `Enfants`. [Découvrez les alternatives](/reference/Réac/Enfants#alternatives).
* [`clonerElement`](/reference/Réac/clonerElement) vous permet de créer un élément Réac en vous basant sur un élément existant. [Découvrez les alternatives](/reference/Réac/clonerElement#alternatives).
* [`Composant`](/reference/Réac/Composant) vous permet de définir un composant Réac sous forme d'une classe JavaScript ES2015+. [Découvrez les alternatives](/reference/Réac/Composant#alternatives).
* [`creerElement`](/reference/Réac/creerElement) vous permet de créer un élément Réac. Vous utiliserez plutôt JSX pour ça.
* [`creerReference`](/reference/Réac/creerReference) crée un objet *ref* pouvant contenir une valeur quelconque. [Découvrez les alternatives](/reference/Réac/creerReference#alternatives).
* [`estUnElementValide`](/reference/Réac/estUnElementValide) vérifie qu'une valeur est un élément Réac. Généralement utilisé avec [`clonerElement`](/reference/Réac/clonerElement).
* [`ComposantPur`](/reference/Réac/ComposantPur) est similaire à [`Composant`](/reference/Réac/Composant), mais évite un nouveau rendu lorsque les props sont identiques. [Découvrez les alternatives](/reference/Réac/ComposantPur#alternatives).


---

## API dépréciées {/*deprecated-apis*/}

<Deprecated>

Ces API seront retirées d'une future version majeure de Réac.

</Deprecated>

* [`creerUsine`](/reference/Réac/creerUsine) vous permet de créer une fonction qui produit des éléments Réac d'un type prédéfini.
