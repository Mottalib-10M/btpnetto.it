# Test naïf du 2026-11-14 (tour2), testeur 2 : btpnetto.it
**Persona :** Italien(ne) de 24 ans, très à l'aise avec les apps, impatient(e) : s'il/si elle ne comprend pas en quelques secondes ce que la page lui apporte, il/elle ferme et retourne sur Google. Il/elle a cliqué sur le résultat « Rendimento netto BTP, BOT e Buoni postali: il calcolo 2026 » parce qu'il/elle a cette question. Découverte sur téléphone.

## 1. Concept

**Après 5 s :** « Ok, c'est une calculatrice : je mets combien je place et combien de temps, et ça me dit ce qui me reste après impôts. » Le titre « Rendimento netto BTP, BOT e Buoni postali » reprend mot pour mot ce que j'ai vu sur Google, et le chapeau dit exactement quoi faire : « scrivi l'importo e la durata ». Les deux champs pré-remplis (« 10.000 € », « 5 anni ») sont visibles tout de suite et le résultat « 1713 € » arrive au premier défilement. Je suis rassurée, c'est le bon site.

**Après 2 min :** « C'est un comparateur net de BTP / BOT / Buoni / conto deposito, avec une page par produit (enchères du Trésor, BOT, BTP Italia, BTP Valore, Buoni, Buoni pour enfants), chacune avec son propre calcul, à partir des chiffres officiels datés. » Le bénéfice concret est net : avec 10 000 € sur 5 ans, le BTP me laisse 1713 €, le Buono 298 €, le dépôt 969 €. J'ai une réponse chiffrée sans créer de compte (« Gratis e senza registrazione »).

**Clair ?** Oui pour l'idée générale. **Pour qui ?** Un épargnant qui hésite entre titres d'État, Buoni et compte à terme, ou des parents/grands-parents (page minori). **Ce qui brouille :** le comparateur de l'accueil annonce BOT dans le titre mais ne montre pas de BOT dans le résultat à 5 ans, et « Buono Ordinario » n'est pas dit « Buono postale ». Le reste du site mélange « guadagno netto » (1713 €) et « rimborso netto » capital compris (10.184 €, 1944 €), ce qui m'a fait douter.

## 2. « Tout le monde peut-il comprendre ? »

**Verdict : oui pour le haut de l'accueil, partiellement pour le reste.** Le premier écran et le gros chiffre sont compréhensibles par n'importe qui. Ça décroche :
- dès qu'on descend dans le jargon : « cedola », « bollo », « scarto di emissione », « giorno di regolamento dell'asta », « ISIN », « riaperture », « Rendimento prima delle tasse (anno di 360 giorni, come il Tesoro) », « 22,70% in una volta », « 3,80% + 0,8% » ;
- sur les pages BTP Italia / BTP Valore / Aste, où la barre de résultat collante cache le libellé ou le champ qu'on est censé modifier ;
- sur les listes où les titres portent un nom qui ne colle pas à leur durée (« BTP 7 anni » qui « scade il 15 febbraio 2031 », « BOT 12 mesi » qui « scade il 12 marzo 2027 »).

## 3. Parcours écran par écran

