import { quiz_espace } from "./questions.js"; // Import des questions

/* VARIABLES ELEMENTS HTML */
// Paragraphe intro
const newParagraph = document.querySelector("#intro");
newParagraph.innerText = quiz_espace.intro;

// quiz-container
const quizContainer = document.querySelector("#quiz-container");
quizContainer.style.margin = "20px 50px";

// questions
const questionTexte = document.querySelector("#question-text");

// options
const choixOptions = document.querySelector("#options-container");
questionTexte.appendChild(newParagraph);

// compteur temps
const paragraphTimer = document.querySelector('#warningTimer');
paragraphTimer.classList.add("conteneurTimer");

// ⏳🛸 Sélection de l'image du gif
const gifCompteur = document.querySelector('#gifcompteur');


// ⏰ COMPTEURS 
let textIndex = 0; // compteur questions
let scoreIndex = 0;
let t = 0;
let myTimeOut; 


// score correct answer
const scoreBonnesReponses = document.querySelector("#score-correct-answer");
// message au joueur en fonction de son score
const message = document.querySelector("#messageJoueur");


// 🅱️ VARIABLES BOUTONS
// bouton "Let's go!"
const boutonStart = document.querySelector("#start-button");
// bouton "Suivant"
const boutonSuivant = document.querySelector("#next-button");
// bouton "Rejouer"
const boutonRejouer = document.querySelector("#replay-button");

const boutonSuivantTimer = document.querySelector("#next-button");


// Sélectionne tous les boutons mais uniquement pour que le Timer les désactive à la fin du temps imparti
let allButtonsForTimer;


/* PROGRESS BAR 🚀 */

// VARIABLES PROGRESS BAR
let progressTimer = document.querySelector("#progress-bar")
const progressBarTimer = document.querySelector("#progress-bar")
const containerProgressBarTimer = document.querySelector("#progress-bar-container")
let totalQuestionsTimer = quiz_espace.questions.length; // Nombre total de questions (ici : 10)

const progressBar = document.querySelector("#progress-bar");
const containerProgressBar = document.querySelector("#progress-bar-container");
const totalQuestions = quiz_espace.questions.length; // Nombre total de questions (ici : 10)
const fuseeProgressBar = document.querySelector("progressFusee");

//compteur questions dans progressBar
const questionCounter = document.querySelector("#questionCounter");
progressBar.appendChild(questionCounter);
//console.log("question counter : ", questionCounter);

// ****************************************************************************************** //

// affichage de la PREMIERE QUESTION & de ses OPTIONS (bouton "Décollage !")
boutonStart.addEventListener("click", function () {

  // Changer le fond d'écran
  document.body.classList.remove("initial-background");
  document.body.classList.add("quiz-background");

  // questions
  const askedQuestion = document.querySelector("#question-text");
  askedQuestion.innerText = quiz_espace.questions[textIndex].text;

  // Pour chaque option, créer un bouton et l'ajouter au conteneur
  quiz_espace.questions[textIndex].options.forEach((option) => {

    const boutonOptions = document.createElement("button");
    boutonOptions.id = option; // AJOUTER id pour identifier de façon unique le bouton sur lequel l'utilisateur à cliqué
    boutonOptions.innerText = option;
    boutonOptions.classList.add("boutonOptionsCSS"); // on ajoute la classe "boutonOptionsCSS" à tous les boutons "option"
    choixOptions.appendChild(boutonOptions);
  });

  askedQuestion.style.backgroundColor = "rgba(8, 84, 159, 0.5)"
  askedQuestion.style.borderBottom = "7px double #bae705"
  askedQuestion.style.borderRadius = "0 15px 0 15px"
  askedQuestion.style.boxShadow = "10px 10px 25px rgb(8, 115, 229)"
  boutonStart.classList.add("hidden");
  
  paragraphTimer.classList.remove("hidden")
  // ⏳ Afficher le gif au démarrage du timer**
  gifCompteur.classList.remove("hidden");


  allButtonsForTimer = choixOptions.querySelectorAll("button"); // Initialiser ici
  startTimer(); // Démarrer le timer au début du quiz

  boutonSuivant.classList.remove("hidden"); // faire apparaitre le bouton "suivant"
});

