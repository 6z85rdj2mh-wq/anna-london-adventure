/* ======================================================
   ANNA'S LONDON ADVENTURE
   SCRIPT.JS FINAL CLEAN
====================================================== */


/* ======================================================
                ELEMENTS
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




if(content){

    content.style.display = "none";

}



let started = false;







/* ======================================================
                START JOURNEY
====================================================== */


function startJourney(){


    if(started)
    return;



    started = true;





    song.volume = 0.35;


    song.play()
    .catch(()=>{


        console.log(
            "Audio bloccato dal browser"
        );


    });







    button.style.opacity = "0";


    button.style.transform =
    "scale(.8)";






    setTimeout(()=>{


        button.style.display = "none";


    },500);







    setTimeout(()=>{


        overlay.classList.add("active");


    },600);







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





    plane.style.opacity = "1";







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










        plane.style.left =
        screenPoint.x + "px";



        plane.style.top =
        (screenPoint.y - 25)
        + "px";









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



        destination.style.filter =
        "drop-shadow(0 0 30px white)";



    }







    setTimeout(()=>{


        closeFlight();


    },1000);



}









/* ======================================================
                CLOSE FLIGHT
====================================================== */


function closeFlight(){



    overlay.style.opacity = "0";


    overlay.style.transform =
    "scale(1.05)";







    setTimeout(()=>{



        overlay.classList.remove(
            "active"
        );






        hero.style.opacity = "0";


        hero.style.transform =
        "scale(1.05)";







        setTimeout(()=>{



            hero.style.display =
            "none";



            content.style.display =
            "block";






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
            SUPABASE PHOTO UPLOAD
====================================================== */


async function uploadToSupabase(event,galleryId){



    const files =
    event.target.files;



    const gallery =
    document.getElementById(
        galleryId
    );





    if(!gallery)
    return;







    for(const file of files){



        try{





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









            const {error} =

            await supabaseClient

            .storage

            .from(
                "anna-graduation-trip"
            )

            .upload(

                filePath,

                file,

                {

                    contentType:file.type,

                    upsert:false

                }

            );







            if(error){

                throw error;

            }








            console.log(
                "Foto caricata:",
                filePath
            );








            await loadGallery(

                folder,

                galleryId

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
            LOAD SAVED PHOTOS
====================================================== */


async function loadGallery(folder,galleryId){



    const gallery =

    document.getElementById(
        galleryId
    );





    if(!gallery)
    return;







    gallery.innerHTML = "";









    const {data,error}=

    await supabaseClient

    .storage

    .from(
        "anna-graduation-trip"
    )

    .list(

        folder,

        {

            limit:100,

            sort:{

                column:"created_at",

                order:"asc"

            }

        }

    );









    if(error){



        console.error(

            "Errore caricamento galleria:",

            error

        );


        return;


    }









    data.forEach(file=>{







        const {data:urlData}=

        supabaseClient

        .storage

        .from(
            "anna-graduation-trip"
        )

        .getPublicUrl(

            `${folder}/${file.name}`

        );









        const img =

        document.createElement(
            "img"
        );









        img.src =

        urlData.publicUrl;








        img.dataset.path =

        `${folder}/${file.name}`;









        gallery.appendChild(
            img
        );



    });




}












/* ======================================================
                RESET + INITIAL LOAD
====================================================== */


let galleryLoaded = false;



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








    if(galleryLoaded)
    return;



    galleryLoaded = true;








    loadGallery(

        "laurea",

        "degreeGallery"

    );








    loadGallery(

        "londra",

        "londonGallery"

    );





});














/* ======================================================
        PHOTO LONG PRESS SYSTEM
====================================================== */


let pressTimer = null;


let selectedImage = null;




const photoMenu = 
document.getElementById(
    "photoMenu"
);






function startPress(img){


    selectedImage = img;



    pressTimer = setTimeout(()=>{


        openPhotoMenu(img);



    },1500);



}







function cancelPress(){


    clearTimeout(
        pressTimer
    );


}









function openPhotoMenu(img){



    selectedImage = img;



    const rect =

    img.getBoundingClientRect();






    photoMenu.style.left =

    rect.left + rect.width/2 + "px";





    photoMenu.style.top =

    rect.top + rect.height/2 + "px";







    photoMenu.classList.add(
        "active"
    );



}









function closePhotoMenu(){



    photoMenu.classList.remove(
        "active"
    );



    selectedImage = null;



}









document

.getElementById(
    "closePhotoMenu"
)

.addEventListener(

"click",

()=>{


    closePhotoMenu();


});









/* ======================================================
        TOUCH LONG PRESS
====================================================== */


document.addEventListener(

"touchstart",

e=>{



    if(

        e.target.tagName === "IMG"

    ){



        startPress(
            e.target
        );



    }



});







document.addEventListener(

"touchend",

()=>{


    cancelPress();



});







document.addEventListener(

"touchmove",

()=>{


    cancelPress();



});
