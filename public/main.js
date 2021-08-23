const submitButton = document.querySelector("#add-recipe-button");
const table = document.querySelector("table");

function renderData(object) {
    //takes in the name, ingredients and steps for a recipe
    const { name, ingredients, steps } = object;

    //create table elements and edit/delete buttons
    const nameCol = document.createElement("td");
    const ingredientsCol = document.createElement("td");
    const stepsCol = document.createElement("td");
    const editCol = document.createElement("td");
    const deleteCol = document.createElement("td");
    const editButton = document.createElement("button", {id="edit-button"});
    const deleteButton = document.createElement("button", {id="delete-button"});
    const newRow = document.createElement("tr")

    //set values of each cell
    nameCol.innerText = `${name}`;
    ingredientsCol.innerText = `${ingredients}`;
    stepsCol.innerText = `${steps}`;
    editCol.appendChild(editButton)
    deleteCol.appendChild(deleteButton)

    //append cells to table row
    newRow.appendChild(nameCol);
    newRow.appendChild(ingredientsCol);
    newRow.appendChild(stepsCol);
    newRow.append(editCol);
    newRow.append(deleteCol);

    //append row to table
    table.appendChild(newRow)
}


async function fetchData() {
    const response = await fetch("/recipes");
    const data = await response.json();
    data.payload.forEach(object => renderData(object));
}


function submitButtonHandler() {
    const popupField = document.querySelectorAll(".popupfield");
    popupField.forEach(field => {
        field.classList.toggle("show");
    })
  }

submitButton.addEventListener('click', submitButtonHandler);