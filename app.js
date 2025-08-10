// Metro: DevOps Survival Mini App
class MetroGame {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.gameState = null;
        this.currentScene = 'start';
        this.botIntegration = null;
        this.init();
    }

    init() {
        // Инициализация Telegram Web App
        this.tg.ready();
        this.tg.expand();
        
        // Загрузка состояния игры
        this.loadGameState();
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Инициализация интеграции с ботом
        this.botIntegration = new BotIntegration(this);
        
        // Показать главное меню
        this.showScreen('main-menu');
        this.updateResources();
    }

    setupEventListeners() {
        // Обработчики кнопок меню
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleMenuAction(action);
            });
        });

        // Обработчики кнопок "назад"
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backTo = e.currentTarget.dataset.back;
                this.showScreen(backTo);
            });
        });

        // Обработчики действий в хабе
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleHubAction(action);
            });
        });

        // Обработчики мультиплеера
        document.getElementById('send-chat')?.addEventListener('click', () => {
            this.sendLocalChat();
        });

        document.getElementById('set-freq')?.addEventListener('click', () => {
            this.setRadioFrequency();
        });

        document.getElementById('drop-note')?.addEventListener('click', () => {
            this.dropNote();
        });

        document.getElementById('scan-notes')?.addEventListener('click', () => {
            this.scanNotes();
        });

        // Обработчики настроек
        document.getElementById('setting-images')?.addEventListener('change', (e) => {
            this.updateSetting('images_enabled', e.target.checked);
        });

        document.getElementById('setting-compact')?.addEventListener('change', (e) => {
            this.updateSetting('ui_compact', e.target.checked);
        });

        document.getElementById('setting-notifications')?.addEventListener('change', (e) => {
            this.updateSetting('notifications_enabled', e.target.checked);
        });

        document.getElementById('setting-shop')?.addEventListener('change', (e) => {
            this.updateSetting('show_shop', e.target.checked);
        });
    }

    loadGameState() {
        // Загрузка состояния из localStorage или создание нового
        const savedState = localStorage.getItem('metro_game_state');
        if (savedState) {
            this.gameState = JSON.parse(savedState);
        } else {
            this.gameState = this.createNewGameState();
        }
    }

    createNewGameState() {
        return {
            scene: "start",
            water: 3,
            filters: 1,
            ammo_light: 30,
            ammo_heavy: 0,
            seeds: 0,
            components: 0,
            inventory_load: 0,
            inventory_max: 10,
            ai_influence: 0.0,
            quest_radio_fixed: false,
            keycard_semenov: false,
            mission1_done: false,
            has_water_sensor: false,
            flags: {},
            reputation: {},
            awaiting_crc_lines: false,
            awaiting_any_input: false,
            username: this.tg.initDataUnsafe?.user?.username || null,
            role_id: null,
            role_name: null,
            nickname: null,
            awaiting_nickname: false,
            lore_logs: [],
            images_enabled: true,
            ui_compact: false,
            notifications_enabled: true,
            locale: "ru",
            raids_completed: 0,
            faction: null,
            show_shop: false,
            last_chat_at: 0,
            daily_date: "",
            daily_quests: [],
            completed_quests: [],
            active_quests: []
        };
    }

    saveGameState() {
        localStorage.setItem('metro_game_state', JSON.stringify(this.gameState));
    }

    showScreen(screenId) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показать нужный экран
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }

        // Обновить ресурсы на всех экранах
        this.updateResources();
    }

    updateResources() {
        // Обновить отображение ресурсов
        document.getElementById('water').textContent = `💧 ${this.gameState.water}`;
        document.getElementById('filters').textContent = `🛡 ${this.gameState.filters}`;
        document.getElementById('ammo').textContent = `🔫 ${this.gameState.ammo_light}`;
        document.getElementById('ai').textContent = `🤖 ${this.gameState.ai_influence.toFixed(1)}`;
        
        // Обновить статистику
        const raidsCompleted = document.getElementById('raids-completed');
        const faction = document.getElementById('faction');
        
        if (raidsCompleted) {
            raidsCompleted.textContent = this.gameState.raids_completed;
        }
        
        if (faction) {
            faction.textContent = this.gameState.faction || 'Нет';
        }
    }

    handleMenuAction(action) {
        switch (action) {
            case 'hub':
                this.showScreen('hub');
                this.loadHubContent();
                break;
            case 'quests':
                this.showScreen('quests');
                this.loadQuests();
                break;
            case 'journal':
                this.showScreen('journal');
                this.loadJournal();
                break;
            case 'reputation':
                this.showReputation();
                break;
            case 'multiplayer':
                this.showScreen('multiplayer');
                this.loadMultiplayer();
                break;
            case 'settings':
                this.showScreen('settings');
                this.loadSettings();
                break;
            case 'help':
                this.showScreen('help');
                break;
            case 'reset':
                if (confirm('Вы уверены, что хотите сбросить прогресс? Это действие нельзя отменить.')) {
                    this.resetGame();
                }
                break;
        }
    }

    handleHubAction(action) {
        switch (action) {
            case 'boris':
                this.startDialogue('boris');
                break;
            case 'chrome':
                this.startDialogue('chrome');
                break;
        }
    }

    loadHubContent() {
        // Загрузка контента хаба
        const missionsList = document.getElementById('missions-list');
        if (missionsList) {
            missionsList.innerHTML = `
                <div class="mission-item">
                    <h4>🪖 Миссия 1: Темная лестница</h4>
                    <p>Исследовать подземные туннели</p>
                    <button class="action-btn" onclick="game.startMission('dark_staircase')">Начать</button>
                </div>
                <div class="mission-item">
                    <h4>🔧 Миссия 2: Серверный зал</h4>
                    <p>Проникнуть в защищенную зону</p>
                    <button class="action-btn" onclick="game.startMission('server_hall')">Начать</button>
                </div>
            `;
        }
    }

    loadQuests() {
        // Загрузка ежедневных квестов
        const questsList = document.getElementById('quests-list');
        if (questsList) {
            const quests = this.getDailyQuests();
            questsList.innerHTML = quests.map(quest => `
                <div class="quest-item ${quest.completed ? 'completed' : ''}">
                    <h4>${quest.title}</h4>
                    <p>${quest.description}</p>
                    <div class="requirements">Требования: ${quest.requirements}</div>
                    <div class="rewards">Награды: ${quest.rewards}</div>
                    ${!quest.completed ? `<button onclick="game.completeQuest('${quest.id}')">Выполнить</button>` : ''}
                </div>
            `).join('');
        }
    }

    loadJournal() {
        // Загрузка журнала/лора
        const journalEntries = document.getElementById('journal-entries');
        if (journalEntries) {
            if (this.gameState.lore_logs.length === 0) {
                journalEntries.innerHTML = '<p>Журнал пуст. Исследуйте мир, чтобы найти записи.</p>';
            } else {
                journalEntries.innerHTML = this.gameState.lore_logs.map(entry => `
                    <div class="journal-entry">
                        <div class="timestamp">${new Date().toLocaleString()}</div>
                        <div class="content">${entry}</div>
                    </div>
                `).join('');
            }
        }
    }

    loadMultiplayer() {
        // Загрузка мультиплеера
        const localChat = document.getElementById('local-chat');
        if (localChat) {
            localChat.innerHTML = '<p>Локальный чат пока недоступен в Mini App версии.</p>';
        }
    }

    loadSettings() {
        // Загрузка настроек
        document.getElementById('setting-images').checked = this.gameState.images_enabled;
        document.getElementById('setting-compact').checked = this.gameState.ui_compact;
        document.getElementById('setting-notifications').checked = this.gameState.notifications_enabled;
        document.getElementById('setting-shop').checked = this.gameState.show_shop;
    }

    getDailyQuests() {
        // Получение ежедневных квестов
        return [
            {
                id: 'quest1',
                title: 'Сбор ресурсов',
                description: 'Соберите 5 единиц воды',
                requirements: 'Вода: 5',
                rewards: 'Фильтры: +1',
                completed: this.gameState.water >= 5
            },
            {
                id: 'quest2',
                title: 'Исследование',
                description: 'Посетите 3 локации',
                requirements: 'Локации: 3',
                rewards: 'Компоненты: +2',
                completed: false
            }
        ];
    }

    startDialogue(npc) {
        // Начало диалога с NPC
        if (this.botIntegration) {
            this.botIntegration.sendDialogueChoice(npc);
        } else {
            this.tg.showAlert(`Диалог с ${npc} пока недоступен в Mini App версии.`);
        }
    }

    startMission(missionId) {
        // Начало миссии
        if (this.botIntegration) {
            this.botIntegration.sendMissionStart(missionId);
        } else {
            this.tg.showAlert(`Миссия ${missionId} пока недоступна в Mini App версии.`);
        }
    }

    completeQuest(questId) {
        // Выполнение квеста
        if (this.botIntegration) {
            this.botIntegration.sendQuestComplete(questId);
        } else {
            this.tg.showAlert(`Квест ${questId} выполнен!`);
            this.loadQuests(); // Обновить список квестов
        }
    }

    sendLocalChat() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (message) {
            this.tg.showAlert(`Сообщение отправлено: ${message}`);
            input.value = '';
        }
    }

    setRadioFrequency() {
        const freq = document.getElementById('radio-freq').value;
        if (freq) {
            this.tg.showAlert(`Частота установлена: ${freq}`);
        }
    }

    dropNote() {
        const text = document.getElementById('drop-text').value.trim();
        if (text) {
            this.tg.showAlert(`Заметка оставлена: ${text}`);
            document.getElementById('drop-text').value = '';
        }
    }

    scanNotes() {
        this.tg.showAlert('Заметки пока недоступны в Mini App версии.');
    }

    updateSetting(setting, value) {
        this.gameState[setting] = value;
        this.saveGameState();
        
        // Отправить изменение в бот
        if (this.botIntegration) {
            this.botIntegration.sendSettingChange(setting, value);
        }
    }

    showReputation() {
        const rep = this.gameState.reputation;
        const repText = Object.keys(rep).length > 0 
            ? Object.entries(rep).map(([faction, value]) => `${faction}: ${value}`).join('\n')
            : 'Репутация пока не заработана';
        
        this.tg.showAlert(`Репутация:\n${repText}`);
    }

    resetGame() {
        this.gameState = this.createNewGameState();
        this.saveGameState();
        this.showScreen('main-menu');
        this.updateResources();
        this.tg.showAlert('Игра сброшена!');
    }

    // Методы для интеграции с ботом
    sendToBot(action, data = {}) {
        // Отправка данных в бот через Telegram Web App
        this.tg.sendData(JSON.stringify({
            action: action,
            data: data,
            userId: this.tg.initDataUnsafe?.user?.id
        }));
    }
}

// Инициализация игры при загрузке страницы
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new MetroGame();
});

// Обработка данных от бота
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'game_update') {
        game.gameState = event.data.state;
        game.saveGameState();
        game.updateResources();
    }
});
