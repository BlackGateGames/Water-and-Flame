/*
 * Tank game example
 */
var platino = require('co.lanica.platino');

function MainScene(window, game) {

    // Create scene
    var self = platino.createScene();

    var updateTimerID = 0;

    var tank        = [];
    var tankTurret  = [];
    var tankBullet  = [];
    var bulletExplosion  = [];
    var tankRect    = [];
    var bulletRect    = [];

    var tankMovingSound = [];
    var tankBulletSound = [];
    var tankExplosionSound = [];
    var tankRotateSound = [];

    var tankMovingBullet  = [];
    var tankMovingBulletTransform  = [];

    var tankTransform = [];
    var tankTurretTransform = [];

    var buttonA = null;
    var buttonB = null;

    var tankCount = 3;

    var pubnub = null;
    var canUsePubNub = true;

    var useMultiplayer = true;

    var myUUID = null;
    var myTankIndex = 0;
    var myOffsetX = 0;
    var myOffsetY = 0;

    var started = false;

    var MAX_ANIMATION_FRAME_INDEX = 23;
    var MAX_ANIMATION_FRAME_COUNT = MAX_ANIMATION_FRAME_INDEX + 1;

    var ANIMATION_INTERVAL = 60;

    var useParticle = true;

    if (Ti.Platform.osname == 'android') {
        useParticle = false;
    }

    var map = null;
    var watery = [];
//    var cloud = [];
//    var cloudTransform = [];
    var flammable = [];

    var canFire = true;

    var tankFrame = {
        down: 0,
        left: 6,
        up  : 12,
        right: 18
    };

    var tankAnimationFrame = {
        down: {left:[1,2,3,4,5,6], up:[1,2,3,4,5,6,7,8,9,10,11,12], right:[23,22,21,20,19,18]},
        left: {down:[5,4,3,2,1,0], up:[7,8,9,10,11,12], right:[7,8,9,10,11,12,13,14,15,16,17,18]},
        up:   {right:[13,14,15,16,17,18], down:[13,14,15,16,17,18,19,20,21,22,23,0], left:[11,10,9,8,7,6]},
        right:{down:[19,20,21,22,23,0], left:[17,16,15,14,13,12,11,10,9,8,7,6], up:[17,16,15,14,13,12]}
    };

    var turretFirePosition = [
        {x:125, y:260}, // 0001
        {x:100, y:190}, // 0002
        {x:80,  y:180}, // 0003
        {x:55,  y:170}, // 0004
        {x:40,  y:155}, // 0005
        {x:35,  y:140}, // 0006
        {x:40,  y:130}, // 0007
        {x:35,  y:110}, // 0008
        {x:42,  y:96},  // 0009
        {x:60,  y:85},  // 0010
        {x:80,  y:72},  // 0011
        {x:100, y:70},  // 0012
        {x:125, y:65},  // 0013
        {x:155, y:67},  // 0014
        {x:180, y:80},  // 0015
        {x:200, y:85},  // 0016
        {x:220, y:100}, // 0017
        {x:225, y:110},  // 0018
        {x:220, y:130},  // 0019
        {x:224, y:145},  // 0020
        {x:215, y:160},  // 0021
        {x:200, y:170},  // 0022
        {x:180, y:180},  // 0023
        {x:160, y:190}   // 0024
    ];
    
    var gsWidth = game.screen.width;
    var midLoc = gsWidth*0.45;

    // randomized tree position
    var locationPosition = [
        {x:midLoc-(128*5), y:(64*5), num:0, status:0}, // 0001
        {x:midLoc-(128*4), y:(64*4), num:1, status:0}, // 0002
        {x:midLoc-(128*3), y:(64*3), num:2, status:0}, // 0003
        {x:midLoc-(128*2), y:(64*2), num:3, status:0}, // 0004
        {x:midLoc-(128*1), y:(64*1), num:4, status:0}, // 0005
        {x:midLoc+(128*0), y:(64*0), num:5, status:0}, // 0006
        {x:midLoc-(128*4), y:(64*6), num:6, status:0}, // 0007
        {x:midLoc-(128*3), y:(64*5), num:7, status:0}, // 0008
        {x:midLoc-(128*2), y:(64*4), num:8, status:0},  // 0009
        {x:midLoc-(128*1), y:(64*3), num:9, status:0},  // 0010
        {x:midLoc+(128*0), y:(64*2), num:10, status:0},  // 0011
        {x:midLoc+(128*1), y:(64*1), num:11, status:0},  // 0012
        {x:midLoc-(128*3), y:(64*7), num:12, status:0},  // 0013
        {x:midLoc-(128*2), y:(64*6), num:13, status:0},  // 0014
        {x:midLoc-(128*1), y:(64*5), num:14, status:0},  // 0015
        {x:midLoc+(128*0), y:(64*4), num:15, status:0},  // 0016
        {x:midLoc+(128*1), y:(64*3), num:16, status:0}, // 0017
        {x:midLoc+(128*2), y:(64*2), num:17, status:0},  // 0018
        {x:midLoc-(128*2), y:(64*8), num:18, status:0},  // 0019
        {x:midLoc-(128*1), y:(64*7), num:19, status:0},  // 0020
        {x:midLoc+(128*0), y:(64*6), num:20, status:0},  // 0021
        {x:midLoc+(128*1), y:(64*5), num:21, status:0},  // 0022
        {x:midLoc+(128*2), y:(64*4), num:22, status:0},  // 0023
        {x:midLoc+(128*3), y:(64*3), num:23, status:0},  // 0024
        {x:midLoc-(128*1), y:(64*9), num:24, status:0}, // 0025
        {x:midLoc+(128*0), y:(64*8), num:25, status:0}, // 0026
        {x:midLoc+(128*1), y:(64*7), num:26, status:0}, // 0027
        {x:midLoc+(128*2), y:(64*6), num:27, status:0}, // 0028
        {x:midLoc+(128*3), y:(64*5), num:28, status:0}, // 0029
        {x:midLoc+(128*4), y:(64*4), num:29, status:0}, // 0030
        {x:midLoc+(128*0), y:(64*10), num:30, status:0}, // 0031
        {x:midLoc+(128*1), y:(64*9), num:31, status:0}, // 0032
        {x:midLoc+(128*2), y:(64*8), num:32, status:0},  // 0033
        {x:midLoc+(128*3), y:(64*7), num:33, status:0},  // 0034
        {x:midLoc+(128*4), y:(64*6), num:34, status:0},  // 0035
        {x:midLoc+(128*5), y:(64*5), num:35, status:0},  // 0036
    ];
    var flammable_seed = [[midLoc-(128*5),(64*5),3],[midLoc,128,1],[midLoc,256,2],[midLoc,384,0],[midLoc,512,3],[midLoc,640,1],[midLoc + 128,64,0],[midLoc - 128,64,0]];
    var MAX_FLAMMABLE_COUNT  = 8;
//    var MAX_CLOUD_COUNT = 5;

    function checkCollision() {
        for (var i = 0; i < tankCount; i++) {
            if (tankMovingBullet[i].alpha === 0) continue;
            for (var j = 0; j < tankCount; j++) {
                if (i == j) continue;
                if (tank[j].alpha > 0 && bulletRect[i].collidesWith(tankRect[j])) {
                    tankMovingBullet[i].clearTransform(tankMovingBulletTransform[i]);
                    tankMovingBulletTransformCompleted({source:{index:i}});
                }
            }
        }
    }

    /*
    ** fix touch coordinates because parent view may have different scale and camera
    **/
    function locationInView(_e) {
        var e = {type:_e.type, source:_e.source};
        var x = _e.x * game.touchScaleX;
        var y = _e.y * game.touchScaleY;
        
        e.x = x;
        e.y = y;
        
        return e;
    }

    var tankMovingBulletTransformCompleted = function(e) {
        var index = e.source.index;
        var x = tankMovingBullet[index].center.x;
        var y = tankMovingBullet[index].center.y;

        tankMovingBullet[index].hide();

        canFire = true;

        explode(x, y, index);
    };

    function movetank(e, index) {
        //Ti.API.info("MOVE " + index + " (" + e.x + "x" + e.y + ")");
        Ti.API.info("Starting location: " + tank[index].position);

        var speed = 300;

        //tankTransform[index].x = e.x - (tank[index].width  * 0.5 * tank[index].scaleX);
        //tankTransform[index].y = e.y - (tank[index].height * 0.5 * tank[index].scaleX);
        //{x:locationPosition[0].x + 64, y:locationPosition[0].y + 64};
        if (e.x > tank[index].x && e.y > tank[index].y) {
        	if (tank[index].position < 30) {tank[index].position += 6;}
        }
        else if (e.x > tank[index].x && e.y < tank[index].y) {
        	if ((tank[index].position + 1) % 6 != 0) {tank[index].position++;}
        }
        else if (e.x < tank[index].x && e.y < tank[index].y) {
        	if (tank[index].position > 5) {tank[index].position -= 6;}
        }
        else if (e.x < tank[index].x && e.y > tank[index].y) {
        	if ((tank[index].position + 1) % 6 != 1) {tank[index].position--;}
        }
        
        Ti.API.info("Ending location: " + tank[index].position);
        
        tankTransform[index].x = locationPosition[tank[index].position].x;
        tankTransform[index].y = locationPosition[tank[index].position].y;

        var distanceX = tank[index].x - tankTransform[index].x;
        var distanceY = tank[index].y - tankTransform[index].y;
        var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        tankTransform[index].duration = distance / speed * 1000;

        tankMovingSound[index].play();

        tank[index].transform(tankTransform[index]);
    }

    function getRotationDegreeOfTank(e, index) {
        var x = e.x - tank[index].center.x;
        var y = e.y - tank[index].center.y;

        var r = Math.atan2(y, x);
        var d = r / (Math.PI / 180);

        return d;
    }

    function getAngleByFrame(frame) {
        return ((frame * (360 / MAX_ANIMATION_FRAME_COUNT)) + 90) % 360;
    }

    function getAngleOfTank(index) {
        return ((tank[index].frame * (360 / MAX_ANIMATION_FRAME_COUNT)) + 90) % 360;
    }

    function rotateTank(e, index) {

        var d = getRotationDegreeOfTank(e, index);
        var absd = Math.abs(d);

        var from_heading = tank[index].heading;
        var to_heading   = null;

        if (absd < 45) {
            to_heading = "right";
        } else if (absd > 135) {
            to_heading = "left";
        } else if (d >= 45 && d <= 135) {
            to_heading = "down";
        } else {
            to_heading = "up";
        }

        if (from_heading == to_heading) return;

        tank[index].heading = to_heading;
        tank[index].animate(tankAnimationFrame[from_heading][to_heading], ANIMATION_INTERVAL, 0, 0);
    }

    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    function rotateTurret(e, index) {
        var frames = getAnimationFrame(tank[index], e, index);

        if (frames.length > 0) {
            tankTurret[index].animate(frames, ANIMATION_INTERVAL, 0, 0);
        }
        //tankTurret[index].selectFrame(zeroPad(to_frame, 4));

        return frames.length;
    }

    function getAnimationFrame(target, e, index) {
        var d = Math.abs(getRotationDegreeOfTank(e, index) + 270) % 360;

        var from_frame = tank[index].frame;
        var to_frame = Math.ceil(d / (360 / MAX_ANIMATION_FRAME_COUNT));

        var frame_count = to_frame - from_frame;
        var frames = [];
        var reverse = false;

        if (frame_count < 0) {
            frame_count = to_frame + (MAX_ANIMATION_FRAME_INDEX - from_frame);
        }

        if (frame_count > MAX_ANIMATION_FRAME_INDEX - (MAX_ANIMATION_FRAME_COUNT / 4)) {
            reverse = true;
            frame_count = MAX_ANIMATION_FRAME_INDEX - frame_count;
        }

        for (var i = 0; i < frame_count; i++) {
            frames[i] = from_frame;

            if (reverse) {
                from_frame = from_frame - 1;
            } else {
                from_frame = from_frame + 1;
            }

            if (from_frame > MAX_ANIMATION_FRAME_INDEX) from_frame = 0;
            if (from_frame < 0) from_frame = MAX_ANIMATION_FRAME_INDEX;
        }

        return frames;
    }

    function rotateTankAndTurret(e, index) {

        var frames = getAnimationFrame(tank[index], e, index);

        if (frames.length > 0) {
            tank[index].animate(frames, ANIMATION_INTERVAL, 0, 0);
            tankTurret[index].animate(frames, ANIMATION_INTERVAL, 0, 0);

            if (frames.length > 5) {
                tankRotateSound[index].stop();
                tankRotateSound[index].play();
            }
        }
        //tank[index].selectFrame(zeroPad(to_frame, 4));

        return frames.length;
    }

    // Fire turret
    function fire(index, param) {

        if (!canFire) return;
        /*
        if (!useParticle) {
            tankBullet[index].scale(0.2, 0.2);

            tankBullet[index].x = tank[index].x + (turretFirePosition[tankTurret[index].frame].x * tank[index].scaleX) - tank[index].width  * 0.5;
            tankBullet[index].y = tank[index].y + (turretFirePosition[tankTurret[index].frame].y * tank[index].scaleY) - tank[index].height * 0.5;

            tankBullet[index].show();
            tankBullet[index].animate(0, 16, ANIMATION_INTERVAL, 0);

        } else {
            tankBullet[index].x = tank[index].x + (turretFirePosition[tankTurret[index].frame].x * tank[index].scaleX);
            tankBullet[index].y = tank[index].y + (turretFirePosition[tankTurret[index].frame].y * tank[index].scaleY);

            if (tankBullet[index].started) {
                tankBullet[index].restart();
            } else {
                tankBullet[index].started = true;
                self.add(tankBullet[index]);
            }
        }
        */

        fireBullet(getFireToPosition(param.x, param.y, getAngleByFrame(param.frame)), index);

        canFire = false;
    }

    // Fire bullet
    function fireBullet(param, index) {

        tankBulletSound[index].play();

        var speed = 400;

        var fromX = tank[index].x + (turretFirePosition[tankTurret[index].frame].x * tank[index].scaleX) - tank[index].width  * 0.5;
        var fromY = tank[index].y + (turretFirePosition[tankTurret[index].frame].y * tank[index].scaleY) - tank[index].height * 0.5;

        tankMovingBullet[index].x = fromX;
        tankMovingBullet[index].y = fromY;

        var toX = param.x - tankMovingBullet[index].width  * 0.5;
        var toY = param.y - tankMovingBullet[index].height * 0.5;

        var distanceX = fromX - toX;
        var distanceY = fromY - toY;
        var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        tankMovingBulletTransform[index].duration = distance / speed * 1000;

        tankMovingBulletTransform[index].x = toX;
        tankMovingBulletTransform[index].y = toY;

        tankMovingBullet[index].show();
        tankMovingBullet[index].frame = 1;

        tankMovingBullet[index].transform(tankMovingBulletTransform[index]);
    }

    function explode(toX, toY, index) {
        tankExplosionSound[index].stop();
        tankExplosionSound[index].play();

        if (!useParticle) {
            bulletExplosion[index].x = toX - (bulletExplosion[index].width  * 0.5);
            bulletExplosion[index].y = toY - (bulletExplosion[index].height * 0.5);

            bulletExplosion[index].show();
            bulletExplosion[index].animate(0, 16, ANIMATION_INTERVAL, 0);
        } else {
            bulletExplosion[index].x = toX;
            bulletExplosion[index].y = toY;

            if (bulletExplosion[index].started) {
                bulletExplosion[index].restart();
            } else {
                bulletExplosion[index].started = true;
                self.add(bulletExplosion[index]);
            }
        }
    }

    var aim = function(_e) {
        var e = locationInView(_e);

        //var frameCount = rotateTankAndTurret(e, myTankIndex);
        var param = {x:tank[myTankIndex].center.x, y:tank[myTankIndex].center.y};

        // Stop moving
        send_a_message("stop", {x:param.x, y:param.y, tank:myTankIndex, offsetX:myOffsetX, offsetY:myOffsetY});
        setTimeout(function() { movetank(param, myTankIndex); }, 0); //ANIMATION_INTERVAL * frameCount);
    };

    function getFireToPosition(fromX, fromY, angle) {
        var r = angle * Math.PI / 180;
        var amount = game.screen.height * 0.7;

        return {x:fromX + (amount * Math.cos(r)), y:fromY + (amount * Math.sin(r))};
    }

    var handleTouchEvent = function(_e) {
        var e = locationInView(_e);

        if (e.type == "touchstart") {
            if (buttonA.contains(e.x, e.y)) {
                buttonA.color(0.5, 0.5, 0.5);
                return;
            }

        } else if (e.type == "touchend") {
            buttonA.color(1, 1, 1);

            /*if (buttonA.contains(e.x, e.y)) {
                var param = {x:tank[myTankIndex].center.x, y:tank[myTankIndex].center.y, frame:tank[myTankIndex].frame};
                send_a_message("fire", {tank:myTankIndex,
                        frame:tank[myTankIndex].frame,
                        x:param.x,
                        y:param.y,
                        offsetX:myOffsetX,
                        offsetY:myOffsetY
                    });
                movetank(param, myTankIndex);
                fire(myTankIndex, param);

                return;
            }*/

            // You can fire when the tank moves
            canFire = true;

            //var frameCount = rotateTankAndTurret(e, myTankIndex);

            send_a_message("move", {x:e.x, y:e.y, tank:myTankIndex, offsetX:myOffsetX, offsetY:myOffsetY});
            setTimeout(function() { movetank(e, myTankIndex); }, 0); //ANIMATION_INTERVAL * frameCount);
        }
    };

    function showSettingDialog() {
        var dialog = Ti.UI.createOptionDialog();
        dialog.title = "SELECT PLAYER";
        dialog.options = ["Fire", "Water"];

        dialog.addEventListener("click", function(e) {
            if (e.index >= 0 && e.index < tankCount) {
                myTankIndex = e.index;
            }

            var param = {tank:myTankIndex};
            send_a_message("ping", param);

            tank[myTankIndex].show();
            tankTurret[myTankIndex].show();
        });

        dialog.show();
    }

    function send_position() {
        var param = {tank:myTankIndex,
                x:tank[myTankIndex].center.x, y:tank[myTankIndex].center.y,
                offsetX:myOffsetX, offsetY:myOffsetY};
        send_a_message("position", param);
    }

    function setupPubNub() {
        if (!started) return;
        if (!useMultiplayer) return;

        // -------------------------------------
        // INIT PUBNUB
        // -------------------------------------
        pubnub = require('pubnub').init({
            publish_key   : 'pub-c-7495654b-d1a6-4767-97d0-c5c929d7ea31',
            subscribe_key : 'sub-c-e4cc5c00-a372-11e4-9f6b-0619f8945a4f',
            ssl           : false,
            origin        : 'pubsub.pubnub.com'
        });

        // -------------------------------------
        // LISTEN FOR MESSAGES
        // -------------------------------------
        pubnub.subscribe({
            channel  : 'codestrong_tank',
            connect  : function() {
                Ti.API.info("subscribe:connect");
            },
            callback : function(message) {
                // Ignore my own message
                if (message.issuer == myUUID) return;

                Ti.API.log("subscribe:callback " + JSON.stringify(message));
                var index = 0;
                var param = {};
                if (message.command == "ping") {
                    index = parseInt(message.data.tank, 10);
                    if (index >= 0 && index < tank.length) {
                        tank[index].show();
                        tankTurret[index].show();
                        Ti.API.info("SHOW TANK " + index);
                    }
                    send_position();
                } else if (message.command == "move") {
                    index = parseInt(message.data.tank, 10);
                    if (index >= 0 && index < tank.length) {
                        param = {x:message.data.x, y:message.data.y};
                        rotateTankAndTurret(param, index);
                        movetank(param, index);
                    }
                    send_position();
                } else if (message.command == "stop") {
                    index = parseInt(message.data.tank, 10);
                    if (index >= 0 && index < tank.length) {
                        param = {x:message.data.x, y:message.data.y};
                        rotateTankAndTurret(param, index);
                        movetank(param, index);
                    }
                } else if (message.command == "fire") {
                    index = parseInt(message.data.tank, 10);
                    if (index >= 0 && index < tank.length) {
                        tank[index].selectFrame(zeroPad(message.data.frame, 4));
                        tankTurret[index].selectFrame(zeroPad(message.data.frame, 4));
                        tank[index].clearTransform(tankTransform[index]);
                        movetank({x:message.data.x, y:message.data.y}, index);
                        fire(index, message.data);
                    }
                    send_position();
                } else if (message.command == "position") {
                    index = parseInt(message.data.tank, 10);
                    if (index >= 0 && index < tank.length) {
                        tank[index].center = {x:message.data.x, y: message.data.y};
                        tank[index].show();
                        tankTurret[index].show();
                    }
                }

            },
            error : function() {
                Ti.API.info("subscribe:error");
                canUsePubNub = false;
            }
        });

    }

    // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    function send_a_message(command, data) {
        // If we failed to subscribe, try to reconnect
        if (pubnub === null || !canUsePubNub) {
            setupPubNub();
        }

        if (pubnub === null) {
            return;
        }

        pubnub.publish({
            channel  : 'codestrong_tank',
            message  : { command : command, data : data, issuer : myUUID },
            callback : function(info) {
                if (info[0]) {
                    Ti.API.log("Successfully Sent Message!");
                }
                if (!info[0]) {
                    Ti.API.log("Failed Because: " + info[1]);
                }
            }
        });
    }
