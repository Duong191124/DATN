import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Khởi tạo i18next
i18n
    .use(HttpApi)  // Để tải các file ngôn ngữ từ file JSON (cụ thể là thư mục public)
    .use(LanguageDetector)  // Phát hiện ngôn ngữ từ trình duyệt hoặc URL
    .use(initReactI18next)  // Đưa vào môi trường React
    .init({
        supportedLngs: ['en', 'vi'],
        fallbackLng: 'en',
        debug: false,
        backend: {
            loadPath: '/assets/i18n/{{lng}}.json'
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;