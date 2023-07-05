import R from "./ramda.js";
/**
 * game_2048.js is a game to model and simulate the game 2048.
 * 2048 is a single-player game played on a plain 4×4 grid,
 * with numbered tiles that slide when a player moves them
 * using the four arrow keys.
 * https://en.wikipedia.org/wiki/2048_(video_game)
 * @namespace game_2048
 * @author Peiqi Luo
 * @version 2022-06-30
 */

const game_2048 = Object.create(null);

/**
 * Create a new empty board.
 * Returns a standard 4 wide, 4 high board.
 * @memberof game_2048
 * @function
 * @returns {Array} An empty board for starting a game.
 */
game_2048.empty_board = () => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];


/**
 * Determine the background color of the cell.
 * When the value increases, the lightness of the background color decreases.
 * @memberof game_2048
 * @function
 * @param {number} num The value of the cell.
 * @returns {number} The lightness of the background color of the cell.
 */
game_2048.cell_background_color = function (num) {
    let power = Math.log2(num);
    let background_lightness = 100 - power * 10;
    return background_lightness;
};


/**
 * Determine the text color of the cell.
 * When the value increases, the lightness of the text color increases.
 * @memberof game_2048
 * @function
 * @param {number} background_lightness The value of the cell.
 * @returns {number} The lightness of the text color of the cell.
 */
game_2048.cell_text_color = function (background_lightness) {
    let text_lightness = (
        background_lightness <= 50
        ? 95
        : 18
    );
    return text_lightness;
};


/**
 * Count the number of empty cells in the board.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to count the empty cells.
 * @returns {number} The number of empty cells in the board.
 */
game_2048.count_empty_cells = function (board) {
    return R.flatten(board).filter((num) => num === 0).length;
};


/**
 * Check if the board is full.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to check.
 * @returns {boolean} Whether the board is full.
 * It returns true if the board is full.
 */
game_2048.is_board_full = function (board) {
    return game_2048.count_empty_cells(board) === 0;
};


/**
 * Check if the adjacent cells are all different.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to check.
 * @param {number} grid_rows The number of rows in the board.
 * @param {number} grid_columns The number of columns in the board.
 * @returns {boolean} Whether the adjacent cells are all different.
 * It returns true if the adjacent cells are all different.
 */
game_2048.is_adjacent_cells_different = function (
    board,
    grid_rows = 4,
    grid_columns = 4
) {
    let flag = 1;
    R.range(0, grid_rows).forEach(function (row_index) {
        R.range(0, grid_columns - 1).forEach(function (column_index) {
            if (
                board[row_index][column_index] ===
                board[row_index][column_index + 1]
            ) {
                flag = 0;
            }
        });
    });

    R.range(0, grid_columns).forEach(function (column_index) {
        R.range(0, grid_rows - 1).forEach(function (row_index) {
            if (
                board[row_index][column_index] ===
                board[row_index + 1][column_index]
            ) {
                flag = 0;
            }
        });
    });
    return flag !== 0;
};

/**
 * Check if the game is over.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to check.
 * @returns {boolean} Whether the game is over.
 */
game_2048.is_game_over = function (board) {
    return (
        game_2048.is_board_full(board) &&
        game_2048.is_adjacent_cells_different(board)
    );
};


/**
 * Filter all the cells in a row that have a value of 0.
 * Create a new row without 0 cells.
 * @memberof game_2048
 * @function
 * @param {Array} row The row to clean.
 * @returns {Array} The cleaned row without cells with value 0.
 */
game_2048.filter_empty_cells = function (row) {
    return row.filter((num) => num !== 0);
};


/**
 * Move and combine cells in the same row.
 * @memberof game_2048
 * @function
 * @param {Array} row The row to move.
 * @param {number} grid_columns The number of columns in the board.
 * @returns {Array} The moved row.
 */