/*
    var cloudTransformCompleted = function(e) {
        var index = e.source.index;

        cloud[index].x = cloud[index].initialX;
        cloud[index].y = cloud[index].initialY - game.screen.height;

        cloud[index].transform(cloudTransform[index]);
    };
*/

    var tankTransformCompleted = function(e) {
        var index = e.source.index;

        tankMovingSound[index].stop();
    };

    self.addEventListener('activated', function(e) {
        Ti.API.info("main scene is activated");

        setupPubNub();

        myUUID = Titanium.Platform.createUUID();

        tank = [];
        tankTurret = [];
        tankRect = [];
        bulletRect = [];

        tankTransform = [];
        tankTurretTransform = [];

        rock = [];

        // Create on-screen controller
        buttonA = platino.createSprite({image:'graphics/A.png'});
        buttonA.tag = "buttonA";
        buttonA.alpha = 0.5;
        buttonA.width  = buttonA.width  * 2;
        buttonA.height = buttonA.height * 2;

        buttonA.x = game.screen.width  - buttonA.width;
        buttonA.y = game.screen.height - buttonA.height;
        buttonA.z = 99;

        self.add(buttonA);

        // Create Tanks
        for (var i = 0; i < tankCount; i++) {
            if (i % 3 === 0) {
                tank[i] = platino.createSpriteSheet({image:'graphics/Panzer/PanzerA.xml'});
                tankTurret[i] = platino.createSpriteSheet({image:'graphics/Panzer/PanzerTurret.xml'});
                tank[i].tag = "PanzerA";
                tankTurret[i].tag = "PanzerTurret";
            } else {
                tank[i] = platino.createSpriteSheet({image:'graphics/M24/M24A.xml'});
                tankTurret[i] = platino.createSpriteSheet({image:'graphics/M24/M24Turret.xml'});
                tank[i].tag = "M24A";
                tankTurret[i].tag = "M24Turret";
            }

            tankMovingBulletTransform[i] = platino.createTransform();
            tankMovingBullet[i] = platino.createSpriteSheet({image:'graphics/explosion.xml'});
            tankMovingBullet[i].hide();

            tankMovingBulletTransform[i].index = i;
            tankMovingBulletTransform[i].addEventListener('complete', tankMovingBulletTransformCompleted);

            if (!useParticle) {
                tankBullet[i] = platino.createSpriteSheet({image:'graphics/explosion.xml'});
                bulletExplosion[i] = platino.createSpriteSheet({image:'graphics/explosion.xml'});
                tankBullet[i].hide();
                bulletExplosion[i].hide();
                self.add(tankBullet[i]);
                self.add(bulletExplosion[i]);
            } else {
                tankBullet[i] = platino.createParticles({image:'graphics/fire.pex'});
                bulletExplosion[i] = platino.createParticles({image:'graphics/bang.pex'});
            }

            tankBullet[i].started = false;
            bulletExplosion[i].started = false;

            tank[i].heading = "down";
            tankTurret[i].heading = "down";

            tank[i].scaleFromCenter(0.7, 0.7, 0, 0);
            tankTurret[i].scaleFromCenter(0.7, 0.7, 0, 0);

            tankTurret[i].followParentTransformRotation = false;
            tankTurret[i].followParentMove = true;
            tank[i].addTransformChildWithRelativePosition(tankTurret[i]);

			if (i % 3 === 0) {
	            tank[i].center = {x:locationPosition[0].x + 64, y:locationPosition[0].y + 64};
	            tank[i].position = 0;
	       } else {
	       		tank[i].center = {x:locationPosition[35].x + 64, y:locationPosition[35].y + 64};
	       		tank[i].position = 35;
	       }
            //tankTurret[i].center = {x:game.screen.width * 0.5, y:game.screen.height * 0.5};

            tankRect[i] = platino.createSprite({width:tank[i].width * 0.5, height:tank[i].height * 0.5});
            tankRect[i].color(0, 0, 1);
            tankRect[i].alpha = 0;

            bulletRect[i] = platino.createSprite({width:tankMovingBullet[i].width * 0.25, height:tankMovingBullet[i].height * 0.25});
            bulletRect[i].color(0, 1, 0);
            bulletRect[i].alpha = 0;

            tankRect[i].center = tank[i].center;
            tankRect[i].followParentMove = true;
            tank[i].addTransformChildWithRelativePosition(tankRect[i]);

            bulletRect[i].center = tankMovingBullet[i].center;
            bulletRect[i].followParentMove = true;
            tankMovingBullet[i].addTransformChildWithRelativePosition(bulletRect[i]);

            tank[i].z = i + 10;
            tankTurret[i].z = i + 2;
            tankBullet[i].z = i + 3;
            bulletExplosion[i].z = i + 4;
            tankMovingBullet[i].z = i + 5;
            tankRect[i].z = 99;
            bulletRect[i].z = 99;

            self.add(tank[i]);
            self.add(tankTurret[i]);
            self.add(tankMovingBullet[i]);
            self.add(tankRect[i]);
            self.add(bulletRect[i]);

            tankTransform[i] = platino.createTransform();
            tankTurretTransform[i] = platino.createTransform();

            tankTransform[i].index = i;
            tankTransform[i].addEventListener('complete', tankTransformCompleted);

            tank[i].hide();
            tankTurret[i].hide();

			if (i % 3 === 0) {
	            tankMovingSound[i]   = Ti.Media.createSound({url:'sounds/flame_moving.wav'});
	      } else {
	      	tankMovingSound[i]   = Ti.Media.createSound({url:'sounds/water_moving.wav'});
	      }
            tankBulletSound[i]   = Ti.Media.createSound({url:'sounds/none.wav'});
            tankExplosionSound[i] = Ti.Media.createSound({url:'sounds/none.wav'});
            tankRotateSound[i]   = Ti.Media.createSound({url:'sounds/none.wav'});
        }

        // Create terrain map
        if (map === null) {
            var mapfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'graphics/Terrain.json');
            var mapjson = JSON.parse(mapfile.read().toString());

            var mapinfo = {
                image:"graphics/" + mapjson.tilesets[0].image,
                tileWidth:mapjson.tilesets[0].tilewidth,
                tileHeight:mapjson.tilesets[0].tileheight,
                border:mapjson.tilesets[0].spacing,
                margin:mapjson.tilesets[0].margin
            };

            map = platino.createMapSprite(mapinfo);

            map.firstgid = mapjson.tilesets[0].firstgid; // tilemap id is started from 'firstgid'
            map.tiles = mapjson.layers[0].data;
            map.orientation = platino.MAP_ISOMETRIC;
            map.mapSize = {width:mapjson.layers[0].width, height:mapjson.layers[0].height};
            map.tileTiltFactorY = mapjson.tileheight * 0.5 / mapjson.tilesets[0].tileheight;
            
            map.z = 0;
            map.center = {x:game.screen.width * 0.4, y:game.screen.height * 0.5};


            self.add(map);
        }

        // Create trees
        var generateRandom = true;
        var forprint = [];
        for (i = 0; i < MAX_FLAMMABLE_COUNT; i++) {
//            if (i % 4 === 0) {
//                flammable[i] = platino.createSprite({image:'graphics/Bush.png'});
//            } else {
                flammable[i] = platino.createSpriteSheet({image:'graphics/Flammable.xml'});
//            }
            var frameindex = 0;
            if (generateRandom) {
            	flammable[i].position = Math.floor(Math.random() * 36);
            	flammable[i].x = locationPosition[flammable[i].position].x;
		        flammable[i].y = locationPosition[flammable[i].position].y;
//                flammable[i].x = Math.floor(Math.random() * (game.screen.width  - flammable[i].width));
//                flammable[i].y = Math.floor(Math.random() * (game.screen.height - flammable[i].height));
                frameindex = Math.floor(Math.random() * 4);
                flammable[i].frame = frameindex;
            } else {
                flammable[i].x = flammable_seed[i][0];
                flammable[i].y = flammable_seed[i][1];
                flammable[i].frame = flammable_seed[i][2];
            }
            flammable[i].z = 50;
            self.add(flammable[i]);

            forprint[i] = [flammable[i].x, flammable[i].y, frameindex];
        }
        if (generateRandom) {
            Ti.API.info(JSON.stringify(forprint));
        }

        // Create clouds
        /*
        for (i = 0; i < MAX_CLOUD_COUNT; i++) {
            cloud[i] = platino.createSpriteSheet({image:'graphics/cloud.xml'});
            cloudTransform[i] = platino.createTransform();
            cloudTransform[i].index = i;
            cloudTransform[i].addEventListener('complete', cloudTransformCompleted);

            if (generateRandom) {
                cloud[i].x = Math.floor(Math.random() * game.screen.width);
                cloud[i].y = Math.floor(Math.random() * game.screen.height) - game.screen.height;
                cloud[i].frame = Math.floor(Math.random() * 3);
            } else {
                cloud[i].x = tree_seed[i][0];
                cloud[i].y = tree_seed[i][1] - game.screen.height - cloud[i].height;
                cloud[i].frame = tree_seed[i][2] <= 2 ? tree_seed[i][2] : 0;
            }

            cloud[i].initialX = cloud[i].x;
            cloud[i].initialY = cloud[i].y;
            cloud[i].z = 99;
            self.add(cloud[i]);

            cloud[i].alpha = 0.5;

            cloudTransform[i].duration = 20000;
            cloudTransform[i].x = cloud[i].x;
            cloudTransform[i].y = tree_seed[i][1] + game.screen.height;

            cloud[i].transform(cloudTransform[i]);
        }
        */

        if (updateTimerID > 0) {
            clearInterval(updateTimerID);
            updateTimerID = 0;
        }

        updateTimerID = setInterval(function(e) {
            checkCollision();
        }, 100);

        game.addEventListener('touchstart', handleTouchEvent);
        game.addEventListener('touchend',   handleTouchEvent);
    });

    self.addEventListener('onloadsprite', function(e) {
        Ti.API.info("onloadsprite: " + e.tag);
        if (!started && e.tag == "PanzerA") {
            started = true;
            game.startCurrentScene();
            showSettingDialog();
        }
    });

    self.addEventListener('deactivated', function(e) {
        Ti.API.info("main scene is deactivated");

        game.removeEventListener('touchstart', handleTouchEvent);
        game.removeEventListener('touchend',   handleTouchEvent);

        self.remove(map);
        map = null;

        for (var i = 0; i < tankCount; i++) {

           tankMovingBulletTransform[i].removeEventListener('complete', tankMovingBulletTransformCompleted);

           self.remove(tank[i]);
           self.remove(tankTurret[i]);
           self.remove(tankBullet[i]);
           self.remove(tankMovingBullet[i]);
           self.remove(bulletExplosion[i]);
           self.remove(tankRect[i]);
           tank[i]       = null;
           tankTurret[i] = null;
           tankBullet[i] = null;
           tankMovingBullet[i] = null;
           tankMovingBulletTransform[i] = null;
           bulletExplosion[i] = null;
           tankTransform[i]       = null;
           tankTurretTransform[i] = null;
           tankRect[i] = null;
        }

        tank       = [];
        tankTurret = [];
        tankBullet = [];
        tankMovingBullet = [];
        bulletExplosion = [];
        tankTransform = [];
        tankTurretTransform = [];
        tankRect = [];
    });

    // Stop update timer before app is closed
    window.addEventListener('android:back', function(e) {
        if (updateTimerID > 0) {
            clearInterval(updateTimerID);
        }
    });

    return self;
}

module.exports = MainScene;
