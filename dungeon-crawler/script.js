/* Roguelike Dungeon Crawler
    - This app is a web based roguelike dungeon crawler. The map will be randomly
      generated and the user can explore, fight enemies, and pick up items. Based on
      http://codepen.io/FreeCodeCamp/full/dGOOEJ/. This is a FreeCodeCamp project.

      Heavy utilization of Ondřej Žára's ROT.js Roguelike Toolkit found at:
      https://github.com/ondras/rot.js.

      2016 Michael Sharp
      www.softwareontheshore.com

      TODO: Add shadowcasting
*/

/*jshint esnext: true */

(function() {
  "use strict";

  /****************** React Bootstrap Components *******************/
  const Button = ReactBootstrap.Button;
  const ButtonToolbar = ReactBootstrap.ButtonToolbar;
  const Label = ReactBootstrap.Label;
  const Modal = ReactBootstrap.Modal;

  /*************** Dungeon Constants  *******************************/
  const WEAPON_TYPES = [
    {
      name: "Club",
      id: 0,
      dmg: 10
    },
   {
      name: "Dagger",
      id: 1,
      dmg: 20
    },
    {
      name: "Axe",
      id: 2,
      dmg: 30
    },
    {
      name: "Maul",
      id: 3,
      dmg: 50
    }
  ];
  const MONSTER_TYPES = {
    "Weight": {
      "Big Boss": 1,
      "Orc": 2,
      "Goblin": 3,
      "Creetin": 4
    },
    "Big Boss": {
      id: 0,
      health: 100,
      dmg: 100
    },
    "Orc": {
      id: 1,
      health: 40,
      dmg: 25
    },
    "Goblin": {
      id: 2,
      health: 30,
      dmg: 15
    },
    "Creetin": {
      id: 3,
      health: 20,
      dmg: 10
    }
  };
  /**************************************************************
  ***************** ROT Game Object *****************************/
  var Map = {
    display: null,
    container: null,
    player: null,
    monsters: null,
    dungeon: {},

    init: function() {
      this.display = new ROT.Display({ fontSize: 18, bg: "brown", fg: "black" });
      this.container = this.display.getContainer();

      this._generateMap();
    },
    /* Private function to generate the map and trigger player, monsters, and item functions */
    _generateMap: function() {
      let rogue = new ROT.Map.Rogue();
      let freeCells = [];

      let rogueCallback = function(x, y, value) {
        this.display.DEBUG(x, y, value);

        if(value) { return; }

        let key = x + "," + y;
        this.dungeon[key] = "";
        freeCells.push(key);
      };
      rogue.create(rogueCallback.bind(this));

      this._generatePotions(freeCells);
      this._generateWeapons(freeCells);
      this._drawWholeMap();


      this.player = this._generatePlayer(freeCells);
      this.monsters = this._generateMonsters(freeCells);
    },
    /* Private function to generate the player and create a new instance */
    _generatePlayer: function(freeCells) {
      let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      let key = freeCells.splice(index, 1)[0];
      let coords = key.split(",");
      let x = parseInt(coords[0]);
      let y = parseInt(coords[1]);

      return new Player(x, y);
    },
    /* Private function to generate 15 monsters based on their weighted value */
    _generateMonsters: function(freeCells) {
      let monsters = [];
      let monsterTypes = [];

      for(let i = 0; i < 15; i++) {
        let type = ROT.RNG.getWeightedValue(MONSTER_TYPES.Weight);
        monsterTypes.push(MONSTER_TYPES[type]);
      }

      monsterTypes.forEach(function(type) {
        let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        let key = freeCells.splice(index, 1)[0];
        let coords = key.split(",");
        let x = parseInt(coords[0]);
        let y = parseInt(coords[1]);
        monsters.push(new Monster(x, y, type.id));
      });

      reduxDispatches.updateMonsters(monsters);
      return monsters;
    },
    /* Private function to generate 7 potions */
    _generatePotions: function(freeCells) {
      for(let i = 0; i < 7; i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.dungeon[key] = "*";
      }
    },
    /* Private function to generate the 3 upgradable weapons */
    _generateWeapons: function(freeCells) {
      WEAPON_TYPES.forEach(function(weapon) {
        if(weapon.name === "Club") { return; }
        let char = "" + weapon.name[0];
        let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        let key = freeCells.splice(index, 1)[0];
        Map.dungeon[key] = char;
      });
    },
    /* Private helper function to finish drawing the rest of the map based on key store */
    _drawWholeMap: function() {
      for(let key in this.dungeon) {
        let cords = key.split(",");
        let x = parseInt(cords[0]);
        let y = parseInt(cords[1]);
        this.display.draw(x, y, this.dungeon[key]);
      }
    }
  };

  /************************ ROT Player ************************/
  var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
    this._state = dungeonStore.getState();
  };

  /* Player function to draw it's new location.
    TODO: Add Shadowcasting */
  Player.prototype._draw = function() {
    Map.display.draw(this._x, this._y, "@", "#ff0");
  };

  /* Player function to handle user keypresses and movement around map .
     Given control by React prop */
  Player.prototype.handleEvent = function(event) {
    let code = event.keyCode;

    /* Map keys to ROT directions (WDSA) */
    let keyMap = {
      87: 0,
      68: 2,
      83: 4,
      65: 6
    };

    //uses spacebar to attack or pick up items
    if(code === 69) {
      this._interact();
      return;
    }

    //return if key pressed is not handled
    if(!(code in keyMap)) { return; }

    //check free spaces
    let direction = ROT.DIRS[8][keyMap[code]];
    let newX = this._x + direction[0];
    let newY = this._y + direction[1];
    let newKey = newX + "," + newY;

    //return if cannot travel in that direct (wall)
    if(!(newKey in Map.dungeon)) { return; }

    /* determine if the space is occupied by an enemy, if so register dmg */
    if(Map.dungeon[newKey] === "#" || Map.dungeon[newKey] === "$" ||
    Map.dungeon[newKey] === "&" || Map.dungeon[newKey] === "+") {
      this._fight(newKey);
      return;
    }

    Map.display.draw(this._x, this._y, Map.dungeon[this._x + "," + this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();

    let fovCallback = function(x, y) {
      let key = x + "," + y;
      if(key in Map.dungeon) { return (Map.dungeon[key] === 0); }
      return false;
    };

    let fieldOfView = new ROT.FOV.PreciseShadowcasting(fovCallback);

    field.compute(newX, newY, 10, function(x, y, r, visibility) {
      Map.display.draw(x, y, Map.dungeon[key]);

    });
  };

  /* Function for player interacting with items. results in a redix dispatch.
    Also updates the game messages */
  Player.prototype._interact = function() {
    let key = this._x + "," + this._y;

    switch(Map.dungeon[key]) {
      case "*":
        document.getElementById("messages").value += "Found a Potion. You have been healed!\n";
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
        Map.dungeon[key] = "";
        reduxDispatches.healPlayer();
        break;
      case "D":
        document.getElementById("messages").value += "Found a dagger. Be careful!\n";
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
        Map.dungeon[key] = "";
        reduxDispatches.newWeapon(1);
        break;
      case "A":
        document.getElementById("messages").value += "Found an axe. Use it well!\n";
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
        Map.dungeon[key] = "";
        reduxDispatches.newWeapon(2);
        break;
      case "M":
        document.getElementById("messages").value += "Found a maul! Swing with fury!\n";
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
        Map.dungeon[key] = "";
        reduxDispatches.newWeapon(3);
        break;
    }
  };

  /* Player function to parse current enemy and deal damage, see if alive/dead, etc */
  Player.prototype._fight = function(newKey) {
    let x = parseInt(newKey.split(",")[0]);
    let y = parseInt(newKey.split(",")[1]);

    //get monsters, then filter out current monsters, then update store
    let monsters = dungeonStore.getState().monsters;
    let monster = monsters.filter(function(creature) {
      return(creature._x === x && creature._y === y);
    })[0];

    //remove the current monster from the monsters array
    monsters = monsters.filter(function(i) {
      return !(i._x === x && i._y === y);
    });

    //register the damage and / or death of monster then update the store
    console.log(monsters);
    console.log(monster);
    let monsterDmg = monster._dmg;
    let userDmg = dungeonStore.getState().player.dmg();
    let userHealth = dungeonStore.getState().player.health;

    //register player and monster damage
    monster._health -= userDmg;
    reduxDispatches.damagePlayer(monsterDmg);

    if(monster._health > 0) {
      document.getElementById("messages").value += "You damage the monster for " + userDmg +
            ". " + monster._health + " health remaining\n";
      document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
      monsters.push(monster);
    } else {
      document.getElementById("messages").value += "Monster killed! You gained xp!\n";
      document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
      Map.dungeon[newKey] = "";
      Map.display.draw(x, y, Map.dungeon[newKey]);
      reduxDispatches.addXp();
    }

    //check if the player is dead
    if(dungeonStore.getState().player.health <= 0) {
      if(confirm("You've died! Try again!")) {
        window.location.reload(false);
      } else {
        window.location.reload(false);
      }
    }

    //check if enough xp to level up
    if(dungeonStore.getState().player.exp / dungeonStore.getState().player.level >= 20) {
      document.getElementById("messages").value += "Leveled up!\n";
      document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
      reduxDispatches.levelUp();
    }

    //check if the player wins
    if(monsters.length === 0) {
      if(confirm("You win! Try again!")) {
        window.location.reload(false);
      } else {
        window.location.reload(false);
      }
    }

    reduxDispatches.updateMonsters(monsters);
  };


  /**************** ROT Monster ***********************/
  var Monster = function(x, y, type) {
    this._x = x;
    this._y = y;
    this._type = type;
    this._draw();

    //Assign health and damage to monster based on type
    switch(type) {
      case 0:
        this._health = MONSTER_TYPES["Big Boss"].health;
        this._dmg = MONSTER_TYPES["Big Boss"].dmg;
        break;
      case 1:
        this._health = MONSTER_TYPES.Orc.health;
        this._dmg = MONSTER_TYPES.Orc.dmg;
        break;
      case 2:
        this._health = MONSTER_TYPES.Goblin.health;
        this._dmg = MONSTER_TYPES.Goblin.dmg;
        break;
      case 3:
        this._health = MONSTER_TYPES.Creetin.health;
        this._dmg = MONSTER_TYPES.Creetin.dmg;
        break;
      default:
        this._health = 50;
        this._dmg = 20;
    }
  };

  /* Monster function to draw itself based on type */
  Monster.prototype._draw = function() {
    let color = "";
    let char = "";

    switch(this._type) {
      case 0:
        color = "purple";
        char = "$";
        break;
      case 1:
        color = "white";
        char = "#";
        break;
      case 2:
        color = "orange";
        char = "&";
        break;
      case 3:
        color = "gray";
        char = "+";
        break;
    }

    Map.dungeon[this._x + "," + this._y] = char;
    Map.display.draw(this._x, this._y, char, color);
  };

  /**************************************************************
  ***************** ReduxReducer Function *****************************/
  const dungeonReducer = function(state, action) {
    if(state === undefined) state = {
      player: {
        baseHealth: 50,
        baseDmg: 5,
        health: 50,
        dmg: function dmg() { return this.baseDmg + this.weapon.dmg; },
        level: 1,
        exp: 0,
        weapon: WEAPON_TYPES[0]
      },
      lightsOn: false,
      monsters: Map.monsters
    };

    switch(action.type) {
      case "NEW_WEAPON":
        state.player.weapon = WEAPON_TYPES[action.weapon];
        return state;
      case "HEAL_PLAYER":
        state.player.health = state.player.baseHealth;
        return state;
      case "ADD_XP":
        state.player.exp += 10;
        return state;
      case "DMG_PLAYER":
        state.player.health -= action.amount;
        return state;
      case "LEVEL_UP":
        state.player.baseHealth = state.player.baseHealth + 50;
        state.player.health = state.player.baseHealth;
        state.player.baseDmg = state.player.baseDmg + 5;
        state.player.level = state.player.level + 1;
        return state;
      case "UPDATE_MONSTERS":
        state.monsters = action.monsters;
        return state;
      default:
        return state;
    }

    return state;
  };

  /**************************************************************
  ***************** Redux Dispatcher Function *****************************/
  const reduxDispatches = {
    newWeapon: function newWeapon(weapon) {
      dungeonStore.dispatch({ type: "NEW_WEAPON", weapon: weapon });
    },
    healPlayer: function healPlayer() {
      dungeonStore.dispatch({ type: "HEAL_PLAYER" });
    },
    addXp: function addXp() {
      dungeonStore.dispatch({ type: "ADD_XP" });
    },
    damagePlayer: function damagePlayer(dmg) {
      dungeonStore.dispatch( { type: "DMG_PLAYER", amount: dmg });
    },
    levelUp: function levelUp() {
      dungeonStore.dispatch( { type: "LEVEL_UP" });
    },
    updateMonsters: function updateMonsters(monsters) {
      dungeonStore.dispatch({ type: "UPDATE_MONSTERS", monsters: monsters });
    }
  };

  /* Redux Store */
  var dungeonStore = Redux.createStore(dungeonReducer);

  /**************************************************************
  ***************** React Components *****************************/
  const Game = React.createClass({ displayName: "Game",
    propTypes: {
      dungeon: React.PropTypes.object.isRequired,
      getState: React.PropTypes.func.isRequired,
      dispatches: React.PropTypes.object.isRequired
    },
    /* Initial state determined by calling the redux store */
    getInitialState: function getInitialState() {
      return ({ showOverlay: false, data: this.props.getState()});
    },
    /* Upon document loading - subscribe to the store and update the react DOM */
    componentDidMount: function componentDidMount() {
      let self = this;

      dungeonStore.subscribe(function() {
        let newState = self.props.getState();

        self.setState(newState);
      });

      window.addEventListener("keydown", this.props.dungeon.player);
    },
    componentWillUnmount: function componentWillUnmount() {
      window.addEventListener("keydown", this.props.dungeon.player);
    },
    restart: function restart() {
      window.location.reload(false);
    },
    open: function open() {
      this.setState({ showOverlay: true });
    },
    close: function close() {
      this.setState({ showOverlay: false });
    },
    render: function render() {
      return(
        React.createElement("div", { id: "content", className: "container" },
          React.createElement(ButtonToolbar, { id: "buttons" },
            React.createElement(Button, { id: "restart-btn", onClick: this.restart, bsStyle: "warning" }, "Restart"),
            //React.createElement(Button, { id: "lights-btn", onClick: this.light }, "Light Switch")
            React.createElement(Button, { id: "instr-btn", onClick: this.open, bsStyle: "primary" }, "Instructions"),
            React.createElement(Modal, { id: "overlay", show: this.state.showOverlay, onHide: this.close },
              React.createElement(Modal.Header, { closeButton: true },
                React.createElement(Modal.Title, { }, "Instructions")
              ),
              React.createElement(Modal.Body, null,
                React.createElement("p", { className: "instr"  }, "Win: KILL ALL MONSTERS"),
                React.createElement("p", { className: "instr" }, "Movement: W, A, S, D"),
                React.createElement("p", { className: "instr"  }, "Interaction: E"),
                React.createElement("p", { className: "instr"  }, "'A' / 'M'/ 'D' -> WEAPONS"),
                React.createElement("p", { className: "instr"  }, "'*' -> POTIONS"),
                React.createElement("p", { className: "instr"  }, "'#' / '&' / '+' -> MONSTERS"),
                React.createElement("p", { className: "instr"  }, "'$' -> BOSS")
              )
            )
          ),
          React.createElement("br", {}),
          React.createElement("div", { id: "control-panel" },
            React.createElement(Label, { className: "display-label" }, "Health:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.data.player.health),
            React.createElement(Label, { className: "display-label" }, "Level:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.data.player.level),
            React.createElement(Label, { className: "display-label" }, "Experience:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.data.player.exp),
            React.createElement(Label, { className: "display-label" }, "Weapon:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.data.player.weapon.name),
            React.createElement(Label, { className: "display-label" }, "Attack:"),
            React.createElement(Label, { className: "tracking-label" }, this.state.data.player.dmg())
          ),
          React.createElement("textarea", { id: "messages", ref: "textarea", readOnly: "readOnly"}),
          React.createElement(Dungeon, { map: this.props.dungeon.container })
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

  //Initializes the ROT object in order to pass it's values to React as a prop
  Map.init();

  ReactDOM.render(React.createElement(
      Game, { getState: dungeonStore.getState, dispatches: reduxDispatches, dungeon: Map }), document.getElementById("main")
  );
}());
