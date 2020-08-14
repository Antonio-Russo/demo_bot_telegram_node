let Presence = require('../models/presence');
let data_utils = require('../utils/date_utils');
const BUTTON_INTEFACE = require('../constants/button');
const commandStartThisMonth=BUTTON_INTEFACE.ins.label;
const commandStartPrevMonth=BUTTON_INTEFACE.insprev.label;

let presenceThisMonth = new Presence();
let datax= new data_utils();
let prevMonth=false;

module.exports = {
    name: 'askPresenza',
    description: 'Ask inserimento Presenza!',
    execute(bot,msg,g) {

        bot.on('text', (msg) => {
            const { text, from } = msg;

            if ((text === commandStartThisMonth || text === commandStartPrevMonth)  && ! g.askInCorso) {
                g.askInCorso=true;
                text === commandStartThisMonth ? prevMonth=false : prevMonth =true;
                presenceThisMonth.reset();
                presenceThisMonth.setName(from.first_name + ' ' + from.last_name);
                presenceThisMonth.setIdTelegram(from.id)
                let message="Stai per inserire le presenze di <b><u>"+( prevMonth ? datax.getNamePrevMonth() : datax.getNameThisMonth() )+"</u></b>.\nInserisci il numero del giorno grazie!\nClicca o scrivi /annullaInserimento per fermarti!";
                let parseMode = 'html';
                return bot.sendMessage(from.id, message, {parseMode, ask: 'day'});
            }
        });

        // inserimento giorno lavoro
        bot.on('ask.day', (msg,args) => {
            //console.table(args);
            const id = msg.from.id;
            if(msg.text==='/annullaInserimento'){
                bot.sendMessage(id, `Inserimento annullato grazie!`);
                g.askInCorso=false;
                return;
            }
            const day = Number(msg.text);
            if (!day || day>31) {
                return bot.sendMessage(id, 'Inserire un numero per il giorno tra 1 e 31, riprova!', {ask: 'day'});
            }else{
                var dataPrensenza= prevMonth ? datax.getPrevDatePart()+day : datax.getThisDatePart()+day ;
                presenceThisMonth.setDateOfPresence(dataPrensenza);
                let parseMode = 'html';
                let message="Stai inserendo la presenza di "+datax.checkBussinessDay(dataPrensenza)+"\nInserisci il numero di ore che hai lavorato per favore.\nClicca o scrivi /annullaInserimento per fermarti!";
                return bot.sendMessage(id, message, {parseMode,ask: 'workingHours'});
            }
        });

        // inserimento ore lavorate nel giorno
        bot.on('ask.workingHours', (msg) => {
            const id = msg.from.id;
            if(msg.text==='/annullaInserimento'){
                bot.sendMessage(id, `Inserimento annullato grazie!`);
                g.askInCorso=false;
                return;
            }
            const workingHours = Number(msg.text);
            if (!workingHours) {
                return bot.sendMessage(id, 'Numero di ore lavorate non corrette (ricorda minimo 1 massimo 12), riprova!', {ask: 'age'});
            } else {
                // Ultimo messaggio
                presenceThisMonth.setWorkingHours(workingHours);
                console.log(presenceThisMonth);
                let parseMode = 'html';
                bot.sendMessage(id, `Perfetto hai inserito  ${ workingHours } ore lavorate per ${datax.checkBussinessDay(presenceThisMonth.getDateOfPresence())}!`,{parseMode});
                setTimeout(function() {
                    g.askInCorso=false;
                }, 1000);
                return;
            }
        });
    },
};