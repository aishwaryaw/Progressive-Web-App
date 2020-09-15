// side navbar - mterialize code
document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    // let updaterecipe = false;
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add recipe form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});

    const uforms = document.querySelectorAll('.side-update-form');
    console.log(uforms);
    M.Sidenav.init(uforms, {edge: 'left'});
    
  });


const recipeContainer = document.querySelector('.recipes');

// render recipe data
const renderRecipes = (data,id) =>{
  const recipe = `<div class="card-panel recipe white row" data-id="${id}">
      <img src="/img/dish.png" alt="recipe thumb">
      <div class="recipe-details">
        <div class="recipe-title">${data.title}</div>
        <div class="recipe-ingredients">${data.ingredients}</div>
      </div>
      <div class="recipe-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
        <button class="sidenav-trigger" data-id="${id}" data-target="side-update-form">Update</button>
      </div>
    </div>
    `
    recipeContainer.innerHTML += recipe;
}


// remove recipe
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();

}

let divContainer = document.querySelector('.side-update-form');
const updateRecipe = (id,recipe) => {

  const newrecipe = `
  <form class="update-recipe container section" data-id="${id}">
  <h6 >New Recipe</h6>
  <div class="divider"></div>
  <div class="input-field">
    <input id="title" type="text" name="title" class="validate" value="${recipe.title}">
 
  </div>
  <div class="input-field">
    <input type="text" name="ingredients" class="validate" value="${recipe.ingredients}">
   
  </div>
  <div class="input-field center">
    <button class="btn-small">Update</button>
  </div>
  </form>
  `

  divContainer.innerHTML = newrecipe;
  let updateform = document.querySelector('.update-recipe');
  
  updateform.addEventListener('submit', evt => {
  // const id = updateform.getAttribute("data-id");
  evt.preventDefault();
  const recipe = {
      title : updateform.title.value,
      ingredients : updateform.ingredients.value
  };

  updaterecipedb(id,recipe);
});
}