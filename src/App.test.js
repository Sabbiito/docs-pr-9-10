import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    window.localStorage.clear();
    // Portal.jsx рендерить у document.body напряму (createPortal), поза
    // контейнером, який `render()` з testing-library створює й прибирає
    // автоматично. Без явного очищення "осиротілий" #portal-root вузол
    // з попереднього тесту лишається в jsdom document і заважає новому
    // рендеру портального контенту (банер, модалки тощо).
    document.getElementById('portal-root')?.remove();
});

test('renders the home page welcome heading', () => {
    render(<App />);
    const heading = screen.getByText(/Вітаємо в грі "Чотири в ряд"/i);
    expect(heading).toBeInTheDocument();
});

test('renders navigation links to the main sections', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Нова гра/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Мої сесії/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Конфіденційність/i })).toBeInTheDocument();
});

test('shows the GDPR cookie consent banner on first visit', () => {
    render(<App />);
    expect(
        screen.getByText(/Ми використовуємо локальне сховище браузера/i)
    ).toBeInTheDocument();
});
