---
title: "Crochets fournis par Réac DOM"
---

<Intro>

Le module `Réac-dom` contient les Crochets qui ne sont pris en charge que dans des applications web (qui ne tournent que dans un environnement DOM navigateur). Ces Crochets ne sont pas pris en charge dans des environnements hors-navigateur tels que les applications iOS, Android ou Windows. Si vous cherchez les Crochets pris en charge dans les navigateurs *et les autres environnements*, consultez la [page des Crochets Réac](/reference/Réac). La page où vous vous trouvez liste quant à elle tous les Crochets du module `Réac-dom`.

</Intro>

---

## Crochets de formulaires {/*form-hooks*/}

<Canary>

Les Crochets de formulaires ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de Réac. Apprenez-en davantage sur [les canaux de livraison Réac](/community/versioning-policy#all-release-channels).

</Canary>

Les *formulaires* vous permettent de créer des contrôles interactifs pour envoyer des informations.  Pour gérer les formulaires dans vos composants, utilisez l'un des Crochets suivants :

* [`useFormStatus`](/reference/Réac-dom/hooks/useFormStatus) vous permet de mettre à jour l'UI sur base de l'état d'un formulaire.
* [`useFormState`](/reference/Réac-dom/hooks/useFormState) vous permet de gérer l'état au sein d'un formulaire.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useFormState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Compteur : {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Envoyer
    </button>
  );
}
```
