/* ==========================================================
   ANNA'S LONDON ADVENTURE
   SCRIPT 2.1
========================================================== */


const hero = document.getElementById("hero");
const overlay = document.getElementById("flightOverlay");
const plane = document.getElementById("plane");

const path = document.getElementById("flightPath");
const line = document.getElementById("flightLine");

const content = document.getElementById("content");
const song = document.getElementById("song");
const button = document.getElementById("startButton");

const flightContainer = document.querySelector(".flight-container");


let started = false;



/* ==========================================================
                START
========================================================== */


function startJourney(){


    if(started) return;

    started=true;



    // musica

    song.volume = 0.35;

    song.play()
    .catch(()=>{});




    // pulsante

    button.style.opacity="0";

    button.style.transform="scale(.8)";



    setTimeout(()=>{

        button.style.display="none";

    },500);





    // apre volo

    setTimeout(()=>{

        overlay.classList.add("active");

    },600);





    // parte animazione

    setTimeout(()=>{

        prepareFlight();

    },1200);



}







/* ==========================================================
             PREPARAZIONE VOLO
========================================================== */


function prepareFlight(){


    const length =
    line.getTotalLength();



    line.style.strokeDasharray =
    length;


    line.style.strokeDashoffset =
    length;




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

            easing:"ease-in-out",

            fill:"forwards"

        }

    );



    setTimeout(()=>{


        flyPlane();



    },700);



}








/* ==========================================================
              AEREO SULLA CURVA
========================================================== */


function flyPlane(){


    const duration = 4300;


    const totalLength =
    path.getTotalLength();



    const start =
    performance.now();



    plane.style.opacity="1";




    function animate(time){



        let progress =
        (time-start)/duration;



        if(progress>1)
        progress=1;



        const currentLength =
        totalLength * progress;



        const point =
        path.getPointAtLength(
            currentLength
        );




        const next =
        path.getPointAtLength(
            Math.min(
                currentLength + 5,
                totalLength
            )
        );





        /*
            conversione SVG -> pixel
        */


        const svg =
        document.getElementById("flightSVG");



        const rect =
        svg.getBoundingClientRect();



        const scaleX =
        rect.width / 1000;



        const scaleY =
        rect.height / 500;




        const x =
        point.x * scaleX;



        const y =
        point.y * scaleY;






        /*
            angolo aereo
        */


        const angle =
        Math.atan2(
            next.y-point.y,
            next.x-point.x
        )
        *
        180 /
        Math.PI;






        plane.style.left =
        x + "px";



        plane.style.top =
        y + "px";




        plane.style.transform =

        `
        translate(-50%,-50%)
        rotate(${angle}deg)
        `;





        if(progress < 1){


            requestAnimationFrame(
                animate
            );


        }
        else{


            arrive();



        }



    }



    requestAnimationFrame(
        animate
    );

}







/* ==========================================================
              ARRIVO
========================================================== */


function arrive(){


    plane.classList.add(
        "landing-glow"
    );



    const destination =
    document.querySelector(
        ".destination-dot"
    );



    destination.style.transform=
    "scale(2)";



    destination.style.boxShadow=
    "0 0 60px white";





    setTimeout(()=>{


        finish();


    },1600);



}







/* ==========================================================
              FINE TRANSIZIONE
========================================================== */


function finish(){


    overlay.style.opacity="0";

    overlay.style.transform=
    "scale(1.05)";



    setTimeout(()=>{


        overlay.classList.remove(
            "active"
        );



        hero.classList.add(
            "fade-away"
        );



        setTimeout(()=>{


            hero.style.display="none";


            content.style.display=
            "block";



        },800);



    },900);



}







/* ==========================================================
              RESET LINEA
========================================================== */


window.addEventListener(
"load",
()=>{


    const length =
    line.getTotalLength();



    line.style.strokeDasharray =
    length;


    line.style.strokeDashoffset =
    length;



});
