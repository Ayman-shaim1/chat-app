// creation du 'overlay' :
let exception_overlay = document.createElement("div");
exception_overlay.setAttribute("id", "exception-overlay");
document.querySelector("body").prepend(exception_overlay);
function Exception(exception_text) {
  // creation de l'exception :
  let exception_Elt = document.createElement("div");
  exception_Elt.classList.add("exception");
  // ******* animation si il ya une click au dehors de l'exception *******
  document.querySelector("#exception-overlay").onclick = () => {
    exception_Elt.style.animationDuration = "0.5s";
    exception_Elt.style.animationName = "click-animation";
    setTimeout(() => {
      exception_Elt.style.animationName = "none";
    }, 500);
  };
  // ******* fin animation *******

  this.create = () => {
    //header :
    let header = document.createElement("div");
    header.classList.add("exception-header");
    // titre :
    let titre = document.createElement("h2");
    titre.classList.add("exception-title");
    titre.innerText = "Erreur";
    // icon :
    let icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-exclamation");
    titre.prepend(icon);
    // close button :
    let btn_Close = document.createElement("button");
    btn_Close.classList.add("exception-btn-close");
    btn_Close.innerHTML = "&times;";
    btn_Close.onclick = this.close;

    header.appendChild(titre);
    header.appendChild(btn_Close);
    // contenu  :
    let content = document.createElement("div");
    content.classList.add("exception-content");
    let h3 = document.createElement("h3");
    h3.innerText = "Veuillez contacter les responsables technique !";
    content.appendChild(h3);

    let exceptionText_elt = document.createElement("p");
    exceptionText_elt.classList.add("exception-text");
    if (exception_text.length >= 212) {
      exceptionText_elt.innerText = exception_text.substring(0, 212) + ".....";
    } else {
      exceptionText_elt.innerText = exception_text;
    }
    content.appendChild(exceptionText_elt);
    // footer:
    let footer = document.createElement("div");
    footer.classList.add("exception-footer");
    // button ok
    let button = document.createElement("button");
    button.textContent = "ok";
    button.onclick = this.close;
    footer.appendChild(button);

    exception_Elt.appendChild(header);
    exception_Elt.appendChild(content);
    exception_Elt.appendChild(footer);

    document.body.appendChild(exception_Elt);
  }; // fin function create
  this.throw = () => {
    this.create();
    document.querySelector("#exception-overlay").classList.add("open");
    exception_Elt.classList.add("open");
  }; // fin function throw
  this.close = () => {
    document.querySelector("#exception-overlay").classList.remove("open");
    exception_Elt.classList.remove("open");
  }; // fin function close
}



