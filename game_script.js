// alert("ゲームを始めますか？")

let red_masu_x = 4;
let red_masu_y = 7;
let blue_masu_x = 4;
let blue_masu_y = 1;
const x = [8, 75, 143, 212, 281, 349, 417, 485, 553];
const y = [0, 53, 106, 160, 218, 272, 327, 382, 436, 500];

const red_tp = document.querySelector(".red_suraimu");
const blue_tp = document.querySelector(".blue_suraimu");

let red_move = 0;

let red_first = undefined;
let red_second = undefined;
let red_third = undefined;

let red_skill = undefined;

let blue_first = undefined;
let blue_second = undefined;
let blue_third = undefined;

let blue_skill = undefined;

let red_number = 1;
let blue_number = 1;

let red_comp = 0;
let blue_comp = 0;

let red_skill_finish = 0;
let blue_skill_finish = 0;

let finish = 0;

let count = 1;

let red_skill_count = 0;
let blue_skill_count = 0;



red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px");

blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px"); 

document.querySelector(".skill_1").style.display = "none";



const music = document.querySelector(".gameBGM");

music.volume = 0.5;
// playBGM()

console.log(music.duration)
    
// 192.168.1.70
    

function playBGM() {
    music.play()
    setTimeout(function() {
        music.pause()
        playBGM()
    }, 69800)
}

function red_button() {

    red_masu_x = Math.floor(Math.random() * 9);
    red_masu_y = Math.floor(Math.random() * 9);

    red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
    red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px"); 

    console.log(red_masu_x, red_masu_y);
}

function blue_button() {

    blue_masu_x = Math.floor(Math.random() * 9);
    blue_masu_y = Math.floor(Math.random() * 9);

    blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
    blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px"); 

    console.log(blue_masu_x, blue_masu_y);
}


function red_one_up() {

    if (red_masu_y > 0) {
        red_masu_y = red_masu_y - 1;
    }

    console.log("縦  " + red_masu_y + "  ↑")

    
}

function blue_one_up() {

    if (blue_masu_y > 0) {
        blue_masu_y = blue_masu_y - 1;
    }

    console.log("縦  " + blue_masu_y + "  ↑")

    
}

function red_one_down() {

    if (red_masu_y < 8) {
        red_masu_y = red_masu_y + 1;
    }

    console.log("縦  " + red_masu_y + "  ↓")

    
}

function blue_one_down() {

    if (blue_masu_y < 9) {
        blue_masu_y = blue_masu_y + 1;
    }

    console.log("縦  " + blue_masu_y + "  ↓")

    

    if (blue_masu_y == 9) {
        blue_win()
    }
}

function red_one_right() {

    if (red_masu_x < 8) {
        red_masu_x = red_masu_x + 1;
    }

    console.log("横  " + red_masu_x + "  →")

    
}

function blue_one_right() {

    if (blue_masu_x < 8) {
        blue_masu_x = blue_masu_x + 1;
    }

    console.log("横  " + blue_masu_x + "  →")

    
}

function red_one_left() {

    if (red_masu_x > 0) {
        red_masu_x = red_masu_x - 1;
    }

    console.log("横  " + red_masu_x + "  ←")

    
}

function blue_one_left() {

    if (blue_masu_x > 0) {
        blue_masu_x = blue_masu_x - 1;
    }

    console.log("横  " + blue_masu_x + "  ←")

    
}

function red_skip() {
    console.log("行動なし")
}

function blue_skip() {
    console.log("行動なし")
}

function red_random() {
    red_move = Math.floor(Math.random() * 5);
    
    if (red_move == 0) {
        red_one_up()
    }
    if (red_move == 1) {
        red_one_down()
    }
    if (red_move == 2) {
        red_one_right()
    }
    if (red_move == 3) {
        red_one_left()
    }
    if (red_move == 4) {
        red_skip()
    }
    console.log(red_move)
}

function blue_random() {
    blue_move = Math.floor(Math.random() * 5);
    
    if (blue_move == 0) {
        blue_one_up()
    }
    if (blue_move == 1) {
        blue_one_down()
    }
    if (blue_move == 2) {
        blue_one_right()
    }
    if (blue_move == 3) {
        blue_one_left()
    }
    if (blue_move == 4) {
        blue_skip()
    }
    console.log(blue_move)
}