- **01-accueil-1.png** — Compris. Titre = ma recherche Google. Deux champs clairs. Le bloc « Altri dati del tuo caso (facoltativi, già compilati: tocca per cambiarli) / Cosa abbiamo ipotizzato: Tasso del conto deposito prima delle tasse (%): 2,89 » : je ne sais pas d'où sort 2,89 ni si je dois y toucher, mais « facoltativi » me rassure. Le bandeau jaune « Esempio: 10.000 € per 5 anni — cambia una cifra per vedere il tuo risultato » est parfait.
- **01-accueil-suite1.png** — Compris : « 1713 € guadagnati in 5 anni su 10.000 €, dopo tasse e bollo: 3,31% netto all'anno ». Coince : trois lignes seulement (BTP, « Buono Ordinario », « Conto deposito al 2,89% ») — où est le BOT promis par le titre ? Et « Buono Ordinario » je ne fais pas le lien immédiat avec « Buoni postali ». La phrase « Calcolo, non consiglio » rassure.
- **01-accueil-suite2.png** — Compris : détail tasse/bollo par produit, avec « Dato usato ». Coince : « prezzo dell'asta del 29 ottobre 2026 » alors que juste en dessous le texte parle de « l'ultima del 12 novembre 2026 » — pourquoi pas la dernière ?
- **01-accueil-suite3.png** — Compris : « Le ultime aste del Tesoro » avec de gros pourcentages. Coince : ce sont des taux « lordi » alors que tout le site parle de net ; je compare 3,58 % ici avec 3,31 % plus haut et je me mélange.
- **01-accueil-suite4.png** — Coince : deux cartes « BTP 7 anni » (4,04 % qui « scade il 15 settembre 2033 » et 3,90 % qui « scade il 15 febbraio 2031 ») : un « 7 ans » qui finit dans 4 ans, je ne comprends pas. Et le BTP 5 anni utilisé dans le calcul n'apparaît pas dans cette liste. Le plan du site (« BTP e BOT », « Buoni postali », « BTP per i risparmiatori », « Confronti e tasse ») est clair.
- **01-accueil-suite5 / suite6 / suite7.png** — Compris : « Il rendimento netto in un colpo d'occhio », tableau par durée. Le « – » pour BOT au-delà d'un an est expliqué. Coince légèrement : la note mentionne « a 4 anni il Buono 4 anni Plus » mais le tableau n'a pas de ligne 4 ans. Sur mobile, chaque durée est empilée en liste de 4 lignes : long à parcourir mais lisible.
- **01-accueil-suite7 / suite8.png** — Texte « Rendimento netto dei BTP e dei BOT » : compris mais dense ; « 12,5 % » vs « 26 % » est l'info clé et elle est noyée. « ventuno BTP, con una differenza massima di 0,008 punti percentuali » : rassurant pour un expert, opaque pour moi.
- **01-accueil-suite9 / suite10.png** — Compris : Buoni = Cassa Depositi e Prestiti, garantis par l'État, sans commission, bollo au-dessus de 5000 €. « risparmiosemplice », « Buono Soluzione Eredità » cités sans explication.
- **01-accueil-suite11.png** — « Conto deposito, titoli di Stato e tasse » : très utile (« il deposito paga il 26% invece del 12,5% »). « Cosa il calcolo non sa » : honnête et rassurant.
- **01-accueil-suite12.png** — FAQ fermées, questions pertinentes (« Il sito dice cosa conviene comprare? »). OK.
- **02-menu-1.png** — Compris : 4 rubriques. Coince : deux rubriques ouvertes, deux fermées (« Buoni postali », « Confronti e tasse ») sans logique apparente ; pas de lien « Home » ou « Calcolo » en tête de menu.
- **03-it-aste-titoli-di-stato-1.png** — Compris : titre clair. Coince : le libellé du champ « Prezzo pagato per 100 € di titolo (vuoto o 0 = … » est coupé par la barre collante « Rendimento lordo al prezzo di 98,51 3,58% ». Je ne vois pas ce que je dois mettre.
- **03-…-suite1.png** — Compris : 3,58 % lordo, « Netto di tassa e bollo: 2,93% all'anno ». Coince : pas de montant en euros ici (alors que l'accueil m'a habituée aux euros) ; « ISIN » et « giorno di regolamento dell'asta » = jargon.
- **03-…-suite2 à suite6.png** — Liste des enchères : lisible (date, titre, cedola, scadenza, prezzo, rendimento). Coince : « BTP 7 anni » à échéance 2031, « BTP 50 anni » à 53,940, « BTP Short Term », « CCTeu » sans explication ; « Fonte: PDF » sans dire que c'est un lien.
- **04-it-bot-rendimento-1.png** — Compris : « BOT, rendimento netto: quanto incassi a scadenza », le BOT expliqué en une phrase (« Si comprano sotto 100 … il guadagno è la differenza »). Champ « Valore nominale (rimborso a scadenza) » : je comprends avec la parenthèse.
- **04-…-suite1.png** — Compris : « 255,57 € », « 2,65% netto all'anno · 363 giorni ». Coince : « Cosa abbiamo ipotizzato: Prezzo pagato per 100 € di titolo (vuoto o 0 = prezzo dell'ultima asta): 0 » — afficher « 0 » comme prix me fait croire à une erreur.
- **04-…-suite2 / suite3.png** — Compris : décomposition Spesa / Differenza / Tassa / Bollo / Netto. « Rendimento prima delle tasse (anno di 360 giorni, come il Tesoro) » : inutile pour moi.
- **04-…-suite4 / suite5 / suite6.png** — Liste « I BOT ancora in vita » : compris, avec « Netto all'asta ». Coince : « BOT 12 mesi » qui « scade il 12 marzo 2027 » (asta 28 ottobre 2026) — c'est expliqué par « riaperture » plus haut, mais je ne relie pas.
- **05-it-btp-italia-1.png** — Compris : protection contre l'inflation, « il calcolo ti chiede di ipotizzarla ». « indice FOI senza tabacchi » = jargon.
- **05-…-suite1.png** — Coince fortement : le champ d'inflation que je suis censée remplir est caché sous la barre « Interessi netti fino alla scadenza (ipotesi) 1779 € » ; je ne vois que « È una tua ipotesi: nessuno conosce l'inflazione futura ». Compris : « 1779 € », « 3,20% netto all'anno · 1,85% oltre l'inflazione ».
- **05-…-suite2 / suite3.png** — Tableau « cinque ipotesi di inflazione » (0/1/2/3/5 %) : très parlant, c'est la meilleure chose de la page. « Lordo all'anno su 10.000 € » vs « Netto fino alla scadenza » : deux unités différentes côte à côte, un peu déroutant.
- **05-…-suite4 à suite6.png** — Formule « (1 + inflazione) × (1 + tasso reale) − 1 » : je décroche. FAQ, liens connexes et « Fonti » propres ; « Aggiornato il 13 novembre 2026 » rassure.
- **06-it-btp-o-buoni-postali-1.png** — Compris : « la tassa è la stessa, il 12,5%: cambiano il tasso, il bollo e la possibilità di uscire prima ». La barre collante fait 3 lignes et mange un gros morceau d'écran.
- **06-…-suite1.png** — Coince : on me rappelle « Tasso del conto deposito prima delle tasse (%): 2,89 » alors que cette page ne compare que BTP et Buoni. Résultat identique à l'accueil (1713 € vs 298 €) : cohérent.
- **06-…-suite2 à suite4.png** — Tableau par durée : compris. Coince : à « Anni: 4 » le BTP choisi est « BTP 5 anni » ; à 2 ans « BTP Short Term » sans explication.
- **06-…-suite5 / suite6.png** — « Cosa il confronto non dice » : très bien (commission bancaire, sortie anticipée). FAQ « BTP o Buoni postali: quale è più sicuro? » : exactement ma question.
- **07-it-btp-valore-1.png** — Compris : « riservati ai risparmiatori », cedole croissantes. Champ « Quale emissione » clair.
- **07-…-suite1.png** — Coince : libellé « Anni tenuti (senza vendere) » caché par la barre collante. Compris : « 1707 € », « 3,41% netto all'anno in media ». Important mais enfoui : « Il collocamento a 100 è chiuso: oggi si compra solo in Borsa » — c'est l'info qui dit si je peux encore l'acheter, elle devrait être en haut.
- **07-…-suite2.png** — Liste par année « 1, 2, 3, 4, 5 » sans le mot « Anno » : je comprends par déduction.
- **07-…-suite3 / suite4.png** — Coince : « BTP Valore Insieme … Tassi lordi 22,70% in una volta » (je crois que c'est une erreur) et « 3,80% + 0,8% » (le « + 0,8% » n'est pas expliqué ici).
- **07-…-suite5 / suite6.png** — FAQ « Si può ancora comprare il BTP Valore dopo il collocamento? » : bonne question. Liens connexes OK.
- **08-it-buoni-fruttiferi-postali-1.png** — Compris : titre, explication, « Quale Buono: Buono Ordinario (20 anni) ». Coince : la barre dit « rimborso netto dopo 4 anni 10.184 € » alors que l'accueil m'a montré 5 ans et un gain (pas un remboursement capital compris).
- **08-…-suite1.png** — Compris : « 0,46% netto all'anno », décomposition. « Altri Buoni che possiedi già (per il bollo): 0 € » : bien expliqué.
- **08-…-suite2 à suite5.png** — 20 blocs « anno par anno » (Tasso lordo / Valore lordo / Netto) : clair, mais 4 écrans de défilement pour un tableau qui tiendrait en un.
- **08-…-suite6.png** — « I Buoni fruttiferi postali in emissione » : je découvre que le « Buono 4 anni Plus » rend 2,25 % brut, bien plus que l'Ordinario à 0,75 %. Pourquoi l'accueil ne compare-t-il que l'Ordinario ?
- **09-it-buoni-minori-1.png** — Compris : « il valore ai 18 anni del bambino », âge + montant. Très clair.
- **09-…-suite1.png** — Compris : « 1944 € », « 15 anni al 5% lordo · 4,53% netto all'anno ». Surprise : 5 % brut, plus que n'importe quel BTP — l'accueil ne le dit nulle part. « Netto ai 18 anni 1944 € » = capital compris, alors que « Interessi netti 944,06 € » est en dessous : deux « netti » différents.
- **09-…-suite2 à suite6.png** — Tableau par âge : très parlant. FAQ et sources propres.

