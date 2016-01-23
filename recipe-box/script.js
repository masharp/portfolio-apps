/* Recipe Box App
    - This is a simple application written in JavaScript using the React UI framework.
      It allows the user to save and remove recipes by adding them to a locallly (window.locaStorage)
      available storage. A FreeCodeCamp project. Inspired by: http://codepen.io/FreeCodeCamp/full/LGbbqj
*/

"use strict";

/* React-Bootstrap reusable components */
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

// Get the local recipes or generate examples
var recipes = localStorage["ss-recipeBox"] ? JSON.parse(localStorage["ss-recipeBox"]) :
              [{ id: Math.floor(1000 + Math.random() * 900000), title: "Example Recipe", ingredients: ["1 cup Ramen Noodles", " 2 cups Tap Water"]},
              { id: Math.floor(1000 + Math.random() * 900000), title: "Example Recipe 2", ingredients: ["1 cup Ramen Noodles", " 2 cups Tap Water"]}];

const RecipeBox = React.createClass({ displayName: "RecipeBox",
  getInitialState: function getInitialState() {
    return ({ showOverlay: false, data: recipes });
  },
  //closes the overlay
  close: function close() {
    this.setState({ showOverlay: false });
  },
  //opens the overlay
  open: function open() {
    this.setState({ showOverlay: true });
  },
  //add a recipe to the state, close overlay, then update
  add: function add() {
    let newTitle = $("#newRecipe-name").val() ? $("#newRecipe-name").val() : "Untitled";
    let newIngredients = $("#newRecipe-ingrd").val().split(",");

    //give the recipe an ID
    recipes.push({ id: Math.floor(1000 + Math.random() * 900000), title: newTitle, ingredients: newIngredients });

    this.setState({ data: recipes });
    this.close();
    this.update();
  },
  //remove the recipe from the global array then update
  remove: function remove(id) {
    recipes = recipes.filter(function filterRecipes(recipe) {
      return(recipe.id !== id);
    });
    this.setState({ data: recipes });
    this.update();
  },
  //update the localstorage - originally used this.state but ran into issues
  update: function update() {
    localStorage.setItem("ss-recipeBox", JSON.stringify(recipes));
  },
  render: function render() {
    return(
      React.createElement("div", { id: "content" },
        React.createElement(RecipeList, { data: this.state.data, remove: this.remove }),
        React.createElement(Button, { bsStyle: "primary", onClick: this.open, id: "newRecipe-btn-open" }, "Add Recipe"),
        React.createElement(Modal, { id: "newRecipe-overlay", show: this.state.showOverlay, onHide: this.close },
          React.createElement(Modal.Header, { closeButton: true },
            React.createElement(Modal.Title, { id: "newRecipe-title" }, "Add a New Recipe")
          ),
          React.createElement(Modal.Body, null,
            React.createElement("form", { id: "newRecipe-form" },
              React.createElement(Input, { id: "newRecipe-name", type: "text",
                placeholder: "Name your recipe...", label: "Recipe Name" }),
              React.createElement(Input, { id: "newRecipe-ingrd", type: "text",
                placeholder: "Add your ingredients, seperated by commas (1 Cup Milk, 1 Egg, etc.)", label: "Ingredients"})
            )
          ),
          React.createElement(Modal.Footer, null,
            React.createElement(Button, { id: "newRecipe-btn-add", bsStyle: "primary", onClick: this.add }, "Add")
          )
        )
      )
    );
  }
});

//generates the list of recipes using an accordion and an array of panels
const RecipeList = React.createClass({ displayName: "RecipeList",
  render: function render() {
    let remove = this.props.remove;
    let recipeNodes = this.props.data.map(function mapData(recipe, index) {
      return(
        React.createElement(Panel, { className: "recipe-panel", header: recipe.title,
          eventKey: index, bsStyle: "success", key: index },

          React.createElement(Recipe, { ingredients: recipe.ingredients, recipeID: recipe.id, remove: remove })
        )
      );
    });

    return (
      React.createElement(Accordion, { id: "recipe-list" }, recipeNodes)
    );
  }
});

//recipe component that generates a list of ingredient components
const Recipe = React.createClass({ displayName: "Recipe",
  handleRemove: function handleRemove(id) {
    this.props.remove(id);
  },
  render: function render() {
    let ingrdsNodes = this.props.ingredients.map(function mapIngrds(ingrd, index) {
      return(
        React.createElement(Ingredient, { key: index, ingredient: ingrd})
      )
    });

    return(
      React.createElement("div", null,
        React.createElement("h4", null, "Ingredients"),
        React.createElement(ListGroup, null, ingrdsNodes),
        React.createElement(Button, { id: "removeRecipe-btn", bsStyle: "danger",
          onClick: this.handleRemove.bind(this, this.props.recipeID) }, "Remove")
      )
    );
  }
});

const Ingredient = React.createClass({ displayName: "Ingredient",
  render: function render() {
    return(
      React.createElement(ListGroupItem, null, this.props.ingredient)
    )
  }
});

ReactDOM.render(React.createElement(RecipeBox, null), document.getElementById("main"));