game_2048.slide = function (row, grid_columns = 4) {
    let new_row = game_2048.filter_empty_cells(row);
    R.range(0, new_row.length).forEach(function (column_index) {
        if (new_row[column_index] === new_row[column_index + 1]) {
            new_row[column_index] = new_row[column_index] * 2;
            new_row[column_index + 1] = 0;
            // score += new_row[column_index];
        }
    });
    //filter the empty cells AGAIN.
    new_row = game_2048.filter_empty_cells(new_row);

    //add zeroes back to the end of the new_row.
    while (new_row.length < grid_columns) {
        new_row.push(0);
    }

    return new_row;
};


/**
 * Slide the cells to the left.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to move.
 * @param {number} grid_rows The number of rows in the board.
 * @returns {Array} The board after moving the cells to the left.
 */
game_2048.slideLeft = function (board, grid_rows = 4) {
    let new_board = R.clone(board);
    R.range(0, grid_rows).forEach(function (row_index) {
        let row = new_board[row_index];
        row = game_2048.slide(row);
        new_board[row_index] = row;
    });
    return new_board;
};


/**
 * Slide the cells to the right.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to move.
 * @param {number} grid_rows The number of rows in the board.
 * @returns {Array} The board after moving the cells to the right.
 */
game_2048.slideRight = function (board, grid_rows = 4) {
    let new_board = R.clone(board);
    R.range(0, grid_rows).forEach(function (row_index) {
        let row = new_board[row_index];
        row = R.reverse(row);
        row = game_2048.slide(row);
        row = R.reverse(row);
        new_board[row_index] = row;
    });
    return new_board;
};


/**
 * Slide the cells to the up.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to move.
 * @param {number} grid_rows The number of rows in the board.
 * @param {number} grid_columns The number of columns in the board.
 * @returns {Array} The board after moving the cells to the up.
 */
game_2048.slideUp = function (board, grid_rows = 4, grid_columns = 4) {
    let new_board = R.clone(board);
    R.range(0, grid_columns).forEach(function (column_index) {
        let column = R.map(R.prop(column_index), new_board);
        column = game_2048.slide(column);
        R.range(0, grid_rows).forEach(function (row_index) {
            new_board[row_index][column_index] = column[row_index];
        });
    });
    return new_board;
};

/**
 * Slide the cells to the down.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to move.
 * @param {number} grid_rows The number of rows in the board.
 * @param {number} grid_columns The number of columns in the board.
 * @returns {Array} The board after moving the cells to the down.
 */
game_2048.slideDown = function (board, grid_rows = 4, grid_columns = 4) {
    let new_board = R.clone(board);
    R.range(0, grid_columns).forEach(function (column_index) {
        let column = R.map(R.prop(column_index), new_board);
        column = R.reverse(column);
        column = game_2048.slide(column);
        column = R.reverse(column);
        R.range(0, grid_rows).forEach(function (row_index) {
            new_board[row_index][column_index] = column[row_index];
        });
    });
    return new_board;
};


/**
 * Insert a new cell into specific index where the cell is empty.
 * @memberof game_2048
 * @function
 * @param {number} index The index to insert the cell.
 * @param {number} num The number to insert.
 * @param {Array} board The board to insert the cell.
 * @param {number} grid_rows The number of rows in the board.
 * @param {number} grid_columns The number of columns in the board.
 * @returns {Array} The board with the new cell.
 */
game_2048.insert_cell = function (
    index,
    num,
    board,
    grid_rows = 4,
    grid_columns = 4
) {
    let counter = 0;
    let new_board = R.clone(board);
    R.range(0, grid_rows).forEach(function (row_index) {
        R.range(0, grid_columns).forEach(function (column_index) {
            if (new_board[row_index][column_index] === 0) {
                if (counter === index) {
                    new_board[row_index][column_index] = num;
                }
                counter = counter + 1;
            }
        });
    });
    return new_board;
};


/**
 * Calculate the score of the board.
 * The score is the sum of all the cells on the board.
 * @memberof game_2048
 * @function
 * @param {Array} board The board to calculate the score.
 * @returns {number} The updated score of the board.
 */

game_2048.calculate_score = function (board) {
    return R.sum(R.flatten(board));
};


export default Object.freeze(game_2048);