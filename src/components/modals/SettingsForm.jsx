import React, { useState } from 'react';

/**
 * Форма редагування налаштувань гри: імена гравців, розмір дошки, умова
 * перемоги, колір дошки. Валідація виконується локально при сабміті
 * (`handleSubmit`), не на льоту при кожній зміні поля.
 *
 * Правила валідації імен гравців:
 * - мінімум 2 символи;
 * - максимум 20 символів;
 * - імена гравця 1 та гравця 2 повинні відрізнятися.
 *
 * @param {Object} props
 * @param {{playerOneName: string, playerTwoName: string, gridSize: string, winCondition: number, boardColor: string}} props.settings — початкові значення форми.
 * @param {function(Object)} props.onSave — викликається з валідними даними форми при успішному сабміті.
 * @param {function()} props.onClose — закрити форму без збереження (також викликається одразу після `onSave`).
 */
const SettingsForm = ({ settings, onSave, onClose }) => {
    const [formData, setFormData] = useState(settings);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.playerOneName || formData.playerOneName.length < 2) {
            newErrors.playerOneName = "Мінімум 2 символи";
        }
        if (!formData.playerTwoName || formData.playerTwoName.length < 2) {
            newErrors.playerTwoName = "Мінімум 2 символи";
        }
        if (formData.playerOneName === formData.playerTwoName) {
            newErrors.playerTwoName = "Імена повинні відрізнятися";
        }
        if (formData.playerOneName.length > 20) {
            newErrors.playerOneName = "Максимум 20 символів";
        }
        if (formData.playerTwoName.length > 20) {
            newErrors.playerTwoName = "Максимум 20 символів";
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
            onClose();
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Ім'я гравця 1</label>
                    <input
                        value={formData.playerOneName}
                        onChange={(e) => setFormData({...formData, playerOneName: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.playerOneName && <p className="text-sm text-red-600 mt-1">{errors.playerOneName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Ім'я гравця 2</label>
                    <input
                        value={formData.playerTwoName}
                        onChange={(e) => setFormData({...formData, playerTwoName: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.playerTwoName && <p className="text-sm text-red-600 mt-1">{errors.playerTwoName}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Розмір дошки</label>
                <select
                    value={formData.gridSize}
                    onChange={(e) => setFormData({...formData, gridSize: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value="6x7">Стандартний (6x7)</option>
                    <option value="7x8">Середній (7x8)</option>
                    <option value="8x9">Великий (8x9)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Умова перемоги</label>
                <select
                    value={formData.winCondition}
                    onChange={(e) => setFormData({...formData, winCondition: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value={4}>4 в ряд (стандарт)</option>
                    <option value={5}>5 в ряд (складно)</option>
                    <option value={6}>6 в ряд (дуже складно)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Колір дошки</label>
                <div className="flex gap-3">
                    {['blue', 'green', 'purple'].map((color) => (
                        <button
                            key={color}
                            onClick={() => setFormData({...formData, boardColor: color})}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                                formData.boardColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                            } ${
                                color === 'blue' ? 'bg-blue-600' :
                                    color === 'green' ? 'bg-green-600' :
                                        'bg-purple-600'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
                    Зберегти
                </button>
                <button onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all">
                    Скасувати
                </button>
            </div>
        </div>
    );
};

export default SettingsForm;