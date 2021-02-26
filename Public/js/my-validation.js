let FORM_ARRAY_RULES = [];
let ACTIVE_FORMS = [];
const forms = document.querySelectorAll("form");
const ERR_SPAN_STYLES = {
  display: "block",
  color: "#dc3545",
  fontSize: "13px",
  margin: "7px",
};

const val_err_rules = {
  required: {
    msg: "the value of this element is required !",
  },
  minlength: {
    msg: "the length value of this element is incorrect !",
  },
  maxlength: {
    msg: "the length value of this element is incorrect !",
  },
  type: {
    Email: {
      regEx:
        "^([A-Z]{0,1})([a-z]{3,15})([0-9]{0,5})([-_.]{0,1})([A-Z]{0,1})([a-z]{0,10})([@]{1})([a-z]{4,8})([.]{1})([a-z]{2,5})$",
      msg: "this email is not valid !",
    },
    number: {
      regEx: "^([0-9]+)$",
      msg: "the value of this element should be a number !",
    },
    date: {
      regEx1: "^([0-9]{2})([/]{1})([0-9]{2})([/]{1})([0-9]{4})$",
      regEx2: "^([0-9]{4})([/]{1})([0-9]{2})([/]{1})([0-9]{2})$",
      regEx3: "^([0-9]{2})([-]{1})([0-9]{2})([-]{1})([0-9]{4})$",
      regEx4: "^([0-9]{4})([-]{1})([0-9]{2})([-]{1})([0-9]{2})$",
      msg: "this date is not valid !",
    },
  },
  regEx: {
    msg: "please check your input!",
  },
};

