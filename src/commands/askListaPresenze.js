let data_utils = require('../utils/date_utils');
const BUTTON_INTEFACE = require('../constants/button');
const commandStartThisMonth=BUTTON_INTEFACE.list.label;
const commandStartPrevMonth=BUTTON_INTEFACE.listprev.label;
let datax= new data_utils();

const BeClient = require("../client/be-client");
const async_function = async function(idTelegram,mont,year) {
    const beClient = new BeClient();
    return await beClient.listPresences(idTelegram,mont,year);
}


module.exports = {
    name: 'askListaPresenze',
    description: 'Ottieni Lista Presenza Mese di un Utente!',
    execute(bot,msg,g) {
        bot.on('text', (msg) => {
            const { text, from } = msg;
            let meseAnnoRichiesto=0;
            let labelMessage='';
            let parseMode = 'html';
            if (text === commandStartThisMonth || text === commandStartPrevMonth) {

                if(text === commandStartThisMonth){
                    meseAnnoRichiesto=datax.getNumberThisMonthYear();
                    labelMessage=datax.getNameThisMonth();
                }else{
                    meseAnnoRichiesto=datax.calulatePrevMonthYear();
                    labelMessage=datax.getNamePrevMonth();
                }

                let htmlResponce='';
                async_function(from.id,meseAnnoRichiesto[0],meseAnnoRichiesto[1]).then((res, error) => {
                    console.log(res);

                    if(res.status===200) {
                        if (res.message.length > 0) {
                            htmlResponce += `<b>🛠 LISTA PRESENZA DI  ${labelMessage.toUpperCase()} 🛠</b>\n\n`;
                            res.message.forEach(function (arrayItem) {
                                htmlResponce += `       ${arrayItem.dateOfPresence} -> N. ${arrayItem.workingHours} ORE\n`;
                            });
                        } else {
                            htmlResponce += `<b> ⛑ NESSUNA PRESENZA REGISTRATA A ${labelMessage.toUpperCase()}  ⛑</b>\n`;
                        }
                    }else{
                        htmlResponce += `Errore Risposta server: ${res.status}`;
                    }
                    return bot.sendMessage(from.id, htmlResponce, {parseMode});
                }).catch((err) => {
                    console.log(err);
                    return bot.sendMessage(from.id, "Errore, recupero lista presenze! "+err.status, {parseMode});
                });

            }
        });
    }


};