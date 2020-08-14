let data_utils = require('../utils/date_utils');
const BUTTON_INTEFACE = require('../constants/button');
const commandStartThisMonth=BUTTON_INTEFACE.list.label;
const commandStartPrevMonth=BUTTON_INTEFACE.listprev.label;
let datax= new data_utils();
let prevMonth=false;

module.exports = {
    name: 'askListaPresenze',
    description: 'Ottieni Lista Presenza Mese di un Utente!',
    execute(bot,msg,g) {
        bot.on('text', (msg) => {
            const { text, from } = msg;
            let meseAnnoRichiesto=0;
            if (text === commandStartThisMonth || text === commandStartPrevMonth) {
                text === commandStartThisMonth ? meseAnnoRichiesto=datax.getNumberThisMonthYear() : meseAnnoRichiesto=datax.calulatePrevMonthYear();
                let message="Ecco la lista del mese "+meseAnnoRichiesto[0]+' '+meseAnnoRichiesto[1];
                let parseMode = 'html';
                return bot.sendMessage(from.id, message, {parseMode});
            }
        });
    }
};