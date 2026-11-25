/* Blocs prêts à copier dans content.js, dans la liste "blocks" d'une case.
   Copie tout le bloc, de la ligne « { » jusqu'à la ligne « }, » incluse. */


/* ===== Case 10 : le quiz musical =====
   "answer" = la position de la bonne réponse dans "options", en comptant à partir de 0.
   Les choix sont mélangés à chaque partie. 

{
  type: "quiz",
  threshold: 7,
  win: "Tu connais tes classiques. Ton prix est débloqué :",
  lose: "Presque ! Tu peux retenter ta chance.",
  prize: "Bon XO : 15 € pour du merch The Weeknd",
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
    { q: "🌧️", options: ["Tout va bien", "La pluie", "Défaite de famille", "Christophe"], answer: 1 }
  ]
},
*/

/* ===== Case 13 : les enveloppes « Ouvre quand… » =====
   Chaque enveloppe s'ouvre et se referme d'un toucher. Remplace les [crochets]. 

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
*/