function validation(obj, form, id) {
  let Input = form.querySelector("#" + id);
  let idForm = form.getAttribute("id");
  let ruleInput = undefined;
  if (obj.rules != undefined && obj.rules[id] != undefined) {
    ruleInput = obj.rules[id];
  }
  let messageInput = undefined;
  if (obj.messages != undefined) {
    if (obj.messages[id] != undefined) {
      messageInput = obj.messages[id];
    }
  }
  let ID_VALDATION_INPUT = idForm + "-" + id;
  let CLASS_VALIDATION_INPUT_P = "m-validation-p-" + ID_VALDATION_INPUT;
  let INDEX_ACTIVE_FORM = ACTIVE_FORMS.findIndex((x) => x == idForm);
  if (INDEX_ACTIVE_FORM != -1) {
    if (Input != undefined) {
      if (form.querySelector("." + CLASS_VALIDATION_INPUT_P) == undefined)
        Input.insertAdjacentHTML(
          "afterend",
          `<div class="${CLASS_VALIDATION_INPUT_P}"></div>`
        );
      let ISVAL_OBJ = {
        id: `${ID_VALDATION_INPUT}`,
        required: true,
        minlength: true,
        maxlength: true,
        type: { email: true, date: true, number: true },
        compare: true,
        regEx: true,
      };
      let CHECK_FORM = FORM_ARRAY_RULES.find((x) => x.id == ID_VALDATION_INPUT);
      if (CHECK_FORM == undefined) FORM_ARRAY_RULES.push(ISVAL_OBJ);
      /***** BEGIN REQUIRED RULE *****/
      if (ruleInput.required != undefined && ruleInput.required == true) {
        if (Input.value == "") {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].required = false;
          let error_message = "";
          if (messageInput != undefined && messageInput.required != undefined) {
            error_message = messageInput.required;
          } else {
            error_message = val_err_rules.required.msg;
          }
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.required");
          if (err_span == undefined) {
            form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .insertAdjacentHTML(
                "beforeend",
                `<span class="val-msg required">${error_message}</span>`
              );
          }
        } else {
          Input.classList.add("valid");
          Input.classList.remove("invalid");
          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].required = true;
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.required");
          if (err_span != undefined) {
            err_span.remove();
          }
        }
      }
      /***** END REQUIRED RULE *****/

      /***** BEGIN TYPE RULE *****/
      if (ruleInput.type != undefined && ruleInput.type != "") {
        /*--- BEGIN EMAIL TYPE ----*/
        if (ruleInput.type.toLowerCase() == "email") {
          let regex = new RegExp(val_err_rules.type.Email.regEx);
          if (Input.value != "" && !regex.test(Input.value)) {
            Input.classList.add("invalid");
            Input.classList.remove("valid");

            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.email = false;
            let error_message = "";
            if (messageInput != undefined && messageInput.type != undefined) {
              error_message = messageInput.type;
            } else {
              error_message = val_err_rules.type.Email.msg;
            }
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.email");
            if (err_span == undefined) {
              form
                .querySelector("." + CLASS_VALIDATION_INPUT_P)
                .insertAdjacentHTML(
                  "beforeend",
                  `<span class="val-msg email">${error_message}</span>`
                );
            }
          } else {
            Input.classList.add("valid");
            Input.classList.remove("invalid");
            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.email = true;
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.email");
            if (err_span != undefined) {
              err_span.remove();
            }
          }
        }
        /*--- END EMAIL TYPE ----*/

        /*--- BEGIN DATE TYPE ----*/
        if (ruleInput.type.toLowerCase() == "date") {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let cpt = 0;
          let regex1 = new RegExp(val_err_rules.type.date.regEx1);
          let regex2 = new RegExp(val_err_rules.type.date.regEx2);
          let regex3 = new RegExp(val_err_rules.type.date.regEx3);
          let regex4 = new RegExp(val_err_rules.type.date.regEx4);

          if (Input.value != "") {
            if (!regex1.test(Input.value)) cpt++;
            if (!regex2.test(Input.value)) cpt++;
            if (!regex3.test(Input.value)) cpt++;
            if (!regex4.test(Input.value)) cpt++;
            if (cpt == 4) {
              let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
                (x) => x.id == ID_VALDATION_INPUT
              );
              FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.date = false;
              let error_message = "";
              if (messageInput != undefined && messageInput.type != undefined) {
                error_message = messageInput.type;
              } else {
                error_message = val_err_rules.type.date.msg;
              }
              let err_span = form
                .querySelector("." + CLASS_VALIDATION_INPUT_P)
                .querySelector(".val-msg.date");
              if (err_span == undefined) {
                form
                  .querySelector("." + CLASS_VALIDATION_INPUT_P)
                  .insertAdjacentHTML(
                    "beforeend",
                    `<span class="val-msg date">${error_message}</span>`
                  );
              }
            } else {
              Input.classList.add("valid");
              Input.classList.remove("invalid");
              let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
                (x) => x.id == ID_VALDATION_INPUT
              );
              FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.date = true;
              let err_span = form
                .querySelector("." + CLASS_VALIDATION_INPUT_P)
                .querySelector(".val-msg.date");
              if (err_span != undefined) {
                err_span.remove();
              }
            }
          }
        }
        /*--- END DATE TYPE ----*/

        /*--- BEGIN NUMBER TYPE ----*/
        if (ruleInput.type.toLowerCase() == "number") {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let regex = new RegExp(val_err_rules.type.number.regEx);
          if (Input.value != "" && !regex.test(Input.value)) {
            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.number = false;
            let error_message = "";
            if (messageInput != undefined && messageInput.type != undefined) {
              error_message = messageInput.type;
            } else {
              error_message = val_err_rules.type.number.msg;
            }
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.number");
            if (err_span == undefined) {
              form
                .querySelector("." + CLASS_VALIDATION_INPUT_P)
                .insertAdjacentHTML(
                  "beforeend",
                  `<span class="val-msg number">${error_message}</span>`
                );
            }
          } else {
            Input.classList.add("valid");
            Input.classList.remove("invalid");
            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].type.number = true;
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.number");
            if (err_span != undefined) {
              err_span.remove();
            }
          }
        }
        /*--- END NUMBER TYPE ----*/
      }
      /***** END TYPE RULE *****/

      /***** BEGIN MINLENGTH RULE *****/
      if (
        ruleInput.minlength != undefined &&
        typeof ruleInput.minlength == "number"
      ) {
        if (Input.value != "" && Input.value.length < ruleInput.minlength) {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].minlength = false;
          let error_message = "";
          if (
            messageInput != undefined &&
            messageInput.minlength != undefined
          ) {
            error_message = messageInput.minlength;
          } else {
            error_message = val_err_rules.minlength.msg;
          }
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.minlength");
          if (err_span == undefined) {
            form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .insertAdjacentHTML(
                "beforeend",
                `<span class="val-msg minlength">${error_message}</span>`
              );
          }
        } else {
          Input.classList.add("valid");
          Input.classList.remove("invalid");
          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].minlength = true;
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.minlength");
          if (err_span != undefined) {
            err_span.remove();
          }
        }
      }
      /***** END MINLENGTH RULE *****/

      /***** BEGIN MAXLENGTH RULE *****/
      if (
        ruleInput.maxlength != undefined &&
        typeof ruleInput.maxlength == "number"
      ) {
        if (Input.value != "" && Input.value.length > ruleInput.maxlength) {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].maxlength = false;
          let error_message = "";
          if (
            messageInput != undefined &&
            messageInput.maxlength != undefined
          ) {
            error_message = messageInput.maxlength;
          } else {
            error_message = val_err_rules.maxlength.msg;
          }
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.maxlength");
          if (err_span == undefined) {
            form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .insertAdjacentHTML(
                "beforeend",
                `<span class="val-msg maxlength">${error_message}</span>`
              );
          }
        } else {
          Input.classList.add("valid");
          Input.classList.remove("invalid");
          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].maxlength = true;
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.maxlength");
          if (err_span != undefined) {
            err_span.remove();
          }
        }
      }
      /***** END MAXLENGTH RULE *****/

      /***** BEGIN COMPARE RULE *****/
      if (ruleInput.compare != undefined && ruleInput.compare != "") {
        let compareInput = document.getElementById(ruleInput.compare);
        if (compareInput == undefined) {
          console.error(
            `---- ##### [COMPARE] the ID : '${ruleInput.compare}' is not found #####  ----`
          );
        } else {
          if (
            Input.value != "" &&
            compareInput.value != "" && 
            compareInput.value != Input.value
          ) {
            Input.classList.add("invalid");
            Input.classList.remove("valid");

            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].compare = false;
            let error_message = "";
            if (
              messageInput != undefined &&
              messageInput.compare != undefined
            ) {
              error_message = messageInput.compare;
            } else {
              error_message = `the value id this element should be like the value of the input [ ID : '${ruleInput.compare}' ]`;
            }
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.compare");
            if (err_span == undefined) {
              form
                .querySelector("." + CLASS_VALIDATION_INPUT_P)
                .insertAdjacentHTML(
                  "beforeend",
                  `<span class="val-msg compare">${error_message}</span>`
                );
            }
          } else {
            Input.classList.add("valid");
            Input.classList.remove("invalid");
            let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
              (x) => x.id == ID_VALDATION_INPUT
            );
            FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].compare = true;
            let err_span = form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .querySelector(".val-msg.compare");
            if (err_span != undefined) {
              err_span.remove();
            }
          }
        }
      }
      /***** END COMPARE RULE *****/
      /***** BEGIN REGEX RULE *****/
      if (ruleInput.regEx != undefined && ruleInput.regEx != "") {
        let regex = new RegExp(ruleInput.regEx);
        if (Input.value != "" && !regex.test(Input.value)) {
          Input.classList.add("invalid");
          Input.classList.remove("valid");

          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].regEx = false;
          let error_message = "";
          if (messageInput != undefined && messageInput.regEx != undefined) {
            error_message = messageInput.regEx;
          } else {
            error_message = val_err_rules.regEx.msg;
          }
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.regEx");
          if (err_span == undefined) {
            form
              .querySelector("." + CLASS_VALIDATION_INPUT_P)
              .insertAdjacentHTML(
                "beforeend",
                `<span class="val-msg regEx">${error_message}</span>`
              );
          }
        } else {
          Input.classList.add("valid");
          Input.classList.remove("invalid");

          let ISVAL_INDEX_TO_CHANGE = FORM_ARRAY_RULES.findIndex(
            (x) => x.id == ID_VALDATION_INPUT
          );
          FORM_ARRAY_RULES[ISVAL_INDEX_TO_CHANGE].regEx = true;
          let err_span = form
            .querySelector("." + CLASS_VALIDATION_INPUT_P)
            .querySelector(".val-msg.regEx");
          if (err_span != undefined) {
            err_span.remove();
          }
        }
      }
      /***** END REGEX RULE *****/
    }

    styleErrSpan();
  }
}

