function startJourney(){


const plane = document.getElementById("plane");

const hero = document.getElementById("hero");

const content = document.getElementById("content");

const song = document.getElementById("song");



// parte la musica

song.volume = 0.35;

song.play();



// parte l'aereo

plane.classList.add("fly");



// chiusura copertina

setTimeout(()=>{


hero.style.opacity="0";

hero.style.transform="scale(1.05)";


},1600);




// apertura viaggio

setTimeout(()=>{


hero.style.display="none";


content.style.display="block";


},3000);



}
