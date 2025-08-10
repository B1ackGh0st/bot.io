// Интеграция Mini App с Telegram ботом
class BotIntegration {
    constructor(game) {
        this.game = game;
        this.tg = window.Telegram.WebApp;
        this.setupIntegration();
    }

    setupIntegration() {
        // Обработка данных от бота
        this.tg.onEvent('mainButtonClicked', () => {
            this.handleMainButtonClick();
        });

        this.tg.onEvent('backButtonClicked', () => {
            this.handleBackButtonClick();
        });

        this.tg.onEvent('settingsButtonClicked', () => {
            this.game.showScreen('settings');
        });

        // Обработка входящих данных
        window.addEventListener('message', (event) => {
            this.handleBotMessage(event.data);
        });
    }

    handleBotMessage(data) {
        if (!data || typeof data !== 'object') return;

        switch (data.type) {
            case 'game_state_update':
                this.updateGameState(data.state);
                break;
            case 'scene_change':
                this.changeScene(data.scene);
                break;
            case 'show_alert':
                this.tg.showAlert(data.message);
                break;
            case 'show_confirm':
                this.tg.showConfirm(data.message, (confirmed) => {
                    this.sendToBot('confirm_result', { confirmed });
                });
                break;
            case 'show_popup':
                this.tg.showPopup(data.title, data.message, data.buttons);
                break;
            case 'set_main_button':
                this.tg.MainButton.setText(data.text);
                this.tg.MainButton.show();
                break;
            case 'hide_main_button':
                this.tg.MainButton.hide();
                break;
            case 'set_back_button':
                this.tg.BackButton.show();
                break;
            case 'hide_back_button':
                this.tg.BackButton.hide();
                break;
        }
    }

    updateGameState(newState) {
        this.game.gameState = { ...this.game.gameState, ...newState };
        this.game.saveGameState();
        this.game.updateResources();
        
        // Обновить текущий экран если нужно
        if (newState.scene && newState.scene !== this.game.currentScene) {
            this.changeScene(newState.scene);
        }
    }

    changeScene(sceneId) {
        this.game.currentScene = sceneId;
        
        // Определить какой экран показать на основе сцены
        let screenId = 'main-menu';
        
        if (sceneId.startsWith('hub:')) {
            screenId = 'hub';
        } else if (sceneId === 'quests') {
            screenId = 'quests';
        } else if (sceneId === 'journal') {
            screenId = 'journal';
        } else if (sceneId === 'multiplayer') {
            screenId = 'multiplayer';
        } else if (sceneId === 'settings') {
            screenId = 'settings';
        }
        
        this.game.showScreen(screenId);
        
        // Загрузить контент для экрана
        switch (screenId) {
            case 'hub':
                this.game.loadHubContent();
                break;
            case 'quests':
                this.game.loadQuests();
                break;
            case 'journal':
                this.game.loadJournal();
                break;
            case 'multiplayer':
                this.game.loadMultiplayer();
                break;
            case 'settings':
                this.game.loadSettings();
                break;
        }
    }

    handleMainButtonClick() {
        // Обработка нажатия главной кнопки
        this.sendToBot('main_button_clicked', {
            scene: this.game.currentScene
        });
    }

    handleBackButtonClick() {
        // Обработка нажатия кнопки "назад"
        this.sendToBot('back_button_clicked', {
            scene: this.game.currentScene
        });
    }

    sendToBot(action, data = {}) {
        // Отправка данных в бот
        const message = {
            action: action,
            data: data,
            userId: this.tg.initDataUnsafe?.user?.id,
            timestamp: Date.now()
        };

        this.tg.sendData(JSON.stringify(message));
    }

    // Методы для отправки конкретных действий
    sendAction(action, data = {}) {
        this.sendToBot(action, data);
    }

    sendButtonClick(buttonId) {
        this.sendToBot('button_click', { button_id: buttonId });
    }

    sendTextInput(text) {
        this.sendToBot('text_input', { text: text });
    }

    sendQuestComplete(questId) {
        this.sendToBot('quest_complete', { quest_id: questId });
    }

    sendMissionStart(missionId) {
        this.sendToBot('mission_start', { mission_id: missionId });
    }

    sendDialogueChoice(choiceId) {
        this.sendToBot('dialogue_choice', { choice_id: choiceId });
    }

    sendMultiplayerAction(action, data = {}) {
        this.sendToBot('multiplayer_action', { action: action, ...data });
    }

    sendSettingChange(setting, value) {
        this.sendToBot('setting_change', { setting: setting, value: value });
    }
}

// Экспорт для использования в основном файле
window.BotIntegration = BotIntegration;
