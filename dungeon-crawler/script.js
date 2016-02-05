/* Roguelike Dungeon Crawler
    - This app is a web based roguelike dungeon crawler. The map will be randomly
      generated and the user can explore, fight enemies, and pick up items. Based on
      http://codepen.io/FreeCodeCamp/full/dGOOEJ/. This is a FreeCodeCamp project.

      2016 Michael Sharp
      www.softwareontheshore.com

      USER STORIES:
        - I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.
        - All the items and enemies on the map are arranged at random.
        - I can move throughout a map, discovering items.
        - I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.
        - Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.
        - When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.
        - When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.
        - When I find and beat the boss, I win.
        - The game should be challenging, but theoretically winnable.
*/

/*jshint esnext: true */

(function() {

  /* React Bootstrap Components */
  const Button = ReactBootstrap.Button;
  const ButtonToolbar = ReactBootstrap.ButtonToolbar;
  const Label = ReactBootstrap.Label;

  /* Script Globals */
  const WEAPON_TYPES = [
    {
      id: 0,
      name: "Club",
      dmg: 5
    },
    {
      id: 1,
      name: "Dagger",
      dmg: 7
    },
    {
      id: 2,
      name: "Axe",
      dmg: 9
    },
    {
      id: 3,
      name: "Maul",
      dmg: 11
    }
  ];

  var initialState = {
    player: {
      health: 100,
      level: 1,
      exp: 0,
      weapon: WEAPON_TYPES[0]
    },
    dungeon: {
      text: "Here is the dungeon!"
    },
    dungeonHeight: 50,
    dungeonWidth: 70,
    lightsOn: false
  };

  /* Redux Dispatch Function */
  function newWeapon(weapon) {
    dungeonStore.dispatch({ type: "NEW_WEAPON", weapon: weapon });
  }


  /* Redux Reducer Function */
  const dungeonReducer = function(state, action) {
    if(state === undefined) state = initialState;

    switch(action.type) {
      case "NEW_WEAPON":
        state.player.weapon = WEAPON_TYPES[action.weapon];
        return state;
      default:
        return state;
    }

    return state;
  };

  /* Redux Store */
  var dungeonStore = Redux.createStore(dungeonReducer);

  /* React Components */
  const Game = React.createClass({ displayName: "Game",
    propTypes: {
      getState: React.PropTypes.func.isRequired
    },
    getInitialState: function getInitialState() {
      return this.props.getState(undefined);
    },
    componentDidMount: function componentDidMount() {

    },
    restart: function restart() {
        return null;
    },
    light: function light() {
      return null;
    },
    render: function render() {
      return(
        React.createElement("div", { id: "content", className: "container" },
          React.createElement(ButtonToolbar, { id: "buttons" },
            React.createElement(Button, { id: "restart-btn", onClick: this.restart }, "Restart"),
            React.createElement(Button, { id: "lights-btn", onClick: this.light }, "Light Switch")
          ),
          React.createElement("br",{}),
          React.createElement("div", { id: "control-panel" },
            React.createElement(Label, { className: "display-label" }, "Health:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.player.health),
            React.createElement(Label, { className: "display-label" }, "Level:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.player.level),
            React.createElement(Label, { className: "display-label" }, "Experience:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.player.exp),
            React.createElement(Label, { className: "display-label" }, "Weapon:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.player.weapon.name),
            React.createElement(Label, { className: "display-label" }, "Attack:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.player.weapon.dmg)
          ),
          React.createElement(Dungeon, { map: this.state.dungeon })
        )
      );
    }
  });

  const Dungeon = React.createClass({ displayName: "Dungeon",
    propTypes: {
      map: React.PropTypes.object.isRequired
    },
    render: function render() {
      return(
        React.createElement("div", { id: "dungeon" }, this.props.map.text)
      );
    }
  });

  ReactDOM.render(React.createElement(Game, { getState: dungeonStore.getState }), document.getElementById("main"));

  dungeonStore.dispatch({ type: "NEW_WEAPON", weapon: 1});

  expect(
    dungeonStore.getState().player.weapon.id
  ).toEqual(1);

  console.log("Tests pass!")
}());
