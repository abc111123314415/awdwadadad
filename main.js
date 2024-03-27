const main = new (class {
  constructor () {
    this.connected = false;
    this.game = new (class {
      constructor () {
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
        this.objectManager = class {
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
