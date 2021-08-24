const addButton = document.querySelector("#add-recipe-button");
const allFlagButtons = document.querySelectorAll('.flag-button');
const table = document.querySelector("table");

let allDeleteButtons = document.querySelectorAll('.delete-buttons');
let allEditButtons = document.querySelectorAll('.edit-buttons');

function renderData(object) {
    //takes in the name, ingredients and steps for a recipe
    const { id, recipe, ingredients, steps } = object;

    //create table elements and edit/delete buttons
    const nameCol = document.createElement("td");
    const ingredientsCol = document.createElement("td");
    const stepsCol = document.createElement("td");
    const editCol = document.createElement("td");
    const deleteCol = document.createElement("td");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const newRow = document.createElement("tr")

    //set ids, classes and innerText values
    editButton.innerHTML = "Edit";
    editButton.classList.add("edit-buttons");
    editButton.setAttribute("id", id);
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-buttons");
    deleteButton.setAttribute("id", id);
    newRow.classList.add("recipe-row");

    //set values of each cell
    nameCol.innerText = `${recipe}`;

    ingredients.forEach(ingredient => {
        const newBreak = document.createElement("li");
        newBreak.innerText= `${ingredient}`;
        ingredientsCol.appendChild(newBreak);
    })

    stepsCol.innerText = `${steps}`;
    editCol.appendChild(editButton)
    deleteCol.appendChild(deleteButton)

    //append cells to table row
    newRow.appendChild(nameCol);
    newRow.appendChild(ingredientsCol);
    newRow.appendChild(stepsCol);
    newRow.appendChild(editCol);
    newRow.appendChild(deleteCol);

    //append row to table
    table.appendChild(newRow)

    //set new button handlers based on newly added rows
    allDeleteButtons = document.querySelectorAll('.delete-buttons');
    allEditButtons = document.querySelectorAll('.edit-buttons');

    allDeleteButtons.forEach(button => {
        button.addEventListener('click', deleteButtonHandler);
    });

    allEditButtons.forEach(button => {
        button.addEventListener('click', editButtonHandler);
    });
    
}


async function fetchData(country) {
    const response = await fetch(`http://localhost:3000/recipes?country=${country}`, {
        method: 'GET',
      });
    const data = await response.json();
    data.payload.forEach(object => renderData(object));
}



function addButtonHandler() {
    const popupField = document.querySelectorAll(".popupfield");
    popupField.forEach(field => {
        field.classList.toggle("show");
    })
  }

function flagButtonHandler(event) {
    const country = event.target.innerText;
    document.querySelectorAll('.recipe-row').forEach(e => e.remove())
    fetchData(country);
}

async function deleteButtonHandler(event) {
    const row = event.path[2];
    const id = event.target.getAttribute("id");
    row.remove();
    const response = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: 'DELETE',
      });
  }

async function submitButtonHandler(event) {
    const row = event.path[2];
    const id = row.lastChild.firstChild.getAttribute("id");

    recipe = row.firstChild.firstChild.value;
    row.firstChild.remove();
    ingredients = row.firstChild.firstChild.value;
    row.firstChild.remove();
    steps = row.firstChild.firstChild.value;
    row.firstChild.remove();

    newRecipeName = document.createElement('td');
    newIngredients = document.createElement('td');
    newSteps = document.createElement('td');

    newRecipeName.innerText = recipe;
    newIngredients.innerText = ingredients;
    ingredientsArray = csvToArray(newIngredients.innerText);
    newSteps.innerText = steps;
    
    console.log(ingredientsArray);

    row.insertBefore(newSteps, row.firstChild);
    row.insertBefore(newIngredients, row.firstChild);
    row.insertBefore(newRecipeName, row.firstChild); 

    recipeObject = {"recipe": recipe,
                    "ingredients": ingredientsArray,
                    "steps": steps};

    const response = await fetch(`http://localhost:3000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeObject),
    });
  }

function editButtonHandler(event) {
    const row = event.path[2];
    const editCol = row.childNodes[3]

    //add cancel button
    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.classList.add("cancel-buttons");
    editCol.appendChild(cancelButton);
    cancelButton.addEventListener('click', cancelButtonHandler);

    //Remove edit button and change to submit
    editCol.firstChild.remove();
    const submitChangeButton = document.createElement("button");
    submitChangeButton.innerHTML = "Submit";
    submitChangeButton.classList.add("submit-buttons");
    submitChangeButton.addEventListener('click', submitButtonHandler);
    editCol.insertBefore(submitChangeButton, editCol.lastChild);

    //saves the pre-existing text in the table
    recipe = row.firstChild.innerText;
    row.firstChild.remove();
    ingredients = row.firstChild.innerText;
    row.firstChild.remove();
    steps = row.firstChild.innerText;
    row.firstChild.remove();

    //create 3 empty input fields
    newRecipeName = document.createElement('input');
    newIngredients = document.createElement('textarea');
    newSteps = document.createElement('textarea');

    //set the values of the input fields to the pre-existing text
    newRecipeName.value = recipe;
    newIngredients.value = ingredients;
    newSteps.value = steps;

    // create 3 new td elemtns
    newtd1 = document.createElement('td');
    newtd2 = document.createElement('td');
    newtd3 = document.createElement('td');

    //append the input fields to the respective td elements
    newtd1.appendChild(newRecipeName)
    newtd2.appendChild(newIngredients)
    newtd3.appendChild(newSteps)
    
    //append the td elements to the row
    row.insertBefore(newtd3, row.firstChild);
    row.insertBefore(newtd2, row.firstChild);
    row.insertBefore(newtd1, row.firstChild);

  }

function cancelButtonHandler(event) {
    const row = event.path[2];
}

function csvToArray(str) {
    newArray = str.split(",")
    return newArray;
}

addButton.addEventListener('click', addButtonHandler);



allFlagButtons.forEach(button => {
    button.addEventListener('click', flagButtonHandler);
});

// Joy - get data from 'add a new recipe' user input
function userInputRecipe() {
    const recipe = document.querySelector("#recipe-name-input").value;
    const country = document.querySelector("#country-input").value;
    const ingredientsList = document.querySelector("#ingredients-input").value;
    const steps = document.querySelector("#steps-input").value;
    const ingredients = csvToArray(ingredientsList);
    return { recipe, country, ingredients, steps };
  }
  
  async function addNewRecipe() {
    const response = await fetch(`http://localhost:3000/recipes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInputRecipe()),
    });
  }
  
  document.querySelector("#submit-button").addEventListener("click", (e) => {
    e.preventDefault();
    addNewRecipe();
  });
