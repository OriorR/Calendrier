/* ==========================================================================
   CONTENU DU CALENDRIER : c'est le seul fichier à modifier pour les textes.
   - Chaque case a un titre et une liste de "blocs" affichés dans l'ordre.
   - Les photos, vocaux et vidéos se mettent dans le dossier "assets/".
   - Les textes entre [crochets] sont des notes pour toi : remplace-les.

   Types de blocs disponibles :
   { type: "title",   text: "Un sous-titre" }
   { type: "text",    text: "Un paragraphe.\nAvec retour à la ligne." }
   { type: "emoji",   emoji: "💌" }
   { type: "image",   src: "assets/photo.jpg", caption: "Légende", tilt: true }
   { type: "link",    label: "Écouter", url: "https://..." }
   { type: "qr",      url: "https://...", label: "Scanne-moi" }
   { type: "audio",   src: "assets/vocal.mp3", label: "Écoute-moi" }
   { type: "video",   src: "assets/video.mp4", poster: "assets/miniature.jpg" }
   { type: "list",    items: ["Première idée", "Deuxième idée"] }
   { type: "quote",   text: "Une phrase qui te ressemble." }
   { type: "letter",  letter: "C", index: 0 }   // lettre du mot mystère
   { type: "divider" }
   ========================================================================== */

