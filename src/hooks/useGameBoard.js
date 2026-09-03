import { useState, useCallback, useEffect } from 'react';

/**
 * @typedef {Object} GameBoardApi
 * @property {Array.<Array.<(number|null)>>} board
 * @property {function(number, number): {success: boolean, row: (number|undefined), col: (number|undefined)}} dropPiece
 * @property {function()} resetBoard
 * @property {function(number): boolean} isColumnFull
 * @property {function(): boolean} isBoardFull
 * @property {number} ROWS
 * @property {number} COLS
 */

/**
 * Хук управління станом ігрової дошки "Чотири в ряд".
 *
 * Дошка представлена як двовимірний масив `board[row][col]`, де `row=0` —
 * верхній ряд, а фішки "падають" знизу вгору: `dropPiece` завжди шукає
 * перший вільний рядок, починаючи з `ROWS - 1` (найнижчого).
 *
 * @param {{rows: number, cols: number}} dimensions — розмір дошки.
 *   Зміна `dimensions` (наприклад, при зміні налаштувань гри) автоматично
 *   скидає дошку до нової порожньої через внутрішній `useEffect`.
 * @returns {GameBoardApi}
 */
export const useGameBoard = (dimensions) => {
    const { rows: ROWS, cols: COLS } = dimensions;

    const createEmptyBoard = useCallback(() =>
            Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
        , [ROWS, COLS]);

    const [board, setBoard] = useState(() => createEmptyBoard());

    // Розмір дошки може змінитись між іграми (інші налаштування) —
    // перестворюємо порожню дошку щоразу, коли змінюються ROWS/COLS.
    useEffect(() => {
        setBoard(createEmptyBoard());
    }, [createEmptyBoard]);

    const resetBoard = useCallback(() => {
        setBoard(createEmptyBoard());
    }, [createEmptyBoard]);

    /**
     * Кидає фішку гравця `player` у колонку `col`. Шукає найнижчу вільну
     * клітинку (гравітаційне падіння). Повертає координати, куди фішка
     * фактично впала, або `{ success: false }`, якщо колонка вже заповнена.
     */
    const dropPiece = useCallback((col, player) => {
        const newBoard = board.map(row => [...row]);
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!newBoard[row][col]) {
                newBoard[row][col] = player;
                setBoard(newBoard);
                return { success: true, row, col };
            }
        }
        return { success: false };
    }, [board, ROWS]);

    const isColumnFull = useCallback((col) => {
        return board[0][col] !== null;
    }, [board]);

    const isBoardFull = useCallback(() => {
        return board[0].every(cell => cell !== null);
    }, [board]);

    return { board, dropPiece, resetBoard, isColumnFull, isBoardFull, ROWS, COLS };
};