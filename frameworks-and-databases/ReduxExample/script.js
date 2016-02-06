var counter = function(state, action) {
  if(typeof state === "undefined") {
    return 0;
  }
  switch(action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

//a Redux Store implemented from scratch
var createStore = function(reducer) {
  var state;
  var listeners = [];

  //returns the current state of the redux object store
  var getState = function() {
    return state;
  };

  //dispatches an action to the state store
  var dispatch = function(action) {
    state = reducer(state, action);
    listeners.forEach(function(listener) {
      listener();
    });
  };

  //registers a callback that redux will call everytime an action has been dispatched
  var subscribe = function(listener) {
    listeners.push(listener);

    return function() {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState: getState, dispatch: dispatch, subscribe: subscribe };
};

//turns the counter function defined above into a redux store
var store = createStore(counter);
