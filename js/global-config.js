// Глобальный менеджер конфигурации
class ConfigManager {
    constructor() {
        this.config = {
            SettingsOrder: {
                auditType: '',
                orderType: '',
                levelOrder: '',
                selectedTB: ''
            },
            Questionnaire: { },
            TeamAudit: { },
            ProcessesModule: { },
            AutomatedSystems: { },
            Generator: { }
        };

        this.listeners = [];
        this.saveStatus = new Map(); // для отслеживания сохранения каждого модуля
    }

    // Получить всю конфигурацию
    getConfig() {
        return this.config;
    }

    // Получить конфигурацию конкретного модуля
    getModuleConfig(moduleName) {
        if (!this.config[moduleName]) {
            this.config[moduleName] = {};
        }
        return this.config[moduleName];
    }

    // Обновить данные модуля (слияние)
    updateModuleConfig(moduleName, data) {
        if (!this.config[moduleName]) {
            this.config[moduleName] = {};
        }

        // Глубокое слияние объектов
        this.config[moduleName] = { ...this.config[moduleName], ...data };

        // Отмечаем, что модуль сохранил данные
        this.saveStatus.set(moduleName, true);

        // Уведомляем подписчиков об изменении
        this.notifyListeners(moduleName, this.config[moduleName]);

        console.log(`✓ Модуль ${moduleName} обновил конфигурацию:`, this.config[moduleName]);
        return this.config[moduleName];
    }

    // НОВЫЙ МЕТОД: Полная замена конфигурации модуля (без слияния)
    replaceModuleConfig(moduleName, data) {
        if (!this.config[moduleName]) {
            this.config[moduleName] = {};
        }

        // Полная замена, а не слияние
        this.config[moduleName] = { ...data };

        // Отмечаем, что модуль сохранил данные
        this.saveStatus.set(moduleName, true);

        // Уведомляем подписчиков об изменении
        this.notifyListeners(moduleName, this.config[moduleName]);

        console.log(`✓ Модуль ${moduleName} полностью заменен:`, this.config[moduleName]);
        return this.config[moduleName];
    }

    // Проверить, все ли модули сохранили данные
    isAllModulesSaved() {
        const requiredModules = ['SettingsOrder', 'Questionnaire', 'TeamAudit', 'ProcessesModule', 'AutomatedSystems'];
        return requiredModules.every(module => this.saveStatus.get(module) === true);
    }

    // Подписка на изменения
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    // Уведомить подписчиков
    notifyListeners(moduleName, data) {
        this.listeners.forEach(callback => {
            callback(moduleName, data, this.config);
        });
    }

    // Получить полную конфигурацию в формате JSON
    getFullConfigJSON() {
        return JSON.stringify(this.config, null, 2);
    }

//    // Сохранить конфигурацию в localStorage
//    saveToLocalStorage() {
//        localStorage.setItem('appConfig', JSON.stringify(this.config));
//        console.log('Конфигурация сохранена в localStorage');
//    }
//    loadFromLocalStorage() {
//        const saved = localStorage.getItem('appConfig');
//        if (saved) {
//            try {
//                const loadedConfig = JSON.parse(saved);
//                Object.assign(this.config, loadedConfig);
//                return true;
//            } catch (e) {
//            }
//        }
//        return false;
//    }

    // Экспорт всех данных для отправки на сервер
    exportForServer() {
        return {
            timestamp: new Date().toISOString(),
            config: this.config,
            allModulesSaved: this.isAllModulesSaved()
        };
    }
}

// Создаем глобальный экземпляр
window.appConfigManager = new ConfigManager();