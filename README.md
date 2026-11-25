# Calendrier de l'avent 2026

Site statique (HTML, CSS, JavaScript), sans base de données ni compte.

## Remplir les cases toi-même

1. Ouvre le dossier dans VS Code.
2. Installe l'extension **Live Server** (Ritwick Dey), puis clic droit sur `index.html`, « Open with Live Server ». La page se recharge toute seule à chaque enregistrement.
3. Modifie **`content.js`** : chaque case a un `title` et une liste de `blocks`. Le mode d'emploi des blocs est en haut du fichier.
4. Mets tes photos, vocaux et vidéos dans **`assets/`**, puis écris par exemple `src: "assets/photo-plage.jpg"`. Compresse les photos avant (squoosh.app), moins de 500 Ko chacune.
5. Pour voir une case, ajoute `?jour=24` à la fin de l'adresse : tout est débloqué.

Les trois erreurs les plus fréquentes :
- une virgule oubliée entre deux blocs `{ ... },` ou entre deux cases ;
- un guillemet `"` dans ton texte : utilise plutôt « » ou écris `\"` ;
- un nom de fichier différent entre `assets/` et `content.js` (majuscules et extensions comptent : `.JPG` n'est pas `.jpg`).

Si la page affiche un message d'erreur à la place du calendrier, le problème vient de la dernière modification de `content.js`. Annule-la (Ctrl+Z) et réessaie.

## Tester

- `?jour=10` simule le 10 décembre, `?jour=0` le 30 novembre, `?jour=24` débloque tout.
- En mode test, rien n'est mémorisé : recharge la page pour revoir l'effet de première ouverture.
- Sur téléphone : avec Live Server, ton téléphone (même Wi-Fi) peut ouvrir l'adresse affichée en remplaçant `127.0.0.1` par l'adresse IP de ton ordinateur. Dans Brave ou Chrome sur ordinateur, F12 puis Ctrl+Shift+M simule un téléphone.

## Fonctionnement du verrouillage

Une case s'ouvre à minuit, dans le fuseau horaire de l'appareil qui consulte le site. Les cases ouvertes sont mémorisées dans son navigateur.

Limites : le contenu des cases futures est présent dans les fichiers du site (visible en lisant le code source), et changer la date du téléphone ouvre les cases en avance.

Si l'appareil demande de réduire les animations (réglage d'accessibilité), le site garde une version douce : fondus et scintillement, sans tourbillon.

## Mettre en ligne (Vercel)

1. Crée un compte sur github.com et vercel.com, et un dépôt GitHub avec ce dossier.
2. Sur Vercel : Add New, Project, choisis le dépôt, Deploy (aucun réglage à changer).
3. Vercel te donne un lien. À chaque modification envoyée sur GitHub, le site se met à jour en une minute.

4. Dans `index.html`, remplace `TON-SITE` (ligne `og:image`) par l'adresse donnée par Vercel : c'est l'image qui s'affiche quand tu envoies le lien par message. Envoie la modification, attends une minute, puis teste en t'envoyant le lien à toi-même.

Sur iPhone, « Partager » puis « Sur l'écran d'accueil » installe le calendrier comme une petite app avec l'icône du cœur enflammé (sur Android : menu ⋮, « Ajouter à l'écran d'accueil »).

Le site contient `noindex` et `robots.txt` pour ne pas apparaître dans les moteurs de recherche. Elle ne peut rien modifier.
