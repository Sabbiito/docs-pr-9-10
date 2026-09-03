import React from 'react';

/**
 * Заголовок сторінки (завжди рендериться як `<h1>`, розмір керується
 * лише візуально через `size`).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'large'|'medium'|'small'} [props.size='large']
 */
const Title = ({ children, size = 'large' }) => {
    const sizes = {
        large: 'text-5xl mb-8',
        medium: 'text-3xl mb-6',
        small: 'text-2xl mb-4'
    };

    return (
        <h1 className={`font-bold text-gray-800 ${sizes[size]}`}>
            {children}
        </h1>
    );
};

export default Title;