function run() {

    if (red_first == 0) {
        red_one_up()
    } else if (red_first == 1) {
        red_one_down()
    } else if (red_first == 2) {
        red_one_right()
    } else if (red_first == 3) {
        red_one_left()
    } 

    if (blue_first == 0) {
        blue_one_up()
    } else if (blue_first == 1) {
        blue_one_down()
    } else if (blue_first == 2) {
        blue_one_right()
    } else if (blue_first == 3) {
        blue_one_left()
    }

    blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
    blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px");

    red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
    red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px");

    if (red_masu_x == blue_masu_x && red_masu_y == blue_masu_y) {
        red_win()
    }
    
    setTimeout(function() {
        if (finish == 0) {
            if (red_second == 0) {
                red_one_up()
            } else if (red_second == 1) {
                red_one_down()
            } else if (red_second == 2) {
                red_one_right()
            } else if (red_second == 3) {
                red_one_left()
            }

            if (blue_second == 0) {
                blue_one_up()
            } else if (blue_second == 1) {
                blue_one_down()
            } else if (blue_second == 2) {
                blue_one_right()
            } else if (blue_second == 3) {
                blue_one_left()
            }
        }
    }, 1000);

    setTimeout(function() {

        blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
        blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px");

        red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
        red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px");

        if (red_masu_x == blue_masu_x && red_masu_y == blue_masu_y) {
        red_win()
        }

    }, 1000);

    setTimeout(function() {
        if (finish == 0) {
        
            if (red_third == 0) {
                red_one_up()
            } else if (red_third == 1) {
                red_one_down()
            } else if (red_third == 2) {
                red_one_right()
            } else if (red_third == 3) {
                red_one_left()
            }

            if (blue_third == 0) {
                blue_one_up()
            } else if (blue_third == 1) {
                blue_one_down()
            } else if (blue_third == 2) {
                blue_one_right()
            } else if (blue_third == 3) {
                blue_one_left()
            }
        }
    }, 2000);

    setTimeout(function() {

        blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
        blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px");

        red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
        red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px");

        if (red_masu_x == blue_masu_x && red_masu_y == blue_masu_y) {
        red_win()
        }

        red_number = 1
        red_first = undefined
        red_second = undefined
        red_third = undefined
        red_skill = undefined
        red_comp = 0

        blue_number = 1
        blue_first = undefined
        blue_second = undefined
        blue_third = undefined
        blue_skill = undefined
        blue_comp = 0


    
        console.log(red_number, red_first, red_second, red_third)

        console.log(blue_number, blue_first, blue_second, blue_third)

        console.log("あかX" + red_masu_x, "あかY" + red_masu_y, "あおX" + blue_masu_x, "あおY" + blue_masu_y)

    }, 2000)
    

    

}
    



function blue_skill_run() {

    console.log("eee")

    if (blue_skill == 0) {
        skill()

        blue_number = 1
        blue_first = undefined
        blue_second = undefined
        blue_third = undefined
        blue_skill = undefined
        blue_comp = 0
        
        setTimeout(function() {
            run()
            
        }, 2500)
            
        blue_skill_count = 1
    }
}

function red_skill_run() {

    console.log("eee")

    if (red_skill == 0) {
        skill()

        

        red_number = 1
        red_first = undefined
        red_second = undefined
        red_third = undefined
        red_skill = undefined
        red_comp = 0

        setTimeout(function() {
            run()
            
        }, 2500)

        red_skill_count = 1
    }
    
    


}

function red_blue_skill_run() {

    console.log("qqq")

    if (blue_skill == 0) {
        skill()

        blue_number = 1
        blue_first = undefined
        blue_second = undefined
        blue_third = undefined
        blue_skill = undefined
        blue_comp = 0
        
        
            
        blue_skill_count = 1
    }

    setTimeout(function() {
        if (red_skill == 0) {
        skill()

        

        red_number = 1
        red_first = undefined
        red_second = undefined
        red_third = undefined
        red_skill = undefined
        red_comp = 0

        
        red_skill_count = 1
    }}, 2500)

    
}


function red_ready() {
    red_comp = 1
    console.log(red_number, red_first, red_second, red_third)
}

function blue_ready() {
    blue_comp = 1
    console.log(blue_number, blue_first, blue_second, blue_third)
}

function confirmation() {
    if (red_comp == 1 && blue_comp == 1) {

        console.log(red_skill, blue_skill)

        if (red_skill == undefined && blue_skill == undefined) {
            run()
            

            setTimeout(function() {
                time_up_win()
            }, 2000)
        } else if (red_skill !== undefined && blue_skill == undefined) {
            console.log("red skill")
            red_skill_run()

            setTimeout(function() {
                time_up_win()
            }, 4500)
            
        } else if (red_skill == undefined && blue_skill !== undefined) {
            console.log("blue skill")
            blue_skill_run()

            setTimeout(function() {
                time_up_win()
            }, 4500)
            
        } else if (red_skill !== undefined && blue_skill !== undefined) {
            console.log("red blue skill")
            red_blue_skill_run()

            setTimeout(function() {
                time_up_win()
            }, 5000)
        }

        count = count + 1

        console.log(count + "回")
        
    } else {
        alert("相手の準備が完了していません！")
    }
}