window.CALENDAR = {
  config: {
    title: "Pour toi,",
    subtitle: "p'tit cœur",
    year: 2026,
    mysteryWord: "CERISE",
    signature: "XO",   // petite signature en bas de chaque carte ("" pour l'enlever)
    finalMessage: "Tu as ouvert toutes les cases ! Joyeux Noël !"
  },

  cards: [
    {
      day: 1,
      title: "Lettre d'ouverture",
      blocks: [
        { type: "emoji", emoji: "💌" },
        { type: "text", text: "Voici donc mon petit calendrier de l'avent, personnalisé pour toi ! \nLes règles sont simples : une case par jour, pas de triche, et tu peux relire les cases déjà ouvertes quand tu veux !" },
        { type: "quote",   text: "Pour bien commencer, petit Bon de 5 € : une boisson de Noël offerte, chocolat chaud, dragon mango (avec citronnade évidemment), ce qui te fait envie. C'est le premier jour, ça se fête !!" }
      ]
    },
    {
      day: 2,
      title: "Playlist de Noël",
      blocks: [
        { type: "text", text: "Aujourd'hui je te laisse découvrir une petite playlist de Noël que j'ai faites pour toi, profites bien !!" },
        { type: "image",   src: "assets/photo-1.jpg", caption: "", tilt: false },
        { type: "link", label: "Écouter la playlist !", url: "https://open.spotify.com/" },
        { type: "qr", url: "https://open.spotify.com/", label: "Ou scanne ce code ^^" }
      ]
    },
    {
      day: 3,
      title: "Une journée avec moi",
      blocks: [
        { type: "text", text: "J'ai jamais trop pris le temps de te montrer mon quotidien, alors c'est le moment ! Voici donc un petit vlog et un dump de ma vie en ce moment" },
        { type: "video",   src: "assets/video-2.mp4", poster: "assets/miniature-2.jpg" },
        { type: "divider" },
        { type: "image", src: "assets/exemple-1.jpg", caption: "Mon lieu de travail", tilt: true },
        { type: "image", src: "assets/exemple-2.jpg", caption: "Mon merveilleux setup" },
        { type: "image", src: "assets/exemple-3.jpg", caption: "Un petit outfit que j'aime bien" }
      ]
    },
    {
      day: 4,
      title: "Sushis ce soir",
      blocks: [
        { type: "emoji", emoji: "🍣" },
        { type: "quote", text: "Un Bon « Sushis » de 30€ : tu commande ce que tu veux, quand tu veux, je te fais le virement :)" },
        { type: "letter", letter: "C", index: 0 }
      ]
    },
    {
      day: 5,
      title: "Tout à toi",
      blocks: [
        { type: "text", text: "Aujourd'hui c'est un Bon « Je suis tout à toi sur le jeu de ton choix » : DbD, LoL, Valorant, Rocket ou ce que tu veux" },
        { type: "quote",   text: "Et en bonus je t'envoie 10€ en cadeau pour le jeu de ton choix, skin LoL, DbD,... ^^" }
      ]
    },
    {
      day: 6,
      title: "Dimanche chill",
      blocks: [
        { type: "text", text: "Je te propose un petit appel, j'ai préparé 22 questions pour apprendre à te connaître encore un peu plus. Je ne te dis rien, tu les découvriras en direct, rien de compliqué, aucune pression chill <3" },
        { type: "quote",   text: "Un Bon de 8 € pour un petit plaisir douillet : un chocolat chaud, un masque, une bougie, ce qui te fait du bien" }
      ]
    },
    {
      day: 7,
      title: "Ce que j'admire chez toi",
      blocks: [
        { type: "list", items: ["Tu cherches tout le temps à faire du mieux que tu peux même dans les moments les plus difficiles", "Tu peux rire toute une journée sans jamais t'épuiser, tout en faisant du bien autour de toi", "Et je t'admire toi par dessus tout"] },
        { type: "emoji", emoji: "🌺" }
      ]
    },
    {
      day: 8,
      title: "Ta lettre de Poudlard",
      blocks: [
        { type: "quote", text: "Collège Poudlard, bureau des admissions" },
        { type: "letter", letter: "E", index: 1 }
      ]
    },
    {
      day: 9,
      title: "Une histoire pour t'endormir",
      blocks: [
        { type: "quote", text: "Je t'ai préparé une petite histoire pour toi, pour t'aider à t'endormir, écoute :)" },
        { type: "audio", src: "assets/message-vocal.mp3", label: "" },
        { type: "text", text: "Si tu préfères lire plutôt qu'écouter, voici la transcription : []" }
      ]
    },
    {
      day: 10,
      title: "Quiz musical",
      blocks: [
        { type: "text", text: "Dix questions, tu associe les Emojis avec le titre de la musique !" },
        { type: "quote", text: "Si tu trouves au moins 7 sons sur les 10, il y a une surprise ^^" },
        { type: "quiz", threshold: 7, win: "Tu connais tes classiques. Ton prix est débloqué :",  lose: "Presque ! Tu peux retenter ta chance.",  prize: "Bon XO : 15 € pour du merch The Weeknd",
          questions: [
          { q: "⏳♾️", options: ["Timeless", "After Hours", "Sacrifice", "Less Than Zero"], answer: 0 },
          { q: "🌃💡😵", options: ["Starboy", "Blinding Lights", "The Hills", "Earned It"], answer: 1 },
          { q: "⭐👦", options: ["Save Your Tears", "Die For You", "Starboy", "Sacrifice"], answer: 2 },
          { q: "💧😢🙅", options: ["Call Out My Name", "Often", "In Your Eyes", "Save Your Tears"], answer: 3 },
          { q: "⛰️⛰️", options: ["The Hills", "Starboy", "Out of Time", "Is There Someone Else?"], answer: 0 },
          { q: "⏰❌", options: ["Save Your Tears", "Out of Time", "Less Than Zero", "Heartless"], answer: 1 },
          { q: "🏊", options: ["Friends", "Into It", "Swim", "Slow Down"], answer: 2 },
          { q: "🔥🪵", options: ["Macarena", "Smog", "Silence", "Feu de bois"], answer: 3 },
          { q: "🌍⭕", options: ["La terre est ronde", "Basique", "Tout va bien", "Jour meilleur"], answer: 0 },
          { q: "🌧️", options: ["Tout va bien", "La pluie", "Défaite de famille", "Christophe"], answer: 1 } ] }
        ]
    },
    {
      day: 11,
      title: "Petit plaisir",
      blocks: [
        { type: "quote", text: "Un Bon « Chocolat ou petit plaisir » : 10€ pour que tu fasse ce qui te fait envie. Petite commande starbucks, petit skin sur LoL, peu importe fais-toi plaisir chou <3" }
      ]
    },
    {
      day: 12,
      title: "Le match des champions",
      blocks: [
        { type: "quote", text: "1v1 Rocket, je joue au clavier, un gage pour le perdant : répondre à une question en toute honnêteté" },
        { type: "letter", letter: "R", index: 2 }
      ]
    },
    {
      day: 13,
      title: "Ouvre quand…",
      blocks: [
        { type: "text", text: "Voici 6 lettres qui vont t'accompagner quand tu en auras besoin, je suis là ptit cœur !" },
        {
  type: "envelopes",
  items: [
    { label: "Ouvre quand tu doutes de toi", text: "Je sais que ta tête est parfois dure avec toi. Alors je te le dis pendant que tu lis : tu es bien plus forte que tu ne le crois. Tu continues même les jours où c'est lourd, et ça, c'est du courage. Si tu doutes, emprunte-moi un peu de ma confiance en toi : j'en ai assez pour deux." },
    { label: "Ouvre quand tu as besoin de rire", text: "[Ta meilleure blague, ou un moment drôle entre vous.] Et si ça ne marche pas, imagine-moi en train de [une chose ridicule]. Voilà. Tu souris, ne mens pas." },
    { label: "Ouvre quand tu n'arrives pas à dormir", text: "Ferme les yeux et respire comme si tu soufflais sur un chocolat trop chaud. Envoie-moi un message si tu veux : même si je dors, il sera là à mon réveil, et moi aussi. Et si le sommeil ne vient toujours pas, relis le conte de la case 9." },
    { label: "Ouvre quand je te manque", text: "Tu me manques aussi, sûrement au même moment. Regarde la lune ce soir : je la regarderai aussi. [Une chose que tu feras avec elle la prochaine fois que vous vous verrez.]" },
    { label: "Ouvre quand tu es fière de toi", text: "Alors moi aussi. Raconte-moi tout, dans les moindres détails : je veux le vivre avec toi. Et garde ce moment en tête pour la prochaine fois que tu douteras. C'est la preuve que tu en es capable." }
  ]
},
        
      ]
    },
    {
      day: 14,
      title: "Notre futur",
      blocks: [
        { type: "text", text: "Et si on essayait de s'imaginer notre futur en quelques idées, ça donnerait quoi ?" },
        { type: "list", items: ["Un séjour ensemble au studio Warner à Londres", "Un road trip", "Un album photo avec pleins d'idées prises de Pinterest, un peu en mode aesthetic", "[Idée 4]", "[Idée 5]"] }
      ]
    },
    {
      day: 15,
      title: "Une petite surprise",
      blocks: [
        { type: "emoji", emoji: "🎁" },
        { type: "image",   src: "assets/skullpanda.jpg", caption: "" },
        { type: "quote", text: "Cadeau surprise ! Un virement arrive, je t'offre une figurine d'une collection SKULLPANDA de ton choix <33 !" }
      ]
    },
    {
      day: 16,
      title: "Hurlevent",
      blocks: [
        { type: "text", text: "[Ce que le film t'a fait ressentir, et ce que tu aimerais qu'elle te dise du livre.]" },
        { type: "letter", letter: "I", index: 3 }
      ]
    },
    {
      day: 17,
      title: "Case spéciale",
      blocks: [
        { type: "emoji", emoji: "👀" },
        { type: "text", text: "Un défi, un gage ou un bon à double sens" }
      ]
    },
    {
      day: 18,
      title: "Soirée chill",
      blocks: [
        { type: "text", text: "Un Bon « Joker » à activer quand tu veux : film en stream, ou petit film tranquille et je te fais à manger quand on se verra" },
        { type: "quote", text: "Et 15€ pour toi, pour un bon repas ce soir <33" }
      ]
    },
    {
      day: 19,
      title: "À ton tour",
      blocks: [
        { type: "text", text: "À toi de jouer ! Envoie-moi une photo et un petit message, ou un vocal. Je pense que tu ne t'y attendais pas ^^" }
      ]
    },
    {
      day: 20,
      title: "Un ciné, un jour",
      blocks: [
        { type: "text", text: "Je pense que celui-là sera ton préféré, un Bon « Date au cinéma » : valable quand on se verra ! Je paye pour nous deux et tu profites de la séance avec ma belle compagnie !" },
        { type: "image", src: "assets/cinema.jpg", caption: "Un petit ticket" },
        { type: "letter", letter: "S", index: 4 }
      ]
    },
    {
      day: 21,
      title: "Manucure",
      blocks: [
        { type: "quote", text: "Finalement j'ai changé d'avis, ce sera celui-là ton préféré ! Un Bon « Manucure de ton choix » : je te laisse prendre rendez-vous, je m'occupe du reste ^^" }
      ]
    },
    {
      day: 22,
      title: "Avant le concert",
      blocks: [
        { type: "text", text: "Demain tu as une grosse journée qui t'attends ! Alors voici une playlist d'Orelsan avec tes titres préférés. Je te laisse aussi la possibilité d'aller écouter ma petite playlist de son qui me font penser à toi <3" },
        { type: "quote", text: "Et sans oublier 15€ pour un petit souvenir là-bas !" },
        { type: "link", label: "Playlist Orelsan", url: "https://open.spotify.com/" },
        { type: "link", label: "Playlist de son pour toi", url: "https://open.spotify.com/" }
      ]
    },
    {
      day: 23,
      title: "Jour de concert",
      blocks: [
        { type: "text", text: "Amuse-toi bien !!! Profites un maximum du concert et raconte-moi tout en rentrant !! Je pense fort à toi bisouusssss" }
      ]
    },
    {
      day: 24,
      title: "La dernière case",
      blocks: [
        { type: "text", text: "[Ta grande lettre finale, ou une vidéo. La révélation du mot mystère se fait ici.]" },
        { type: "letter", letter: "E", index: 5 }
      ]
    }
  ]
};
