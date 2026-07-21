/* ======================================================
   ANNA'S LONDON ADVENTURE
   SCRIPT.JS 2.3
====================================================== */



const hero = document.getElementById("hero");

const overlay = document.getElementById("flightOverlay");

const plane = document.getElementById("plane");

const svg = document.getElementById("flightSVG");

const path = document.getElementById("flightPath");

const line = document.getElementById("flightLine");

const content = document.getElementById("content");

const song = document.getElementById("song");

const button = document.getElementById("startButton");



let started = false;





/* ======================================================
                START JOURNEY
====================================================== */


function startJourney(){



    if(started)
    return;


    started=true;




    // musica

    song.volume = 0.35;


    song.play()
    .catch(()=>{

        console.log(
        "Audio bloccato dal browser"
        );

    });





    // nasconde bottone


    button.style.opacity="0";

    button.style.transform=
    "scale(.8)";



    setTimeout(()=>{


        button.style.display="none";


    },500);







    // apre volo


    setTimeout(()=>{


        overlay.classList.add("active");


    },600);







    // parte animazione


    setTimeout(()=>{


        startFlight();


    },1200);



}









/* ======================================================
                START FLIGHT
====================================================== */


function startFlight(){



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


        animatePlane();


    },700);




}









/* ======================================================
            PLANE FOLLOW SVG PATH
====================================================== */


function animatePlane(){



    const duration = 4300;


    const totalLength =
    path.getTotalLength();



    const start =
    performance.now();



    plane.style.opacity="1";





    function frame(time){



        let progress =
        (time-start)/duration;



        if(progress>1)
        progress=1;






        const current =
        totalLength * progress;






        const point =
        path.getPointAtLength(
            current
        );



        const next =
        path.getPointAtLength(

            Math.min(
                current+5,
                totalLength
            )

        );






        /*
            conversione SVG
            responsive
        */


        const matrix =
        svg.getScreenCTM();



        const screenPoint =
        new DOMPoint(

            point.x,

            point.y

        )
        .matrixTransform(matrix);



        const screenNext =
        new DOMPoint(

            next.x,

            next.y

        )
        .matrixTransform(matrix);







        /*
            posizione aereo
        */


        plane.style.left =
        screenPoint.x + "px";



        plane.style.top =
        (screenPoint.y - 25)
        + "px";







        /*
            rotazione
        */


        const angle =

        Math.atan2(

            screenNext.y-screenPoint.y,

            screenNext.x-screenPoint.x

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


            requestAnimationFrame(
                frame
            );


        }
        else{


            finishFlight();


        }



    }



    requestAnimationFrame(frame);



}
/* ======================================================
                ARRIVAL
====================================================== */


function finishFlight(){



    plane.classList.add(
        "landing-glow"
    );




    const destination =
    document.querySelector(
        ".destination-dot"
    );



    if(destination){


        destination.style.transform =
        "scale(2)";


        destination.style.boxShadow =
        "0 0 60px white";


    }






    setTimeout(()=>{


        closeFlight();


    },1500);



}







/* ======================================================
                CLOSE FLIGHT
====================================================== */


function closeFlight(){



    overlay.style.opacity="0";


    overlay.style.transform =
    "scale(1.05)";






    setTimeout(()=>{



        overlay.classList.remove(
            "active"
        );





        hero.style.opacity="0";

        hero.style.transform=
        "scale(1.05)";






        setTimeout(()=>{



            hero.style.display="none";



            content.style.display="block";



            window.scrollTo({

                top:0,

                behavior:"smooth"

            });



        },700);




    },900);



}









/* ======================================================
            CARD OPEN / CLOSE
====================================================== */


function toggleSection(header){



    const body =
    header.nextElementSibling;



    const isOpen =
    body.classList.contains(
        "open"
    );



    document
    .querySelectorAll(
        ".card-body"
    )
    .forEach(section=>{


        section.classList.remove(
            "open"
        );


    });




    document
    .querySelectorAll(
        ".card-header"
    )
    .forEach(item=>{


        item.classList.remove(
            "active"
        );


    });






    if(!isOpen){



        body.classList.add(
            "open"
        );



        header.classList.add(
            "active"
        );


    }



}








/* ======================================================
            PHOTO UPLOAD PREVIEW
====================================================== */


async function uploadToSupabase(event, galleryId){

    const files = event.target.files;

    const gallery = document.getElementById(galleryId);


    for (const file of files){

        try {

            let folder = "";

            if(galleryId === "degreeGallery"){
                folder = "laurea";
            }

            if(galleryId === "londonGallery"){
                folder = "londra";
            }


            const fileName =
            `${Date.now()}-${file.name}`;


            const filePath =
            `${folder}/${fileName}`;



            const {data,error} =
            await supabaseClient
            .storage
            .from("anna-graduation-trip")
            .upload(
                filePath,
                file
            );


            if(error){
                throw error;
            }



            const {data:urlData} =
            supabaseClient
            .storage
            .from("anna-adventure")
            .getPublicUrl(
                filePath
            );



            const img =
            document.createElement("img");


            img.src =
            urlData.publicUrl;


            gallery.appendChild(img);



            console.log(
                "Foto caricata:",
                urlData.publicUrl
            );


        }

        catch(error){

            console.error(
                "Errore upload:",
                error
            );

        }

    }

}









/* ======================================================
            RESET
====================================================== */


window.addEventListener(
"load",
()=>{


    if(line){


        const length =
        line.getTotalLength();



        line.style.strokeDasharray =
        length;



        line.style.strokeDashoffset =
        length;



    }



});
