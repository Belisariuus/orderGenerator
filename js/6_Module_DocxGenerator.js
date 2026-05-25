export default class DocxGenerator {
    constructor(configManager) {
        this.config = configManager.config;
        this.SettingsOrder = this.config.SettingsOrder || {};
        this.tbList = {
            'Байкальский банк': 'Байкальскому банку',
            'Волго-Вятский банк': 'Волго-Вятскому банку',
            'Дальневосточный банк': 'Дальневосточному банку',
            'Московский банк': 'Московскому банку',
            'Поволжский банк': 'Поволжскому банку',
            'Северо-Западный банк': 'Северо-Западному банку',
            'Сибирский банк': 'Сибирскому банку',
            'Среднерусский банк': 'Среднерусскому банку',
            'Уральский банк': 'Уральскому банку',
            'Центрально-Чернозёмный банк': 'Центрально-Чернозёмному банку',
            'Юго-Западный банк': 'Юго-Западному банку'
        };

        this.listWordForms = (this.SettingsOrder.auditType === 'execution') ? [
            'О проведении аудиторской проверки',
        ] : [
            'О подготовке к аудиторской проверке',
        ];
    }

    async generateDocument(dict) {
        try {
            const response = await fetch("templates/tpl.docx");
            const arrayBuffer = await response.arrayBuffer();

            const zip = new PizZip(arrayBuffer);
            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            console.log(dict)
            doc.render(
                dict
            );

            saveAs(doc.toBlob(), "output.docx");
        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки шаблона');
        }
    }

    prepareDocument() {
        const dict = {};
        this.flagIsTB = this.config.SettingsOrder.levelOrder === 'CA' ? false : true;
        dict.flagIsTB = this.flagIsTB;
        if (this.flagIsTB) {
            Object.assign(dict, { nameTB: this.config.SettingsOrder.selectedTB.toUpperCase(), nameTB2: 'ПО ' + this.tbList[this.config.SettingsOrder.selectedTB].toUpperCase() });
        };
        dict.pv_title = this.listWordForms[0];
        this.generateDocument(dict)
    }

}