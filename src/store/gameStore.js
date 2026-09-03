import { create } from 'zustand';

/**
 * Глобальний стор поточного стану активного матчу (Zustand, без
 * персистентності — скидається при перезавантаженні сторінки).
 *
 * На відміну від `useGameLogic` (локальний React-стан однієї гри),
 * цей стор тримає легкий "знімок" ходу гри, доступний з будь-якого
 * компонента без прокидання пропсів (наприклад, для відображення імені
 * поточного гравця в шапці навігації).
 */
export const useGameStore = create((set, get) => ({
    currentPlayer: 1,
    winner: null,
    isGameOver: false,
    lastMove: null,

    setCurrentPlayer: (player) => set({ currentPlayer: player }),

    setWinner: (winner) => set({ winner, isGameOver: true }),

    setLastMove: (move) => set({ lastMove: move }),

    /** Перемикає хід між гравцем 1 та гравцем 2. */
    switchPlayer: () => set((state) => ({
        currentPlayer: state.currentPlayer === 1 ? 2 : 1
    })),

    resetGame: () => set({
        currentPlayer: 1,
        winner: null,
        isGameOver: false,
        lastMove: null
    })
}));