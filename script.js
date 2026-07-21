function startJourney(){


    const plane = document.getElementById("plane");

    const hero = document.getElementById("hero");

    const content = document.getElementById("content");



    plane.classList.add("fly");



    setTimeout(function(){


        hero.style.opacity="0";


    },1500);




    setTimeout(function(){


        hero.style.display="none";


        content.style.display="block";


    },2500);



}