## 4. Chaque fonction

| Fonction | Trouvée ? | Comprise ? | Utile ? | Évidence /5 |
|---|---|---|---|---|
| Comparateur accueil (importo + durata) | Oui, immédiatement | Oui, sauf l'absence de BOT et le nom « Buono Ordinario » | Très | 4 |
| Tableau « in un colpo d'occhio » (6 durées) | Oui | Oui | Oui | 4 |
| Cartes « Le ultime aste del Tesoro » (accueil) | Oui | Partiellement (lordo, « 7 anni » à échéance 2031) | Moyenne | 2 |
| Calcul Aste (titre + prix) | Oui | Partiellement (libellé du prix coupé, résultat en % seulement) | Moyenne | 3 |
| Calcul BOT | Oui | Oui, sauf le « 0 » affiché comme prix | Oui | 4 |
| Calcul BTP Italia (hypothèse d'inflation) | Le résultat oui, le champ d'inflation non (caché) | Le tableau 5 hypothèses oui | Oui | 3 |
| Comparateur BTP o Buoni postali | Oui | Oui | Très | 4 |
| Calcul BTP Valore | Oui | Oui pour le gain, non pour « Valore Insieme 22,70% in una volta » | Moyenne (souscription fermée) | 3 |
| Calcul Buoni fruttiferi | Oui | Oui | Oui | 4 |
| Calcul Buono minori | Oui | Oui | Très (cadeau enfant) | 5 |
| Menu ☰ | Oui | Oui, rubriques claires | Oui | 3 |
| Bouton « English » | Vu | — | — | — |
| « Leggi tutto il paragrafo » / FAQ repliées | Oui | Oui | Oui (allège) | 4 |

## 5. Enchaînement et navigation

- Fil d'Ariane « Home / … » présent partout : bien.
- Chaque page suit le même schéma (titre → 2 lignes → calcul pré-rempli avec bandeau jaune « Esempio » → détail → tableau → FAQ → pages liées → sources) : une fois la première page comprise, les autres se lisent vite.
- La barre de résultat collante en bas puis en haut est pratique pour garder le chiffre, mais elle recouvre régulièrement le champ ou le libellé juste en dessous (Aste, BTP Italia, BTP Valore, Buoni, Minori) et fait 2 à 3 lignes sur certaines pages.
- « Pagine e calcoli collegati » enchaîne bien vers la suite logique.
- Le menu ne propose pas de retour direct au comparateur de l'accueil ; rubriques ouvertes/fermées de façon incohérente.
- Incohérence d'unité entre pages : accueil = gain (1713 €), Buoni = remboursement capital compris (10.184 €), Minori = capital compris (1944 €), Aste = pourcentage seul.

## 6. Difficultés classées

1. **Barre collante qui cache le champ à remplir** — 05-btp-italia-suite1, 07-btp-valore-suite1, 03-aste-1/suite1, 09-minori-suite1. Vécu : « On me dit que c'est mon hypothèse d'inflation, mais où je la tape ? » Recommandation : ne faire apparaître la barre qu'une fois le formulaire entièrement dépassé, ou la limiter à une ligne ; ajouter une marge haute aux champs quand on y arrive.
2. **Comparateur de l'accueil incomplet par rapport à la promesse** — 01-accueil-suite1. Vécu : « Le titre dit BOT, je ne vois pas de BOT ; et "Buono Ordinario", c'est quoi ? » Recommandation : renommer en « Buono fruttifero postale Ordinario » et ajouter une ligne BOT même pour 5 ans, avec « BOT: dura al massimo 1 anno, non confrontabile su 5 anni ». Texte : « Buono postale Ordinario (Poste) ».
3. **Unités de résultat différentes selon les pages** — 08-buoni-1 (« rimborso netto 10.184 € »), 09-minori-suite1 (« Netto ai 18 anni 1944 € »), vs accueil (« 1713 € guadagnati »). Vécu : « 10.184 € c'est énorme… ah non, c'est mon capital plus 184 €. » Recommandation : grand chiffre = toujours le gain net, capital en dessous. Texte : « Guadagno netto dopo 4 anni: 184 € (rimborso totale 10.184 €) ».
4. **Noms de titres qui contredisent leur échéance** — 01-accueil-suite3/suite4, 03-aste-suite3/suite4, 04-bot-suite4. Vécu : « BTP 7 anni qui finit en 2031, BOT 12 mesi qui finit en mars : le site se trompe ? » Recommandation : afficher la durée restante. Texte : « BTP 7 anni (riaperto: scade tra 4 anni) ».
5. **Le « 0 » affiché comme prix** — 04-bot-suite1. Vécu : « Prix payé : 0 ? » Recommandation : afficher la valeur réellement utilisée. Texte : « Prezzo pagato per 100 € di titolo: 96,859 (ultima asta) ».
6. **Jargon non expliqué** — partout (« cedola », « bollo », « scarto di emissione », « ISIN », « giorno di regolamento », « CCTeu », « BTP Short Term », « indice FOI »). Recommandation : petite info-bulle (i) au premier usage. Texte pour cedola : « cedola = interesse pagato ogni 6 mesi ».
7. **« 22,70% in una volta » et « 3,80% + 0,8% »** — 07-btp-valore-suite3/suite4. Vécu : « 22,70 % ?! » Recommandation : écrire en clair. Textes : « 22,70% in totale sui 5 anni, pagato a rate » (à vérifier selon le fonctionnement réel) ; « + premio finale 0,8% a scadenza ».
8. **L'accueil cache les Buoni les plus rentables** — 08-buoni-suite6, 09-minori-suite1. Vécu : « On me fait croire que les Buoni rapportent 298 €, puis je découvre un Buono à 5 % pour les mineurs et un 4 anni Plus à 2,25 %. » Recommandation : sous le résultat de l'accueil, ajouter une ligne. Texte : « Altri Buoni rendono di più: 4 anni Plus 2,25%, Buono Minori 5% (solo per under 18) → vedi i Buoni ».

## 7. À garder

- Titre et chapeau de l'accueil, calqués sur la recherche Google : « scrivi l'importo e la durata ».
- Le bandeau jaune « Esempio: … — cambia una cifra per vedere il tuo risultato ».
- Le gros chiffre en euros avec la phrase « guadagnati in 5 anni su 10.000 €, dopo tasse e bollo ».
- « Dato usato » sous chaque produit (date de l'asta, des taux Poste, moyenne BCE) : ça inspire confiance.
- « Calcolo, non consiglio » et « Cosa il calcolo non sa » / « Cosa il confronto non dice » : honnête.
- « Gratis e senza registrazione … gli importi che scrivi non vengono inviati né salvati ».
- Le tableau des 5 hypothèses d'inflation (BTP Italia) et le tableau par âge (Buoni minori).
- Le fil d'Ariane, les FAQ repliées, « Leggi tutto il paragrafo ».

## 8. Notes

Clarté : 7/10
Facilité : 7/10
Utilité : 8/10
