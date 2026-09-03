import { useState, useCallback } from 'react';
import { useGameBoard } from './useGameBoard';
import { useWinDetection } from './useWinDetection';

/**
 * @typedef {Object} GameLogicApi
 * @property {Array.<Array.<(number|null)>>} board
 * @property {number} currentPlayer
 * @property {?(number|string)} winner — `1`, `2`, `'draw'` або `null` (гра ще триває).
 * @property {boolean} isGameOver
 * @property {?{row: number, col: number}} lastMove
 * @property {function(number): boolean} makeMove
 * @property {function()} restartGame
 * @property {function(number): boolean} isColumnFull
 */

/**
 * Головний хук оркестрації ігрового процесу "Чотири в ряд".
 *
 * Об'єднує стан дошки (`useGameBoard`) і перевірку перемоги
 * (`useWinDetection`) з чергою ходів двох гравців. Гравці позначаються
 * числами `1` та `2`; нічия позначається спеціальним значенням
 * `winner === 'draw'`.
 *
 * @param {{rows: number, cols: number}} dimensions — розмір дошки.
 * @param {number} winCondition — довжина лінії, необхідна для перемоги.
 * @returns {GameLogicApi}
 */
export const useGameLogic = (dimensions, winCondition) => {
    const { board, dropPiece, resetBoard, isColumnFull, isBoardFull } = useGameBoard(dimensions);
    const { checkWinner } = useWinDetection(winCondition);

    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [winner, setWinner] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [lastMove, setLastMove] = useState(null);

    /**
     * Виконує хід поточного гравця в колонку `col`. Ігнорується, якщо гра
     * вже завершена або колонка заповнена. Після успішного ходу перевіряє
     * перемогу, потім нічию (заповнена дошка без переможця), і лише якщо
     * жодного з цих станів не досягнуто — передає хід іншому гравцю.
     *
     * @param {number} col — індекс колонки (0-based).
     * @returns {boolean} `true`, якщо хід був фактично зроблений.
     */
    const makeMove = useCallback((col) => {
        if (isGameOver || isColumnFull(col)) return false;

        const result = dropPiece(col, currentPlayer);

        if (result.success) {
            setLastMove({ row: result.row, col: result.col });

            if (checkWinner(board, result.row, result.col, currentPlayer)) {
                setWinner(currentPlayer);
                setIsGameOver(true);
                return true;
            }

            if (isBoardFull()) {
                setWinner('draw');
                setIsGameOver(true);
                return true;
            }

            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            return true;
        }
        return false;
    }, [currentPlayer, isGameOver, board, dropPiece, checkWinner, isColumnFull, isBoardFull]);

    /** Скидає гру до початкового стану: порожня дошка, хід гравця 1. */
    const restartGame = useCallback(() => {
        resetBoard();
        setCurrentPlayer(1);
        setWinner(null);
        setIsGameOver(false);
        setLastMove(null);
    }, [resetBoard]);

    return {
        board,
        currentPlayer,
        winner,
        isGameOver,
        lastMove,
        makeMove,
        restartGame,
        isColumnFull
    };
};