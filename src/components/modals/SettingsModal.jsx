import React from 'react';
import SettingsForm from './SettingsForm';

/**
 * Модальне вікно з формою налаштувань гри (обгортка над `SettingsForm`).
 * На відміну від `GameOverModal`, рендериться напряму в дереві компонентів,
 * без `Portal`.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Object} props.settings
 * @param {function(Object)} props.onSave
 * @param {function()} props.onClose
 */
const SettingsModal = ({ isOpen, settings, onSave, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                    <h2 className="text-3xl font-bold text-white text-center">
                        ⚙️ Налаштування гри
                    </h2>
                </div>
                <div className="p-6">
                    <SettingsForm
                        settings={settings}
                        onSave={onSave}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
