// enable offline data
db.enablePersistence()
.catch(function(error){
    if(error.code == 'failed-persistence'){
        // probably multiple tabs are open
        console.log('persistence failed');
    }
    else if(error.code == 'unimplemented'){
        // browser does not support for the feature
        console.log('Persistence is unavailable');
    }
});

// real time listener
db.collection('Recipes').onSnapshot((snapshot)=>{
    // console.log(snapshot.docChanges())

    snapshot.docChanges().forEach(change => {

        if(change.type == "added"){
            // console.log("added", change.doc.data());
            renderRecipes(change.doc.data(), change.doc.id);
        }

        else if(change.type == "removed"){
            removeRecipe(change.doc.id);
        }
        
    });
        
});

// add recipe
const form = document.querySelector('.add-recipe');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const recipe = {
        title : form.title.value,
        ingredients : form.ingredients.value
    };

    db.collection('Recipes').add(recipe).catch(error =>{
        console.log(error);
    });

    form.title.value = '';
    form.ingredients.value = '';
});


// remove recipe
recipeContainer.addEventListener('click', evt => {
    if(evt.target.tagName === "I"){
        id = evt.target.getAttribute("data-id");
        db.collection('Recipes').doc(id).delete();     
    }
});

// update recipe
recipeContainer.addEventListener('click', event => {
    console.log(event.target.tagName);
    if(event.target.tagName === "BUTTON") {
        id = event.target.getAttribute("data-id");
        db.collection('Recipes').doc(id).get().then(doc => {
            updateRecipe(id, doc.data());
         
            // console.log(doc.data());
        });
        
    }
});

// update recipe in db
const updaterecipedb = (id, recipe) => {
    console.log(recipe);

    db.collection('Recipes').doc(id).set(recipe).catch(error =>{
        console.log(error);
    });

    const recipe1 = document.querySelector(`.recipe[data-id=${id}]`);
    recipe1.innerHTML = 
        `<img src="/img/dish.png" alt="recipe thumb">
        <div class="recipe-details">
          <div class="recipe-title">${recipe.title}</div>
          <div class="recipe-ingredients">${recipe.ingredients}</div>
        </div>
        <div class="recipe-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
          <button class="sidenav-trigger" data-id="${id}" data-target="side-update-form">Update</button>
        </div>`
 
}


