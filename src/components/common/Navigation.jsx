import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/Navigation.module.css';

/**
 * Верхня навігаційна панель застосунку. Автоматично підсвічує активне
 * посилання відповідно до поточного маршруту (`useLocation`).
 */
const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    🎮 Чотири в ряд
                </Link>

                <div className={styles.links}>
                    <Link
                        to="/"
                        className={`${styles.link} ${isActive('/') && location.pathname === '/' ? styles.active : ''}`}
                    >
                        Домашня
                    </Link>

                    <Link
                        to="/start"
                        className={`${styles.link} ${isActive('/start') ? styles.active : ''}`}
                    >
                        Нова гра
                    </Link>

                    <Link
                        to="/sessions"
                        className={`${styles.link} ${isActive('/sessions') ? styles.active : ''}`}
                    >
                        Мої сесії
                    </Link>

                    <Link
                        to="/privacy"
                        className={`${styles.link} ${isActive('/privacy') ? styles.active : ''}`}
                    >
                        Конфіденційність
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;