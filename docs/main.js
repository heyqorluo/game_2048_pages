import R from "../common/ramda.js";
import game_2048 from "../common/game_2048.js";


const grid_columns = 4;
const grid_rows = 4;

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

let board = game_2048.empty_board();
let score = 0;


//update the style of the cell.
const update_cell_style = function (cell, num) {
    let background_lightness = game_2048.cell_background_color(num);
    let text_lightness = game_2048.cell_text_color(background_lightness);
    cell.style.setProperty(
        "--background-lightness",
        `${background_lightness}%`
    );
    cell.style.setProperty("--text-lightness", `${text_lightness}%`);
    cell.textContent = num;
    if (num === 0) {
        cell.textContent = "";
    }
};


//update the board.
const update_board = function () {
    R.range(0, grid_rows).forEach(function (row_index) {
        R.range(0, grid_columns).forEach(function (column_index) {
            let num = board[row_index][column_index];
            let cell = document.getElementById(`${row_index}-${column_index}`);
            update_cell_style(cell, num);
        });
    });
    //update score.
    score = game_2048.calculate_score(board);
    document.getElementById("score").textContent = score;
};


//generate a new cell.
const generate_cell = function () {
    let count = game_2048.count_empty_cells(board);
    if (count > 0) {
        //random index of empty cell.
        let random_index = Math.floor(Math.random() * count);
        //insert either 2 or 4 to the empty cell with index specified above.
        board = game_2048.insert_cell(random_index, (
            Math.random() > 0.2
            ? 2
            : 4
        ), board);
    }
};


//initialize the board.
const initialize_board = function () {
    R.range(0, grid_rows).forEach(function (row_index) {
        const row = document.createElement("div");
        const grid = document.getElementById("grid");
        row.className = "row";

        R.range(0, grid_columns).forEach(function (column_index) {
            const cell = document.createElement("div");
            cell.className = "cell";
            let num = board[row_index][column_index];
            update_cell_style(cell, num);
            cell.id = `${row_index}-${column_index}`;
            row.appendChild(cell);
        });

        grid.appendChild(row);
    });

    generate_cell();
    generate_cell();
    update_board();
};


//run initialize_board.
initialize_board();


//game over.
const game_over = function () {
    if (game_2048.is_game_over(board)) {
        document.getElementById("over").style.display = "block";
        document.getElementById("mask_layer").style.display = "block";
        document.getElementById("score_final").textContent = score;
    }
};


//restart game.
const restart_game = function () {
    document.getElementById("over").style.display = "none";
    document.getElementById("mask_layer").style.display = "none";
    board = game_2048.empty_board(); //cannot say let board = ...
    score = 0;
    generate_cell();
    generate_cell();
    update_board();
};


//handle user input.
const action_after_moving = function () {
    generate_cell();
    score = game_2048.calculate_score(board);
    update_board();
    game_over();
};

document.onkeyup = function (e) {
    if (e.code === "ArrowLeft") {
        board = game_2048.slideLeft(board);
        action_after_moving();
    } else if (e.code === "ArrowRight") {
        board = game_2048.slideRight(board);
        action_after_moving();
    } else if (e.code === "ArrowUp") {
        board = game_2048.slideUp(board);
        action_after_moving();
    } else if (e.code === "ArrowDown") {
        board = game_2048.slideDown(board);
        action_after_moving();
    }
};

document.getElementById("restart").onclick = function () {
    restart_game();
};
document.getElementById("new_game").onclick = function () {
    restart_game();
};