// FONCTION LOAD NEXT QUESTION
  // affichage des questions suivantes au clic du bouton "Suivant"
  boutonSuivant.addEventListener("click", function () {
    clearInterval(myTimeOut);  // on remet le compteur à zéro après chaque réponse
    t = 0;
    startTimer();  // on redémarre le timer
    choixOptions.innerHTML = "";
    textIndex++
  
    // Vérifier si c'est la dernière question
    if (textIndex >= quiz_espace.questions.length) {
      displayLastPage(); // Appel de la fonction pour afficher la dernière page
      return; // Important : Arrêter l'exécution de la fonction ici
    }

    const askedQuestion = document.querySelector("#question-text");
    askedQuestion.innerText = quiz_espace.questions[textIndex].text;
  
    // Pour chaque option, créer un bouton et l'ajouter au conteneur
    quiz_espace.questions[textIndex].options.forEach((option) => {
      const boutonOptions = document.createElement("button");
      boutonOptions.id = option; // AJOUTER id pour identifier de façon unique le bouton sur lequel l'utilisateur à cliqué
      boutonOptions.innerText = option;
      boutonOptions.classList.add("boutonOptionsCSS"); // on ajoute la classe "boutonOptionsCSS" à tous les boutons "option"
      choixOptions.appendChild(boutonOptions);
    });
    
    boutonStart.classList.add("hidden");
    boutonSuivant.classList.remove("hidden"); // faire apparaitre le bouton "suivant"
    boutonSuivant.setAttribute("disabled", "") // rend inactif le bouton suivant tant que l'on n'a pas donné de réponse
    // t = 0
    // myTimeOut = setInterval(() => warningTime(allButtonsForTimer), 1000); // Passer allButtonsForTimer
  });


// RECUPERATION DE L'OPTION CLIQUEE
  choixOptions.addEventListener("click", function (event) {
    const buttonClicked = event.target; // récupère l'élément bouton cliqué
    const buttonIdClicked = event.target.id; // Recuperer l'ID du bouton sur lequel l'utilisateur a cliqué
    const correctAnswer = quiz_espace.questions[textIndex].correct_answer; // Recuperer la réponse considerée comme correct depuis quiz_space

    checkAnswer(buttonIdClicked, correctAnswer, buttonClicked);
    clearInterval(myTimeOut); // arrête le timer lorsqu'une réponse est donnée
    //bouton "Suivant" DISABLED
    boutonSuivant.removeAttribute("disabled")


    
    // ****************
    // PROGRESS BAR  🚀
    // ****************
    containerProgressBar.classList.remove("hidden");  // faire apparaitre le container de la progress bar
    progressBar.classList.remove("hidden");  // faire apparaitre la progress bar

    // Mettre à jour la barre de progression
      const progress = ((textIndex +1) / totalQuestions) * 100;
      progressBar.style.width = progress + "%";
    
    // Mettre à jour la position de la fusée
    const fuseeProgress = document.querySelector("#fuseeProgress");
    fuseeProgress.classList.remove("hidden");  // faire apparaitre la fusee
    fuseeProgress.style.left = `calc(${progress}% - 45px)`; // Ajustez la position de l'image
  
    // Mettre à jour le compteur de questions restantes
    const remainingQuestions = totalQuestions - textIndex - 1;
    let message = "";
      if (remainingQuestions === 1) {
          message = "Reste 1 question";
      } else if (remainingQuestions > 1) {
          message = "Restent " + remainingQuestions + " questions";
      } else {
          message = ""; // Aucune question restante
      }
    questionCounter.textContent = message;
  
    // Positionner le compteur juste après la fusée
    const fuseeRect = fuseeProgress.getBoundingClientRect();
    const fuseeRight = fuseeRect.right;
    const progressBarRect = progressBar.getBoundingClientRect();
    const progressBarLeft = progressBarRect.left;
    const textPosition = fuseeRight - progressBarLeft + 10;

    // Mettre à jour la position du texte
    document.querySelector("#progress-bar-text").style.left = `${progressBarLeft}px`; // Positionnez la div au début de la barre
    questionCounter.style.left = `${textPosition - progressBarLeft}px`; // Positionnez le texte par rapport à la div

    // Vérifier si c'est la dernière question après la réponse
    if (textIndex + 1 >= quiz_espace.questions.length) {
    displayLastPage(); // Appel de la fonction pour afficher la dernière page
    setTimeout(displayLastPage, 3500); // Ajout d'un délai de 3.5 secondes
    choixOptions.innerHTML = ""; // Efface les options de réponse
    boutonSuivant.classList.add("hidden"); // Cacher le bouton Suivant
    }
  });


