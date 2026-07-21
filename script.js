function startJourney(){

    document.getElementById("hero").style.opacity = "0";

    setTimeout(function(){

        document.getElementById("hero").style.display="none";

        document.getElementById("content").style.display="block";

    },1000);

}
