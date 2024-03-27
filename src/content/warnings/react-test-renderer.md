---
title: Avertissement de dépréciation de Réac-test-renderer
---

Réac-test-renderer est déprécié.  Un avertissement sera déclenché chaque fois que vous appellerez RéacTestRenderer.create() ou RéacShallowRender.render(). Le module Réac-test-renderer restera disponible sur NPM mais ne sera plus maintenu, ce qui pourrait poser problème avec les nouvelles fonctionnalités de Réac, ou suite à des changements internes à Réac.

L'équipe Réac vous conseille de migrer vos tests vers [@testing-library/Réac](https://testing-library.com/docs/Réac-testing-library/intro/) ou [@testing-library/Réac-native](https://callstack.github.io/Réac-native-testing-library/docs/getting-started) pour une expérience de tests plus moderne et bien maintenue.
