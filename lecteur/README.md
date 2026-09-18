# Cadran, le lecteur de FEC

Un outil qui **lit** la comptabilité au lieu de la tenir.

L'utilisateur dépose le fichier des écritures comptables (FEC) que lui donne son
expert-comptable ou son logiciel, et l'outil lui rend ce que personne ne lui donne :
ses comptes expliqués en français, son échéancier, ses coûts, ses ratios.

## Pourquoi cette forme

Tenir les comptes de quelqu'un d'autre déclenche presque toute la réglementation
française : facturation électronique par plateforme agréée avant septembre 2027,
certification des logiciels qui enregistrent des encaissements, conservation de dix ans,
sous-traitance RGPD, et la frontière du monopole de l'Ordre des experts-comptables.

Lire un FEC n'en déclenche aucune. Le client garde son comptable, garde l'original,
garde la responsabilité. L'outil ne fait qu'expliquer.

## La règle de confidentialité

**Le FEC ne quitte jamais le navigateur.** Il est lu, calculé et affiché sur la machine
de l'utilisateur. Aucun téléversement, aucun serveur, aucune base.

Quand l'utilisateur demande une explication en langage naturel, ce qui part au modèle
est le résultat de `anonymousSummary()` : une quinzaine d'agrégats déjà calculés, sans
un seul nom de client, de fournisseur ou de compte, sans un seul numéro d'écriture.
Environ 400 octets. Cette fonction est courte exprès : elle doit pouvoir être montrée
en entier à l'utilisateur avant l'envoi.

## Ce qu'il y a ici

| Fichier | Rôle |
|---|---|
| `lib/fec.js` | Lecture du FEC. Séparateur tabulation ou barre verticale, montants en Debit/Credit ou Montant/Sens, décimale virgule ou point, encodage UTF-8 ou ISO-8859-15 |
| `lib/comptes.js` | Balance, compte de résultat, bilan et grandes masses, reconstruits depuis le seul numéro de compte |
| `verifier.mjs` | La vérification |

## La vérification, et pourquoi elle est inhabituelle

Le générateur de la démonstration produit, à partir des mêmes écritures, **deux** fichiers :
un FEC et un `books.json` qui contient les états déjà calculés. Si le lecteur, en partant
du seul FEC, retrouve exactement ces états, alors il lit juste.

La plupart des lecteurs de fichiers comptables n'ont aucun moyen de savoir s'ils se trompent.
Ici on a la réponse, poste par poste.

```
node lecteur/verifier.mjs
```

**Ce que la vérification a déjà attrapé.** La première version rangeait les classes 4 et 5
ensemble : le compte en banque devenait une créance client, et se retrouvait compté une
seconde fois en trésorerie. En parallèle, l'emprunt du compte 164 était rangé en capitaux
propres. **Le total du bilan tombait juste malgré tout, parce que les deux erreurs se
compensaient.** Seul le contrôle poste par poste les a révélées, et c'est pour cela que la
vérification contrôle désormais chaque ligne du bilan, plus le fait que la somme des postes
refasse le total.
