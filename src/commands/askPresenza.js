
const data_utils = require('../utils/date_utils');
const BUTTON_INTEFACE = require('../constants/button');
const commandStartThisMonth=BUTTON_INTEFACE.ins.label;
const commandStartPrevMonth=BUTTON_INTEFACE.insprev.label;

let datax= new data_utils();
let prevMonth=false;

//let Presence = require('../models/presence');
//let presenceThisMonth = new Presence();

const BeClient = require("../client/be-client");
const async_function = async function(presence) {
    const beClient = new BeClient();
    return await beClient.addPresence(presence);
}

module.exports = {
    name: 'askPresenza',
    description: 'Ask inserimento Presenza!',
    execute(bot,msg,g) {

        bot.on('text', (msg) => {
            const { text, from } = msg;
            let objIndex = global.arrayPresence.findIndex((obj => obj.idTelegram == from.id));
            if ((text === commandStartThisMonth || text === commandStartPrevMonth)  && objIndex===-1) {

                text === commandStartThisMonth ? prevMonth=false : prevMonth =true;
                //cancello eventuali oggetti residui
                if(objIndex>=0){
                    global.arrayPresence.splice(objIndex, 1);
                }
                //inserisco nuovo oggetto presenza
                global.arrayPresence.push({idTelegram: from.id,
                            name: (from.first_name!==undefined ? from.first_name : "") +  (from.last_name!==undefined ? ' ' +from.last_name : ""),
                            dateOfPresence: "", workingHours: "" });
                console.log(global.arrayPresence);

                let message="Presenza per <b><u>"+( prevMonth ? datax.getNamePrevMonth() : datax.getNameThisMonth() )+"</u></b>.\nInserisci il  giorno oe /annulla !";
                let parseMode = 'html';
                return bot.sendMessage(from.id, message, {parseMode, ask: 'day'});
            }
        });

        // inserimento giorno lavoro
        bot.on('ask.day', (msg,args) => {
            //console.table(args);
            const id = msg.from.id;
            let objIndex = global.arrayPresence.findIndex((obj => obj.idTelegram == id));
            if(msg.text==='/annulla'){
                bot.sendMessage(id, `Inserimento annullato grazie!`);
                pulisciArray(objIndex);
                return;
            }
            const day = Number(msg.text);
            if (!day || day>31) {
                return bot.sendMessage(id, 'Inserire un numero per il giorno tra 1 e 31, riprova!', {ask: 'day'});
            }else{
                let dayDatePart;
                if(day<10){
                    dayDatePart='0'+day;
                }else{
                    dayDatePart=day;
                }

                var dataPrensenza= prevMonth ? datax.getPrevDatePart()+dayDatePart : datax.getThisDatePart()+dayDatePart ;

                if(objIndex>=0){ //-1 quando non trova nulla
                    global.arrayPresence[objIndex].dateOfPresence = dataPrensenza;
                }
                console.log(global.arrayPresence);

                let parseMode = 'html';
                let message="Quante ore hai lavorato "+datax.checkBussinessDay(dataPrensenza)+"\nInserisci il numero o  /annulla !";
                return bot.sendMessage(id, message, {parseMode,ask: 'workingHours'});
            }
        });

        // inserimento ore lavorate nel giorno
        bot.on('ask.workingHours', (msg) => {
            const id = msg.from.id;
            let parseMode = 'html';
            let objIndex = global.arrayPresence.findIndex((obj => obj.idTelegram == id));
            if(msg.text==='/annulla'){
                bot.sendMessage(id, `Inserimento annullato grazie!`);
                pulisciArray(objIndex);
                return;
            }
            const workingHours = Number(msg.text);
            if (!workingHours) {
                return bot.sendMessage(id, 'Numero di ore lavorate non corrette (ricorda minimo 1 massimo 12), riprova!', {ask: 'age'});
            } else {
                // Ultimo messaggio
                if(objIndex>=0){ //-1 quando non trova nulla
                    global.arrayPresence[objIndex].workingHours = workingHours;

                    let htmlResponce='';
                    async_function(global.arrayPresence[objIndex]).then((res, error) => {
                        console.log(res);

                        if(res.status===200){
                            htmlResponce= `Perfetto hai inserito  ${ workingHours } ore lavorate per ${datax.checkBussinessDay( global.arrayPresence[objIndex].dateOfPresence )}!`;
                        }else{
                            htmlResponce+=`<b> ⛑ ERRORE REGISTRAZIONE PRESENZA ${res.message.message ? res.message.message : '' }  ⛑</b>\n\n${res.message.details ?   res.message.details : res.status }`;
                        }
                        pulisciArray(objIndex);
                        return bot.sendMessage(id,htmlResponce,{parseMode});

                    }).catch(err => {console.log(err.response.status);
                        pulisciArray(objIndex);
                        return bot.sendMessage(id, "Errore, inserimento Presenza!"+err.response.status, {parseMode});
                    });
                }
            }
        });

        function pulisciArray(objIndex) {
            //todo chiamare api di salvataggio e pulire l array, ritardo di un secondo per evitare sovrapposizione
            setTimeout(function() {
                if(objIndex>=0){ //-1 quando non trova nulla
                    global.arrayPresence.splice(objIndex, 1); //cancella elemento
                }
            }, 1000);
        }

    },
};