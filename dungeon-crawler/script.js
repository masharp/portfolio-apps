/* Roguelike Dungeon Crawler
    - This app is a web based roguelike dungeon crawler. The map will be randomly
      generated and the user can explore, fight enemies, and pick up items. Based on
      http://codepen.io/FreeCodeCamp/full/dGOOEJ/. This is a FreeCodeCamp project.

      Heavy utilization of Ondřej Žára's ROT.js Roguelike Toolkit found at:
      https://github.com/ondras/rot.js.

      2016 Michael Sharp
      www.softwareontheshore.com
*/

/*jshint esnext: true */

(function() {
  "use strict";

  /* React Bootstrap Components */
  const Button = ReactBootstrap.Button;
  const ButtonToolbar = ReactBootstrap.ButtonToolbar;
  const Label = ReactBootstrap.Label;

  /* Script Globals */
  const WEAPON_TYPES = {
    "Club": {
      name: "Club",
      id: 0,
      dmg: 10
    },
    "Dagger": {
      name: "Dagger",
      id: 1,
      dmg: 15
    },
    "Axe": {
      name: "Axe",
      id: 2,
      dmg: 20
    },
    "Maul": {
      name: "Maul",
      id: 3,
      dmg: 30
    }
  };

  const ITEM_TYPES = {
    "Weight": {
      "Mega Potion" : 1,
      "Ultra Potion" : 2,
      "Potion": 3
    },
    "Mega Potion" : {
      id: 0,
      health: 200
    },
    "Ultra Potion" : {
      id: 1,
      health: 100
    },
    "Potion" : {
      id: 2,
      health: 50
    }
  };

  const MONSTER_TYPES = {
    "Weight": {
      "Big Boss": 1,
      "Orc": 2,
      "Goblin": 3,
      "Creetin": 4
    },
    "Big Boss": {
      id: 0,
      health: 75,
      dmg: 20
    },
    "Orc": {
      id: 1,
      health: 25,
      dmg: 15
    },
    "Goblin": {
      id: 2,
      health: 20,
      dmg: 10
    },
    "Creetin": {
      id: 3,
      health: 15,
      dmg: 5
    }
  };

  const DUNGEON_HEIGHT = 30;
  const DUNGEON_WIDTH = 80;

  /* ----------------------------- */
  /* ROT Game Object */
  var Map = {
    display: null,
    container: null,
    player: null,
    engine: null,
    items: null,
    monsters: null,
    weapons: null,
    map: {},

    init: function() {
      ROT.DEFAULT_WIDTH = DUNGEON_WIDTH;
      ROT.DEFAULT_HEIGHT = DUNGEON_HEIGHT;

      this.display = new ROT.Display({ fontSize: 10, bg: "black", fg: "white", spacing: 1.1 });
      this.container = this.display.getContainer();

      this._generateMap();

      //creates an ROT event scheduler to handle user input and future AI actions
      let scheduler = new ROT.Scheduler.Simple();
      scheduler.add(this.player, true);

      //controls event flow
      this.engine = new ROT.Engine(scheduler);
      this.engine.start();
    },
    _generateMap: function() {
      let digger = new ROT.Map.Digger();
      let freeCells = [];

      let diggerCallback = function(x, y, value) {
        if(value) { return; }

        let key = x + "," + y;
        this.map[key] = ".";
        freeCells.push(key);
      };
      digger.create(diggerCallback.bind(this));

      this._generateItems(freeCells);
      this._drawWholeMap();

      this.player = this._createCreature(Player, freeCells);
    },
    _createCreature: function(type, freeCells) {

    },
    _generateItems: function(freeCells) {

    },
    _drawWholeMap: function() {
      for(let key in this.map) {
        let cords = key.split(",");
        let x = parseInt(cords[0]);
        let y = parseInt(cords[1]);
        this.display.draw(x, y, this.map[key]);
      }
    }
  };

  /* ROT Player */
  var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
  };

  Player.prototype._draw = function() {

  };
  Player.prototype.act = function() {

  };
  Player.prototype.handleEvent = function(event) {

  };
  Player.prototype.interact = function() {

  };



  var mapDungeon = function mapDungeon() {
    ROT.DEFAULT_WIDTH = DUNGEON_WIDTH;
    ROT.DEFAULT_HEIGHT = DUNGEON_HEIGHT;

    let display = new ROT.Display({ fontSize: 10, bg: "black", fg: "black" });
    let container = display.getContainer();

    let map = new ROT.Map.Digger();
    let data = {};

    map.create(function(x, y, type) {
      data[x + "," + y] = type;
      display.DEBUG(x, y, type);
    });

    //find the starting position of the player
    let rooms = map.getRooms();
    let startX = rooms[0]._x1 + 1;
    let startY = rooms[0]._y1 + 1;

    //calculate the field of view from the player's current position
    let fieldOfView = new ROT.FOV.PreciseShadowcasting(function(x, y) {
      let key = x + "," + y;
      if(key in data) { return (data[key] === 0); }
      return false;
    });

    //draw the field of view based on the current position
    fieldOfView.compute(startX, startY, 6, function(x, y, r, visibility) {
      let ch = (r ? "" : "@");
      let color = (data[x + "," + y] ? "black" : "white");

      display.draw(x, y, ch, "#000", color);
    });

    return container;
  };

  var populateMap =  function populateMap() {
    let monsters = [];
    let weightedMonsters = [];

    for(let i = 0; i < 10; i++) {
      let monster = ROT.RNG.getWeightedValue(MONSTER_TYPES.Weight);
      weightedMonsters.push(monster);
    }

    weightedMonsters.forEach(function(monster) {
      monsters.push(MONSTER_TYPES[monster]);
    });

    return monsters;
  };

  /* Redux Reducer Function */
  const dungeonReducer = function(state, action) {
    Map.init();

    if(state === undefined) state = {
      player: {
        baseHealth: 50,
        baseDmg: 5,
        health: 50,
        dmg: function dmg() { return this.baseDmg + this.weapon.dmg; },
        level: 1,
        exp: 0,
        weapon: WEAPON_TYPES.Club
      },
      monsters: populateMap(),
      dungeon: Map.container,
      dungeonHeight: DUNGEON_HEIGHT,
      dungeonWidth: DUNGEON_WIDTH,
      lightsOn: false
    };

    switch(action.type) {
      case "NEW_WEAPON":
        state.player.weapon = WEAPON_TYPES[action.weapon];
        return state;
      case "HEAL_PLAYER":
        state.player.health = state.player.baseHealth;
        return state;
      case "DMG_PLAYER":
        state.player.health = state.player.health - action.amount;
        return state;
      case "LEVEL_UP":
        state.player.baseHealth = state.player.baseHealth + 50;
        state.player.health = state.player.baseHealth;
        state.player.baseDmg = state.player.baseDmg + 5;
        state.player.level = state.player.level + 1;

        return state;
      default:
        return state;
    }

    return state;
  };

  /* Redux Dispatch Function */
  const reduxDispatches = {
    newWeapon: function newWeapon(weapon) {
      dungeonStore.dispatch({ type: "NEW_WEAPON", weapon: weapon });
    },
    healPlayer: function healPlayer() {
      dungeonStore.dispatch({ type: "HEAL_PLAYER" });
    },
    damagePlayer: function damagePlayer(dmg) {
      dungeonStore.dispatch( { type: "DMG_PLAYER", amount: dmg });
    },
    levelUp: function levelUp() {
      dungeonStore.dispatch( { type: "LEVEL_UP" });
    }
  };

  /* Redux Store */
  var dungeonStore = Redux.createStore(dungeonReducer);

  /* React Components */
  const Game = React.createClass({ displayName: "Game",
    propTypes: {
      getState: React.PropTypes.func.isRequired,
      dispatches: React.PropTypes.object.isRequired
    },
    /* Initial state determined by calling the redux store */
    getInitialState: function getInitialState() {
      return this.props.getState();
    },
    /* Upon document loading - subscribe to the store and update the react DOM */
    componentDidMount: function componentDidMount() {
      let self = this;

      dungeonStore.subscribe(function() {
        let newState = self.props.getState();

        self.setState(newState);
      });

    },
    restart: function restart() {

    },
    light: function light() {

    },
    render: function render() {
      return(
        React.createElement("div", { id: "content", className: "container" },
          React.createElement(ButtonToolbar, { id: "buttons" },
            React.createElement(Button, { id: "restart-btn", onClick: this.restart }, "Restart"),
            React.createElement(Button, { id: "lights-btn", onClick: this.light }, "Light Switch")
          ),
          React.createElement("br", {}),
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
            React.createElement(Label, { className: "tracking-label" }, this.state.player.dmg())
          ),
          React.createElement(Dungeon, { map: this.state.dungeon }),
          React.createElement("p", { id: "control-desc" }, "W, A, S, D to Move")
        )
      );
    }
  });

  const Dungeon = React.createClass({ displayName: "Dungeon",
    propTypes: {
      map: React.PropTypes.object.isRequired
    },
    componentDidMount: function componentDidMount() {
      ReactDOM.findDOMNode(this).appendChild(this.props.map);
    },
    render: function render() {
      return(
        React.createElement("div", { id: "dungeon" })
      );
    }
  });

  Map.init();
  ReactDOM.render(React.createElement(
      Game, { getState: dungeonStore.getState, dispatches: reduxDispatches }), document.getElementById("main")
  );

  /* Expect Assertion Tests
  dungeonStore.dispatch({ type: "NEW_WEAPON", weapon: 1 });
  expect(
    dungeonStore.getState().player.weapon.id
  ).toEqual(1);

  console.log("Tests pass!");

  */
}());
