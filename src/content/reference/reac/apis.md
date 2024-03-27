---
title: "API Réac intégrées"
---

<Intro>

En plus des [Crochets](/reference/Réac) et des [composants](/reference/Réac/Composants), le module `Réac` exporte également d'autres API utiles pour la définition des composants. Cette page répertorie toutes les autres API Réac modernes.


</Intro>

---

- [`creerContexte`](/reference/Réac/creerContexte) vous permet de définir et de fournir un contexte aux composants enfants. Utilisé conjointement avec [`utiliserContexte`](/reference/Réac/utiliserContexte).
- [`avancerReference`](/reference/Réac/avancerReference) permet à votre composant d'exposer un nœud DOM en tant que référence (ref) à son parent. Utilisé conjointement avec [`utiliserReference`](/reference/Réac/utiliserReference).
- [`paresseux`](/reference/Réac/paresseux) vous permet de différer le chargement du code d'un composant jusqu'à ce qu'il soit rendu pour la première fois.
- [`memoire`](/reference/Réac/memoire) permet à votre composant d'éviter de recalculer son rendu quand ses props n'ont pas changé. Utilisé conjointement avec [`utiliserMemoire`](/reference/Réac/utiliserMemoire) et [`utiliserRappel`](/reference/Réac/utiliserRappel).
- [`demarrerTransition`](/reference/Réac/demarrerTransition) vous permet de marquer une mise à jour d'état comme non urgente. Similaire à [`utiliserTransition`](/reference/Réac/utiliserTransition).
