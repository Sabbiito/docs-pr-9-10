// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (тестове DOM-середовище Jest) не надає глобальні TextEncoder/
// TextDecoder за замовчуванням, хоча вони доступні в самому Node.js через
// модуль `util`. react-router@7.x використовує їх внутрішньо, тому без
// цього поліфілу будь-який тест, що імпортує react-router-dom, падає з
// `ReferenceError: TextEncoder is not defined`.
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}
