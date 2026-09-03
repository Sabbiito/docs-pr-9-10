import React from 'react';

/**
 * Ігрова дошка "Чотири в ряд" — сітка клітинок-фішок з можливістю кліку
 * по колонці для здійснення ходу.
 *
 * Розмір сітки визначається автоматично з `board[0].length` (кількість
 * колонок) та кількості рядків у `board`; явно передавати розмір не
 * потрібно.
 *
 * @param {Object} props
 * @param {Array.<Array.<(number|null)>>} props.board — двовимірний масив
 *   дошки, `board[row][col]` дорівнює `null` (порожньо), `1` (фішка
 *   гравця 1, червона) або `2` (фішка гравця 2, жовта).
 * @param {function(number)} props.onColumnClick — викликається з
 *   індексом колонки при кліку по будь-якій клітинці цієї колонки
 *   (клік по клітинці — це спрощений UX-еквівалент "кинути фішку в
 *   колонку", а не вибір конкретного рядка).
 * @param {function(number): boolean} [props.isColumnFull] — приймається,
 *   але наразі НЕ впливає на рендер (немає візуального індикатора
 *   заповненої колонки чи блокування кліку — обробка заповненої
 *   колонки відбувається на вищому рівні, в `useGameLogic.makeMove`,
 *   яка мовчки ігнорує хід у заповнену колонку). Залишено в пропсах
 *   як точку розширення для майбутнього UX-покращення (наприклад,
 *   `cursor-not-allowed` на заповнених колонках).
 * @param {?{row: number, col: number}} [props.lastMove] — координати
 *   останнього ходу; відповідна клітинка підсвічується зеленим кільцем.
 * @param {string} props.boardColor — колір фону дошки: `'blue'`, `'green'` або `'purple'`.
 */
const GameBoard = ({ board, onColumnClick, isColumnFull, lastMove, boardColor }) => {
    const colorClasses = {
        blue: 'bg-blue-700',
        green: 'bg-green-700',
        purple: 'bg-purple-700'
    };

    return (
        <div className={`inline-block ${colorClasses[boardColor]} p-4 rounded-lg shadow-2xl`}>
            <div className="grid gap-2" style={{gridTemplateColumns: `repeat(${board[0]?.length || 7}, minmax(0, 1fr))`}}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
                        const colors = {
                            1: 'bg-red-500',
                            2: 'bg-yellow-500'
                        };

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => onColumnClick(colIndex)}
                                className={`w-12 h-12 rounded-full cursor-pointer transition-all ${
                                    cell ? colors[cell] : 'bg-white hover:bg-gray-100'
                                } ${isLastMove ? 'ring-4 ring-green-400' : ''}`}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default GameBoard;