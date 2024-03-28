const main = new (class {
  constructor () {
    this.connected = false;
    this.beautify = new (class {
        constructor () {}

        init () {
            // MENU
            // VISUALS
            // GUI
            // UI
        }
    })();
    this.game = new (class {
      constructor () {
        // DEFINE GLOBAL VARIABLES
        this.players = [];
        this.alliances = [];
        this.player;
        this.enemies = [];
        this.enemy;
        this.teammates = [];
        this.teammates;
        this.playerSID;

        this.ais = []; // mohmoh got no ais
        this.projectiles = [];
        this.buildings = []; // <- CLOSER THAN 300
        this.gameObjects = [];

        this.$ = window.$;
        this.get = (el) => { return document.getElementById(el); };
        this.delta;
        this.now;
        this.lastSent;
        this.lastUpdate = Date.now();
        this.keys;
        this.attackState;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.inGame = false;
        // GLOBAL FUNCTIONS
        this.findPlayerByID = (id) => {
            for (var i = 0; i < this.players.length; ++i) {
                if (this.players[i].id == id) {
                    return this.players[i];
                }
            } return null;
        }
        this.findPlayerBySID = (sid) => {
            for (var i = 0; i < this.players.length; ++i) {
                if (this.players[i].sid == sid) {
                    return this.players[i];
                }
            } return null;
        }
        this.findAIBySID = (sid) => {
            for (var i = 0; i < this.ais.length; ++i) {
                if (this.ais[i].sid == sid) {
                    return this.ais[i];
                }
            } return null;
        }
        this.findObjectBySid = (sid) => {
            for (var i = 0; i < this.gameObjects.length; ++i) {
                if (this.gameObjects[i].sid == sid) {
                    return this.gameObjects[i];
                }
            } return null;
        }

        // ELEMENTS 
        var adContainer = document.getElementById("ad-container");
        var mainMenu = document.getElementById("mainMenu");
        var enterGameButton = document.getElementById("enterGame");
        var promoImageButton = document.getElementById("promoImg");
        var partyButton = document.getElementById("partyButton");
        var joinPartyButton = document.getElementById("joinPartyButton");
        var settingsButton = document.getElementById("settingsButton");
        var settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
        var allianceButton = document.getElementById("allianceButton");
        var storeButton = document.getElementById("storeButton");
        var chatButton = document.getElementById("chatButton");
        var gameCanvas = document.getElementById("gameCanvas");
        var mainContext = gameCanvas.getContext("2d");
        var serverBrowser = document.getElementById("serverBrowser");
        var nativeResolutionCheckbox = document.getElementById("nativeResolution");
        var showPingCheckbox = document.getElementById("showPing");
        var playMusicCheckbox = document.getElementById("playMusic");
        var pingDisplay = document.getElementById("pingDisplay");
        var shutdownDisplay = document.getElementById("shutdownDisplay");
        var menuCardHolder = document.getElementById("menuCardHolder");
        var guideCard = document.getElementById("guideCard");
        var loadingText = document.getElementById("loadingText");
        var gameUI = document.getElementById("gameUI");
        var actionBar = document.getElementById("actionBar");
        var scoreDisplay = document.getElementById("scoreDisplay");
        var foodDisplay = document.getElementById("foodDisplay");
        foodDisplay.style.display = "none";
        var woodDisplay = document.getElementById("woodDisplay");
        woodDisplay.style.display = "none";
        var stoneDisplay = document.getElementById("stoneDisplay");
        stoneDisplay.style.display = "none";
        var killCounter = document.getElementById("killCounter");
        var leaderboardData = document.getElementById("leaderboardData");
        var nameInput = document.getElementById("nameInput");
        var itemInfoHolder = document.getElementById("itemInfoHolder");
        var ageText = document.getElementById("ageText");
        ageText.style.display = "none";
        var ageBarBody = document.getElementById("ageBarBody");
        var upgradeHolder = document.getElementById("upgradeHolder");
        var upgradeCounter = document.getElementById("upgradeCounter");
        var allianceMenu = document.getElementById("allianceMenu");
        var allianceHolder = document.getElementById("allianceHolder");
        var allianceManager = document.getElementById("allianceManager");
        var mapDisplay = document.getElementById("mapDisplay");
        var diedText = document.getElementById("diedText");
        var skinColorHolder = document.getElementById("skinColorHolder");
        var mapContext = mapDisplay.getContext("2d");
        mapDisplay.width = 300;
        mapDisplay.height = 300;
        var storeMenu = document.getElementById("storeMenu");
        var storeHolder = document.getElementById("storeHolder");
        var noticationDisplay = document.getElementById("noticationDisplay");

        // UTILITIES
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
            this.lerp = function (value1, value2, amount) {
              return value1 + (value2 - value1) * amount;
            };
            this.decel = function (val, cel) {
              if (val > 0) {
                  val = Math.max(0, val - cel);
              } else if (val < 0) {
                  val = Math.min(0, val + cel);
              }
              return val;
            };
            this.getAngleDist = function (a, b) {
              var p = mathABS(b - a) % (mathPI * 2);
              return (p > mathPI ? (mathPI * 2) - p : p);
            };
            this.isNumber = function (n) {
              return (typeof n == "number" && !isNaN(n) && isFinite(n));
            };
            this.isString = function (s) {
              return (s && typeof s == "string");
            };
            this.kFormat = function (num) {
              return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
            };
            this.getDistance = function(x1, y1, x2, y2) {
              return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
            };
            this.getDirection = function(x1, y1, x2, y2) {
              return mathATAN2(y1 - y2, x1 - x2);
            };
            this.getDist = function (e, t) {
              try {
                  return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
              } catch (e) {
                  return Infinity;
              }
            };
            this.getDir = function(e, t) {
              try {
                  return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
              } catch (e) {
                  return 0;
              }
            };
            this.capitalizeFirst = function (string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            };
            this.fixTo = function (n, v) {
              return parseFloat(n.toFixed(v));
            };
            this.sortByPoints = function (a, b) {
              return parseFloat(b.points) - parseFloat(a.points);
            };
            this.exports.hookTouchEvents = function (element, skipPrevent) {
              var preventDefault = !skipPrevent;
              var isHovering = false;
              var passive = false;
              element.addEventListener("touchstart", module.exports.checkTrusted(touchStart), passive);
              element.addEventListener("touchmove", module.exports.checkTrusted(touchMove), passive);
              element.addEventListener("touchend", module.exports.checkTrusted(touchEnd), passive);
              element.addEventListener("touchcancel", module.exports.checkTrusted(touchEnd), passive);
              element.addEventListener("touchleave", module.exports.checkTrusted(touchEnd), passive);
              function touchStart(e) {
                  module.exports.mousifyTouchEvent(e);
                  window.setUsingTouch(true);
                  if (preventDefault) {
                      e.preventDefault();
                      e.stopPropagation();
                  }
                  if (element.onmouseover)
                      element.onmouseover(e);
                  isHovering = true;
              }
              function touchMove(e) {
                  module.exports.mousifyTouchEvent(e);
                  window.setUsingTouch(true);
                  if (preventDefault) {
                      e.preventDefault();
                      e.stopPropagation();
                  }
                  if (module.exports.containsPoint(element, e.pageX, e.pageY)) {
                      if (!isHovering) {
                          if (element.onmouseover)
                              element.onmouseover(e);
                          isHovering = true;
                      }
                  } else {
                      if (isHovering) {
                          if (element.onmouseout)
                              element.onmouseout(e);
                          isHovering = false;
                      }
                  }
              }
              function touchEnd(e) {
                  module.exports.mousifyTouchEvent(e);
                  window.setUsingTouch(true);
                  if (preventDefault) {
                      e.preventDefault();
                      e.stopPropagation();
                  }
                  if (isHovering) {
                      if (element.onclick)
                          element.onclick(e);
                      if (element.onmouseout)
                          element.onmouseout(e);
                      isHovering = false;
                  }
              }
            };
            this.lineInRect = function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
              var minX = x1;
              var maxX = x2;
              if (x1 > x2) {
                  minX = x2;
                  maxX = x1;
              }
              if (maxX > recX2)
                  maxX = recX2;
              if (minX < recX)
                  minX = recX;
              if (minX > maxX)
                  return false;
              var minY = y1;
              var maxY = y2;
              var dx = x2 - x1;
              if (Math.abs(dx) > 0.0000001) {
                  var a = (y2 - y1) / dx;
                  var b = y1 - a * x1;
                  minY = a * minX + b;
                  maxY = a * maxX + b;
              }
              if (minY > maxY) {
                  var tmp = maxY;
                  maxY = minY;
                  minY = tmp;
              }
              if (maxY > recY2)
                  maxY = recY2;
              if (minY < recY)
                  minY = recY;
              if (minY > maxY)
                  return false;
              return true;
            };
            this.containsPoint = function (element, x, y) {
              var bounds = element.getBoundingClientRect();
              var left = bounds.left + window.scrollX;
              var top = bounds.top + window.scrollY;
              var width = bounds.width;
              var height = bounds.height;
  
              var insideHorizontal = x > left && x < left + width;
              var insideVertical = y > top && y < top + height;
              return insideHorizontal && insideVertical;
            };
            this.mousifyTouchEvent = function(event) {
              var touch = event.changedTouches[0];
              event.screenX = touch.screenX;
              event.screenY = touch.screenY;
              event.clientX = touch.clientX;
              event.clientY = touch.clientY;
              event.pageX = touch.pageX;
              event.pageY = touch.pageY;
            };
            this.removeAllChildren = function (element) {
              while (element.hasChildNodes()) {
                  element.removeChild(element.lastChild);
              }
            };
            this.generateElement = function (config) {
              var element = document.createElement(config.tag || "div");
              function bind(configValue, elementValue) {
                  if (config[configValue])
                      element[elementValue] = config[configValue];
              }
              bind("text", "textContent");
              bind("html", "innerHTML");
              bind("class", "className");
              for (var key in config) {
                  switch (key) {
                      case "tag":
                      case "text":
                      case "html":
                      case "class":
                      case "style":
                      case "hookTouch":
                      case "parent":
                      case "children":
                          continue;
                      default:
                          break;
                  }
                  element[key] = config[key];
              }
              if (element.onclick)
                  element.onclick = module.exports.checkTrusted(element.onclick);
              if (element.onmouseover)
                  element.onmouseover = module.exports.checkTrusted(element.onmouseover);
              if (element.onmouseout)
                  element.onmouseout = module.exports.checkTrusted(element.onmouseout);
              if (config.style) {
                  element.style.cssText = config.style;
              }
              if (config.hookTouch) {
                  module.exports.hookTouchEvents(element);
              }
              if (config.parent) {
                  config.parent.appendChild(element);
              }
              if (config.children) {
                  for (var i = 0; i < config.children.length; i++) {
                      element.appendChild(config.children[i]);
                  }
              }
              return element;
            };
            this.eventIsTrusted = function(ev) {
              if (ev && typeof ev.isTrusted == "boolean") {
                  return ev.isTrusted;
              } else {
                  return true;
              }
            };
            this.checkTrusted = function(callback) {
              return function(ev) {
                  if (ev && ev instanceof Event && module.exports.eventIsTrusted(ev)) {
                      callback(ev);
                  }
              }
            }
            this.randomString = function(length) {
              var text = "";
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              for (var i = 0; i < length; i++) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
              }
              return text;
            };
            this.countInArray = function(array, val) {
              var count = 0;
              for (var i = 0; i < array.length; i++) {
                  if (array[i] === val) count++;
              } return count;
            };
          }
        })();
        // ANIMATED TEXT
        this.animText = class {
            constructor () {}
            // INITIALIZE
            init (x, y, scale, speed, life, text, color) {
                this.x = x;
                this.y = y;
                const range = 30;
                this.xOffsetEZ = (Math.random() - 0.5) * range * 2;
                this.yOffsetEZ = (Math.random() - 0.5) * range * 2;
                this.color = color;
                this.scale = scale;
                this.startScale = this.scale;
                this.maxScale = scale * 1.5;
                this.scaleSpeed = 0.2;
                this.opacity = 1.0;
                this.speed = speed;
                this.life = life;
                this.text = text;
            }
            // UPDATE:
            update (delta) {
              if (this.life) {
                  this.life -= delta;
                  this.y -= (window.visuals ? this.speed / 2 : this.speed) * delta;
                  if (this.opacity > 0 && window.visuals) {
                      this.opacity -= 0.001 * delta;
                  }
                  this.scale += this.scaleSpeed * delta;
                  if (this.scale >= this.maxScale) {
                      this.scale = this.maxScale;
                      this.scaleSpeed *= -1;
                  } else if (this.scale <= this.startScale) {
                      this.scale = this.startScale;
                      this.scaleSpeed = 0;
                  }
                  if (this.life <= 0) {
                      this.life = 0;
                  }
              }
            };
            // RENDER:
            render (ctxt, xOff, yOff) {
                ctxt.globalAlpha = Math.max(0, this.opacity);
                ctxt.fillStyle = this.color;
                ctxt.font = this.scale + "px Hammersmith One";
                ctxt.lineWidth = 7;
                if (window.visuals) {
                    ctxt.strokeText(this.text, this.x - xOff - this.xOffsetEZ, this.y - yOff - this.yOffsetEZ);
                    ctxt.fillText(this.text, this.x - xOff - this.xOffsetEZ, this.y - yOff - this.yOffsetEZ);
                } else {
                    ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                }
            };
        };
        // TEXT MANAGER
        this.textManager = new (class {
          constructor () {
              this.texts = [];
          }
          // UPDATE:
          update (delta, ctxt, xOff, yOff) {
            ctxt.textBaseline = "middle";
            ctxt.textAlign = "center";
            for (var i = this.texts.length - 1; i >= 0; i--) {
                if (this.texts[i].life) {
                    this.texts[i].update(delta);
                    this.texts[i].render(ctxt, xOff, yOff);
                } else {
                    this.texts.splice(i, 1);
                }
            }
          };
          // SHOW TEXT:
          showText (x, y, scale, speed, life, text, color) {
              var tmpText;
              for (var i = 0; i < this.texts.length; ++i) {
                  if (!this.texts[i].life) {
                      tmpText = this.texts[i];
                      break;
                  }
              }
              if (!tmpText) {
                  tmpText = new game.AnimText();
                  this.texts.push(tmpText);
              }
              tmpText.init(x, y, scale, speed, life, text, color);
          };
        })();
        // CONFIGS
        this.configs = new (class {
          constructor () {
            // RENDER:
            this.maxScreenWidth = 1920*1.3;
            this.maxScreenHeight = 1080*1.3;

            // SERVER:
            this.serverUpdateRate = 9;
            this.tickRate = (1000 / this.serverUpdateRate);
            this.maxPlayers = 100;
            this.maxPlayersHard = this.maxPlayers;
            this.collisionDepth = 6;
            this.minimapRate = 3000;

            // COLLISIONS:
            this.colGrid = 10;

            // CLIENT:
            this.clientSendRate = 5;

            // UI:
            this.healthBarWidth = 50;
            this.healthBarPad = 4.5;
            this.iconPadding = 15;
            this.iconPad = 0.9;
            this.deathFadeout = 350;
            this.crownIconScale = 60;
            this.crownPad = 35;

            // CHAT:
            this.chatCountdown = 3000;
            this.chatCooldown = 500;

            // SANDBOX:
            this.inSandbox = true; // mohmoh always sandbox

            // PLAYER:
            this.maxAge = 100;
            this.gatherAngle = Math.PI/2.6;
            this.gatherWiggle = 10;
            this.hitReturnRatio = 0.25;
            this.hitAngle = Math.PI / 2;
            this.playerScale = 35;
            this.playerSpeed = 0.0016;
            this.playerDecel = 0.993;
            this.nameY = 34;

            // CUSTOMIZATION:
            this.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                         "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                         "#8bc373", "#91B2DB"];

            // ANIMALS:
            this.animalCount = 7;
            this.aiTurnRandom = 0.06;
            this.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper",
                                       "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];

            // WEAPONS:
            this.shieldAngle = Math.PI/3;
            this.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1
            }, {
                id: 1,
                src: "_g",
                xp: 1000,
                val: 1.1
            }, {
                id: 2,
                src: "_d",
                xp: 1750,
                val: 1.18
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 2500,
                val: 1.18
            }, {
                id: 4,
                src: '_e',
                xp: 3000,
                val: 1.25
            }];
            this.fetchVariant = function(player) {
                var tmpXP = player.weaponXP[player.weaponIndex]||0;
                for (var i = this.weaponVariants.length - 1; i >= 0; --i) {
                    if (tmpXP >= this.weaponVariants[i].xp)
                        return this.weaponVariants[i];
                }
            };

            // NATURE:
            this.resourceTypes = ["wood", "food", "stone", "points"];
            this.areaCount = 7;
            this.treesPerArea = 9;
            this.bushesPerArea = 3;
            this.totalRocks = 32;
            this.goldOres = 7;
            this.riverWidth = 724;
            this.riverPadding = 114;
            this.waterCurrent = 0.0011;
            this.waveSpeed = 0.00001;
            this.waveMax = 1.2;
            this.treeScales = [150, 160, 165, 175];
            this.bushScales = [80, 85, 95];
            this.rockScales = [80, 85, 90];

            // BIOME DATA:
            this.snowBiomeTop = 2400;
            this.snowSpeed = 0.75;

            // DATA:
            this.maxNameLength = 15;

            // MAP:
            this.mapScale = 14400; // 14400 2000
            this.mapPingScale = 40;
            this.mapPingTime = 2200;
            /**/
            this.volcanoScale = 320;
            this.innerVolcanoScale = 100;
            this.volcanoAnimalStrength = 2;
            this.volcanoAnimationDuration = 3200;
            this.volcanoAggressionRadius = 1440;
            this.volcanoAggressionPercentage = 0.2;
            this.volcanoDamagePerSecond = -1;
            this.volcanoLocationX = 14400 - 320 - 120;
            this.volcanoLocationY = 14400 - 320 - 120;
          }
        })();
        this.screen = {
            maxH: this.configs.maxScreenWidth,
            maxW: this.configs.maxScreenWidth,
            H: maxH,
            W: maxW
        };
        var hats = this.store.hats;
        var accessories = this.store.accessories;
        // GAMEOBJECT
        this.gameObject = class {
          constructor (sid) {
            this.sid = sid;
          }
          // INIT:
          init (x, y, dir, scale, type, data, owner) {
            data = data||{};
            this.sentTo = {};
            this.gridLocations = [];
            this.active = true;
            this.doUpdate = data.doUpdate;
            this.x = x;
            this.y = y;
            this.dir = dir;
            this.shootted = 0;
            this.xWiggle = 0;
            this.yWiggle = 0;
            this.scale = scale;
            this.type = type;
            this.id = data.id;
            this.owner = owner;
            this.name = data.name;
            this.isItem = (this.id!=undefined);
            this.group = data.group;
            this.health = data.health;
            this.cHealth = this.health;
            this.buildHealth = data.health;
            this.layer = 2;
            if (this.group != undefined) {
                this.layer = this.group.layer;
            } else if (this.type == 0) {
                this.layer = 3;
            } else if (this.type == 2) {
                this.layer = 0;
            }  else if (this.type == 4) {
                this.layer = -1;
            }
            this.colDiv = data.colDiv||1;
            this.blocker = data.blocker;
            this.ignoreCollision = data.ignoreCollision;
            this.dontGather = data.dontGather;
            this.hideFromEnemy = data.hideFromEnemy;
            this.friction = data.friction;
            this.projDmg = data.projDmg;
            this.dmg = data.dmg;
            this.pDmg = data.pDmg;
            this.pps = data.pps;
            this.zIndex = data.zIndex||0;
            this.turnSpeed = data.turnSpeed;
            this.req = data.req;
            this.trap = data.trap;
            this.healCol = data.healCol;
            this.teleport = data.teleport;
            this.boostSpeed = data.boostSpeed;
            this.projectile = data.projectile;
            this.shootRange = data.shootRange;
            this.shootRate = data.shootRate;
            this.shootCount = this.shootRate;
            this.spawnPoint = data.spawnPoint;
            this.opacity = 0;
          };
          // GET HIT:
          changeHealth (amount, doer) {
              this.health += amount
              return (this.health <= 0);
          };
          // GET SCALE:
          getScale (sM, ig) {
              sM = sM||1;
              return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                  ?1:(0.6*sM)) * (ig?1:this.colDiv);
          };
          // VISIBLE TO PLAYER:
          visibleToPlayer (player) {
              return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                              (this.owner.team && player.team == this.owner.team)));
          };
          // UPDATE:
          update (delta) {
              if (this.active) {
                  if (this.xWiggle) {
                      this.xWiggle *= Math.pow(0.99, delta);
                  } if (this.yWiggle) {
                      this.yWiggle *= Math.pow(0.99, delta);
                  }
                  if (this.turnSpeed) {
                      this.dir += this.turnSpeed * delta;
                  }
              }
          };
        };
        // OBJECT MANAGER
        this.ObjectManager = class {
          constructor (GameObject, gameObjects, UTILS, config, players, server) {
            var mathFloor = Math.floor;
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;

            this.objects = gameObjects;
            this.grids = {};
            this.updateObjects = [];
            var tmpS = config.mapScale/config.colGrid;
            var tmpX, tmpY;
            this.setObjectGrids = function(obj) {
                var objX = Math.min(config.mapScale, Math.max(0, obj.x));
                var objY = Math.min(config.mapScale, Math.max(0, obj.y));
                for (var x = 0; x < config.colGrid; ++x) {
                    tmpX = x * tmpS;
                    for (var y = 0; y < config.colGrid; ++y) {
                        tmpY = y * tmpS;
                        if (objX + obj.scale >= tmpX && objX - obj.scale <= tmpX + tmpS &&
                            objY + obj.scale >= tmpY && objY - obj.scale <= tmpY + tmpS) {
                            if (!this.grids[x + "_" + y])
                                this.grids[x + "_" + y] = [];
                            this.grids[x + "_" + y].push(obj);
                            obj.gridLocations.push(x + "_" + y);
                        }
                    }
                }
            };
            // REMOVE OBJECT FROM GRID:
            this.removeObjGrid = function(obj) {
                var tmpIndx;
                for (var i = 0; i < obj.gridLocations.length; ++i) {
                    tmpIndx = this.grids[obj.gridLocations[i]].indexOf(obj);
                    if (tmpIndx >= 0) {
                        this.grids[obj.gridLocations[i]].splice(tmpIndx, 1);
                    }
                }
            };
            // DISABLE OBJ:
            this.disableObj = function(obj) {
                obj.active = false;
                if (server) {
                    if (obj.owner && obj.pps) obj.owner.pps -= obj.pps;
                    this.removeObjGrid(obj);
                    var tmpIndx = this.updateObjects.indexOf(obj);
                    if (tmpIndx >= 0) {
                        this.updateObjects.splice(tmpIndx, 1);
                    }
                }
            };
            // HIT OBJECT:
            this.hitObj = function(tmpObj, tmpDir) {
                for (var p = 0; p < players.length; ++p) {
                    if (players[p].active) {
                        if (tmpObj.sentTo[players[p].id]) {
                            if (!tmpObj.active) server.send(players[p].id, "12", tmpObj.sid);
                            else if (players[p].canSee(tmpObj))
                                server.send(players[p].id, "8", UTILS.fixTo(tmpDir, 1), tmpObj.sid);
                        } if (!tmpObj.active && tmpObj.owner == players[p])
                            players[p].changeItemCount(tmpObj.group.id, -1);
                    }
                }
            };
            // GET GRID ARRAY:
            var tmpArray = [];
            var tmpGrid;
            this.getGridArrays = function(xPos, yPos, s) {
                tmpX = mathFloor(xPos / tmpS);
                tmpY = mathFloor(yPos / tmpS);
                tmpArray.length = 0;
                try {
                    if (this.grids[tmpX + "_" + tmpY]) {
                        tmpArray.push(this.grids[tmpX + "_" + tmpY]);
                    }
                    if (xPos + s >= (tmpX + 1) * tmpS) { // RIGHT
                        tmpGrid = this.grids[(tmpX + 1) + "_" + tmpY];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                        if (tmpY && yPos - s <= tmpY * tmpS) { // TOP RIGHT
                            tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY - 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM RIGHT
                            tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY + 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        }
                    } if (tmpX && xPos - s <= tmpX * tmpS) { // LEFT
                        tmpGrid = this.grids[(tmpX - 1) + "_" + tmpY];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                        if (tmpY && yPos - s <= tmpY * tmpS) { // TOP LEFT
                            tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY - 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM LEFT
                            tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY + 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        }
                    } if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM
                        tmpGrid = this.grids[tmpX + "_" + (tmpY + 1)];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                    } if (tmpY && yPos - s <= tmpY * tmpS) { // TOP
                        tmpGrid = this.grids[tmpX + "_" + (tmpY - 1)];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                    }
                } catch (e) {}
                return tmpArray;
            };
            // ADD NEW:
            var tmpObj;
            this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                tmpObj = null;
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].sid == sid) {
                        tmpObj = gameObjects[i];
                        break;
                    }
                } if (!tmpObj) {
                    for (var ip = 0; ip < gameObjects.length; ++ip) {
                        if (!gameObjects[ip].active) {
                            tmpObj = gameObjects[ip];
                            break;
                        }
                    }
                } if (!tmpObj) {
                    tmpObj = new GameObject(sid);
                    gameObjects.push(tmpObj);
                }
                if (setSID)
                    tmpObj.sid = sid;
                tmpObj.init(x, y, dir, s, type, data, owner);
                if (server) {
                    this.setObjectGrids(tmpObj);
                    if (tmpObj.doUpdate)
                        this.updateObjects.push(tmpObj);
                }
            };
            // DISABLE BY SID:
            this.disableBySid = function(sid) {
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].sid == sid) {
                        this.disableObj(gameObjects[i]);
                        break;
                    }
                }
            };
            // REMOVE ALL FROM PLAYER:
            this.removeAllItems = function(sid, server) {
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].active && gameObjects[i].owner && gameObjects[i].owner.sid == sid) {
                        this.disableObj(gameObjects[i]);
                    }
                }
                if (server) {
                    server.broadcast("13", sid);
                }
            };
            // FETCH SPAWN OBJECT:
            this.fetchSpawnObj = function(sid) {
                var tmpLoc = null;
                for (var i = 0; i < gameObjects.length; ++i) {
                    tmpObj = gameObjects[i];
                    if (tmpObj.active && tmpObj.owner && tmpObj.owner.sid == sid && tmpObj.spawnPoint) {
                        tmpLoc = [tmpObj.x, tmpObj.y];
                        this.disableObj(tmpObj);
                        server.broadcast("12", tmpObj.sid);
                        if (tmpObj.owner) {
                            tmpObj.owner.changeItemCount(tmpObj.group.id, -1);
                        }
                        break;
                    }
                }
                return tmpLoc;
            };
            // CHECK IF PLACABLE:
            this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                for (var i = 0; i < gameObjects.length; ++i) {
                    var blockS = (gameObjects[i].blocker?
                                  gameObjects[i].blocker:gameObjects[i].getScale(sM, gameObjects[i].isItem));
                    if (gameObjects[i].active && UTILS.getDistance(x, y, gameObjects[i].x,
                                                                   gameObjects[i].y) < (s + blockS))
                        return false;
                } if (!ignoreWater && indx != 18 && y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <=
                      (config.mapScale / 2) + (config.riverWidth / 2)) {
                    return false;
                }
                return true;
            };
            // ADD PROJECTILE:
            this.addProjectile = function(x, y, dir, range, indx) {
                var tmpData = items.projectiles[indx];
                var tmpProj;
                for (var i = 0; i < projectiles.length; ++i) {
                    if (!projectiles[i].active) {
                        tmpProj = projectiles[i];
                        break;
                    }
                }
                if (!tmpProj) {
                    tmpProj = new Projectile(players, UTILS);
                    projectiles.push(tmpProj);
                }
                tmpProj.init(indx, x, y, dir, tmpData.speed, range, tmpData.scale);
            };
            // CHECK PLAYER COLLISION:
            this.checkCollision = function(player, other, delta) {
                delta = delta||1;
                var dx = player.x - other.x;
                var dy = player.y - other.y;
                var tmpLen = player.scale + other.scale;
                if (mathABS(dx) <= tmpLen || mathABS(dy) <= tmpLen) {
                    tmpLen = player.scale + (other.getScale ? other.getScale() : other.scale);
                    var tmpInt = mathSQRT(dx * dx + dy * dy) - tmpLen;
                    if (tmpInt <= 0) {
                        var tmpDir = UTILS.getDirection(player.x, player.y, other.x, other.y);
                        var tmpDist = UTILS.getDistance(player.x, player.y, other.x, other.y);
                        if (other.isPlayer) {
                            tmpInt = (tmpInt * -1) / 2;
                            player.x += (tmpInt * mathCOS(tmpDir));
                            player.y += (tmpInt * mathSIN(tmpDir));
                            other.x -= (tmpInt * mathCOS(tmpDir));
                            other.y -= (tmpInt * mathSIN(tmpDir));
                        } else {
                            player.x = other.x + (tmpLen * mathCOS(tmpDir));
                            player.y = other.y + (tmpLen * mathSIN(tmpDir));
                            player.xVel *= 0.75;
                            player.yVel *= 0.75;
                        }
                        return true;
                    }
                }
                return false;
            };
          }
        };
        this.objectManager = new this.ObjectManager(this.gameObject, this.gameObjects, this.UTILS, this.configs);
        // ITEMS
        this.items = new (class {
            constructor () {
                // ITEM GROUPS:
                this.groups = [{
                    id: 0,
                    name: "food",
                    layer: 0
                }, {
                    id: 1,
                    name: "walls",
                    place: true,
                    limit: 30,
                    layer: 0
                }, {
                    id: 2,
                    name: "spikes",
                    place: true,
                    limit: 15,
                    layer: 0
                }, {
                    id: 3,
                    name: "mill",
                    place: true,
                    limit: 7,
                    layer: 1
                }, {
                    id: 4,
                    name: "mine",
                    place: true,
                    limit: 1,
                    layer: 0
                }, {
                    id: 5,
                    name: "trap",
                    place: true,
                    limit: 6,
                    layer: -1
                }, {
                    id: 6,
                    name: "booster",
                    place: true,
                    limit: 12,
                    layer: -1
                }, {
                    id: 7,
                    name: "turret",
                    place: true,
                    limit: 2,
                    layer: 1
                }, {
                    id: 8,
                    name: "watchtower",
                    place: true,
                    limit: 12,
                    layer: 1
                }, {
                    id: 9,
                    name: "buff",
                    place: true,
                    limit: 4,
                    layer: -1
                }, {
                    id: 10,
                    name: "spawn",
                    place: true,
                    limit: 1,
                    layer: -1
                }, {
                    id: 11,
                    name: "sapling",
                    place: true,
                    limit: 2,
                    layer: 0
                }, {
                    id: 12,
                    name: "blocker",
                    place: true,
                    limit: 3,
                    layer: -1
                }, {
                    id: 13,
                    name: "teleporter",
                    place: true,
                    limit: 2,
                    layer: -1
                }];

                // PROJECTILES:
                this.projectiles = [{
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 25,
                    speed: 1.6,
                    scale: 103,
                    range: 1000
                }, {
                    indx: 1,
                    layer: 1,
                    dmg: 25,
                    scale: 20
                }, {
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 35,
                    speed: 2.5,
                    scale: 103,
                    range: 1200
                }, {
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 30,
                    speed: 2,
                    scale: 103,
                    range: 1200
                }, {
                    indx: 1,
                    layer: 1,
                    dmg: 16,
                    scale: 20
                }, {
                    indx: 0,
                    layer: 0,
                    src: "bullet_1",
                    dmg: 50,
                    speed: 3.6,
                    scale: 160,
                    range: 1400
                }];

                // WEAPONS:
                this.weapons = [{
                    id: 0,
                    type: 0,
                    name: "tool hammer",
                    desc: "tool for gathering all resources",
                    src: "hammer_1",
                    length: 140,
                    width: 140,
                    xOff: -3,
                    yOff: 30,
                    dmg: 25,
                    range: 65,
                    gather: 1,
                    speed: 300
                }, {
                    id: 1,
                    type: 0,
                    age: 2,
                    name: "hand axe",
                    desc: "gathers resources at a higher rate",
                    src: "axe_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 30,
                    spdMult: 1,
                    range: 70,
                    gather: 2,
                    speed: 400
                }, {
                    id: 2,
                    type: 0,
                    age: 8,
                    name: "great axe",
                    desc: "deal more damage and gather more resources",
                    src: "great_axe_1",
                    length: 140,
                    width: 140,
                    xOff: -8,
                    yOff: 25,
                    dmg: 35,
                    spdMult: 1,
                    range: 75,
                    gather: 4,
                    speed: 400
                }, {
                    id: 3,
                    type: 0,
                    age: 2,
                    name: "short sword",
                    desc: "increased attack power but slower move speed",
                    src: "sword_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 46,
                    dmg: 35,
                    spdMult: 0.85,
                    range: 110,
                    gather: 1,
                    speed: 300
                }, {
                    id: 4,
                    type: 0,
                    age: 8,
                    name: "katana",
                    desc: "greater range and damage",
                    src: "samurai_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 59,
                    dmg: 40,
                    spdMult: 0.8,
                    range: 118,
                    gather: 1,
                    speed: 300
                }, {
                    id: 5,
                    type: 0,
                    age: 2,
                    name: "polearm",
                    desc: "long range melee weapon",
                    src: "spear_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 45,
                    knock: 0.2,
                    spdMult: 0.82,
                    range: 142,
                    gather: 1,
                    speed: 700
                }, {
                    id: 6,
                    type: 0,
                    age: 2,
                    name: "bat",
                    desc: "fast long range melee weapon",
                    src: "bat_1",
                    iPad: 1.3,
                    length: 110,
                    width: 180,
                    xOff: -8,
                    yOff: 53,
                    dmg: 20,
                    knock: 0.7,
                    range: 110,
                    gather: 1,
                    speed: 300
                }, {
                    id: 7,
                    type: 0,
                    age: 2,
                    name: "daggers",
                    desc: "really fast short range weapon",
                    src: "dagger_1",
                    iPad: 0.8,
                    length: 110,
                    width: 110,
                    xOff: 18,
                    yOff: 0,
                    dmg: 20,
                    knock: 0.1,
                    range: 65,
                    gather: 1,
                    hitSlow: 0.1,
                    spdMult: 1.13,
                    speed: 100
                }, {
                    id: 8,
                    type: 0,
                    age: 2,
                    name: "stick",
                    desc: "great for gathering but very weak",
                    src: "stick_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 1,
                    spdMult: 1,
                    range: 70,
                    gather: 7,
                    speed: 400
                }, {
                    id: 9,
                    type: 1,
                    age: 6,
                    name: "hunting bow",
                    desc: "bow used for ranged combat and hunting",
                    src: "bow_1",
                    req: ["wood", 4],
                    length: 120,
                    width: 120,
                    xOff: -6,
                    yOff: 0,
                    Pdmg: 25,
                    projectile: 0,
                    spdMult: 0.75,
                    speed: 600
                }, {
                    id: 10,
                    type: 1,
                    age: 6,
                    name: "great hammer",
                    desc: "hammer used for destroying structures",
                    src: "great_hammer_1",
                    length: 140,
                    width: 140,
                    xOff: -9,
                    yOff: 25,
                    dmg: 10,
                    Pdmg: 10,
                    spdMult: 0.88,
                    range: 75,
                    sDmg: 7.5,
                    gather: 1,
                    speed: 400
                }, {
                    id: 11,
                    type: 1,
                    age: 6,
                    name: "wooden shield",
                    desc: "blocks projectiles and reduces melee damage",
                    src: "shield_1",
                    length: 120,
                    width: 120,
                    Pdmg: 0,
                    shield: 0.2,
                    xOff: 6,
                    yOff: 0,
                    spdMult: 0.7
                }, {
                    id: 12,
                    type: 1,
                    age: 8,
                    name: "crossbow",
                    desc: "deals more damage and has greater range",
                    src: "crossbow_1",
                    req: ["wood", 5],
                    aboveHand: true,
                    armS: 0.75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    Pdmg: 35,
                    yOff: 0,
                    projectile: 2,
                    spdMult: 0.7,
                    speed: 700
                }, {
                    id: 13,
                    type: 1,
                    age: 9,
                    name: "repeater crossbow",
                    desc: "high firerate crossbow with reduced damage",
                    src: "crossbow_2",
                    req: ["wood", 10],
                    aboveHand: true,
                    armS: 0.75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    yOff: 0,
                    Pdmg: 30,
                    projectile: 3,
                    spdMult: 0.7,
                    speed: 230
                }, {
                    id: 14,
                    type: 1,
                    age: 6,
                    name: "mc grabby",
                    desc: "steals resources from enemies",
                    src: "grab_1",
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 0,
                    Pdmg: 0,
                    steal: 250,
                    knock: 0.2,
                    spdMult: 1.05,
                    range: 125,
                    gather: 0,
                    speed: 700
                }, {
                    id: 15,
                    type: 1,
                    age: 9,
                    name: "musket",
                    desc: "slow firerate but high damage and range",
                    src: "musket_1",
                    req: ["stone", 10],
                    aboveHand: true,
                    rec: 0.35,
                    armS: 0.6,
                    Pdmg: 50,
                    hndS: 0.3,
                    hndD: 1.6,
                    length: 205,
                    width: 205,
                    xOff: 25,
                    yOff: 0,
                    projectile: 5,
                    hideProjectile: true,
                    spdMult: 0.6,
                    speed: 1500
                }];

                // ITEMS:
                this.list = [{
                    group: this.groups[0],
                    name: "apple",
                    desc: "restores 20 health when consumed",
                    req: ["food", 10],
                    consume: function(doer) {
                        return doer.changeHealth(20, doer);
                    },
                    scale: 22,
                    holdOffset: 15,
                    healing: 20
                }, {
                    age: 3,
                    group: this.groups[0],
                    name: "cookie",
                    desc: "restores 40 health when consumed",
                    req: ["food", 15],
                    consume: function(doer) {
                        return doer.changeHealth(40, doer);
                    },
                    scale: 27,
                    holdOffset: 15,
                    healing: 40
                }, {
                    age: 7,
                    group: this.groups[0],
                    name: "cheese",
                    desc: "restores 30 health and another 50 over 5 seconds",
                    req: ["food", 25],
                    consume: function(doer) {
                        if (doer.changeHealth(30, doer) || doer.health < 100) {
                            doer.dmgOverTime.dmg = -10;
                            doer.dmgOverTime.doer = doer;
                            doer.dmgOverTime.time = 5;
                            return true;
                        }
                        return false;
                    },
                    scale: 27,
                    holdOffset: 15,
                    healing: 30
                }, {
                    group: this.groups[1],
                    name: "wood wall",
                    desc: "provides protection for your village",
                    req: ["wood", 10],
                    projDmg: true,
                    health: 380,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 3,
                    group: this.groups[1],
                    name: "stone wall",
                    desc: "provides improved protection for your village",
                    req: ["stone", 25],
                    health: 900,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[1],
                    name: "castle wall",
                    desc: "provides powerful protection for your village",
                    req: ["stone", 35],
                    health: 1500,
                    scale: 52,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    group: this.groups[2],
                    name: "spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 20, "stone", 5],
                    health: 400,
                    dmg: 20,
                    scale: 49,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 5,
                    group: this.groups[2],
                    name: "greater spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 30, "stone", 10],
                    health: 500,
                    dmg: 35,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 9,
                    group: this.groups[2],
                    name: "poison spikes",
                    desc: "poisons enemies when they touch them",
                    req: ["wood", 35, "stone", 15],
                    health: 600,
                    dmg: 30,
                    pDmg: 5,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 9,
                    group: this.groups[2],
                    name: "spinning spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 30, "stone", 20],
                    health: 500,
                    dmg: 45,
                    turnSpeed: 0.001,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    group: this.groups[3],
                    name: "windmill",
                    desc: "generates gold over time",
                    req: ["wood", 50, "stone", 10],
                    health: 400,
                    pps: 1,
                    turnSpeed: 0,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 5,
                    group: this.groups[3],
                    name: "faster windmill",
                    desc: "generates more gold over time",
                    req: ["wood", 60, "stone", 20],
                    health: 500,
                    pps: 1.5,
                    turnSpeed: 0,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 47,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 8,
                    group: this.groups[3],
                    name: "power mill",
                    desc: "generates more gold over time",
                    req: ["wood", 100, "stone", 50],
                    health: 800,
                    pps: 2,
                    turnSpeed: 0,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 47,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 5,
                    group: this.groups[4],
                    type: 2,
                    name: "mine",
                    desc: "allows you to mine stone",
                    req: ["wood", 20, "stone", 100],
                    iconLineMult: 12,
                    scale: 65,
                    holdOffset: 20,
                    placeOffset: 0
                }, {
                    age: 5,
                    group: this.groups[11],
                    type: 0,
                    name: "sapling",
                    desc: "allows you to farm wood",
                    req: ["wood", 150],
                    iconLineMult: 12,
                    colDiv: 0.5,
                    scale: 110,
                    holdOffset: 50,
                    placeOffset: -15
                }, {
                    age: 4,
                    group: this.groups[5],
                    name: "pit trap",
                    desc: "pit that traps enemies if they walk over it",
                    req: ["wood", 30, "stone", 30],
                    trap: true,
                    ignoreCollision: true,
                    hideFromEnemy: true,
                    health: 500,
                    colDiv: 0.2,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 4,
                    group: this.groups[6],
                    name: "boost pad",
                    desc: "provides boost when stepped on",
                    req: ["stone", 20, "wood", 5],
                    ignoreCollision: true,
                    boostSpeed: 1.5,
                    health: 150,
                    colDiv: 0.7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[7],
                    doUpdate: true,
                    name: "turret",
                    desc: "defensive structure that shoots at enemies",
                    req: ["wood", 200, "stone", 150],
                    health: 800,
                    projectile: 1,
                    shootRange: 700,
                    shootRate: 2200,
                    scale: 43,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[8],
                    name: "platform",
                    desc: "platform to shoot over walls and cross over water",
                    req: ["wood", 20],
                    ignoreCollision: true,
                    zIndex: 1,
                    health: 300,
                    scale: 43,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[9],
                    name: "healing pad",
                    desc: "standing on it will slowly heal you",
                    req: ["wood", 30, "food", 10],
                    ignoreCollision: true,
                    healCol: 15,
                    health: 400,
                    colDiv: 0.7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 9,
                    group: this.groups[10],
                    name: "spawn pad",
                    desc: "you will spawn here when you die but it will dissapear",
                    req: ["wood", 100, "stone", 100],
                    health: 400,
                    ignoreCollision: true,
                    spawnPoint: true,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[12],
                    name: "blocker",
                    desc: "blocks building in radius",
                    req: ["wood", 30, "stone", 25],
                    ignoreCollision: true,
                    blocker: 300,
                    health: 400,
                    colDiv: 0.7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: this.groups[13],
                    name: "teleporter",
                    desc: "teleports you to a random point on the map",
                    req: ["wood", 60, "stone", 60],
                    ignoreCollision: true,
                    teleport: true,
                    health: 200,
                    colDiv: 0.7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }];

                // ASSIGN IDS:
                for (var i = 0; i < this.list.length; ++i) {
                    this.list[i].id = i;
                    if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                }
            }
        })();
        // STORE
        this.store = new (class {
            constructor () {
                // STORE HATS:
                this.hats = [{
                    id: 45,
                    name: "Shame!",
                    dontSell: true,
                    price: 0,
                    scale: 120,
                    desc: "hacks are for losers"
                }, {
                    id: 51,
                    name: "Moo Cap",
                    price: 0,
                    scale: 120,
                    desc: "coolest mooer around"
                }, {
                    id: 50,
                    name: "Apple Cap",
                    price: 0,
                    scale: 120,
                    desc: "apple farms remembers"
                }, {
                    id: 28,
                    name: "Moo Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 29,
                    name: "Pig Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 30,
                    name: "Fluff Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 36,
                    name: "Pandou Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 37,
                    name: "Bear Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 38,
                    name: "Monkey Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 44,
                    name: "Polar Head",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 35,
                    name: "Fez Hat",
                    price: 0,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 42,
                    name: "Enigma Hat",
                    price: 0,
                    scale: 120,
                    desc: "join the enigma army"
                }, {
                    id: 43,
                    name: "Blitz Hat",
                    price: 0,
                    scale: 120,
                    desc: "hey everybody i'm blitz"
                }, {
                    id: 49,
                    name: "Bob XIII Hat",
                    price: 0,
                    scale: 120,
                    desc: "like and subscribe"
                }, {
                    id: 57,
                    name: "Pumpkin",
                    price: 50,
                    scale: 120,
                    desc: "Spooooky"
                }, {
                    id: 8,
                    name: "Bummle Hat",
                    price: 100,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 2,
                    name: "Straw Hat",
                    price: 500,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 15,
                    name: "Winter Cap",
                    price: 600,
                    scale: 120,
                    desc: "allows you to move at normal speed in snow",
                    coldM: 1
                }, {
                    id: 5,
                    name: "Cowboy Hat",
                    price: 1000,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 4,
                    name: "Ranger Hat",
                    price: 2000,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 18,
                    name: "Explorer Hat",
                    price: 2000,
                    scale: 120,
                    desc: "no effect"
                }, {
                    id: 31,
                    name: "Flipper Hat",
                    price: 2500,
                    scale: 120,
                    desc: "have more control while in water",
                    watrImm: true
                }, {
                    id: 1,
                    name: "Marksman Cap",
                    price: 3000,
                    scale: 120,
                    desc: "increases arrow speed and range",
                    aMlt: 1.3
                }, {
                    id: 10,
                    name: "Bush Gear",
                    price: 3000,
                    scale: 160,
                    desc: "allows you to disguise yourself as a bush"
                }, {
                    id: 48,
                    name: "Halo",
                    price: 3000,
                    scale: 120,
                    desc: "You found an easter egg!"
                }, {
                    id: 6,
                    name: "Soldier Helmet",
                    price: 4000,
                    scale: 120,
                    desc: "reduces damage taken but slows movement",
                    spdMult: 0.94,
                    dmgMult: 0.75
                }, {
                    id: 23,
                    name: "Anti Venom Gear",
                    price: 4000,
                    scale: 120,
                    desc: "makes you immune to poison",
                    poisonRes: 1
                }, {
                    id: 13,
                    name: "Medic Gear",
                    price: 5000,
                    scale: 110,
                    desc: "slowly regenerates health over time",
                    healthRegen: 3
                }, {
                    id: 9,
                    name: "Miners Helmet",
                    price: 5000,
                    scale: 120,
                    desc: "earn 1 extra gold per resource",
                    extraGold: 1
                }, {
                    id: 32,
                    name: "Musketeer Hat",
                    price: 5000,
                    scale: 120,
                    desc: "reduces cost of projectiles",
                    projCost: 0.5
                }, {
                    id: 7,
                    name: "Bull Helmet",
                    price: 6000,
                    scale: 120,
                    desc: "increases damage done but drains health",
                    healthRegen: -5,
                    dmgMultO: 1.5,
                    spdMult: 0.96
                }, {
                    id: 22,
                    name: "Emp Helmet",
                    price: 6000,
                    scale: 120,
                    desc: "turrets won't attack but you move slower",
                    antiTurret: 1,
                    spdMult: 0.7
                }, {
                    id: 12,
                    name: "Booster Hat",
                    price: 6000,
                    scale: 120,
                    desc: "increases your movement speed",
                    spdMult: 1.16
                }, {
                    id: 26,
                    name: "Barbarian Armor",
                    price: 8000,
                    scale: 120,
                    desc: "knocks back enemies that attack you",
                    dmgK: 0.6
                }, {
                    id: 21,
                    name: "Plague Mask",
                    price: 10000,
                    scale: 120,
                    desc: "melee attacks deal poison damage",
                    poisonDmg: 5,
                    poisonTime: 6
                }, {
                    id: 46,
                    name: "Bull Mask",
                    price: 10000,
                    scale: 120,
                    desc: "bulls won't target you unless you attack them",
                    bullRepel: 1
                }, {
                    id: 14,
                    name: "Windmill Hat",
                    topSprite: true,
                    price: 10000,
                    scale: 120,
                    desc: "generates points while worn",
                    pps: 1.5
                }, {
                    id: 11,
                    name: "Spike Gear",
                    topSprite: true,
                    price: 10000,
                    scale: 120,
                    desc: "deal damage to players that damage you",
                    dmg: 0.45
                }, {
                    id: 53,
                    name: "Turret Gear",
                    topSprite: true,
                    price: 10000,
                    scale: 120,
                    desc: "you become a walking turret",
                    turret: {
                        proj: 1,
                        range: 700,
                        rate: 2500
                    },
                    spdMult: 0.7
                }, {
                    id: 20,
                    name: "Samurai Armor",
                    price: 12000,
                    scale: 120,
                    desc: "increased attack speed and fire rate",
                    atkSpd: 0.78
                }, {
                    id: 58,
                    name: "Dark Knight",
                    price: 12000,
                    scale: 120,
                    desc: "restores health when you deal damage",
                    healD: 0.4
                }, {
                    id: 27,
                    name: "Scavenger Gear",
                    price: 15000,
                    scale: 120,
                    desc: "earn double points for each kill",
                    kScrM: 2
                }, {
                    id: 40,
                    name: "Tank Gear",
                    price: 15000,
                    scale: 120,
                    desc: "increased damage to buildings but slower movement",
                    spdMult: 0.3,
                    bDmg: 3.3
                }, {
                    id: 52,
                    name: "Thief Gear",
                    price: 15000,
                    scale: 120,
                    desc: "steal half of a players gold when you kill them",
                    goldSteal: 0.5
                }, {
                    id: 55,
                    name: "Bloodthirster",
                    price: 20000,
                    scale: 120,
                    desc: "Restore Health when dealing damage. And increased damage",
                    healD: 0.25,
                    dmgMultO: 1.2,
                }, {
                    id: 56,
                    name: "Assassin Gear",
                    price: 20000,
                    scale: 120,
                    desc: "Go invisible when not moving. Can't eat. Increased speed",
                    noEat: true,
                    spdMult: 1.1,
                    invisTimer: 1000
                }];

                // STORE ACCESSORIES:
                this.accessories = [{
                    id: 12,
                    name: "Snowball",
                    price: 1000,
                    scale: 105,
                    xOff: 18,
                    desc: "no effect"
                }, {
                    id: 9,
                    name: "Tree Cape",
                    price: 1000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 10,
                    name: "Stone Cape",
                    price: 1000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 3,
                    name: "Cookie Cape",
                    price: 1500,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 8,
                    name: "Cow Cape",
                    price: 2000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 11,
                    name: "Monkey Tail",
                    price: 2000,
                    scale: 97,
                    xOff: 25,
                    desc: "Super speed but reduced damage",
                    spdMult: 1.35,
                    dmgMultO: 0.2
                }, {
                    id: 17,
                    name: "Apple Basket",
                    price: 3000,
                    scale: 80,
                    xOff: 12,
                    desc: "slowly regenerates health over time",
                    healthRegen: 1
                }, {
                    id: 6,
                    name: "Winter Cape",
                    price: 3000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 4,
                    name: "Skull Cape",
                    price: 4000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 5,
                    name: "Dash Cape",
                    price: 5000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 2,
                    name: "Dragon Cape",
                    price: 6000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 1,
                    name: "Super Cape",
                    price: 8000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 7,
                    name: "Troll Cape",
                    price: 8000,
                    scale: 90,
                    desc: "no effect"
                }, {
                    id: 14,
                    name: "Thorns",
                    price: 10000,
                    scale: 115,
                    xOff: 20,
                    desc: "no effect"
                }, {
                    id: 15,
                    name: "Blockades",
                    price: 10000,
                    scale: 95,
                    xOff: 15,
                    desc: "no effect"
                }, {
                    id: 20,
                    name: "Devils Tail",
                    price: 10000,
                    scale: 95,
                    xOff: 20,
                    desc: "no effect"
                }, {
                    id: 16,
                    name: "Sawblade",
                    price: 12000,
                    scale: 90,
                    spin: true,
                    xOff: 0,
                    desc: "deal damage to players that damage you",
                    dmg: 0.15
                }, {
                    id: 13,
                    name: "Angel Wings",
                    price: 15000,
                    scale: 138,
                    xOff: 22,
                    desc: "slowly regenerates health over time",
                    healthRegen: 3
                }, {
                    id: 19,
                    name: "Shadow Wings",
                    price: 15000,
                    scale: 138,
                    xOff: 22,
                    desc: "increased movement speed",
                    spdMult: 1.1
                }, {
                    id: 18,
                    name: "Blood Wings",
                    price: 20000,
                    scale: 178,
                    xOff: 26,
                    desc: "restores health when you deal damage",
                    healD: 0.2
                }, {
                    id: 21,
                    name: "Corrupt X Wings",
                    price: 20000,
                    scale: 178,
                    xOff: 26,
                    desc: "deal damage to players that damage you",
                    dmg: 0.25
                }];
            }
        })();
        // PROJECTILE
        this.projectile = class {
            constructor (players, ais, objectManager, items, config, UTILS, server) {
                // UPDATE:
                var objectsHit = [];
                var tmpObj;
                this.update = function(delta) {
                    if (this.active) {
                        var tmpSpeed = this.speed * delta;
                        var tmpScale;
                        if (!this.skipMov) {
                            this.x += tmpSpeed * Math.cos(this.dir);
                            this.y += tmpSpeed * Math.sin(this.dir);
                            this.range -= tmpSpeed;
                            if (this.range <= 0) {
                                this.x += this.range * Math.cos(this.dir);
                                this.y += this.range * Math.sin(this.dir);
                                tmpSpeed = 1;
                                this.range = 0;
                                this.active = false;
                            }
                        } else {
                            this.skipMov = false;
                        }
                        if (server) {
                            for (var i = 0; i < players.length; ++i) {
                                if (!this.sentTo[players[i].id] && players[i].canSee(this)) {
                                    this.sentTo[players[i].id] = 1;
                                    server.send(players[i].id, "18", UTILS.fixTo(this.x, 1), UTILS.fixTo(this.y, 1),
                                                UTILS.fixTo(this.dir, 2), UTILS.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid);
                                }
                            }
                            objectsHit.length = 0;
                            for (let i = 0; i < players.length + ais.length; ++i) {
                                tmpObj = players[i]||ais[i-players.length];
                                if (tmpObj.alive && tmpObj != this.owner && !(this.owner.team && tmpObj.team == this.owner.team)) {
                                    if (UTILS.lineInRect(tmpObj.x-tmpObj.scale, tmpObj.y-tmpObj.scale, tmpObj.x+tmpObj.scale,
                                                        tmpObj.y+tmpObj.scale, this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)),
                                                        this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }
                            var tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                            for (var x = 0; x < tmpList.length; ++x) {
                                for (var y = 0; y < tmpList[x].length; ++y) {
                                    tmpObj = tmpList[x][y];
                                    tmpScale = tmpObj.getScale();
                                    if (tmpObj.active && !(this.ignoreObj == tmpObj.sid) && (this.layer <= tmpObj.layer) &&
                                        objectsHit.indexOf(tmpObj) < 0 && !tmpObj.ignoreCollision && UTILS.lineInRect(tmpObj.x-tmpScale, tmpObj.y-tmpScale, tmpObj.x+tmpScale, tmpObj.y+tmpScale,
                                                                                                                    this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)), this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }

                            // HIT OBJECTS:
                            if (objectsHit.length > 0) {
                                var hitObj = null;
                                var shortDist = null;
                                var tmpDist = null;
                                for (let i = 0; i < objectsHit.length; ++i) {
                                    tmpDist = UTILS.getDistance(this.x, this.y, objectsHit[i].x, objectsHit[i].y);
                                    if (shortDist == null || tmpDist < shortDist) {
                                        shortDist = tmpDist;
                                        hitObj = objectsHit[i];
                                    }
                                }
                                if (hitObj.isPlayer || hitObj.isAI) {
                                    var tmpSd = 0.3 * (hitObj.weightM||1);
                                    hitObj.xVel += tmpSd * Math.cos(this.dir);
                                    hitObj.yVel += tmpSd * Math.sin(this.dir);
                                    if (hitObj.weaponIndex == undefined || (!(items.weapons[hitObj.weaponIndex].shield &&
                                                                            UTILS.getAngleDist(this.dir+Math.PI, hitObj.dir) <= config.shieldAngle))) {
                                        hitObj.changeHealth(-this.dmg, this.owner, this.owner);
                                    }
                                } else {
                                    if (hitObj.projDmg && hitObj.health && hitObj.changeHealth(-this.dmg)) {
                                        objectManager.disableObj(hitObj);
                                    }
                                    for (let i = 0; i < players.length; ++i) {
                                        if (players[i].active) {
                                            if (hitObj.sentTo[players[i].id]) {
                                                if (hitObj.active) {
                                                    if (players[i].canSee(hitObj))
                                                        server.send(players[i].id, "8", UTILS.fixTo(this.dir, 2), hitObj.sid);
                                                } else {
                                                    server.send(players[i].id, "12", hitObj.sid);
                                                }
                                            }
                                            if (!hitObj.active && hitObj.owner == players[i])
                                                players[i].changeItemCount(hitObj.group.id, -1);
                                        }

                                    }
                                }
                                this.active = false;
                                for (let i = 0; i < players.length; ++i) {
                                    if (this.sentTo[players[i].id])
                                        server.send(players[i].id, "19", this.sid, UTILS.fixTo(shortDist, 1));
                                }
                            }
                        }
                    }
                };
            }
            init (indx, x, y, dir, spd, dmg, rng, scl, owner) {
                this.active = true;
                this.indx = indx;
                this.x = x;
                this.y = y;
                this.dir = dir;
                this.skipMov = true;
                this.speed = spd;
                this.dmg = dmg;
                this.scale = scl;
                this.range = rng;
                this.owner = owner;
                if (server) {
                    this.sentTo = {};
                }
            }
        };
        // PROJECTILE MANAGER
        this.projectileManager = new (class {
            constructor (Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
                    var tmpData = items.projectiles[indx];
                    var tmpProj;
                    for (var i = 0; i < projectiles.length; ++i) {
                        if (!projectiles[i].active) {
                            tmpProj = projectiles[i];
                            break;
                        }
                    } if (!tmpProj) {
                        tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                        tmpProj.sid = projectiles.length;
                        projectiles.push(tmpProj);
                    }
                    tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                    tmpProj.ignoreObj = ignoreObj;
                    tmpProj.layer = layer||tmpData.layer;
                    tmpProj.src = tmpData.src;
                    return tmpProj;
                };
            }
        })(
            this.projectile,
            this.projectiles,
            this.players,
            this.ais,
            this.objectManager,
            this.items,
            this.configs,
            this.UTILS
        );
        // PLAYER
        this.Player = class {
            constructor (id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                var mathABS = Math.abs;
                var mathCOS = Math.cos;
                var mathSIN = Math.sin;
                var mathPOW = Math.pow;
                var mathSQRT = Math.sqrt;

                this.id = id;
                this.sid = sid;
                this.tmpScore = 0;
                this.team = null;
                this.skinIndex = 0;
                this.tailIndex = 0;
                this.hitTime = 0;
                this.tails = {};
                // MOHMOH ALL ITEMS
                for (var i = 0; i < accessories.length; ++i) {
                    this.tails[accessories[i].id] = 1;
                }
                this.skins = {};
                for (var j = 0; j < hats.length; ++j) {
                    this.skins[hats[j].id] = 1;
                }
                this.points = 0;
                this.dt = 0;
                this.rt = 0;
                this.hidden = false;
                this.itemCounts = {};
                this.isPlayer = true;
                this.pps = 0;
                this.moveDir = undefined;
                this.skinRot = 0;
                this.lastPing = 0;
                this.iconIndex = 0;
                this.skinColor = 0;

                // SPAWN:
                this.spawn = function(moofoll) {
                    this.active = true;
                    this.alive = true;
                    /***/
                    this.kkills = {};
                    this.shameGained = 0;
                    this.shameReset = -1;
                    this.lastShame = 0;
                    this.srInsta = false;
                    this.autoQ = false;
                    this.harmCount = 0;
                    /***/
                    this.lockMove = false;
                    this.lockDir = false;
                    this.minimapCounter = 0;
                    this.chatCountdown = 0;
                    this.chatAlpha = 1;
                    this.chatStart = {};
                    this.chatPos = {};
                    this.oldX = 0;
                    this.oldY = 0;
                    this.shameCount = 0;
                    this.maxShame = 7;
                    this.shameTimer = 0;
                    this.aim2 = 0;
                    this.handPos = {
                        x: 35,
                        y: 0
                    };
                    this.weaponPos = {
                        x: 35,
                        y: 0
                    };
                    this.dist2 = 0;
                    this.sentTo = {};
                    this.bTick = 0;
                    this.gathering = 0;
                    this.opacity = 0;
                    this.shooting = {};
                    this.campingR = false;
                    this.shootIndex = undefined;
                    this.bowThreat = {
                        9: 0,
                        12: 0,
                        13: 0,
                        15: 0,
                    };
                    this.autoGather = 0;
                    this.animTime = 0;
                    this.animSpeed = 0;
                    this.mouseState = 0;
                    this.buildIndex = -1;
                    this.weaponIndex = 0;
                    this.dmgOverTime = {};
                    this.noMovTimer = 0;
                    this.maxXP = 300;
                    this.XP = 0;
                    this.age = 1;
                    this.kills = 0;
                    this.upgrAge = 2;
                    this.upgradePoints = 0;
                    this.x = 0;
                    this.y = 0;
                    this.zIndex = 0;
                    this.xVel = 0;
                    this.yVel = 0;
                    this.slowMult = 1;
                    this.dir = 0;
                    this.dirPlus = 0;
                    this.targetDir = 0;
                    this.targetAngle = 0;
                    this.maxHealth = 100;
                    this.health = this.maxHealth;
                    this.healthMov = 100;
                    this.scale = config.playerScale;
                    this.speed = config.playerSpeed;
                    this.resetMoveDir();
                    this.resetResources(moofoll);
                    this.items = [0, 3, 6, 10];
                    this.weapons = [0];
                    this.inTrap = null;
                    this.shootCount = 0;
                    this.maxSpeed = 1;
                    this.primaryVariant = undefined;
                    this.secondaryVariant = undefined;
                    this.syncThreats = 0;
                    this.syncers = [];
                    this.weaponXP = [];
                    this.variants = [];
                    this.reloads = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                        12: 0,
                        13: 0,
                        14: 0,
                        15: 0,
                        53: 0,
                    };
                    this.oldReloads = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                        12: 0,
                        13: 0,
                        14: 0,
                        15: 0,
                        53: 0,
                    };
                    new Array(16).fill(0).forEach(() => this.variants.push(config.weaponVariants[0]));
                };

                // RESET MOVE DIR:
                this.resetMoveDir = function() {
                    this.moveDir = undefined;
                };
                // RESET RESOURCES:
                this.resetResources = function(moofoll) {
                    for (var i = 0; i < config.resourceTypes.length; ++i) {
                        this[config.resourceTypes[i]] = moofoll?100:0;
                    }
                };
                // ADD ITEM:
                this.addItem = function(id) {
                    var tmpItem = items.list[id];
                    if (tmpItem) {
                        for (var i = 0; i < this.items.length; ++i) {
                            if (items.list[this.items[i]].group == tmpItem.group) {
                                if (this.buildIndex == this.items[i])
                                    this.buildIndex = id;
                                this.items[i] = id;
                                return true;
                            }
                        }
                        this.items.push(id);
                        return true;
                    }
                    return false;
                };
                // SET USER DATA:
                this.setUserData = function(data) {
                    if (data) {
                        // SET INITIAL NAME:
                        this.name = "unknown";
                        // VALIDATE NAME:
                        var name = data.name + "";
                        name = name.slice(0, config.maxNameLength);
                        name = name.replace(/[^\w:\(\)\/? -]+/gmi, " "); // USE SPACE SO WE CAN CHECK PROFANITY naw
                        name = name.replace(/[^\x00-\x7F]/g, " ");
                        name = name.trim();
                        if (name.length > 0) { // !isProfane
                            this.name = name;
                        }
                        // SKIN:
                        this.skinColor = 0;
                        if (config.skinColors[data.skin]) {
                            this.skinColor = data.skin;
                        }
                    }
                };
                // GET DATA TO SEND:
                this.getData = function() {
                    return [
                        this.id,
                        this.sid,
                        this.name,
                        UTILS.fixTo(this.x, 2),
                        UTILS.fixTo(this.y, 2),
                        UTILS.fixTo(this.dir, 3),
                        this.health,
                        this.maxHealth,
                        this.scale,
                        this.skinColor
                    ];
                };
                // SET DATA:
                this.setData = function(data) {
                    this.id = data[0];
                    this.sid = data[1];
                    this.name = data[2];
                    this.x = data[3];
                    this.y = data[4];
                    this.dir = data[5];
                    this.health = data[6];
                    this.maxHealth = data[7];
                    this.scale = data[8];
                    this.skinColor = data[9];
                };
                // UPDATE:
                var timerCount = 0;
                this.update = function(delta) {
                    if (!this.alive) return;
                    // SHAME SHAME SHAME:
                    if (this.shameTimer > 0) {
                        this.shameTimer -= delta;
                        if (this.shameTimer <= 0) {
                            this.shameTimer = 0;
                            this.shameCount = 0;
                        }
                    }
                    // REGENS AND AUTO:
                    timerCount -= delta;
                    if (timerCount <= 0) {
                        var regenAmount = (this.skin && this.skin.healthRegen?this.skin.healthRegen:0) +
                            (this.tail && this.tail.healthRegen?this.tail.healthRegen:0);
                        if (regenAmount) {
                            this.changeHealth(regenAmount, this);
                        } if (this.dmgOverTime.dmg) {
                            this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                            this.dmgOverTime.time -= 1;
                            if (this.dmgOverTime.time <= 0)
                                this.dmgOverTime.dmg = 0;
                        } if (this.healCol) {
                            this.changeHealth(this.healCol, this);
                        }
                        timerCount = 1000;
                    }
                    // CHECK KILL:
                    if (!this.alive) {
                        return;
                    }
                    // SLOWER:
                    if (this.slowMult < 1) {
                        this.slowMult += 0.0008 * delta;
                        if (this.slowMult > 1)
                            this.slowMult = 1;
                    }
                    // MOVE:
                    this.noMovTimer += delta;
                    if (this.xVel || this.yVel) this.noMovTimer = 0;
                    if (this.lockMove) {
                        this.xVel = 0;
                        this.yVel = 0;
                    } else {
                        var spdMult = ((this.buildIndex>=0)?0.5:1) * (items.weapons[this.weaponIndex].spdMult||1) *
                            (this.skin?(this.skin.spdMult||1):1) * (this.tail?(this.tail.spdMult||1):1) * (this.y<=config.snowBiomeTop?
                                                                                                        ((this.skin&&this.skin.coldM)?1:config.snowSpeed):1) * this.slowMult;
                        if (!this.zIndex && this.y >= (config.mapScale / 2) - (config.riverWidth / 2) &&
                            this.y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
                            if (this.skin && this.skin.watrImm) {
                                spdMult *= 0.75;
                                this.xVel += config.waterCurrent * 0.4 * delta;
                            } else {
                                spdMult *= 0.33;
                                this.xVel += config.waterCurrent * delta;
                            }
                        }
                        this.maxSpeed = spdMult;
                        var xVel = (this.moveDir!=undefined)?mathCOS(this.moveDir):0;
                        var yVel = (this.moveDir!=undefined)?mathSIN(this.moveDir):0;
                        var length = mathSQRT(xVel * xVel + yVel * yVel);
                        if (length != 0) {
                            xVel /= length;
                            yVel /= length;
                        }
                        if (true) this.xVel += xVel * this.speed * spdMult * delta; // xVel
                        if (true) this.yVel += yVel * this.speed * spdMult * delta; // yVel
                    }
                    // OBJECT COLL:
                    this.zIndex = 0;
                    this.lockMove = false;
                    this.healCol = 0;
                    var tmpList;
                    var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                    var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                    var tMlt = 1 / depth;
                    for (var i = 0; i < depth; ++i) {
                        if (this.xVel)
                            this.x += (this.xVel * delta) * tMlt;
                        if (this.yVel)
                            this.y += (this.yVel * delta) * tMlt;
                        tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                        console.log("Ee2");
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active) {
                                    objectManager.checkCollision(this, tmpList[x][y], tMlt);
                                }
                            }
                        }
                    }
                    // PLAYER COLLISIONS:
                    var tmpIndx = players.indexOf(this);
                    for (var is = tmpIndx + 1; is < players.length; ++is) {
                        if (players[is] != this && players[is].alive) {
                            objectManager.checkCollision(this, players[is]);
                        }
                    }
                    // DECEL:
                    if (this.xVel) {
                        this.xVel *= mathPOW(config.playerDecel, delta);
                        if (this.xVel <= 0.01 && this.xVel >= -0.01) this.xVel = 0;
                    } if (this.yVel) {
                        this.yVel *= mathPOW(config.playerDecel, delta);
                        if (this.yVel <= 0.01 && this.yVel >= -0.01) this.yVel = 0;
                    }
                    // MAP BOUNDARIES:
                    if (this.x - this.scale < 0) {
                        this.x = this.scale;
                    } else if (this.x + this.scale > config.mapScale) {
                        this.x = config.mapScale - this.scale;
                    } if (this.y - this.scale < 0) {
                        this.y = this.scale;
                    } else if (this.y + this.scale > config.mapScale) {
                        this.y = config.mapScale - this.scale;
                    }
                    // USE WEAPON OR TOOL:
                    if (this.buildIndex < 0) {
                        if (this.reloads[this.weaponIndex] > 0) {
                            this.reloads[this.weaponIndex] -= delta;
                            this.gathering = this.mouseState;
                        } else if (this.gathering || this.autoGather) {
                            var worked = true;
                            if (items.weapons[this.weaponIndex].gather != undefined) {
                                this.gather(players);
                            } else if (items.weapons[this.weaponIndex].projectile != undefined &&
                                    this.hasRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0))) {
                                this.useRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0));
                                this.noMovTimer = 0;
                                var tmpIndx2 = items.weapons[this.weaponIndex].projectile;
                                var projOffset = this.scale * 2;
                                var aMlt = (this.skin&&this.skin.aMlt)?this.skin.aMlt:1;
                                if (items.weapons[this.weaponIndex].rec) {
                                    this.xVel -= items.weapons[this.weaponIndex].rec * mathCOS(this.dir);
                                    this.yVel -= items.weapons[this.weaponIndex].rec * mathSIN(this.dir);
                                }
                                projectileManager.addProjectile(this.x+(projOffset*mathCOS(this.dir)),
                                                                this.y+(projOffset*mathSIN(this.dir)), this.dir, items.projectiles[tmpIndx2].range*aMlt,
                                                                items.projectiles[tmpIndx2].speed*aMlt, tmpIndx2, this, null, this.zIndex);
                            } else {
                                worked = false;
                            }
                            this.gathering = this.mouseState;
                            if (worked) {
                                this.reloads[this.weaponIndex] = items.weapons[this.weaponIndex].speed*(this.skin?(this.skin.atkSpd||1):1);
                            }
                        }
                    }

                };
                // ADD WEAPON XP:
                this.addWeaponXP = function(amnt) {
                    if (!this.weaponXP[this.weaponIndex]) {
                        this.weaponXP[this.weaponIndex] = 0;
                    }
                    this.weaponXP[this.weaponIndex] += amnt;
                };
                // EARN XP:
                this.earnXP = function(amount) {
                    if (this.age < config.maxAge) {
                        this.XP += amount;
                        if (this.XP >= this.maxXP) {
                            if (this.age < config.maxAge) {
                                this.age++;
                                this.XP = 0;
                                this.maxXP *= 1.2;
                            } else {
                                this.XP = this.maxXP;
                            }
                            this.upgradePoints++;
                            server.send(this.id, "16", this.upgradePoints, this.upgrAge);
                            server.send(this.id, "15", this.XP, UTILS.fixTo(this.maxXP, 1), this.age);
                        } else {
                            server.send(this.id, "15", this.XP);
                        }
                    }
                };
                // CHANGE HEALTH:
                this.changeHealth = function(amount, doer) {
                    if (amount > 0 && this.health >= this.maxHealth)
                        return false
                    if (amount < 0 && this.skin)
                        amount *= this.skin.dmgMult||1;
                    if (amount < 0 && this.tail)
                        amount *= this.tail.dmgMult||1;
                    if (amount < 0)
                        this.hitTime = Date.now();
                    this.health += amount;
                    if (this.health > this.maxHealth) {
                        amount -= (this.health - this.maxHealth);
                        this.health = this.maxHealth;
                    }
                    if (this.health <= 0) {
                        this.kill(doer);
                    }
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id])
                            server.send(players[i].id, "h", this.sid, Math.round(this.health));
                    }
                    if (doer && doer.canSee(this) && !(doer == this && amount < 0)) {
                        server.send(doer.id, "t", Math.round(this.x),
                                    Math.round(this.y), Math.round(-amount), 1);
                    }
                    return true;
                };
                // KILL:
                this.kill = function(doer) {
                    if (doer && doer.alive) {
                        doer.kills++;
                        if (doer.kkills[this.sid]) {
                            doer.kkills[this.sid] += 1;
                        } else {
                            doer.kkills[this.sid] = 1;
                        }
                        if (doer.skin && doer.skin.goldSteal) scoreCallback(doer, Math.round(this.points / 2));
                        else scoreCallback(doer, Math.round(this.age*100*((doer.skin&&doer.skin.kScrM)?doer.skin.kScrM:1)));
                        server.send(doer.id, "9", "kills", doer.kills, 1);
                    }
                    this.alive = false;
                    server.send(this.id, "11");
                    iconCallback();
                };
                // ADD RESOURCE:
                this.addResource = function(type, amount, auto) {
                    if (!auto && amount > 0) {
                        this.addWeaponXP(amount);
                    }
                    if (type == 3) {
                        scoreCallback(this, amount, true);
                    } else {
                        this[config.resourceTypes[type]] += amount;
                        server.send(this.id, "9", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
                    }
                };
                // CHANGE ITEM COUNT:
                this.changeItemCount = function(index, value) {
                    this.itemCounts[index] = this.itemCounts[index]||0;
                    this.itemCounts[index] += value;
                    server.send(this.id, "14", index, this.itemCounts[index]);
                };
                // BUILD ITEM
                this.buildItemPosition = function(e, dir = (this.d2 || this.dir)) {
                    var t = this.scale + e.scale + (e.placeOffset || 0),
                        i = (this.x2 || this.x) + t * mathCOS(dir),
                        n = (this.y2 || this.x) + t * mathSIN(dir);
                    return {
                        x: i,
                        y: n
                    };
                }
                // BUILD:
                this.buildItem = function(item) {
                    var tmpS = (this.scale + item.scale + (item.placeOffset||0));
                    var tmpX = this.x + (tmpS * mathCOS(this.dir));
                    var tmpY = this.y + (tmpS * mathSIN(this.dir));
                    if (this.canBuild(item) && !(item.consume && (this.skin && this.skin.noEat))
                        && (item.consume || objectManager.checkItemLocation(tmpX, tmpY, item.scale,
                                                                            0.6, item.id, false, this))) {
                        var worked = false;
                        if (item.consume) {
                            if (this.hitTime) {
                                var timeSinceHit = Date.now() - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit <= 120) {
                                    this.shameCount++;
                                    if (this.shameCount >= 8) {
                                        this.shameTimer = 30000;
                                        this.shameCount = 0;
                                    }
                                } else {
                                    this.shameCount -= 2;
                                    if (this.shameCount <= 0) {
                                        this.shameCount = 0;
                                    }
                                }
                            }
                            if (this.shameTimer <= 0)
                                worked = item.consume(this);
                        } else {
                            worked = true;
                            if (item.group.limit) {
                                this.changeItemCount(item.group.id, 1);
                            }
                            if (item.pps)
                                this.pps += item.pps;
                            objectManager.add(objectManager.objects.length, tmpX, tmpY, this.dir, item.scale,
                                            item.type, item, false, this);
                        }
                        if (worked) {
                            this.useRes(item);
                            this.buildIndex = -1;
                        }
                    }
                };
                // HAS RESOURCES:
                this.hasRes = function(item, mult) {
                    for (var i = 0; i < item.req.length;) {
                        if (this[item.req[i]] < Math.round(item.req[i + 1] * (mult||1)))
                            return false;
                        i+=2;
                    }
                    return true;
                };
                // USE RESOURCES:
                this.useRes = function(item, mult) {
                    if (config.inSandbox)
                        return;
                    for (var i = 0; i < item.req.length;) {
                        this.addResource(config.resourceTypes.indexOf(item.req[i]), -Math.round(item.req[i+1]*(mult||1)));
                        i+=2;
                    }
                };
                // CAN BUILD:
                this.canBuild = function(item) {
                    if (config.inSandbox)
                        return true;
                    if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
                        return false;
                    return this.hasRes(item);
                };
                // GATHER:
                this.gather = function() {
                    // SHOW:
                    this.noMovTimer = 0;
                    // SLOW MOVEMENT:
                    this.slowMult -= (items.weapons[this.weaponIndex].hitSlow||0.3);
                    if (this.slowMult < 0)
                        this.slowMult = 0;
                    // VARIANT DMG:
                    var tmpVariant = config.fetchVariant(this);
                    var applyPoison = tmpVariant.poison;
                    var variantDmg = tmpVariant.val;
                    // CHECK IF HIT GAME OBJECT:
                    var hitObjs = {};
                    var tmpDist, tmpDir, tmpObj, hitSomething;
                    var tmpList = objectManager.getGridArrays(this.x, this.y, items.weapons[this.weaponIndex].range);
                    console.log("()HOujwbd");
                    for (var t = 0; t < tmpList.length; ++t) {
                        for (var i = 0; i < tmpList[t].length; ++i) {
                            tmpObj = tmpList[t][i];
                            if (tmpObj.active && !tmpObj.dontGather && !hitObjs[tmpObj.sid] && tmpObj.visibleToPlayer(this)) {
                                tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - tmpObj.scale;
                                if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                    tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                    if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {
                                        hitObjs[tmpObj.sid] = 1;
                                        if (tmpObj.health) {
                                            if (tmpObj.changeHealth(-items.weapons[this.weaponIndex].dmg*(variantDmg)*(items.weapons[this.weaponIndex].sDmg||1)*(this.skin&&this.skin.bDmg?this.skin.bDmg:1), this)) {
                                                for (var x = 0; x < tmpObj.req.length;) {
                                                    this.addResource(config.resourceTypes.indexOf(tmpObj.req[x]), tmpObj.req[x+1]);
                                                    x+=2;
                                                }
                                                objectManager.disableObj(tmpObj);
                                            }
                                        } else {
                                            this.earnXP(4*items.weapons[this.weaponIndex].gather);
                                            var count = items.weapons[this.weaponIndex].gather+(tmpObj.type==3?4:0);
                                            if (this.skin && this.skin.extraGold) {
                                                this.addResource(3, 1);
                                            } this.addResource(tmpObj.type, count);
                                        }
                                        hitSomething = true;
                                        objectManager.hitObj(tmpObj, tmpDir);
                                    }
                                }
                            }
                        }
                    }
                    // CHECK IF HIT PLAYER:
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i]||ais[i-players.length];
                        if (tmpObj != this && tmpObj.alive && !(tmpObj.team && tmpObj.team == this.team)) {
                            tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - (tmpObj.scale * 1.8);
                            if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {
                                    // STEAL RESOURCES:
                                    var stealCount = items.weapons[this.weaponIndex].steal;
                                    if (stealCount && tmpObj.addResource) {
                                        stealCount = Math.min((tmpObj.points||0), stealCount);
                                        this.addResource(3, stealCount);
                                        tmpObj.addResource(3, -stealCount);
                                    }
                                    // MELEE HIT PLAYER:
                                    var dmgMlt = variantDmg;
                                    if (tmpObj.weaponIndex != undefined && items.weapons[tmpObj.weaponIndex].shield &&
                                        UTILS.getAngleDist(tmpDir+Math.PI, tmpObj.dir) <= config.shieldAngle) {
                                        dmgMlt = items.weapons[tmpObj.weaponIndex].shield;
                                    }
                                    var dmgVal = items.weapons[this.weaponIndex].dmg *
                                        (this.skin && this.skin.dmgMultO?this.skin.dmgMultO:1) *
                                        (this.tail && this.tail.dmgMultO?this.tail.dmgMultO:1);
                                    var tmpSpd = (0.3 * (tmpObj.weightM||1)) + (items.weapons[this.weaponIndex].knock||0);
                                    tmpObj.xVel += tmpSpd * mathCOS(tmpDir);
                                    tmpObj.yVel += tmpSpd * mathSIN(tmpDir);
                                    if (this.skin && this.skin.healD)
                                        this.changeHealth(dmgVal * dmgMlt * this.skin.healD, this);
                                    if (this.tail && this.tail.healD)
                                        this.changeHealth(dmgVal * dmgMlt * this.tail.healD, this);
                                    if (tmpObj.skin && tmpObj.skin.dmg && dmgMlt == 1)
                                        this.changeHealth(-dmgVal * tmpObj.skin.dmg, tmpObj);
                                    if (tmpObj.tail && tmpObj.tail.dmg && dmgMlt == 1)
                                        this.changeHealth(-dmgVal * tmpObj.tail.dmg, tmpObj);
                                    if (tmpObj.dmgOverTime && this.skin && this.skin.poisonDmg &&
                                        !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = this.skin.poisonDmg;
                                        tmpObj.dmgOverTime.time = this.skin.poisonTime||1;
                                        tmpObj.dmgOverTime.doer = this;
                                    } if (tmpObj.dmgOverTime && applyPoison &&
                                        !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = 5;
                                        tmpObj.dmgOverTime.time = 5;
                                        tmpObj.dmgOverTime.doer = this;
                                    } if (tmpObj.skin && tmpObj.skin.dmgK) {
                                        this.xVel -= tmpObj.skin.dmgK * mathCOS(tmpDir);
                                        this.yVel -= tmpObj.skin.dmgK * mathSIN(tmpDir);
                                    } tmpObj.changeHealth(-dmgVal * dmgMlt, this, this);
                                }
                            }
                        }
                    }
                    // SEND FOR ANIMATION:
                    this.sendAnimation(hitSomething?1:0);
                };
                // SEND ANIMATION:
                this.sendAnimation = function(hit) {
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id] && this.canSee(players[i])) {
                            server.send(players[i].id, "7", this.sid, hit?1:0, this.weaponIndex);
                        }
                    }
                };
                // ANIMATE:
                var tmpRatio = 0;
                var animIndex = 0;
                this.animate = function(delta) {
                    if (this.animTime > 0) {
                        this.animTime -= delta;
                        if (this.animTime <= 0) {
                            this.animTime = 0;
                            this.dirPlus = 0;
                            tmpRatio = 0;
                            animIndex = 0;
                        } else {
                            if (animIndex == 0) {
                                tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                if (tmpRatio >= 1) {
                                    tmpRatio = 1;
                                    animIndex = 1;
                                }
                            } else {
                                tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                            }
                        }
                    }
                };
                // GATHER ANIMATION:
                this.startAnim = function(didHit, index) {
                    this.animTime = this.animSpeed = items.weapons[index].speed * 2;
                    this.targetAngle = (didHit?-config.hitAngle:-Math.PI);
                    tmpRatio = 0;
                    animIndex = 0;
                };
                // CAN SEE:
                this.canSee = function(other) {
                    if (!other) return false;
                    if (other.skin && other.skin.invisTimer && other.noMovTimer
                        >= other.skin.invisTimer) return false;
                    var dx = mathABS(other.x - this.x) - other.scale;
                    var dy = mathABS(other.y - this.y) - other.scale;
                    return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                };
            }
        };
        // MATHS:
        var mathPI = Math.PI;
        var mathPI2 = mathPI * 2;
        var mathPI3 = mathPI * 3;
        Math.lerpAngle = function (value1, value2, amount) {
            var difference = Math.abs(value2 - value1);
            if (difference > mathPI) {
                if (value1 > value2) {
                    value2 += mathPI2;
                } else {
                    value1 += mathPI2;
                }
            }
            var value = (value2 + ((value1 - value2) * amount));
            if (value >= 0 && value <= mathPI2) {
                return value;
            }
            return (value % mathPI2);
        }
        // REOUNDED RECTANGLE:
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            if (r < 0) {
                r = 0;
            }
            this.beginPath();
            this.moveTo(x+r, y);
            this.arcTo(x+w, y, x+w, y+h, r);
            this.arcTo(x+w, y+h, x, y+h, r);
            this.arcTo(x, y+h, x, y, r);
            this.arcTo(x, y, x+w, y, r);
            this.closePath();
            return this;
        }
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
        this.renderManager = new (class {
            constructor () {
                this.offset = {
                    x: 0,
                    y: 0
                };
                this.cam = {
                    x: 0,
                    y: 0
                };
                this.frame = {
                    now: Date.now(),
                    last: Date.now(),
                    count: 0,
                    fps: 0
                };
            }
            loop () {
                game.now = Date.now();
                game.delta = game.now - game.lastUpdate;
                game.lastUpdate = game.now;
                this.update();
                window.requestAnimFrame(this.update);
            }
            // CANVAS 2D VISUALS
            update () {
                // FRAMES PER SECOND
                this.frame.now = Date.now();
                this.frame.count++;
                if (this.frame.now - this.frame.lastUpdate > 1000) {
                    this.frame.lastUpdate = Date.now();
                    this.frame.fps = this.frame.count;
                    this.frame.count = 0;
                }
                // OFFSETS
                this.offset.x = this.cam.x - (game.screen.maxW / 2);
                this.offset.y = this.cam.y - (game.screen.maxH / 2);

                if (game.player) {
                    var tmpDist = game.UTILS.getDistance(this.cam.x, this.cam.y, game.player.x, game.player.y);
                    var tmpDir = game.UTILS.getDirection(game.player.x, game.player.y, this.cam.x, this.cam.y);
                    var camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                    if (tmpDist > 0.05) {
                        cam.x += camSpd * Math.cos(tmpDir);
                        cam.y += camSpd * Math.sin(tmpDir);
                    } else {
                        cam.x = player.x;
                        cam.y = player.y;
                    }
                } else {
                    cam.x = 14400 / 2;
                    cam.y = 14400 / 2;
                }
            }
        })();
        // WHEN WEBSOCKET CONNECTED
        this.start = () => {
            loadingText.style.display = "none";
            menuCardHolder.style.display = "block";
            this.renderManager.loop();
        };
        // MAIN SCRIPT
        this.script = new (class {
            constructor () {
                // FORCE EQUIPS
                this.force = {
                    toggle: false,
                    ar: []
                };
                this.old = {
                    build: -1,
                    weapon: -1,
                    watchAngle: 0,
                    moveAngle: 0,
                    chat: ""
                };
                // PREDICITONS
                this.predictions = new (class {
                    constructor () {
                        this.traps = [];
                        this.scale = 50;
                    }
                    update (...args) {}
                    add (...args) {}
                })();
                this.autoHitting = false;
                this.base = new (class {
                    constructor () {}
                    buy (index, isTail) {
                        main.io.send("13c", 1, index, isTail);
                        return true;
                    }
                    equip (index, isTail) {
                        index = (this.force.toggle ? this.force.ar[Number(isTail)] : index); // FORCE EQUIPS
                        if (!game.player.alive) return;
                        if (isTail == 0) {
                            if (game.player.skinIndex != index) {
                                main.io.send("13c", 0, index, 0);
                            }
                        } else if (isTail == 1) {
                            if (game.player.tailIndex != index) {
                                main.io.send("13c", 0, index, 1);
                            }
                        }
                    }
                    place (id, radian, trap, builds) {
                        try {
                            if (!game.player.alive) return;
                            if (!game.player.items.includes(e)) return;
                            let fixDir = this.old.watchAngle;
                            let item = game.items.list[game.player.items[id]];
                            let pos = game.player.buildItemPosition(game.items.list[game.player.items[id]], radian);
                            if (!trap || !this.predictions.traps.some(trap => game.UTILS.getDist(trap, pos) < this.predictions.scale + item.scale)) {
                                if (!builds || !game.buildings.some(e => e.active && game.UTILS.getDist(pos, e) < game.items.list[game.player.items[id]].scale + (e.blocker ? e.blocker : e.getScale(0.6, e.isItem)))) {
                                    this.selectObj(game.player.items[id]);
                                    main.io.send("c", 1, radian);
                                    this.selectObj(this.old.weapon, true);
                                    this.watch(fixDir);
                                    trap && (this.predictions.add(pos));
                                    return true;
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    watch (direction) {
                        if (!game.player.alive) return;
                        if (this.old.watchAngle == direction) return;
                        game.io.send("2", direction);
                    }
                    autoHit (toggle) {
                        if (toggle) {
                            this.autoHitting == false && main.io.send("7", 1);
                            this.autoHitting = true;
                        } else {
                            this.autoHitting == true && main.io.send("7", 1);
                            this.autoHitting = false;
                        }
                    }
                    selectObj (index, isWpn) {
                        if (!game.player.alive) return;
                        if (!game.player[isWpn ? "weapons" : "items"].includes(index)) return;
                        if (isWpn) {
                            if (this.old.build == -1 && game.player.weaponIndex == index) return;
                            io.send("5", index, true);
                        } else {
                            if (this.old.build == index) return;
                            io.send("5", index);
                        }
                    }
                    move (angle) {
                        if (!game.player || !game.player.alive) return;
                        main.io.send("33", angle);
                        return true;
                    }
                    hit (id, angle) {
                        main.io.send("c", id, angle);
                    }
                })();
            }
        })();

        // WEBSOCKET CACHES
        this.setInitData = (data) => {
            this.alliances = data.teams;
        };
        this.disconnect = (reason) => {
            main.io.close();
            window.location.reload();
        };
        let firstSetup = true;
        this.setupGame = (yourSID) => {
            loadingText.style.display = "none";
            menuCardHolder.style.display = "block";
            mainMenu.style.display = "none";
            this.attackState = 0;
            this.inGame = true;
            this.playerSID = yourSID;
            if (firstSetup) {
                firstSetup = false;
                this.gameObjects.length = 0;
                // BUY ALL HATS / ACCSESORIES
                setTimeout(function(){
                    for (let i = 0; i < this.store.hats.length; i++) {
                        const currentHat = this.store.hats[i];
                        const currentId = currentHat.id;
                        this.script.base.buy(currentId, false);
                    }
                    for (let i = 0; i < this.store.accessories.length; i++) {
                        const currentHat = this.store.accessories[i];
                        const currentId = currentHat.id;
                        this.script.base.buy(currentId, true);
                    }
                }, 1000);
                // ITEM COUNTS
                for (let i = 0; i <= 38; i++) {
                    let doit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].some(a => {
                        return a == i;
                    })
                    if (!doit) {
                        let thing = document.createElement("div");
                        thing.setAttribute("id", "itemCounts" + (i));
                        thing.style = `position: absolute;padding-left: 5px;font-size: 16px;color: #fff;`;
                        thing.innerHTML = "0";
                        document.getElementById("actionBarItem" + JSON.stringify(i)).appendChild(thing);
                        document.getElementById("actionBarItem" + i).appendChild(thing);
                    }
                }
            }
            main.io.send("6", 7);
            main.io.send("6", 17);
            main.io.send("6", 31);
            main.io.send("6", 23);
            main.io.send("6", 10);
        };
        this.addPlayer = (data, isYou) => {
            var tmpPlayer = this.findPlayerByID(data[0]);
            if (!tmpPlayer) {
                tmpPlayer = new this.Player(data[0], data[1], this.configs, this.UTILS, this.projectileManager,
                                       this.objectManager, this.players, this.ais, this.items, this.hats, this.accessories);

                this.players.push(tmpPlayer);
            }
            tmpPlayer.spawn(isYou ? moofoll : null);
            tmpPlayer.visible = false;
            tmpPlayer.x2 = undefined;
            tmpPlayer.y2 = undefined;
            tmpPlayer.setData(data);
            if (isYou) {
                this.player = tmpPlayer;
                this.renderManager.cam.x = player.x;
                this.renderManager.cam.y = player.y;
                /*updateItems();
                updateStatusDisplay();
                updateAge();
                updateUpgrades(0);*/
                gameUI.style.display = "block";
            }
        };
        this.removePlayer = (id) => {
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].id == id) {
                    this.players.splice(i, 1);
                    break;
                }
            }
        };
        this.updatePlayers = (data) => {}; // BIBVGUBGUGBGHBG CODE
        this.updateLeaderboard = (data) => {
            this.UTILS.removeAllChildren(leaderboardData);
            var tmpC = 1;
            for (var i = 0; i < data.length; i += 3) {
                (function(i) {
                    this.UTILS.generateElement({
                        class: "leaderHolder",
                        parent: leaderboardData,
                        children: [
                            this.UTILS.generateElement({
                                class: "leaderboardItem",
                                style: "color:" + ((data[i] == this.playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown") + " (" + data[i] + ")"
                            }),
                            this.UTILS.generateElement({
                                class: "leaderScore",
                                text: this.UTILS.kFormat(data[i+2]) || "0"
                            })
                        ]
                    });
                })(i);
                tmpC++;
            }
        };
        this.loadGameObject = (data) => {
            for (var i = 0; i < data.length;) {
                this.objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                  data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {sid:data[i + 7]} : null));
                i+=8;
            }
        };
        this.loadAI = (data) => {}; // no thanks
        this.animateAI = (sid) => {}; // no thanks
        this.gatherAnimation = (sid, didHit, index) => {
            let tmpObj = this.findPlayerBySID(sid);
            if (tmpObj) tmpObj.startAnim(didHit, index);
        };
        this.wiggleGameObject = (dir, sid) => {
            let tmpObj = this.findObjectBySid(sid);
            if (tmpObj) {
                tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
            }
        };
        this.shootTurret = (sid, dir) => {
            let tmpObj = findObjectBySid(sid);
            if (tmpObj) {
                tmpObj.dir = dir;
                tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir+Math.PI);
                tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir+Math.PI);
            }
        };
        this.updatePlayerValue = (index, value, updateView) => {
            if (this.player) {
                this.playerplayer[index] = value;
                if (updateView) {}
            }
        };
        this.updateHealth = (sid, value) => {};
        this.killPlayer = () => {};
        this.killObject = (sid) => {};
        this.killObjects = (sid) => {};
        this.updateItemCounts = (index, value) => {};
        this.updateAge = (xp, mxp, age) => {};
        this.updateUpgrades = (points, age) => {};
        this.updateItems = (data, wpn) => {};
        this.addProjectile = (x, y, dir, range, speed, indx, layer, sid) => {};
        this.remProjectile = (sid, range) => {}; 
        this.serverShutdownNotice = (countdown) => {};
        this.addAlliance = (data) => {};
        this.deleteAlliance = (sid) => {}; 
        this.allianceNotification = (sid, name) => {};
        this.setPlayerTeam = (team, isOwner) => {};
        this.setAlliancePlayers = (data) => {};
        this.updateStoreItems = (type, id, index) => {};
        this.receiveChat = (sid, message) => {};
        this.updateMinimap = (data) => {};
        this.showText = (x, y, value, type) => {};
        this.pingMap = (x, y) => {};
        this.pingSocketResponse = () => {};
      }
    })();
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
      // BEAUTIFY
      this.beautify.init();
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
        // HANDLER (code you want to run when sending packets)
        let handler = {
            "2": function(direction) {
                this.game.old.watchAngle = direction;
            },
            "33": function(direction) {
                this.game.old.moveAngle = direction;
            },
            "5": function(index, isWpn) {
                isWpn ? (this.game.old.build = -1, this.game.old.weapon = index) : this.game.old.build = index;
            },
            "6": function(index) {
                this.game.old.weapon = index;
            },
            "7": function() {},
            "8": function() {},
            "9": function() {},
            "10": function() {},
            "11": function() {},
            "12": function() {},
            "13c": function() {},
            "14": function() {},
            "sp": function() {},
            "pp": function() {},
            "c": function(hit, direction) {
                direction != null && hit && (this.game.old.watchAngle = direction);
            },
            "rmd": function() {},
            "ch": function(message) {
                this.game.old.chat = message;
            },
        };
        handler[packet](...args);
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
