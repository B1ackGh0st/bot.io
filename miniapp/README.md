# Metro: DevOps Survival - Telegram Mini App

Веб-интерфейс для игры Metro: DevOps Survival в формате Telegram Mini App.

## Структура файлов

```
miniapp/
├── index.html          # Основная HTML страница
├── styles.css          # Стили интерфейса
├── app.js              # Основная логика игры
├── bot-integration.js  # Интеграция с Telegram ботом
└── README.md           # Этот файл
```

## Особенности

### 🎮 Игровой интерфейс
- **Главное меню** - доступ ко всем разделам игры
- **Хаб** - взаимодействие с NPC и миссиями
- **Квесты дня** - ежедневные задания
- **Журнал** - записи и лор игры
- **Мультиплеер** - локальный чат и радио
- **Настройки** - персонализация интерфейса

### 🔧 Технические возможности
- **Telegram Web App API** - полная интеграция с Telegram
- **Локальное хранение** - сохранение прогресса в браузере
- **Адаптивный дизайн** - работает на всех устройствах
- **Темная тема** - в стиле Metro 2033

### 📱 Telegram интеграция
- **Web App API** - использование нативных функций Telegram
- **Синхронизация с ботом** - обмен данными через `sendData()`
- **Кнопки бота** - поддержка MainButton и BackButton
- **Уведомления** - показ алертов и попапов

## Настройка

### 1. Размещение файлов
Загрузите все файлы из папки `miniapp/` на ваш веб-сервер или GitHub Pages.

### 2. Настройка бота
В вашем Telegram боте добавьте поддержку Mini App:

```python
# В deepseek.py добавьте обработчик для Mini App
async def handle_webapp_data(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка данных от Mini App"""
    if update.effective_message and update.effective_message.web_app_data:
        data = json.loads(update.effective_message.web_app_data.data)
        user_id = data.get('userId')
        action = data.get('action')
        
        # Обработка различных действий
        if action == 'dialogue_choice':
            await handle_dialogue_choice(user_id, data.get('data', {}))
        elif action == 'mission_start':
            await handle_mission_start(user_id, data.get('data', {}))
        elif action == 'quest_complete':
            await handle_quest_complete(user_id, data.get('data', {}))
        # ... другие действия

# Добавьте в main():
application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_webapp_data))
```

### 3. Настройка Mini App в BotFather
1. Отправьте `/newapp` в @BotFather
2. Выберите вашего бота
3. Укажите название: "Metro: DevOps Survival"
4. Укажите описание: "Текстовая игра в мире Metro 2033"
5. Загрузите иконку (16:9, до 1MB)
6. Укажите URL: `https://ваш-домен.com/miniapp/`
7. Укажите короткое название: "MetroGame"

## Использование

### Для игроков
1. Найдите вашего бота в Telegram
2. Нажмите кнопку "Start" или отправьте `/start`
3. Нажмите на кнопку Mini App в меню бота
4. Игра откроется в Telegram

### Для разработчиков
1. Откройте `index.html` в браузере для тестирования
2. Используйте DevTools для отладки
3. Проверьте интеграцию с Telegram Web App API

## API интеграции

### Отправка данных в бот
```javascript
// Отправка действия
game.botIntegration.sendAction('dialogue_choice', { npc: 'boris' });

// Отправка нажатия кнопки
game.botIntegration.sendButtonClick('mission_start');

// Отправка текста
game.botIntegration.sendTextInput('привет');
```

### Получение данных от бота
```javascript
// Обновление состояния игры
window.postMessage({
    type: 'game_state_update',
    state: { water: 5, ammo_light: 25 }
}, '*');

// Смена сцены
window.postMessage({
    type: 'scene_change',
    scene: 'hub:boris'
}, '*');
```

## Стилизация

### CSS переменные
```css
:root {
    --bg-primary: #1a1a1a;      /* Основной фон */
    --bg-secondary: #2d2d2d;    /* Вторичный фон */
    --accent-primary: #4a9eff;  /* Основной акцент */
    --text-primary: #ffffff;    /* Основной текст */
}
```

### Адаптивность
- **Desktop**: полный интерфейс с сеткой
- **Tablet**: адаптированная сетка
- **Mobile**: одноколоночная компоновка

## Разработка

### Добавление новых экранов
1. Добавьте HTML разметку в `index.html`
2. Добавьте стили в `styles.css`
3. Добавьте логику в `app.js`
4. Обновите обработчики в `bot-integration.js`

### Добавление новых функций
1. Создайте метод в классе `MetroGame`
2. Добавьте обработчик в `setupEventListeners()`
3. При необходимости добавьте интеграцию с ботом

## Лицензия

Этот проект является частью игры Metro: DevOps Survival.
Все права защищены.

## Поддержка

Для вопросов и предложений обращайтесь к разработчику бота.
