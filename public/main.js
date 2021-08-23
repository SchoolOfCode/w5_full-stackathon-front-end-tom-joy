const submitButton = document.querySelector("#add-recipe-button");


function submitButtonHandler() {
    const popupField = document.querySelectorAll(".popupfield");
    popupField.forEach(field => {
        field.classList.toggle("show");
    })
  }

submitButton.addEventListener('click', submitButtonHandler);