// Calcul score bonnes réponses
function correctAnswerScore(buttonIdClicked, correctAnswer){
  if(buttonIdClicked === correctAnswer){
    scoreIndex++;
  };

  if(scoreIndex <= 2){
    message.innerText = "L'espace, c'est pas ton truc... 👽"
  }else if(scoreIndex >= 3 && scoreIndex <= 7){
    message.innerText = "Pas mal, persévère ! 🤩"
  }else if (scoreIndex >= 8 && scoreIndex <= 9){
    message.innerText = "Excellent ! tu es prêt(e) pour la prochaine expédition sur Mars !!🛸 🥳"
  }else{
    message.innerText = "BRAVO ! Tu es prêt(e) pour coloniser la Lune !! 🎉 🥳"
  }

// ****************
//   CONFETTIS  🎉
// ****************
// Déclenchement des confettis si toutes les réponses sont correctes
  if (scoreIndex === quiz_espace.questions.length) {
    confetti({
        particleCount: 300,  // nombre de confettis
        spread: 150,         // dispersion des confettis
        origin: { y: 0.6 },
        duration: 4500,
        startVelocity: 60,  // vitesse initiale
        decay: 0.9,  // ralentit la décélération
        colors: ['#ffffff', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71'] // Ajoute des couleurs
    });
  }
};


/* Gestion réponses */
function checkAnswer(buttonIdClicked, correctAnswer, buttonClicked) {
    correctAnswerScore(buttonIdClicked, correctAnswer);

      if (buttonIdClicked === correctAnswer) {
        buttonClicked.style = "border: 8px solid green"
        buttonClicked.style.transition = "transform 0.2s ease-in-out"; // Ajout d'une transition
        buttonClicked.style.transform = "scale(1.1)"; // Agrandissement de 10%
          // Réinitialisation de la taille après un court délai
          setTimeout(() => {
            buttonClicked.style.transform = "scale(1)";
        }, 500); // Réinitialisation après 500 ms (0.5 seconde)
      } else {
        buttonClicked.style = "border: 8px solid red"
        // j'affiche quelle était la réponse correcte
      const allButtons = choixOptions.querySelectorAll("button");
          allButtons.forEach(button => {
            // Une fois une option cliquée, on désactive les autres boutons options
          button.disabled = true;
             // Une fois une option cliquée, on fait apparaitre la bonne réponse
          if (button.id === correctAnswer) {
                  button.style.border = "8px solid green";
          }
        }); 
      }
}

  // ***************************
  //   SECTION POUR LE TIMER ⏰
  // ***************************

  function startTimer(){
    clearInterval(myTimeOut);
    t = 0;
    // **S'assurer que le gif est visible au début de chaque timer**
    gifCompteur.classList.remove("hidden");
    myTimeOut = setInterval(() => warningTime(allButtonsForTimer), 1000); // Passer allButtonsForTimer
  }

function warningTime(allButtonsForTimer) {
  const correctAnswerTimer = quiz_espace.questions[textIndex].correct_answer;
  t++
  paragraphTimer.innerHTML = t
    if(t > 10){
      paragraphTimer.innerHTML = "temps écoulé ! ⏱️"
      paragraphTimer.style.padding = "8px"
      clearInterval(myTimeOut);
      boutonSuivantTimer.disabled = false; // Uniquement lorsque le timer est terminé
      containerProgressBarTimer.classList.remove("hidden");  // faire apparaitre le container de la progress bar lorsque le timer est terminé
      progressBarTimer.classList.remove("hidden");  // faire apparaitre la progress bar lorsque le timer est terminé
      progressTimer = ((textIndex + 1) / totalQuestionsTimer) * 100 // Uniquement lorsque le timer est terminé
      progressBarTimer.style.width = progressTimer + "%" // Uniquement lorsque le timer est terminé

      allButtonsForTimer.forEach(button => {
        button.disabled = true;
        if (button.id === correctAnswerTimer) {
            button.style.border = "8px solid green";
        }
      });
       // Cacher le gif quand le temps est écoulé
       gifCompteur.classList.add("hidden");
    }
}

// Fonction pour afficher la dernière page
function displayLastPage() {
  boutonSuivant.classList.add("hidden");
  scoreBonnesReponses.classList.remove("hidden");
  scoreBonnesReponses.innerText = ("Bonnes réponses : " + scoreIndex + " / " + quiz_espace.questions.length);
  message.classList.remove("hidden")
  boutonRejouer.classList.remove("hidden");
  paragraphTimer.classList.add("hidden");
  // Cacher le gif quand le temps est écoulé
  gifCompteur.classList.add("hidden");
  questionTexte.innerHTML = "";

  questionTexte.style.backgroundColor = "";
  questionTexte.style.borderRadius = "";
  questionTexte.style.borderBottom = "";
  questionTexte.style.boxShadow = "";

  // Changer le fond d'écran
  document.body.classList.remove("quiz-background");
  document.body.classList.add("replay-background");
}


// Gestion du bouton "Rejouer"
  boutonRejouer.addEventListener("click", function () {
    location.reload(); // Rafraîchir la page
  });