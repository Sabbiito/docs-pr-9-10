import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Рендерить `children` у портал поза звичайним DOM-деревом React —
 * у `<div id="portal-root">`, доданий напряму в `document.body`.
 * Використовується для модалок і GDPR cookie-банера, щоб уникнути
 * проблем з `z-index`/`overflow: hidden` батьківських контейнерів.
 *
 * Контейнер створюється лениво при першому монтуванні (`useEffect`) і
 * повторно використовується, якщо вже існує (кілька `Portal` на сторінці
 * діляться одним `#portal-root`). Стан контейнера навмисно тримається в
 * `useState`, а не `useRef` — зміна `ref.current` не тригерить ререндер,
 * тому з `useRef` перший рендер завжди повертав би `null` і вміст порталу
 * ніколи б не з'явився без стороннього тригера ререндеру.
 *
 * @param {{ children: React.ReactNode }} props
 */
const Portal = ({ children }) => {
    const [container, setContainer] = useState(null);

    useEffect(() => {
        let node = document.getElementById('portal-root');
        if (!node) {
            node = document.createElement('div');
            node.id = 'portal-root';
            document.body.appendChild(node);
        }
        setContainer(node);
    }, []);

    if (!container) return null;
    return createPortal(children, container);
};

export default Portal;