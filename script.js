/* ==========================================================
   ANNA'S LONDON ADVENTURE
   SCRIPT VERSIONE 2.0
========================================================== */


const hero = document.getElementById("hero");

const overlay = document.getElementById("flightOverlay");

const plane = document.getElementById("plane");

const path = document.getElementById("flightPath");

const line = document.getElementById("flightLine");

const content = document.getElementById("content");

const song = document.getElementById("song");

const button = document.getElementById("startButton");



let animationStarted = false;



/* ==========================================================
        START JOURNEY
========================================================== */


function startJourney(){


    if(animationStarted) return;


    animationStarted = true;


    /*
        musica
    */

    song.volume = 0.35;

    song.play()
    .catch(()=>{

        console.log(
        "Autoplay bloccato dal browser"
        );

    });



    /*
        nasconde pulsante
    */


    button.style.opacity="0";

    button.style.transform="scale(.8)";



    setTimeout(()=>{


        button.style.display="none";


    },500);



    /*
        apre volo
    */


    setTimeout(()=>{


        overlay.classList.add("active");


    },600);



    /*
        avvia animazione
    */


    setTimeout(()=>{


        animateFlight();


    },1200);



}




/* ==========================================================
        FLIGHT ANIMATION
========================================================== */


function animateFlight(){



    /*
        prepara linea
    */


    const length =
    line.getTotalLength();



    line.style.strokeDasharray =
    length;



    line.style.strokeDashoffset =
    length;



    /*
        animazione linea
    */


    line.animate(

        [
            {
                strokeDashoffset:length
            },

            {
                strokeDashoffset:0
            }

        ],

        {

            duration:3500,

            easing:
            "ease-in-out",

            fill:"forwards"

        }

    );



    /*
        animazione aereo
    */


    animatePlane();



}





/* ==========================================================
        PLANE FOLLOW SVG PATH
========================================================== */


function animatePlane(){


    const duration = 4200;


    const start = performance.now();



    plane.style.opacity=1;



    function frame(time){



        let progress =
        (time-start)/duration;



        if(progress>1)
        {

            progress=1;

        }



        const point =
        path.getPointAtLength(

            path.getTotalLength()
            *
            progress

        );




        const next =
        path.getPointAtLength(

            Math.min(

            path.getTotalLength(),

            path.getTotalLength()
            *
            (progress+.01)

            )

        );



        /*
            posizione
        */


        plane.style.left =
        point.x/10 + "%";


        plane.style.top =
        point.y/10 + "%";



        /*
            rotazione aereo
        */


        const angle =
        Math.atan2(

            next.y-point.y,

            next.x-point.x

        )
        *
        180
        /
        Math.PI;



        plane.style.transform =
        `
        translate(-50%,-50%)
        rotate(${angle}deg)
        `;



        if(progress<1){


            requestAnimationFrame(frame);


        }

        else{


            finishFlight();


        }



    }



    requestAnimationFrame(frame);


}
