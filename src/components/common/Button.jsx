import React from 'react';

/**
 * Базова кнопка застосунку з трьома візуальними варіантами.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children — вміст кнопки (текст, іконки-емодзі тощо).
 * @param {function()} [props.onClick] — обробник кліку.
 * @param {'primary'|'secondary'|'success'} [props.variant='primary'] — візуальний варіант:
 *   `primary` (синій, основна дія), `secondary` (сірий, другорядна дія),
 *   `success` (зелений, підтверджувальна/позитивна дія).
 * @param {boolean} [props.disabled=false] — чи вимкнена кнопка.
 */
const Button = ({ children, onClick, variant = 'primary', disabled = false }) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;