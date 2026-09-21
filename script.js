// const { Direction } = require("@minecraft/server");

// const { Block } = require("@minecraft/server");

const roomMessage = document.getElementById("roomMessage");
const createRoom = document.getElementById("createRoom");

const roomInput = document.getElementById("roomInput");
const joinRoom = document.getElementById("joinRoom");
const joinMessage = document.getElementById("joinMessage");

const socket = new WebSocket("ws://localhost:8080");

const playerCount = document.getElementById("playerCount");

const gameStart = document.getElementById("gameStart");

const game = document.getElementById("game");
const matching = document.getElementById("matching");

const skill0 = document.getElementById("skill0");
const skill1 = document.getElementById("skill1");

let skillNumber = 0;

const playerNumber = document.getElementById("playerNumber");

let player = 0;



let start = false;

socket.addEventListener("open", () => {
    console.log("サーバーに接続しました！");
});

socket.addEventListener("message", (event) => {

    console.log("サーバーから受信:", event.data);

    const data = JSON.parse(event.data);

    if (data.type === "roomCreated") {

        roomMessage.textContent = "部屋番号：" + data.roomId;

    }

    if (data.type === "joinResult") {

        joinMessage.textContent = data.message;

    }

    if (data.type === "playerCount") {

        playerCount.textContent = "参加人数：" + data.count + "人";

    }

    if (data.type === "playerNumber") {

        playerNumber.textContent = "あなた：プレイヤー" + data.number;

        if (data.number === 1) {
            gameStart.style.display = "block";
        }

        player = data.number;

        console.log(player);
    }

    if (data.type === "start") {

        console.log("aaa");
        start = true;

        const redX = data.redX
        const redY = data.redY;
        const blueX = data.blueX;
        const blueY = data.blueY;


        run(redX, redY, blueX, blueY);

        console.log(redX);
        console.log(redY);
        console.log(blueX);
        console.log(blueY);

        updataButton();
    }






    // ゲームシステム

    if (data.type === "redChoose") {

        const clickCount = data.clickCount;

        const command = data.command;

        const dice = data.dice;

        console.log(clickCount, command);

        if (clickCount === 1) {

            redCommands.style.display = "block"

            if (command === 0) {

                redFirst.textContent = "１回目：上 "

            } else if (command === 1) {

                redFirst.textContent = "１回目：下 "

            } else if (command === 2) {

                redFirst.textContent = "１回目：左 "

            } else if (command === 3) {

                redFirst.textContent = "１回目：右 "

            }
        }

        if (clickCount === 2) {

            redCommands.style.display = "block"

            if (command === 0) {

                redSecond.textContent = "ーー２回目：上 "

            } else if (command === 1) {

                redSecond.textContent = "ーー２回目：下 "

            } else if (command === 2) {

                redSecond.textContent = "ーー２回目：左 "

            } else if (command === 3) {

                redSecond.textContent = "ーー２回目：右 "

            }
        }

        if (clickCount === 3) {

            redCommands.style.display = "block"

            if (command === 0) {

                redThird.textContent = "ーー３回目：上 "

            } else if (command === 1) {

                redThird.textContent = "ーー３回目：下 "

            } else if (command === 2) {

                redThird.textContent = "ーー３回目：左 "

            } else if (command === 3) {

                redThird.textContent = "ーー３回目：右 "

            }
        }

        if (clickCount === 4) {

            if (command === 0) {

                red4th.textContent = "ーー４回目：上"

            } else if (command === 1) {

                red4th.textContent = "ーー４回目：下"

            } else if (command === 2) {

                red4th.textContent = "ーー４回目：左"

            } else if (command === 3) {

                red4th.textContent = "ーー４回目：右"

            }
        }

        if (clickCount === 5) {

            if (command === 0) {

                red5th.textContent = "ーー５回目：上"

            } else if (command === 1) {

                red5th.textContent = "ーー５回目：下"

            } else if (command === 2) {

                red5th.textContent = "ーー５回目：左"

            } else if (command === 3) {

                red5th.textContent = "ーー５回目：右"

            }
        }

        if (clickCount === 6) {

            if (command === 0) {

                red6th.textContent = "ーー６回目：上"

            } else if (command === 1) {

                red6th.textContent = "ーー６回目：下"

            } else if (command === 2) {

                red6th.textContent = "ーー６回目：左"

            } else if (command === 3) {

                red6th.textContent = "ーー６回目：右"

            }
        }
    }

    if (data.type === "blueChoose") {

        const clickCount = data.clickCount;

        const command = data.command;

        console.log(clickCount, command);

        if (clickCount === 1) {

            blueCommands.style.display = "block"

            if (command === 0) {

                blueFirst.textContent = "１回目：上"

            } else if (command === 1) {

                blueFirst.textContent = "１回目：下"

            } else if (command === 2) {

                blueFirst.textContent = "１回目：左"

            } else if (command === 3) {

                blueFirst.textContent = "１回目：右"

            }
        }

        if (clickCount === 2) {

            if (command === 0) {

                blueSecond.textContent = "ーー２回目：上"

            } else if (command === 1) {

                blueSecond.textContent = "ーー２回目：下"

            } else if (command === 2) {

                blueSecond.textContent = "ーー２回目：左"

            } else if (command === 3) {

                blueSecond.textContent = "ーー２回目：右"

            }
        }

        if (clickCount === 3) {

            if (command === 0) {

                blueThird.textContent = "ーー３回目：上"

            } else if (command === 1) {

                blueThird.textContent = "ーー３回目：下"

            } else if (command === 2) {

                blueThird.textContent = "ーー３回目：左"

            } else if (command === 3) {

                blueThird.textContent = "ーー３回目：右"

            }
        }

        if (clickCount === 4) {

            blueCommands.style.display = "block"

            if (command === 0) {

                blueFirst.textContent = "４回目：上"

            } else if (command === 1) {

                blueFirst.textContent = "４回目：下"

            } else if (command === 2) {

                blueFirst.textContent = "４回目：左"

            } else if (command === 3) {

                blueFirst.textContent = "４回目：右"

            }
        }

        if (clickCount === 5) {

            blueCommands.style.display = "block"

            if (command === 0) {

                blueFirst.textContent = "５回目：上"

            } else if (command === 1) {

                blueFirst.textContent = "５回目：下"

            } else if (command === 2) {

                blueFirst.textContent = "５回目：左"

            } else if (command === 3) {

                blueFirst.textContent = "５回目：右"

            }
        }

        if (clickCount === 6) {

            blueCommands.style.display = "block"

            if (command === 0) {

                blueFirst.textContent = "６回目：上"

            } else if (command === 1) {

                blueFirst.textContent = "６回目：下"

            } else if (command === 2) {

                blueFirst.textContent = "６回目：左"

            } else if (command === 3) {

                blueFirst.textContent = "６回目：右"

            }
        }


    }

    if (data.type === "commandStart") {

        const redDice = data.redDice;
        const blueDice = data.blueDice;
        const redDiceNext = data.redDiceNext;
        const blueDiceNext = data.blueDiceNext;

        console.log("command start!");

        red.style.display = "block";

        blue.style.display = "block";

        console.log(redDice, redDiceNext);

        if (redDice >= 4 && redDiceNext === 2) {

            red4th.style.display = "none";
            red5th.style.display = "none";
            red6th.style.display = "none";

        } else if (redDice <= 3 && redDiceNext === 2) {

            redFirst.style.display = "block";
            redSecond.style.display = "block";
            redThird.style.display = "block";
        }

        updataButton();
    }

    if (data.type === "commandFinish") {

        console.log("move start!");

        redFirst.textContent = "？";
        redSecond.textContent = "ーー？";
        redThird.textContent = "ーー？";

        blueFirst.textContent = "？";
        blueSecond.textContent = "ーー？";
        blueThird.textContent = "ーー？";

        red.style.display = "none";

        blue.style.display = "none";
    }











    if (data.type === "redOneUp") {

        console.log("上に1マス");

        const redY = data.redY;
        const currentY = data.currentY;

        const moveY = y[redY] - y[currentY];

        red_tp.style.setProperty("--red_suraimu_next_Y", moveY + "px");

        red_tp.style.animation = "none";

        requestAnimationFrame(() => {

            red_tp.style.animation = "redMoveUpDown 0.3s linear";

            setTimeout(() => {

                red_tp.style.setProperty("--red_suraimu-top", y[redY] + "px");

                red_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "redOneDown") {

        console.log("下に1マス");

        const redY = data.redY;
        const currentY = data.currentY;

        const moveY = y[redY] - y[currentY];

        red_tp.style.setProperty("--red_suraimu_next_Y", moveY + "px");

        red_tp.style.animation = "none";

        requestAnimationFrame(() => {

            red_tp.style.animation = "redMoveUpDown 0.3s linear";

            setTimeout(() => {

                red_tp.style.setProperty("--red_suraimu-top", y[redY] + "px");

                red_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "redOneLeft") {

        console.log("左に1マス");

        const redX = data.redX;
        const currentX = data.currentX;

        const moveX = x[redX] - x[currentX];

        red_tp.style.setProperty("--red_suraimu_next_X", moveX + "px");

        red_tp.style.animation = "none";

        requestAnimationFrame(() => {

            red_tp.style.animation = "redMoveLeftRight 0.3s linear";

            setTimeout(() => {

                red_tp.style.setProperty("--red_suraimu-left", x[redX] + "px");

                red_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "redOneRight") {

        console.log("右に1マス");

        const redX = data.redX;
        const currentX = data.currentX;

        const moveX = x[redX] - x[currentX];

        red_tp.style.setProperty("--red_suraimu_next_X", moveX + "px");

        red_tp.style.animation = "none";

        requestAnimationFrame(() => {

            red_tp.style.animation = "redMoveLeftRight 0.3s linear";

            setTimeout(() => {

                red_tp.style.setProperty("--red_suraimu-left", x[redX] + "px");

                red_tp.style.animation = "none";

            }, 200);
        });

    }



    if (data.type === "blueOneUp") {

        console.log("上に1マス");

        const blueY = data.blueY;
        const currentY = data.currentY;

        const moveY = y[blueY] - y[currentY];

        blue_tp.style.setProperty("--blue_suraimu_next_Y", moveY + "px");

        blue_tp.style.animation = "none";

        requestAnimationFrame(() => {

            blue_tp.style.animation = "blueMoveUpDown 0.3s linear";

            setTimeout(() => {

                blue_tp.style.setProperty("--blue_suraimu-top", y[blueY] + "px");

                blue_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "blueOneDown") {

        console.log("下に1マス");

        const blueY = data.blueY;
        const currentY = data.currentY;

        const moveY = y[blueY] - y[currentY];

        blue_tp.style.setProperty("--blue_suraimu_next_Y", moveY + "px");

        blue_tp.style.animation = "none";

        requestAnimationFrame(() => {

            blue_tp.style.animation = "blueMoveUpDown 0.3s linear";

            setTimeout(() => {

                blue_tp.style.setProperty("--blue_suraimu-top", y[blueY] + "px");

                blue_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "blueOneLeft") {

        console.log("左に1マス");

        const blueX = data.blueX;
        const currentX = data.currentX;

        const moveX = x[blueX] - x[currentX];

        blue_tp.style.setProperty("--blue_suraimu_next_X", moveX + "px");

        blue_tp.style.animation = "none";

        requestAnimationFrame(() => {

            blue_tp.style.animation = "blueMoveLeftRight 0.3s linear";

            setTimeout(() => {

                blue_tp.style.setProperty("--blue_suraimu-left", x[blueX] + "px");

                blue_tp.style.animation = "none";

            }, 200);
        });

    }

    if (data.type === "blueOneRight") {

        console.log("右に1マス");

        const blueX = data.blueX;
        const currentX = data.currentX;

        const moveX = x[blueX] - x[currentX];

        blue_tp.style.setProperty("--blue_suraimu_next_X", moveX + "px");

        blue_tp.style.animation = "none";

        requestAnimationFrame(() => {

            blue_tp.style.animation = "blueMoveLeftRight 0.3s linear";

            setTimeout(() => {

                blue_tp.style.setProperty("--blue_suraimu-left", x[blueX] + "px");

                blue_tp.style.animation = "none";

            }, 200);
        });

    }

    // スキルシステム

    if (data.type === "skillChoose_0") {

        console.log("入れ替わり!");

        const redX = data.redX;

        const redY = data.redY;

        const blueX = data.blueX;

        const blueY = data.blueY;

        red_tp.style.setProperty("--red_suraimu-top", y[redY] + "px");
        red_tp.style.setProperty("--red_suraimu-left", x[redX] + "px");

        blue_tp.style.setProperty("--blue_suraimu-top", y[blueY] + "px");
        blue_tp.style.setProperty("--blue_suraimu-left", x[blueX] + "px");
    }

    if (data.type === "skillActive_0") {

        const skillActive = document.getElementById("skillActive");

        skillActive.style.display = "block";

        skillActive.style.animation = "move1 0.3s ease-out"

        sound3.play();

        setTimeout(() => {

            skillActive.style.display = "none";

        }, 2000);
    }

    if (data.type === "diceResult") {

        const dice = data.dice;

        console.log("サイコロの結果：" + dice);

        diceResult.textContent = dice + "回！";

        setTimeout(() => {

            redFirst.style.display = "none";
            redSecond.style.display = "none";
            redThird.style.display = "none";
            red4th.style.display = "none";
            red5th.style.display = "none";
            red6th.style.display = "none";

            if (dice >= 1) {

                redFirst.style.display = "block";

                if (dice >= 2) {

                    redSecond.style.display = "block";

                    if (dice >= 3) {

                        redThird.style.display = "block";

                        if (dice >= 4) {

                            red4th.style.display = "block";

                            if (dice >= 5) {

                                red5th.style.display = "block";

                                if (dice === 6) {

                                    red6th.style.display = "block";
                                }
                            }
                        }
                    }
                }
            }

            diceResult.style.display = "none";
        }, 1200);
    }

    if (data.type === "redWin") {
        
        redFinish.style.display = "block";
        redResult.textContent = "YOU WIN!";
        blueFinish.style.display = "block";
        blueResult.textContent = "YOU LOSE...";

        updataButton();

    }

    if (data.type === "blueWin") {
        
        blueFinish.style.display = "block";
        blueResult.textContent = "YOU WIN!";
        redFinish.style.display = "block";
        redResult.textContent = "YOU LOSE...";
        

        updataButton();

    }

    if (data.type === "oneMoreStart") {
        
        start = true;

        const redX = data.redX
        const redY = data.redY;
        const blueX = data.blueX;
        const blueY = data.blueY;


        run(redX, redY, blueX, blueY);

        console.log(redX);
        console.log(redY);
        console.log(blueX);
        console.log(blueY);

        blueFinish.style.display = "none";
        redFinish.style.display = "none";

        updataButton();
    }







});

createRoom.addEventListener("click", () => {

    console.log("部屋を作るボタンが押されました！");

    socket.send(JSON.stringify({
        type: "createRoom"
    }));

});

joinRoom.addEventListener("click", () => {

    const roomId = roomInput.value;

    console.log("参加ボタンを押しました！");
    console.log("部屋番号:", roomId);
    console.log("WebSocket状態:", socket.readyState);

    socket.send(JSON.stringify({
        type: "joinRoom",
        roomId: roomId
    }));

    console.log("サーバーに送信しました！")
});

gameStart.addEventListener("click", () => {

    console.log("game start!")

    socket.send(JSON.stringify({
        type: "gameStart"
    }));


});

skill0.addEventListener("click", () => {

    skillNumber = 0;

    console.log(skillNumber);
});

skill1.addEventListener("click", () => {

    skillNumber = 1;

    console.log(skillNumber);
});







function run(redX, redY, blueX, blueY) {
    if (start === true) {

        console.log("bbb")

        matching.style.display = "none";

        game.style.display = "block";

        console.log("game:", game);
        console.log("field:", document.querySelector(".board"));





        red_tp.style.setProperty("--red_suraimu-top", y[redY] + "px");
        red_tp.style.setProperty("--red_suraimu-left", x[redX] + "px");

        blue_tp.style.setProperty("--blue_suraimu-top", y[blueY] + "px");
        blue_tp.style.setProperty("--blue_suraimu-left", x[blueX] + "px");
    }

}

function updataButton() {

    console.log(player);
    
    if (player === 1) {
        
        red.style.display = "block";
        blue.style.display = "none";

    } else if (player === 2) {
        
        red.style.display = "none";
        blue.style.display = "block";

    }
}

const redUp = document.getElementById("redUp");
const redDown = document.getElementById("redDown");
const redLeft = document.getElementById("redLeft");
const redRight = document.getElementById("redRight");

const blueUp = document.getElementById("blueUp");
const blueDown = document.getElementById("blueDown");
const blueLeft = document.getElementById("blueLeft");
const blueRight = document.getElementById("blueRight");

const redChooseSkill = document.getElementById("redChooseSkill");
const blueChooseSkill = document.getElementById("blueChooseSkill");

const redReady = document.getElementById("redReady");
const blueReady = document.getElementById("blueReady");


const red_tp = document.getElementById("red_suraimu");
const blue_tp = document.getElementById("blue_suraimu");

const redFirst = document.getElementById("redFirst");
const redSecond = document.getElementById("redSecond");
const redThird = document.getElementById("redThird");
const red4th = document.getElementById("red4th");
const red5th = document.getElementById("red5th");
const red6th = document.getElementById("red6th");

const redCommands = document.getElementById("redCommands");

const blueFirst = document.getElementById("blueFirst");
const blueSecond = document.getElementById("blueSecond");
const blueThird = document.getElementById("blueThird");

const blueCommands = document.getElementById("blueCommands");

const red = document.getElementById("red");
const blue = document.getElementById("blue");

const diceResult = document.getElementById("diceResult");

const redResult = document.getElementById("redResult");
const blueResult = document.getElementById("blueResult");
const oneMore = document.getElementById("oneMore");

const redFinish = document.getElementById("redFinish");
const blueFinish = document.getElementById("blueFinish");



const sound1 = new Audio("sound1.mp3");
const sound2 = new Audio("sound2.mp3");
const sound3 = new Audio("sound3.mp3");



const x = [8, 75, 143, 212, 281, 349, 417, 485, 553];
const y = [0, 53, 106, 160, 218, 272, 327, 382, 436, 500];








redUp.addEventListener("click", () => {

    console.log("サーバーに赤上を送信！")

    socket.send(JSON.stringify({
        type: "redCommand",
        command: 0
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

redDown.addEventListener("click", () => {

    console.log("サーバーに赤下を送信！")

    socket.send(JSON.stringify({
        type: "redCommand",
        command: 1
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

redLeft.addEventListener("click", () => {

    console.log("サーバーに赤左を送信！")

    socket.send(JSON.stringify({
        type: "redCommand",
        command: 2
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

redRight.addEventListener("click", () => {

    console.log("サーバーに赤右を送信！")

    socket.send(JSON.stringify({
        type: "redCommand",
        command: 3
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});



blueUp.addEventListener("click", () => {

    console.log("サーバーに青上を送信！")

    socket.send(JSON.stringify({
        type: "blueCommand",
        command: 0
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

blueDown.addEventListener("click", () => {

    console.log("サーバーに青下を送信！")

    socket.send(JSON.stringify({
        type: "blueCommand",
        command: 1
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

blueLeft.addEventListener("click", () => {

    console.log("サーバーに青左を送信！")

    socket.send(JSON.stringify({
        type: "blueCommand",
        command: 2
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

blueRight.addEventListener("click", () => {

    console.log("サーバーに青右を送信！")

    socket.send(JSON.stringify({
        type: "blueCommand",
        command: 3
    }));

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

redChooseSkill.addEventListener("click", () => {

    console.log("サーバーに赤スキルを送信！");

    if (skillNumber === 0) {

        socket.send(JSON.stringify({
            type: "redChooseSkill",
            skill: 0
        }));
    } else if (skillNumber === 1) {

        socket.send(JSON.stringify({
            type: "redChooseSkill",
            skill: 1
        }));
    }

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

blueChooseSkill.addEventListener("click", (skillNumber) => {

    console.log("サーバーに青スキルを送信！");

    if (skillNumber === 0) {

        socket.send(JSON.stringify({
            type: "blueChooseSkill",
            skill: 0
        }));
    } else if (skillNumber === 1) {

        socket.send(JSON.stringify({
            type: "blueChooseSkill",
            skill: 1
        }));
    }

    sound1.pause();
    sound1.currentTime = 0;
    sound1.play();
});

redReady.addEventListener("click", () => {

    console.log("サーバーに赤決定を送信！")

    socket.send(JSON.stringify({
        type: "redReady",

    }));

    sound2.pause();
    sound2.currentTime = 0;
    sound2.play();
});

blueReady.addEventListener("click", () => {

    console.log("サーバーに青決定を送信！")

    socket.send(JSON.stringify({
        type: "blueReady",

    }));

    sound2.pause();
    sound2.currentTime = 0;
    sound2.play();


});

oneMore.addEventListener("click", () => {

    console.log("サーバーに赤続行を送信！");

    socket.send(JSON.stringify({
        type: "oneMore"
    }));
})





