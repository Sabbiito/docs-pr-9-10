import React from 'react';

/**
 * Базова біла картка з тінню та заокругленими кутами — контейнер для
 * вмісту сторінок (форми, повідомлення, списки).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className=''] — додаткові Tailwind-класи (напр. `max-w-2xl`).
 */
const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-2xl p-8 ${className}`}>
            {children}
        </div>
    );
};

export default Card;