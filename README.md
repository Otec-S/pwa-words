# PWA Слова

Прогрессивное веб-приложение для изучения слов с таймером обратного отсчета.

## Технологии

- **React 19.2** - UI библиотека
- **TypeScript 5.9** - типизация
- **Vite 6** - сборщик и dev-сервер
- **vite-plugin-pwa** - PWA функциональность
- **Web Audio API** - звуковые уведомления

## Функциональность

### Карточки слов
- 3 карточки с группами слов
- Каждая карточка содержит 4 визуально разделенные группы:
  - Группа 1: 3 слова по 3 очка каждое
  - Группа 2: 3 слова по 3 очка каждое
  - Группа 3: 1 слово на 5 очков
  - Группа 4: 1 слово/предложение на 7 очков
- Чекбоксы для отметки изученных слов
- Подсчет общего количества очков

### Таймер
- Обратный отсчет 2:00 (120 секунд)
- Кнопка СТАРТ/СТОП
- Автоматический сброс при переключении карточек
- Звуковой сигнал при завершении (900 Hz, 700ms)
- Красный фон карточки при истечении времени

### Навигация
- Кнопки ← и → для перелистывания карточек
- Свайпы (touch-жесты) влево/вправо
- Клавиши ArrowLeft/ArrowRight на клавиатуре
- Плавная CSS-анимация при переключении (300ms)

### PWA
- Работает офлайн
- Устанавливается на домашний экран
- Standalone режим
- SVG иконки
- Оптимизация для мобильных устройств
- Поддержка safe area для iOS

## Установка и запуск

### Установка зависимостей
```bash
npm install
```

### Режим разработки
```bash
npm run dev
```
Приложение будет доступно по адресу http://localhost:5173/

### Сборка для production
```bash
npm run build
```

### Предварительный просмотр production-сборки
```bash
npm run preview
```

## Структура проекта

```
pwa-words/
├── public/
│   └── icons/              # PWA иконки
├── src/
│   ├── components/
│   │   ├── Card/           # Компонент карточки
│   │   ├── Timer/          # Компонент таймера
│   │   ├── WordGroup/      # Компонент группы слов
│   │   └── Navigation/     # Компонент навигации
│   ├── hooks/
│   │   ├── useSwipe.ts     # Хук для свайпов
│   │   └── useKeyboard.ts  # Хук для клавиатуры
│   ├── types/
│   │   └── index.ts        # TypeScript типы
│   ├── data/
│   │   └── cards.json      # Данные карточек
│   ├── App.tsx             # Главный компонент
│   ├── App.css             # Стили приложения
│   ├── main.tsx            # Точка входа
│   └── index.css           # Глобальные стили
├── index.html
├── vite.config.ts          # Конфигурация Vite + PWA
├── tsconfig.json
└── package.json
```

## Особенности реализации

### Таймер
- Использует `setInterval` для отсчета
- Реагирует на смену карточки через `useEffect` с зависимостью от `cardId`
- Web Audio API генерирует звук без внешних файлов

### Анимации
- CSS keyframes для плавного перелистывания
- 4 анимации: slideInLeft, slideInRight, slideOutLeft, slideOutRight
- Transform-based (translateX) для производительности

### Управление состоянием
- Локальное состояние через `useState`
- Без сохранения прогресса
- Автоматический сброс при смене карточки

### Responsive дизайн
- Mobile-first подход
- Media queries для разных размеров экрана
- Safe area insets для iOS с вырезом
- `user-scalable=no` для предотвращения зума

## Браузерная совместимость

- Chrome/Edge 90+
- Safari 14+ (iOS 14+)
- Firefox 88+
- Поддержка Web Audio API
- Поддержка Touch Events
- Поддержка Service Workers


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
- на малых экранах убирай стрелки
- вынеси в переменную время таймера
- слова черным
