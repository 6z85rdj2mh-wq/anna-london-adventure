function startJourney(){


const plane = document.getElementById("plane");

const hero = document.getElementById("hero");

const content = document.getElementById("content");



plane.classList.add("fly");



setTimeout(()=>{


hero.style.opacity="0";

hero.style.transform="scale(1.05)";


},1600);




setTimeout(()=>{


hero.style.display="none";


content.style.display="block";


},3000);



}
