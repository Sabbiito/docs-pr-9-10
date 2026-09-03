import React from 'react';
import Button from './Button';

/**
 * `Button` — базовий переговивальний елемент застосунку. Використовується
 * скрізь: у формах налаштувань, модалках завершення гри, панелі керування
 * грою. Має три візуальні варіанти (`primary`, `secondary`, `success`) і
 * стан `disabled`.
 */
export default {
    title: 'Common/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        // Кнопка невелика — центруємо її на превʼю, щоб не губилась зліва.
        layout: 'centered',
    },
    argTypes: {
        children: {
            control: 'text',
            description: 'Вміст кнопки (текст або емодзі-іконка з текстом).',
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'success'],
            description:
                'Візуальний варіант: `primary` (синій, основна дія), ' +
                '`secondary` (сірий, другорядна дія), `success` (зелений, ' +
                'підтверджувальна дія).',
            table: { defaultValue: { summary: 'primary' } },
        },
        disabled: {
            control: 'boolean',
            description: 'Чи вимкнена кнопка (напівпрозора, курсор not-allowed, клік ігнорується).',
            table: { defaultValue: { summary: 'false' } },
        },
        onClick: { action: 'clicked' },
    },
    args: {
        children: 'Натисни мене',
        variant: 'primary',
        disabled: false,
    },
};

/**
 * Дефолтний стан кнопки — синій варіант `primary`. Властивості в панелі
 * "Controls" внизу можна вільно змінювати (`variant`, `disabled`, текст).
 */
export const Primary = {
    args: {
        variant: 'primary',
        children: 'Почати гру',
    },
};

/**
 * Усі три візуальні варіанти поруч — зручно для порівняння кольорів
 * і перевірки, що жоден варіант не "зламався" при зміні стилів.
 */
export const AllVariants = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
        </div>
    ),
    parameters: {
        // Ця стори — композиція з кількох кнопок, а не одна кнопка,
        // тому контроли пропсів (які працюють з "одним екземпляром") тут
        // не застосовуються.
        controls: { disable: true },
    },
};

/**
 * Вимкнена кнопка — використовується, наприклад, у формі налаштувань,
 * поки валідація не пройдена, або в модалці під час завантаження.
 */
export const Disabled = {
    args: {
        variant: 'primary',
        disabled: true,
        children: 'Недоступно',
    },
};
