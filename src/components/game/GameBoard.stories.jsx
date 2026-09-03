import React from 'react';
import GameBoard from './GameBoard';

/** Створює порожню дошку `rows × cols`, заповнену `null`. */
const emptyBoard = (rows, cols) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));

/**
 * `GameBoard` — центральний ігровий компонент застосунку: рендерить
 * сітку "Чотири в ряд" на основі двовимірного масиву та підсвічує
 * клітинку останнього ходу. Комплексний компонент: обчислює похідний
 * стан (`isLastMove` для кожної клітинки), має конфігуровану колірну
 * тему (`boardColor`) і обробляє клік по всій колонці, а не по клітинці.
 */
export default {
    title: 'Game/GameBoard',
    component: GameBoard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Розмір дошки визначається автоматично з переданого масиву `board` ' +
                    '— окремо передавати кількість рядків/колонок не потрібно. ' +
                    'Пропс `isColumnFull` приймається, але наразі не впливає на ' +
                    'рендер (див. JSDoc компонента) — це видно в стори `AlmostFull`, ' +
                    'де заповнена колонка виглядає так само клікабельною, як і решта.',
            },
        },
    },
    argTypes: {
        boardColor: {
            control: 'select',
            options: ['blue', 'green', 'purple'],
            description: 'Колір фону дошки.',
            table: { defaultValue: { summary: 'blue' } },
        },
        onColumnClick: { action: 'column-clicked' },
        board: { control: false },
        lastMove: { control: false },
    },
};

/**
 * Порожня дошка стандартного розміру 6×7 (класичні правила "4 в ряд") —
 * стан на самому початку матчу, до першого ходу.
 */
export const EmptyBoard = {
    args: {
        board: emptyBoard(6, 7),
        lastMove: null,
        boardColor: 'blue',
    },
};

/**
 * Гра в процесі: кілька ходів обох гравців зроблено, останній хід
 * (жовта фішка гравця 2) підсвічений зеленим кільцем — саме так
 * `GameBoard` показує `lastMove` під час реальної гри на сторінці `/game`.
 */
export const InProgress = {
    args: {
        board: [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, 2, null, null, null],
            [null, null, 2, 1, null, null, null],
            [null, 1, 1, 2, null, null, null],
            [null, 1, 2, 1, 1, null, null],
        ],
        lastMove: { row: 2, col: 3 },
        boardColor: 'green',
    },
};

/**
 * Дошка з майже заповненою першою колонкою (5 із 6 клітинок зайнято) —
 * демонструє колірний варіант `purple` і той нюанс, що `GameBoard` сам
 * по собі не показує візуальну різницю для колонок, які от-от заповняться
 * (обробка "колонка повна" відбувається на рівні `useGameLogic`, не тут).
 */
export const AlmostFull = {
    args: {
        board: [
            [null, null, null, null, null, null, null],
            [1, null, null, null, null, null, null],
            [2, null, null, 1, null, null, null],
            [1, null, 1, 2, null, null, null],
            [2, null, 2, 1, 2, null, null],
            [1, 2, 1, 2, 1, 2, 1],
        ],
        lastMove: { row: 1, col: 0 },
        boardColor: 'purple',
    },
};
