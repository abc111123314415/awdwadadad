const main = new (class {
  constructor () {}
  init () {
    // websocket connection, inizialise mod (run render)
    console.log("worked");
  }
  render () {
    // visuals, render manager
  }
  game () {
    // moomoo bundle kinda, and all websocket functions
    this.updatePlayers = function () {}; // like this
  }
})();
