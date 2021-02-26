// creation du 'overlay' :
let overlay = document.createElement("div");
overlay.setAttribute("id", "modal-overlay");
document.querySelector("body").prepend(overlay);

function Modal(obj) {
  this.title = obj.title;
  this.content = obj.content || "";
  this.width = obj.width || "400px";
  this.type = obj.type;
  this.icon = obj.icon;

  // creation de modal :
  let modal = document.createElement("div");
  modal.classList.add("modal");
  if (obj.type != undefined) modal.classList.add(this.type);
  modal.style.width = this.width;

  // ******* animation si il ya une click au dehors de modal *******
  document.querySelector("#modal-overlay").onclick = () => {
    modal.style.animationDuration = "0.5s";
    modal.style.animationName = "click-animation";
    setTimeout(() => {
      modal.style.animationName = "none";
    }, 500);
  };
  // ******* fin animation *******

  this.create = function () {
    // creation de l entete :
    let modal_header = document.createElement("div");
    modal_header.classList.add("modal-header");

    //creation de titre de modal :
    if (this.title != undefined) {
      let modal_title = document.createElement("h3");
      modal_title.classList.add("modal-title");
      modal_title.innerText = this.title;
      modal_header.appendChild(modal_title);
    }
    // creation de bouton de fermeture de modal :
    let modal_btn_close = document.createElement("button");
    modal_btn_close.innerHTML = "&times;";
    modal_btn_close.classList.add("modal-btn-close");
    modal_btn_close.onclick = function () {
      modal.classList.remove("open");
      document.querySelector("#modal-overlay").classList.remove("open");
    };

    modal_header.appendChild(modal_btn_close);

    // ajoute le l'entete de modal:
    modal.appendChild(modal_header);
    // creation de contenu de modal :
    let modal_content = document.createElement("div");
    modal_content.classList.add("modal-content");
    modal_content.innerHTML = this.content;

    // ajoute de contenu de modal :
    modal.appendChild(modal_content);
    // verfier est ce que la propriete buttons existe ou non :
    if (obj.buttons != undefined) {
      // si oui :
      // on creer le modal footer :
      let modal_footer = document.createElement("div");
      modal_footer.classList.add("modal-footer");
      // on creer les boutons
      obj.buttons.forEach((btn) => {
        console.log();
        let text = "ok";
        let cls = "m-btn m-btn-sm";
        if (btn.text != undefined) text = btn.text;
        if (btn.class != undefined) cls = btn.class;
        // verfication s il ya plusieurs class ou non :
        let _cls = cls.split(" ");
        let button = document.createElement("button");
        button.innerText = text;
        if (_cls.length > 1) {
          _cls.forEach((cl) => button.classList.add(cl));
        } else {
          button.classList.add(cls);
        }
        // ajouter l evenment click au bouton
        if (btn.onClick != undefined)
          button.addEventListener("click", btn.onClick);
        else button.addEventListener("click", this.close);

        // ajouter la bouton ou footer :
        modal_footer.appendChild(button);
        // ajouter le footer au modal :
        modal.appendChild(modal_footer);
      }); //fin forEach
    } // fin if
  }; // function create

  // ovrire le modal :
  this.open = function () {
    this.create();
    modal.classList.add("open");
    if (this.icon != undefined && this.title != undefined) {
      let icon = document.createElement("i");
      if (this.icon.split(" ").length == 1) {
        icon.classList.add(this.icon);
      } else {
        this.icon.split(" ").forEach((cl) => icon.classList.add(cl));
      }
      modal.querySelector(".modal-header .modal-title").prepend(icon);
    }

    document.querySelector("#modal-overlay").classList.add("open");
    document.querySelector("body").appendChild(modal);
  }; // fin function open

  this.close = function () {
    modal.classList.remove("open");
    document.querySelector("#modal-overlay").classList.remove("open");
  }; // fin function close
} // fin class modal