function time_up_win() {
    if (count == 6) {
        alert("鬼側が勝利した！")
    } 
}

function red_win() {
    
    if (finish == 0) {

        finish = 1;

        setTimeout(function() {
            alert("捕まえた！！");
        }, 10)
    }
    
}

function blue_win() {

    if (finish == 0) {
        
        finish = 1;

        setTimeout(function() {
            alert("逃げ側が勝利した！");
        }, 10)
    }
    
    
}

function red_up() {
    if (red_number == 1) {
        red_first = 0
        red_number = 2
    } else if (red_number == 2) {
        red_second = 0
        red_number = 3
    } else if (red_number == 3) {
        red_third = 0
    } else if (red_number == 0) {
        console.log("決定を押してください")
    }

    console.log(red_number, red_first, red_second, red_third)
}

function blue_up() {
    if (blue_number == 1) {
        blue_first = 0
        blue_number = 2
    } else if (blue_number == 2) {
        blue_second = 0
        blue_number = 3
    } else if (blue_number == 3) {
        blue_third = 0
    } else if (blue_number == 0) {
        console.log("決定を押してください")
    }

    console.log(blue_number, blue_first, blue_second, blue_third)
}

function red_down() {
    if (red_number == 1) {
        red_first = 1
        red_number = 2
    } else if (red_number == 2) {
        red_second = 1
        red_number = 3
    } else if (red_number == 3) {
        red_third = 1
    } else if (red_number == 0) {
        console.log("決定を押してください")
    }

    console.log(red_number, red_first, red_second, red_third)

}

function blue_down() {
    if (blue_number == 1) {
        blue_first = 1
        blue_number = 2
    } else if (blue_number == 2) {
        blue_second = 1
        blue_number = 3
    } else if (blue_number == 3) {
        blue_third = 1
    } else if (blue_number == 0) {
        console.log("決定を押してください")
    }

    console.log(blue_number, blue_first, blue_second, blue_third)

}

function red_right() {
    if (red_number == 1) {
        red_first = 2
        red_number = 2
    } else if (red_number == 2) {
        red_second = 2
        red_number = 3
    } else if (red_number == 3) {
        red_third = 2
    } else if (red_number == 0) {
        console.log("決定を押してください")
    }

    console.log(red_number, red_first, red_second, red_third)
}

function blue_right() {
    if (blue_number == 1) {
        blue_first = 2
        blue_number = 2
    } else if (blue_number == 2) {
        blue_second = 2
        blue_number = 3
    } else if (blue_number == 3) {
        blue_third = 2
    } else if (blue_number == 0) {
        console.log("決定を押してください")
    }

    console.log(blue_number, blue_first, blue_second, blue_third)
}

function red_left() {
    if (red_number == 1) {
        red_first = 3
        red_number = 2
    } else if (red_number == 2) {
        red_second = 3
        red_number = 3
    } else if (red_number == 3) {
        red_third = 3
    } else if (red_number == 0) {
        console.log("決定を押してください")
    }

    console.log(red_number, red_first, red_second, red_third)
}

function blue_left() {
    if (blue_number == 1) {
        blue_first = 3
        blue_number = 2
    } else if (blue_number == 2) {
        blue_second = 3
        blue_number = 3
    } else if (blue_number == 3) {
        blue_third = 3
    } else if (blue_number == 0) {
        console.log("決定を押してください")
    }

    console.log(blue_number, blue_first, blue_second, blue_third)
}

function red_choose_skill() {
    if (count !== 1) {
        if (red_skill_count == 0) {
            red_skill = 0
        } else {
            alert("スキルの使用は1回までです！")
        }
    } else {
        alert("1回目はスキルが使用できません！")
    }
    
}

function blue_choose_skill() {
    if (count !== 1) {
        if (blue_skill_count == 0) {
            blue_skill = 0
        } else {
            alert("スキルの使用は1回までです！")
        }
    } else {
        alert("1回目はスキルが使用できません！")
    }
    
}

function skill() {
    const btn = document.querySelector(".btn")
    const img1 = document.querySelector(".skill_1")


    img1.style.display = "block";

    setTimeout(function() {
        img1.style.display = "none"

        let temp

        temp = red_masu_x;
        red_masu_x = blue_masu_x;
        blue_masu_x = temp;

        temp = red_masu_y
        red_masu_y = blue_masu_y
        blue_masu_y = temp

        temp = undefined

        red_tp.style.setProperty("--red_suraimu-top", y[red_masu_y] + "px");
        red_tp.style.setProperty("--red_suraimu-left", x[red_masu_x] + "px");

        blue_tp.style.setProperty("--blue_suraimu-top", y[blue_masu_y] + "px");
        blue_tp.style.setProperty("--blue_suraimu-left", x[blue_masu_x] + "px"); 

        console.log("スキル発動！")
    }, 1500)
    


    

}



