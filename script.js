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

    if(
        !gallery ||
        !files ||
        files.length === 0
    )
    return;


    let folder = "";


    if(galleryId === "degreeGallery"){

        folder = "laurea";

    }


    if(galleryId === "londonGallery"){

        folder = "londra";

    }


    if(!folder){

        console.error(
            "Galleria non riconosciuta:",
            galleryId
        );

        return;

    }


    for(const file of files){

        try{

            const safeName =

            file.name.replace(
                /\s+/g,
                "-"
            );


            const fileName =

            `${Date.now()}-${safeName}`;


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


            const {data:urlData} =

            supabaseClient

            .storage

            .from(
                "anna-graduation-trip"
            )

            .getPublicUrl(
                filePath
            );


            addPhotoToGallery(

                gallery,

                urlData.publicUrl,

                filePath

            );


            console.log(
                "Foto caricata:",
                filePath
            );

        }

        catch(error){

            console.error(
                "Errore upload:",
                error
            );


            alert(
                "Non è stato possibile caricare la foto. Riprova."
            );

        }

    }


    event.target.value = "";

}


/* ======================================================
        CREATE GALLERY IMAGE
====================================================== */


function addPhotoToGallery(
    gallery,
    photoUrl,
    filePath
){

    if(
        !gallery ||
        !photoUrl ||
        !filePath
    )
    return null;


    const img =

    document.createElement(
        "img"
    );


    img.src =
    photoUrl;


    img.dataset.path =
    filePath;


    img.alt =
    "Ricordo di Anna";


    img.loading =
    "lazy";


    img.draggable =
    false;


    gallery.appendChild(
        img
    );


    return img;

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


    const {data,error} =

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

        const {data:urlData} =

        supabaseClient

        .storage

        .from(
            "anna-graduation-trip"
        )

        .getPublicUrl(

            `${folder}/${file.name}`

        );


        addPhotoToGallery(

            gallery,

            urlData.publicUrl,

            `${folder}/${file.name}`

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

let longPressTriggered = false;

let pointerMoved = false;

let pressStartX = 0;

let pressStartY = 0;


const photoMenu =

document.getElementById(
    "photoMenu"
);


/* ======================================================
        CHECK GALLERY IMAGE
====================================================== */


function isGalleryImage(element){

    if(
        !element ||
        element.tagName !== "IMG"
    )
    return false;


    return Boolean(

        element.closest(
            "#degreeGallery, #londonGallery"
        )

    );

}


/* ======================================================
        START PRESS
====================================================== */


function startPress(img,event){

    if(!isGalleryImage(img))
    return;


    selectedImage = img;

    longPressTriggered = false;

    pointerMoved = false;


    pressStartX =
    event.clientX ?? 0;


    pressStartY =
    event.clientY ?? 0;


    clearTimeout(
        pressTimer
    );


    pressTimer = setTimeout(()=>{

        if(pointerMoved)
        return;


        longPressTriggered = true;


        openPhotoMenu(
            img
        );

    },1000);

}


/* ======================================================
        CANCEL PRESS
====================================================== */


function cancelPress(){

    clearTimeout(
        pressTimer
    );

    pressTimer = null;

}


/* ======================================================
        OPEN PHOTO MENU
====================================================== */


function openPhotoMenu(img){

    if(
        !photoMenu ||
        !img
    )
    return;


    selectedImage = img;


    const rect =

    img.getBoundingClientRect();


    photoMenu.style.left =

    rect.left +
    rect.width / 2 +
    "px";


    photoMenu.style.top =

    rect.top +
    rect.height / 2 +
    "px";


    photoMenu.classList.add(
        "active"
    );

}


/* ======================================================
        CLOSE PHOTO MENU
====================================================== */


function closePhotoMenu(){

    if(photoMenu){

        photoMenu.classList.remove(
            "active"
        );

    }


    selectedImage = null;

    longPressTriggered = false;

    pointerMoved = false;

    cancelPress();

}


/* ======================================================
        CLOSE MENU BUTTON
====================================================== */


const closePhotoMenuButton =

document.getElementById(
    "closePhotoMenu"
);


if(closePhotoMenuButton){

    closePhotoMenuButton.addEventListener(

        "click",

        ()=>{

            closePhotoMenu();

        }

    );

}


/* ======================================================
        POINTER DOWN
====================================================== */


document.addEventListener(

"pointerdown",

event=>{

    const img =
    event.target;


    if(!isGalleryImage(img))
    return;


    startPress(
        img,
        event
    );

});


/* ======================================================
        POINTER MOVE
====================================================== */


document.addEventListener(

"pointermove",

event=>{

    if(!pressTimer)
    return;


    const currentX =
    event.clientX ?? 0;


    const currentY =
    event.clientY ?? 0;


    const distanceX =

    Math.abs(
        currentX - pressStartX
    );


    const distanceY =

    Math.abs(
        currentY - pressStartY
    );


    if(
        distanceX > 10 ||
        distanceY > 10
    ){

        pointerMoved = true;

        cancelPress();

    }

});


/* ======================================================
        POINTER UP
====================================================== */


document.addEventListener(

"pointerup",

event=>{

    const img =
    event.target;


    if(!isGalleryImage(img)){

        cancelPress();

        return;

    }


    cancelPress();


    if(pointerMoved){

        pointerMoved = false;

        return;

    }


    if(longPressTriggered){

        longPressTriggered = false;

        return;

    }


    selectedImage = img;


    openPhotoViewer(
        img
    );

});


/* ======================================================
        POINTER CANCEL
====================================================== */


document.addEventListener(

"pointercancel",

()=>{

    pointerMoved = true;

    cancelPress();

});


/* ======================================================
        PREVENT NATIVE IMAGE MENU
====================================================== */


document.addEventListener(

"contextmenu",

event=>{

    if(isGalleryImage(event.target)){

        event.preventDefault();

    }

});
/* ======================================================
        SAVE PHOTO
====================================================== */


const savePhotoButton =

document.getElementById(
    "savePhoto"
);


if(savePhotoButton){

    savePhotoButton.addEventListener(

        "click",

        ()=>{

            if(!selectedImage)
            return;


            const link =

            document.createElement(
                "a"
            );


            link.href =

            selectedImage.src;


            link.download =

            "anna-photo.jpg";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            closePhotoMenu();

        }

    );

}


/* ======================================================
        DELETE PHOTO
====================================================== */


const deletePhotoButton =

document.getElementById(
    "deletePhoto"
);


if(deletePhotoButton){

    deletePhotoButton.addEventListener(

        "click",

        async ()=>{

            if(!selectedImage)
            return;


            const imageToDelete =

            selectedImage;


            const path =

            imageToDelete.dataset.path;


            if(!path){

                console.error(
                    "Percorso foto non trovato"
                );

                return;

            }


            const confirmDelete =

            confirm(
                "Vuoi eliminare questa foto?"
            );


            if(!confirmDelete)
            return;


            try{

                const {error} =

                await supabaseClient

                .storage

                .from(
                    "anna-graduation-trip"
                )

                .remove([
                    path
                ]);


                if(error){

                    throw error;

                }


                console.log(
                    "Foto eliminata:",
                    path
                );


                /*
                Rimuove subito la foto
                dalla schermata
                */

                imageToDelete.remove();


                /*
                Chiude il menu
                e azzera la selezione
                */

                closePhotoMenu();


                /*
                Se il viewer stava mostrando
                la stessa foto, lo chiude
                */

                if(

                    viewerImage &&

                    viewerImage.src ===
                    imageToDelete.src

                ){

                    closePhotoViewer();

                }

            }

            catch(error){

                console.error(

                    "Errore eliminazione:",

                    error

                );


                alert(
                    "Errore durante eliminazione foto"
                );

            }

        }

    );

}
/* ======================================================
        PHOTO VIEWER
====================================================== */


const photoViewer =

document.getElementById(
    "photoViewer"
);


const viewerImage =

document.getElementById(
    "viewerImage"
);


const viewerCloseButton =

document.getElementById(
    "viewerClose"
);


const viewerBackground =

document.querySelector(
    ".viewer-background"
);


/*
I vecchi pulsanti Salva ed Elimina
del viewer vengono riutilizzati
come precedente e successiva
*/


const viewerPreviousButton =

document.getElementById(
    "viewerSave"
);


const viewerNextButton =

document.getElementById(
    "viewerDelete"
);


let viewerPhotos = [];

let viewerIndex = 0;

let viewerTouchStartX = 0;

let viewerTouchEndX = 0;


/* ======================================================
        GET CURRENT GALLERY PHOTOS
====================================================== */


function getGalleryPhotos(img){

    if(!img)
    return [];


    const gallery =

    img.closest(
        "#degreeGallery, #londonGallery"
    );


    if(!gallery)
    return [];


    return Array.from(

        gallery.querySelectorAll(
            "img"
        )

    );

}


/* ======================================================
        OPEN PHOTO VIEWER
====================================================== */


function openPhotoViewer(img){

    if(
        !photoViewer ||
        !viewerImage ||
        !img
    )
    return;


    viewerPhotos =

    getGalleryPhotos(
        img
    );


    viewerIndex =

    viewerPhotos.indexOf(
        img
    );


    if(viewerIndex < 0){

        viewerIndex = 0;

    }


    updateViewerImage();


    photoViewer.classList.add(
        "active"
    );


    document.body.style.overflow =
    "hidden";

}


/* ======================================================
        UPDATE VIEWER IMAGE
====================================================== */


function updateViewerImage(){

    if(
        !viewerImage ||
        viewerPhotos.length === 0
    )
    return;


    const currentPhoto =

    viewerPhotos[
        viewerIndex
    ];


    viewerImage.src =

    currentPhoto.src;


    viewerImage.alt =

    currentPhoto.alt ||
    "Foto dell'album";


    updateViewerButtons();

}


/* ======================================================
        UPDATE VIEWER BUTTONS
====================================================== */


function updateViewerButtons(){

    const hasMultiplePhotos =

    viewerPhotos.length > 1;


    if(viewerPreviousButton){

        viewerPreviousButton.style.display =

        hasMultiplePhotos
        ? "flex"
        : "none";


        viewerPreviousButton.innerHTML =
        "←";


        viewerPreviousButton.setAttribute(

            "aria-label",

            "Foto precedente"

        );

    }


    if(viewerNextButton){

        viewerNextButton.style.display =

        hasMultiplePhotos
        ? "flex"
        : "none";


        viewerNextButton.innerHTML =
        "→";


        viewerNextButton.setAttribute(

            "aria-label",

            "Foto successiva"

        );

    }

}


/* ======================================================
        PREVIOUS PHOTO
====================================================== */


function showPreviousPhoto(){

    if(viewerPhotos.length <= 1)
    return;


    viewerIndex--;


    if(viewerIndex < 0){

        viewerIndex =
        viewerPhotos.length - 1;

    }


    updateViewerImage();

}


/* ======================================================
        NEXT PHOTO
====================================================== */


function showNextPhoto(){

    if(viewerPhotos.length <= 1)
    return;


    viewerIndex++;


    if(
        viewerIndex >=
        viewerPhotos.length
    ){

        viewerIndex = 0;

    }


    updateViewerImage();

}


/* ======================================================
        CLOSE PHOTO VIEWER
====================================================== */


function closePhotoViewer(){

    if(!photoViewer)
    return;


    photoViewer.classList.remove(
        "active"
    );


    document.body.style.overflow =
    "";


    viewerPhotos = [];

    viewerIndex = 0;

}


/* ======================================================
        VIEWER BUTTON EVENTS
====================================================== */


if(viewerPreviousButton){

    viewerPreviousButton.addEventListener(

        "click",

        event=>{

            event.stopPropagation();

            showPreviousPhoto();

        }

    );

}


if(viewerNextButton){

    viewerNextButton.addEventListener(

        "click",

        event=>{

            event.stopPropagation();

            showNextPhoto();

        }

    );

}


if(viewerCloseButton){

    viewerCloseButton.addEventListener(

        "click",

        event=>{

            event.stopPropagation();

            closePhotoViewer();

        }

    );

}


if(viewerBackground){

    viewerBackground.addEventListener(

        "click",

        closePhotoViewer

    );

}


/* ======================================================
        SWIPE VIEWER
====================================================== */


if(photoViewer){

    photoViewer.addEventListener(

        "touchstart",

        event=>{

            viewerTouchStartX =

            event.changedTouches[0]
            .screenX;

        },

        {
            passive:true
        }

    );


    photoViewer.addEventListener(

        "touchend",

        event=>{

            viewerTouchEndX =

            event.changedTouches[0]
            .screenX;


            const swipeDistance =

            viewerTouchEndX -
            viewerTouchStartX;


            if(
                Math.abs(
                    swipeDistance
                ) < 50
            )
            return;


            if(swipeDistance > 0){

                showPreviousPhoto();

            }

            else{

                showNextPhoto();

            }

        },

        {
            passive:true
        }

    );

}


/* ======================================================
        KEYBOARD VIEWER CONTROLS
====================================================== */


document.addEventListener(

"keydown",

event=>{

    if(
        !photoViewer ||
        !photoViewer.classList.contains(
            "active"
        )
    )
    return;


    if(event.key === "ArrowLeft"){

        showPreviousPhoto();

    }


    if(event.key === "ArrowRight"){

        showNextPhoto();

    }


    if(event.key === "Escape"){

        closePhotoViewer();

    }

});
