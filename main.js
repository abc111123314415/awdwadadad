const main = new (class {
  constructor () {
    this.connected = false;
    this.game = new (class {
      constructor () {
        this.UTILS = new (class {
          constructor() {
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            var mathATAN2 = Math.atan2;
            var mathPI = Math.PI;

            this.randInt = function (min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            this.randFloat = function (min, max) {
              return Math.random() * (max - min + 1) + min;
            };
          }
        })();

        this.start = () => {};

        // WEBSOCKET CACHES
        this.setInitData = function (data) {};
        this.disconnect = function (reason) {};
        this.setupGame = function (yourSID) {};
        this.addPlayer = function (data, isYou) {};
        this.removePlayer = function (id) {};
        this.updatePlayers = function (data) {};
        this.updateLeaderboard = function (data) {};
        this.loadGameObject = function (data) {};
        this.loadAI = function (data) {};
        this.animateAI = function (sid) {};
        this.gatherAnimation = function (sid, didHit, index) {};
        this.wiggleGameObject = function (dir, sid) {};
        this.shootTurret = function (sid, dir) {};
        this.updatePlayerValue = function (index, value, updateView) {};
        this.updateHealth = function (sid, value) {};
        this.killPlayer = function () {};
        this.killObject = function (sid) {};
        this.killObjects = function (sid) {};
        this.updateItemCounts = function (index, value) {};
        this.updateAge = function (xp, mxp, age) {};
        this.updateUpgrades = function (points, age) {};
        this.updateItems = function (data, wpn) {};
        this.addProjectile = function (x, y, dir, range, speed, indx, layer, sid) {};
        this.remProjectile = function (sid, range) {}; 
        this.serverShutdownNotice = function (countdown) {};
        this.addAlliance = function (data) {};
        this.deleteAlliance = function (sid) {}; 
        this.allianceNotification = function (sid, name) {};
        this.setPlayerTeam = function (team, isOwner) {};
        this.setAlliancePlayers = function (data) {};
        this.updateStoreItems = function (type, id, index) {};
        this.receiveChat = function (sid, message) {};
        this.updateMinimap = function (data) {};
        this.showText = function (x, y, value, type) {};
        this.pingMap = function (x, y) {};
        this.pingSocketResponse = function () {};
      }
    })();
    this.renderManager = new (class {})();
  }
  init () {
    // ADD MSGPACK
    let min = document.createElement("script");
    min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
    document.body.append(min);
    // CREATE WEBSOCKET
    this.url = window.location.hostname == "mohmohsg.onrender.com" ? "wss://mohmohsg.onrender.com" : "wss://mohmoh.eu";
    this.io = new WebSocket(this.url);
    this.io.onopen = () => {
      // START GAME
      this.game.start();
      this.connected = true;
      // SET BINARY TYPE
      this.io.binaryType = "arraybuffer";
      // PACKETS PER SECOND
      this.io.pps = 0;
      setInterval(() => { this.io.pps = 0; }, 1000);
      // SEND FUNCTION
      this.io._send = this.io.send;
      this.io.send = (type) => {
        // EXTRACT DATA ARRAY:
        let data = Array.prototype.slice.call(arguments, 1);
        // SEND MESSAGE:
        let binary = window.msgpack.encode([type, data]);
        this.io.pps++;
        this.io.send_(binary);
      }
      this.io.addEventListener("close", () => { window.location.reload(); }); // RELOAD
      // MESSAGE LISTENER
      this.io.addEventListener("message", (msg) => {
        let data = new Uint8Array(msg.data);
        let parsed = window.msgpack.decode(data);
        let type = parsed[0];
        data = parsed[1];
        let events = {
          "id": this.game.setInitData,
          "d": this.game.disconnect,
          "1": this.game.setupGame,
          "2": this.game.addPlayer,
          "4": this.game.removePlayer,
          "33": this.game.updatePlayers,
          "5": this.game.updateLeaderboard,
          "6": this.game.loadGameObject,
          "a": this.game.loadAI,
          "aa": this.game.animateAI,
          "7": this.game.gatherAnimation,
          "8": this.game.wiggleGameObject,
          "sp": this.game.shootTurret,
          "9": this.game.updatePlayerValue,
          "h": this.game.updateHealth,
          "11": this.game.killPlayer,
          "12": this.game.killObject,
          "13": this.game.killObjects,
          "14": this.game.updateItemCounts,
          "15": this.game.updateAge,
          "16": this.game.updateUpgrades,
          "17": this.game.updateItems,
          "18": this.game.addProjectile,
          "19": this.game.remProjectile,
          "20": this.game.serverShutdownNotice,
          "ac": this.game.addAlliance,
          "ad": this.game.deleteAlliance,
          "an": this.game.allianceNotification,
          "st": this.game.setPlayerTeam,
          "sa": this.game.setAlliancePlayers,
          "us": this.game.updateStoreItems,
          "ch": this.game.receiveChat,
          "mm": this.game.updateMinimap,
          "t": this.game.showText,
          "p": this.game.pingMap,
          "pp": this.game.pingSocketResponse
        };
        if (events[type]) {
          events[type].apply(undefined, data);
        } else {
          console.log("Invalid packet received: " + type)
        }
      });
    }
  }
})();