function setValidation(obj, form) {
  if (obj.rules != undefined) {
    let ids = Object.keys(obj.rules);
    ids.forEach((id) => {
      let chekInput = form.querySelector("#" + id);
      if (chekInput != undefined) {
        validation(obj, form, id);
      } else {
        console.error(
          `---- ##### [RULES] the ID : '${id}' is not found #####  ----`
        );
      }
    });
  }
}
function styleErrSpan() {
  document.querySelectorAll(".val-msg").forEach((elt) => {
    Object.assign(elt.style, ERR_SPAN_STYLES);
  });
}
function onInput_validation(form, obj) {
  let FORM_ID = form.getAttribute("id");
  let FORM_INDEX = ACTIVE_FORMS.findIndex((x) => x == FORM_ID);
  if (FORM_INDEX != -1) {
    let keys = Object.keys(obj.rules);
    keys.forEach((key) => {
      let Input = form.querySelector(`input#${key}`);
      let Select = form.querySelector(`select#${key}`);
      let Textarea = form.querySelector(`textarea#${key}`);
      if (Input != undefined) {
        Input.addEventListener("keyup", () => {
          validation(obj, form, key);
        });
      }
      if (Select != undefined) {
        Select.addEventListener("input", () => {
          validation(obj, form, key);
        });
      }
      if (Textarea != undefined) {
        Textarea.addEventListener("keyup", () => {
          validation(obj, form, key);
        });
      }
    });
  }
}


