/* Recipe Box App
    - This is a simple application written in JavaScript using the React UI framework.
      It allows the user to save and remove recipes by adding them to a locallly (window.locaStorage)
      available storage. A FreeCodeCamp project. Inspired by: http://codepen.io/FreeCodeCamp/full/LGbbqj
*/

'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const ReactBootstrap = require('react-bootstrap');

/* React-Bootstrap reusable components */
const Accordion = ReactBootstrap.Accordion;
const Panel = ReactBootstrap.Panel;
const Button = ReactBootstrap.Button;
const Input = ReactBootstrap.FormControl;
const Modal = ReactBootstrap.Modal;
const ListGroup = ReactBootstrap.ListGroup;
const ListGroupItem = ReactBootstrap.ListGroupItem;

// Get the local recipes or generate examples
const recipes = localStorage['ss-recipeBox'] ? JSON.parse(localStorage['ss-recipeBox']) :
    [
      {
        id: Math.floor(1000 + Math.random() * 900000),
        title: 'Example Recipe',
        ingredients: ['1 cup Ramen Noodles', ' 2 cups Tap Water'],
      },
      {
        id: Math.floor(1000 + Math.random() * 900000),
        title: 'Example Recipe 2',
        ingredients: ['1 cup Ramen Noodles', ' 2 cups Tap Water'],
      }
    ];

const RecipeBox = React.createClass({ displayName: 'RecipeBox',
  propTypes: {
    recipes: React.PropTypes.array.isRequired,
  },
  getInitialState: function getInitialState() {
    return ({ showOverlay: false, data: this.props.recipes });
  },
  // closes the overlay
  close: function close() {
    this.setState({ showOverlay: false });
  },
  // opens the overlay
  open: function open() {
    this.setState({ showOverlay: true });
  },
  // add a recipe to the state, close overlay, then update
  add: function add() {
    const newTitle = $('#newRecipe-name').val() ? $('#newRecipe-name').val() : 'Untitled';
    const newIngredients = $('#newRecipe-ingrd').val().split(',');
    const currentRecipes = this.state.data;

    // give the recipe an ID
    currentRecipes.push(
      {
        id: Math.floor(1000 + Math.random() * 900000),
        title: newTitle,
        ingredients: newIngredients
      });

    this.setState({ data: currentRecipes });
    this.close();
    this.update();
  },
  // remove the recipe from the global array then update
  remove: function remove(id) {
    let currentRecipes = this.state.data;
    currentRecipes = currentRecipes.filter((recipe) => recipe.id !== id);

    this.setState({ data: currentRecipes });
    this.update(currentRecipes);
  },
  // update the localstorage - originally used this.state but ran into issues
  update: function update(newRecipes) {
    localStorage.setItem('ss-recipeBox', JSON.stringify(newRecipes));
  },
  render: function render() {
    return (
      React.createElement('div', { id: 'content' },
        React.createElement(RecipeList, { data: this.state.data, remove: this.remove }),
        React.createElement(Button, { bsStyle: 'primary', onClick: this.open, id: 'newRecipe-btn-open' }, 'Add Recipe'),
        React.createElement(Modal, { id: 'newRecipe-overlay', show: this.state.showOverlay, onHide: this.close },
          React.createElement(Modal.Header, { closeButton: true },
            React.createElement(Modal.Title, { id: 'newRecipe-title' }, 'Add a New Recipe')
          ),
          React.createElement(Modal.Body, null,
            React.createElement('form', { id: 'newRecipe-form' },
              React.createElement(Input, { id: 'newRecipe-name', type: 'text',
                placeholder: 'Name your recipe...', label: 'Recipe Name' }),
              React.createElement(Input, { id: 'newRecipe-ingrd', type: 'text',
                placeholder: 'Add your ingredients, seperated by commas (1 Cup Milk, 1 Egg, etc.)', label: 'Ingredients' })
            )
          ),
          React.createElement(Modal.Footer, null,
            React.createElement(Button, { id: 'newRecipe-btn-add', bsStyle: 'primary', onClick: this.add }, 'Add')
          )
        )
      )
    );
  }
});
// generates the list of recipes using an accordion and an array of panels
const RecipeList = React.createClass({ displayName: 'RecipeList',
  propTypes: {
    remove: React.PropTypes.func,
    data: React.PropTypes.array,
  },
  render: function render() {
    const remove = this.props.remove;
    const recipeNodes = this.props.data.map((recipe, index) =>
        React.createElement(Panel, { className: 'recipe-panel', header: recipe.title,
          eventKey: index, bsStyle: 'success', key: index },
          React.createElement(Recipe, { ingredients: recipe.ingredients, recipeID: recipe.id, remove })
        )
    );
    return (
      React.createElement(Accordion, { id: 'recipe-list' }, recipeNodes)
    );
  }
});

// recipe component that generates a list of ingredient components
const Recipe = React.createClass({ displayName: 'Recipe',
  propTypes: {
    remove: React.PropTypes.func,
    ingredients: React.PropTypes.array,
    recipeID: React.PropTypes.number
  },
  handleRemove: function handleRemove(id) {
    this.props.remove(id);
  },
  render: function render() {
    const ingrdsNodes = this.props.ingredients.map((ingrd, index) =>
        React.createElement(Ingredient, { key: index, ingredient: ingrd })
    );
    return (
      React.createElement('div', null,
        React.createElement('h4', null, 'Ingredients'),
        React.createElement(ListGroup, null, ingrdsNodes),
        React.createElement(Button, { id: 'removeRecipe-btn', bsStyle: 'danger',
          onClick: this.handleRemove.bind(this, this.props.recipeID) }, 'Remove')
      )
    );
  }
});

const Ingredient = React.createClass({ displayName: 'Ingredient',
  propTypes: {
    ingredient: React.PropTypes.string
  },
  render: function render() {
    return (
      React.createElement(ListGroupItem, null, this.props.ingredient)
    );
  }
});

ReactDOM.render(React.createElement(RecipeBox, { recipes }), document.getElementById('main'));
