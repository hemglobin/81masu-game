const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const { type } = require("os");
const { send } = require("process");
const console = require("console");

const httpServer = http.createServer((req, res) => {

    if (req.url === "/") {
        fs.readFile("index.html", (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("エラー");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(data);
        });

    } else if (req.url === "/script.js") {

        fs.readFile("script.js", (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("エラー");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/javascript; charset=utf-8"
            });

            res.end(data);
        });

    } else {
        res.writeHead(404);
        res.end("Not Found");
    }

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("Webサーバーを起動しました！");
});

const server = new WebSocket.Server({
    server: httpServer
});

console.log("WebSocketサーバーを起動しました！");

const rooms = {};



server.on("connection", (socket) => {

    console.log("プレイヤーが接続しました！");

    socket.on("close", () => {
        console.log("プレイヤーの接続が切れました！");
    });

    socket.on("error", (error) => {
        console.log("WebSocketエラー：", error);
    });

    socket.on("message", (message) => {

        console.log("受信:", message.toString());

        const data = JSON.parse(message);

        if (data.type === "createRoom") {

            const roomId = Math.floor(1000 + Math.random() * 9000);

            rooms[roomId] = {
                player: [socket],
                redPosition: {
                    x: 4,
                    y: 7
                },
                bluePosition: {
                    x: 4,
                    y: 1
                },

                redCommands: {
                    move: [],
                    skill: undefined
                },
                blueCommands: {
                    move: [],
                    skill: undefined
                },

                redReady: false,
                blueReady: false,

                count: 1,

                redSkillCount: 0,
                blueSkillCount: 0,

                redClickCount: 0,
                blueClickCount: 0,

                redDice: undefined,
                blueDice: undefined,
                redDiceNext: undefined,
                blueDiceNext: undefined,

                redFinish: false,
                blueFinish: false
            };

            // このプレイヤーがいる部屋を記録
            socket.roomId = roomId

            console.log("部屋を作成しました：" + roomId);

            // 部屋番号を送る
            socket.send(JSON.stringify({
                type: "roomCreated",
                roomId: roomId
            }));

            console.log(rooms[roomId].player.length);

            // 参加人数を送る
            socket.send(JSON.stringify({
                type: "playerCount",
                count: rooms[roomId].player.length
            }));

            // 1人目なのでプレイヤー1
            socket.send(JSON.stringify({
                type: "playerNumber",
                number: 1
            }));

            socket.playerNumber = rooms[roomId].player.length;
        }

        if (data.type === "joinRoom") {

            const roomId = data.roomId;

            console.log("参加しようとしています：", roomId);
            console.log("現在の部屋：", rooms);

            if (rooms[roomId]) {

                // このプレイヤーがいる部屋を記録
                socket.roomId = roomId;

                rooms[roomId].player.push(socket);

                socket.playerNumber = rooms[roomId].player.length;

                console.log("参加成功！");
                console.log("現在の人数：", rooms[roomId].player.length);

                const playerNumber = rooms[roomId].player.length;

                console.log(
                    "プレイヤーが部屋 " +
                    roomId +
                    " に参加しました！"
                );

                console.log(
                    "プレイヤー番号：" +
                    playerNumber
                );

                socket.send(JSON.stringify({
                    type: "playerNumber",
                    number: playerNumber
                }));



                // 現在の人数
                const playerCount = rooms[roomId].player.length;

                // 部屋にいる全員に人数を送る
                rooms[roomId].player.forEach((player) => {

                    player.send(JSON.stringify({
                        type: "playerCount",
                        count: playerCount
                    }));

                });




            } else {

                console.log("部屋が見つかりません：", roomId);

                socket.send(JSON.stringify({
                    type: "joinResult",
                    message: "その部屋はありません。"
                }));

            }
        }

        if (data.type === "gameStart") {

            const roomId = socket.roomId;



            console.log("ゲーム開始！");
            console.log("部屋番号：" + roomId);

            

            rooms[roomId].player.forEach((player) => {

                console.log("startを送信！");

                player.send(JSON.stringify({
                    type: "start",
                    redX: rooms[roomId].redPosition.x,
                    redY: rooms[roomId].redPosition.y,
                    blueX: rooms[roomId].bluePosition.x,
                    blueY: rooms[roomId].bluePosition.y,
                    playerNumber: socket.playerNumber
                }));

            });



        }




        // ゲームシステム↓↓↓↓↓

        if (data.type === "redCommand") {

            const roomId = socket.roomId;

            const command = data.command;

            rooms[roomId].redCommandNumber = command;

            rooms[roomId].redClickCount++;

            const clickCount = rooms[roomId].redClickCount

            redCommand(command, roomId, clickCount);

            console.log("aaa");
        }

        if (data.type === "blueCommand") {

            const roomId = socket.roomId;

            const command = data.command;

            rooms[roomId].blueCommandNumber = command;

            rooms[roomId].blueClickCount++;

            const clickCount = rooms[roomId].blueClickCount

            blueCommand(command, roomId, clickCount);

            console.log("aaa");
        }

        if (data.type === "redChooseSkill") {

            const roomId = socket.roomId;

            const skill = data.skill;

            console.log(skill);

            if (rooms[roomId].redSkillCount === 0 && rooms[roomId].count !== 1) {

                rooms[roomId].redCommands.skill = skill;

                console.log("赤スキル：" + rooms[roomId].redCommands.skill);
            } else {

                console.log("スキルが選択できなかった！");
            }

        }

        if (data.type === "blueChooseSkill") {

            const roomId = socket.roomId;
            
            const skill = data.skill;

            console.log(skill);

            if (rooms[roomId].blueSkillCount === 0 && rooms[roomId].count !== 1) {

                rooms[roomId].blueCommands.skill = skill;

                console.log("青スキル" + rooms[roomId].blueCommands.skill);
            } else {

                console.log("スキルが選択できなかった！");
            }


        }

        if (data.type === "redReady") {

            const roomId = socket.roomId;

            console.log("赤の準備完了！")

            rooms[roomId].redReady = true;

            if (rooms[roomId].redReady === true && rooms[roomId].blueReady === true) {

                rooms[roomId].player.forEach((player) => {

                    console.log("コマンドを消します！");

                    player.send(JSON.stringify({
                        type: "commandFinish"
                    }));
                });

                confirmation(roomId);
            }

        }

        if (data.type === "blueReady") {

            const roomId = socket.roomId;

            console.log("青の準備完了！")

            rooms[roomId].blueReady = true;

            if (rooms[roomId].redReady === true && rooms[roomId].blueReady === true) {

                rooms[roomId].player.forEach((player) => {

                    console.log("コマンドを消します！");

                    player.send(JSON.stringify({
                        type: "commandFinish"
                    }));
                });

                confirmation(roomId);
            }

        }

        if (data.type === "oneMore") {

            const roomId = socket.roomId;

            rooms[roomId].redPosition.x = 4;
            rooms[roomId].redPosition.y = 7;
            rooms[roomId].bluePosition.x = 4;
            rooms[roomId].bluePosition.y = 1;
            rooms[roomId].redCommands.move = [];
            rooms[roomId].redCommands.skill = undefined;
            rooms[roomId].blueCommands.move = [];
            rooms[roomId].blueCommands.skill = undefined;
            rooms[roomId].redReady = false;
            rooms[roomId].blueReady = false;
            rooms[roomId].count = 1;
            rooms[roomId].redSkillCount = 0;
            rooms[roomId].blueSkillCount = 0;
            rooms[roomId].redClickCount = 0;
            rooms[roomId].blueClickCount = 0;
            rooms[roomId].redDice = undefined;
            rooms[roomId].blueDice = undefined;
            rooms[roomId].redDiceNext = undefined;
            rooms[roomId].blueDiceNext = undefined;
            rooms[roomId].redFinish = false;
            rooms[roomId].blueFinish = false;

            console.log("ゲーム開始！");
            console.log("部屋番号：" + roomId);

            rooms[roomId].player.forEach((player) => {

                console.log("このplayerの番号：" + player.playerNumber);

                console.log("startを送信！");

                player.send(JSON.stringify({
                    type: "oneMoreStart",
                    redX: rooms[roomId].redPosition.x,
                    redY: rooms[roomId].redPosition.y,
                    blueX: rooms[roomId].bluePosition.x,
                    blueY: rooms[roomId].bluePosition.y,
                    playerNumber: player.playerNumber
                }));

            });

        }














    });

    

    function redCommand(command, roomId, clickCount) {

        const dice = rooms[roomId].redDice;

        if (dice >= 1 && clickCount === 1) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice >= 2 && clickCount === 2) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice >= 3 && clickCount === 3) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice >= 4 && clickCount === 4) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice >= 5 && clickCount === 5) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice >= 6 && clickCount === 6) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));

        } else if (dice === undefined && clickCount === 1) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice === undefined && clickCount === 2) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice === undefined && clickCount === 3) {

            rooms[roomId].redCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "redChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        }



        console.log(command);

        console.log("赤：" + rooms[roomId].redCommands.move);
    }



    function blueCommand(command, roomId, clickCount) {

        const dice = rooms[roomId].blueDice;

        if (dice >= 1 && clickCount === 1) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice >= 2 && clickCount === 2) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice >= 3 && clickCount === 3) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice >= 4 && clickCount === 4) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice >= 5 && clickCount === 5) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice >= 6 && clickCount === 6) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice === undefined && clickCount === 1) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice === undefined && clickCount === 2) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        } else if (dice === undefined && clickCount === 3) {

            rooms[roomId].blueCommands.move.push(command);

            socket.send(JSON.stringify({
                type: "blueChoose",
                clickCount: clickCount,
                command: command,
                dice: dice
            }));
        }

        console.log(command);

        console.log("青：" + rooms[roomId].blueCommands.move);
    }



    function confirmation(roomId) {

        setTimeout(() => {

            const redSkill = rooms[roomId].redCommands.skill;
            const blueSkill = rooms[roomId].blueCommands.skill;

            console.log("redSkill =" + redSkill);

            if (rooms[roomId].redDiceNext !== undefined) {

                rooms[roomId].redDiceNext++;

                console.log(rooms[roomId].redDiceNext)

            } else if (rooms[roomId].blueDiceNext !== undefined) {

                rooms[roomId].blueDiceNext++;

            }

            if (redSkill === undefined &&
                blueSkill === undefined) {

                redMove(roomId);
                blueMove(roomId);

            } else if (redSkill !== undefined &&
                blueSkill === undefined) {

                console.log("赤スキル発動！");

                redSkillFunction(redSkill, roomId);

                setTimeout(() => {

                    blueMove(roomId);

                }, 3000);

            } else if (redSkill === undefined &&
                blueSkill !== undefined) {

                blueSkillFunction(blueSkill, roomId);

                setTimeout(() => {

                    redMove(roomId);

                }, 3000);

            } else if (redSkill !== undefined &&
                blueSkill !== undefined) {

                redSkillFunction(redSkill, roomId);

                setTimeout(() => {

                    blueSkillFunction(blueSkill, roomId);

                }, 3000)

            }

            rooms[roomId].count++;

        }, 700)


    }

    function commandStart(roomId) {

        console.log("redFinish =" + rooms[roomId].redFinish);
        console.log("blueFinish =" + rooms[roomId].blueFinish);

        console.log(
            rooms[roomId].redDice,
            rooms[roomId].blueDice,
            rooms[roomId].redDiceNext,
            rooms[roomId].blueDiceNext
        )

        if (rooms[roomId].redFinish === true && rooms[roomId].blueFinish === true) {

            console.log("通過！");

            rooms[roomId].player.forEach((player) => {

                console.log("コマンドを表示します！");

                player.send(JSON.stringify({
                    type: "commandStart",
                    redDice: rooms[roomId].redDice,
                    blueDice: rooms[roomId].blueDice,
                    redDiceNext: rooms[roomId].redDiceNext,
                    blueDiceNext: rooms[roomId].blueDiceNext,
                    playerNumber: socket.playerNumber
                }));
            });

            rooms[roomId].redClickCount = 0;
            rooms[roomId].blueClickCount = 0;

            rooms[roomId].redFinish = false;
            rooms[roomId].blueFinish = false;

            if (rooms[roomId].redDiceNext === 2) {

                rooms[roomId].redDice = undefined;
                rooms[roomId].redDiceNext = undefined;

            } else if (rooms[roomId].blueDiceNext === 2) {

                rooms[roomId].blueDice = undefined;
                rooms[roomId].blueDiceNext = undefined;

            }
        }


    }

    function redMove(roomId) {

        const commands = rooms[roomId].redCommands.move;

        console.log(rooms[roomId].redDice + "回！");

        setTimeout(() => {

            if (commands[0] === 0) {

                console.log("1回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[0] === 1) {

                console.log("１回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[0] === 2) {

                console.log("１回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[0] === 3) {

                console.log("１回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 1) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 1000);



        setTimeout(() => {

            if (commands[1] === 0) {

                console.log("２回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[1] === 1) {

                console.log("２回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[1] === 2) {

                console.log("２回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[1] === 3) {

                console.log("２回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 2) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 2000);

        setTimeout(() => {

            if (commands[2] === 0) {

                console.log("３回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[2] === 1) {

                console.log("３回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[2] === 2) {

                console.log("３回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[2] === 3) {

                console.log("３回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 3) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 3000);

        setTimeout(() => {

            if (commands[3] === 0) {

                console.log("４回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[3] === 1) {

                console.log("４回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[3] === 2) {

                console.log("４回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[3] === 3) {

                console.log("４回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 4) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 4000);

        setTimeout(() => {

            if (commands[4] === 0) {

                console.log("５回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[4] === 1) {

                console.log("５回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[4] === 2) {

                console.log("５回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[4] === 3) {

                console.log("５回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 5) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 5000);

        setTimeout(() => {

            if (commands[5] === 0) {

                console.log("６回目：赤上に移動！");

                redOneUp(roomId);

            } else if (commands[5] === 1) {

                console.log("６回目：赤下に移動！");

                redOneDown(roomId);

            } else if (commands[5] === 2) {

                console.log("６回目：赤左に移動！");

                redOneLeft(roomId);

            } else if (commands[5] === 3) {

                console.log("６回目：赤右に移動！");

                redOneRight(roomId);

            }

            if (commands.length === 6) {

                rooms[roomId].redCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].redFinish = true;

                commandStart(roomId);
            }

        }, 6000);





    }

    function blueMove(roomId) {

        const commands = rooms[roomId].blueCommands.move;
        const redPosition = rooms[roomId].redPosition;
        const bluePosition = rooms[roomId].bluePosition;

        setTimeout(() => {

            if (commands[0] === 0) {

                console.log("1回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[0] === 1) {

                console.log("１回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[0] === 2) {

                console.log("１回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[0] === 3) {

                console.log("１回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 1) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId);
            }

        }, 1000);

        setTimeout(() => {

            if (commands[1] === 0) {

                console.log("２回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[1] === 1) {

                console.log("２回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[1] === 2) {

                console.log("２回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[1] === 3) {

                console.log("２回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 2) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId);
            }

        }, 2000);

        setTimeout(() => {

            if (commands[2] === 0) {

                console.log("３回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[2] === 1) {

                console.log("３回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[2] === 2) {

                console.log("３回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[2] === 3) {

                console.log("３回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 3) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId)
            }

        }, 3000);

        setTimeout(() => {

            if (commands[3] === 0) {

                console.log("４回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[3] === 1) {

                console.log("４回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[3] === 2) {

                console.log("４回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[3] === 3) {

                console.log("４回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 4) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId)
            }

        }, 4000);

        setTimeout(() => {

            if (commands[4] === 0) {

                console.log("５回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[4] === 1) {

                console.log("５回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[4] === 2) {

                console.log("５回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[4] === 3) {

                console.log("５回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 5) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId)
            }

        }, 5000);

        setTimeout(() => {

            if (commands[5] === 0) {

                console.log("６回目：青上に移動！");

                blueOneUp(roomId);

            } else if (commands[5] === 1) {

                console.log("６回目：青下に移動！");

                blueOneDown(roomId);

            } else if (commands[5] === 2) {

                console.log("６回目：青左に移動！");

                blueOneLeft(roomId);

            } else if (commands[5] === 3) {

                console.log("６回目：青右に移動！");

                blueOneRight(roomId);

            }

            if (redPosition.x === bluePosition.x && redPosition.y === bluePosition.y) {
                redWin(roomId)
            }

            if (commands.length === 6) {

                rooms[roomId].blueCommands.move = [];

                rooms[roomId].redReady = false;
                rooms[roomId].blueReady = false;

                rooms[roomId].blueFinish = true;

                commandStart(roomId)
            }

        }, 6000);




    }








    function redOneUp(roomId) {

        const redPosition = rooms[roomId].redPosition;

        const currentY = redPosition.y;

        if (redPosition.y !== 0) {

            redPosition.y--;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + redPosition.y);
                console.log("情報を送信：" + currentY);

                player.send(JSON.stringify({
                    type: "redOneUp",
                    redY: redPosition.y,
                    currentY: currentY
                }));
            });
        }

    }


    function redOneDown(roomId) {

        const redPosition = rooms[roomId].redPosition;

        const currentY = redPosition.y;

        if (redPosition.y !== 8) {

            redPosition.y++;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + redPosition.y);
                console.log("情報を送信：" + currentY);

                player.send(JSON.stringify({
                    type: "redOneDown",
                    redY: redPosition.y,
                    currentY: currentY
                }));
            });
        }

    }

    function redOneLeft(roomId) {

        const redPosition = rooms[roomId].redPosition;

        const currentX = redPosition.x;

        if (redPosition.x !== 0) {

            redPosition.x--;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + redPosition.x);
                console.log("情報を送信：" + currentX);

                player.send(JSON.stringify({
                    type: "redOneLeft",
                    redX: redPosition.x,
                    currentX: currentX
                }));
            });
        }

    }

    function redOneRight(roomId) {

        const redPosition = rooms[roomId].redPosition;

        const currentX = redPosition.x;

        if (redPosition.x !== 8) {

            redPosition.x++;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + redPosition.x);
                console.log("情報を送信：" + currentX);

                player.send(JSON.stringify({
                    type: "redOneRight",
                    redX: redPosition.x,
                    currentX: currentX
                }));
            });
        }

    }


    function blueOneUp(roomId) {

        const bluePosition = rooms[roomId].bluePosition;

        const currentY = bluePosition.y;

        if (bluePosition.y !== 0) {

            bluePosition.y--;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + bluePosition.y);
                console.log("情報を送信：" + currentY);

                player.send(JSON.stringify({
                    type: "blueOneUp",
                    blueY: bluePosition.y,
                    currentY: currentY
                }));
            });
        }

    }

    function blueOneDown(roomId) {

        const bluePosition = rooms[roomId].bluePosition;

        const currentY = bluePosition.y;

        if (bluePosition.y !== 9) {

            bluePosition.y++;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + bluePosition.y);
                console.log("情報を送信：" + currentY);

                player.send(JSON.stringify({
                    type: "blueOneDown",
                    blueY: bluePosition.y,
                    currentY: currentY
                }));
            });

            if (bluePosition.y === 9) {

                blueWin(roomId)
            }
        }

    }

    function blueOneLeft(roomId) {

        const bluePosition = rooms[roomId].bluePosition;

        const currentX = bluePosition.x;

        if (bluePosition.x !== 0) {

            bluePosition.x--;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + bluePosition.x);
                console.log("情報を送信：" + currentX);

                player.send(JSON.stringify({
                    type: "blueOneLeft",
                    blueX: bluePosition.x,
                    currentX: currentX
                }));
            });
        }

    }

    function blueOneRight(roomId) {

        const bluePosition = rooms[roomId].bluePosition;

        const currentX = bluePosition.x;

        if (bluePosition.x !== 8) {

            bluePosition.x++;

            rooms[roomId].player.forEach((player) => {

                console.log("情報を送信：" + bluePosition.x);
                console.log("情報を送信：" + currentX);

                player.send(JSON.stringify({
                    type: "blueOneRight",
                    blueX: bluePosition.x,
                    currentX: currentX
                }));
            });
        }

    }

    function redWin(roomId) {

        console.log("赤が青を捕まえました！");

        rooms[roomId].player.forEach((player) => {

            player.send(JSON.stringify({
                type: "redWin"
            }));
        });

    }

    function blueWin(roomId) {

        console.log("青が逃げ切りました！");

        rooms[roomId].player.forEach((player) => {

            player.send(JSON.stringify({
                type: "blueWin"
            }));
        });
    }

    function redSkillFunction(skill, roomId) {

        const redPosition = rooms[roomId].redPosition;
        const bluePosition = rooms[roomId].bluePosition;

        rooms[roomId].player.forEach((player) => {

            player.send(JSON.stringify({
                type: "skillActive_0",
            }));
        });

        setTimeout(() => {

            console.log("スキル：" + skill);

            if (skill === 0) {

                console.log("入れ替え発動！");

                const temp = {
                    x: redPosition.x,
                    y: redPosition.y
                };

                redPosition.x = bluePosition.x;
                redPosition.y = bluePosition.y;

                bluePosition.x = temp.x;
                bluePosition.y = temp.y;

                rooms[roomId].player.forEach((player) => {

                    player.send(JSON.stringify({
                        type: "skillChoose_0",
                        redX: redPosition.x,
                        redY: redPosition.y,
                        blueX: bluePosition.x,
                        blueY: bluePosition.y
                    }));
                });

                rooms[roomId].redSkillCount = 1;

            } else if (skill === 1) {

                console.log("運命のダイス発動！");

                rooms[roomId].redDice = Math.floor(Math.random() * 6) + 1;

                const dice = rooms[roomId].redDice;

                rooms[roomId].player.forEach((player) => {

                    player.send(JSON.stringify({
                        type: "diceResult",
                        dice: dice
                    }));
                });


                rooms[roomId].redSkillCount = 1;

                rooms[roomId].redDiceNext = 1;
            }

        }, 2500);

        rooms[roomId].redFinish = true;

        rooms[roomId].redCommands.skill = undefined;

    }

    function blueSkillFunction(skill, roomId) {

        const redPosition = rooms[roomId].redPosition;
        const bluePosition = rooms[roomId].bluePosition;

        if (skill === 0) {

            rooms[roomId].player.forEach((player) => {

                player.send(JSON.stringify({
                    type: "skillActive_0",
                }));
            });

            console.log("入れ替え発動！");

            setTimeout(() => {

                const temp = {
                    x: redPosition.x,
                    y: redPosition.y
                };

                redPosition.x = bluePosition.x;
                redPosition.y = bluePosition.y;

                bluePosition.x = temp.x;
                bluePosition.y = temp.y;



                rooms[roomId].player.forEach((player) => {

                    player.send(JSON.stringify({
                        type: "skillChoose_0",
                        redX: redPosition.x,
                        redY: redPosition.y,
                        blueX: bluePosition.x,
                        blueY: bluePosition.y
                    }));
                });

                rooms[roomId].blueSkillCount = 1;

                rooms[roomId].blueDiceNext = 1;
            }, 2500);

            rooms[roomId].blueFinish = true;

            rooms[roomId].blueCommands.skill = undefined;
        }
    }






});