function formIsValid(form, obj) {
  let keys = Object.keys(obj.rules);
  let cpt = 0;
  keys.forEach((key) => {
    let ID = form.getAttribute("id") + "-" + key;
    let VALIDATION_OBJ = FORM_ARRAY_RULES.find((x) => x.id == ID);
    if (VALIDATION_OBJ != undefined) {
      if (
        !VALIDATION_OBJ.required ||
        !VALIDATION_OBJ.minlength ||
        !VALIDATION_OBJ.maxlength ||
        !VALIDATION_OBJ.compare ||
        !VALIDATION_OBJ.regEx ||
        !VALIDATION_OBJ.type.email ||
        !VALIDATION_OBJ.type.number ||
        !VALIDATION_OBJ.type.date
      ) {
        cpt++;
      } else {
        let DIV_ERR_CLASS = ".m-validation-p-" + ID;
        let DIV_ERR = form.querySelector(DIV_ERR_CLASS);
        document.getElementById(key).classList.remove("valid");
        if (DIV_ERR != undefined) {
          DIV_ERR.remove();
        }
      }
    }
  });
  if (cpt == 0) {
    if (
      obj.onSubmit != undefined &&
      obj.onSubmit.emptyInputs != undefined &&
      obj.onSubmit.emptyInputs
    ) {
      let NEW_ACTIVE_FORMS = ACTIVE_FORMS.filter(
        (x) => x != form.getAttribute("id")
      );
      ACTIVE_FORMS = NEW_ACTIVE_FORMS;
    }
    return true;
  } else return false;
}

function emptyInputs(form) {
  let Inputs = form.querySelectorAll("input");
  let Selects = form.querySelectorAll("select");
  let TextAreas = form.querySelectorAll("textarea");
  if (Inputs.length != 0) {
    Inputs.forEach((Input) => {
      Input.value = "";
    });
  }
  if (TextAreas.length != 0) {
    TextAreas.forEach((TextArea) => {
      TextArea.value = "";
    });
  }
  if (Selects.length != 0) {
    Selects.forEach((Select) => {
      Select.selectedIndex = 0;
    });
  }
}

function ValidForm(form, obj) {
  let NEW_ACTIVE_FORMS = ACTIVE_FORMS.filter(
    (x) => x != form.getAttribute("id")
  );
  ACTIVE_FORMS = NEW_ACTIVE_FORMS;
  let FORM_ID = form.getAttribute("id");
  let keys = Object.keys(obj.rules);
  keys.forEach((key) => {
    let ID_VALDATION_INPUT = FORM_ID + "-" + key;
    let NEW_FORM_ARRAY_RULES = FORM_ARRAY_RULES.filter(
      (x) => x.id != ID_VALDATION_INPUT
    );
    FORM_ARRAY_RULES = NEW_FORM_ARRAY_RULES;
  });
}
forms.forEach((form) => {
  form.__proto__.validate = function (obj) {
    this.addEventListener("submit", function (e) {
      ACTIVE_FORMS.push(this.getAttribute("id"));
      onInput_validation(this, obj);
      setValidation(obj, this);
      let isvalid = formIsValid(this, obj);
      if (isvalid) {
        ValidForm(this, obj);
        if (obj.onSubmit != undefined) {
          if (obj.onSubmit.async == undefined || obj.onSubmit.async) {
            e.preventDefault();
          }
          if (
            obj.onSubmit.emptyInputs != undefined &&
            obj.onSubmit.emptyInputs
          ) {
            emptyInputs(this);
          }
          if (
            obj.onSubmit.action != undefined &&
            typeof obj.onSubmit.action == "function"
          ) {
            obj.onSubmit.action();
          }
        }
      } else {
        e.preventDefault();
      }
    });
  };
});