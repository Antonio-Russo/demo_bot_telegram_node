const {app} = require("./config");
const TeleBot = require('telebot');
const fs = require('fs');
const sentiment = require('multilang-sentiment');
const Discord = require('discord.js');
let bot = new Discord.Client();
bot = new TeleBot({
    token:  app.tokenTelegram,
    usePlugins: ['namedButtons','askUser'],
    pluginConfig: {
        namedButtons: {
            buttons: this.BUTTON_INTEFACE
        }
    }
});

//contiene le variabili globali da condidere con i moduli
const g = require('./models/global');
global.arrayPresence= [];

//contiene la lista dei bottoni relativa al markup del BOT che vengono gestiti dal BOT con commands apposite
const BUTTON_INTEFACE = require('./constants/button');
const actionButton = [
        BUTTON_INTEFACE.ins.label, BUTTON_INTEFACE.insprev.label,
        BUTTON_INTEFACE.list.label,BUTTON_INTEFACE.listprev.label
];

//definisco quali e quanti bottoni su ogni riga del bot
let replyMarkup = bot.keyboard([
    [BUTTON_INTEFACE.ins.label, BUTTON_INTEFACE.insprev.label],
    [BUTTON_INTEFACE.list.label,BUTTON_INTEFACE.listprev.label]
], {resize: true});

//colleziono tutti i commands presenti per le azioni nella omonima cartella
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(__dirname +'/commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(__dirname +`\\commands\\${file}`);
    bot.commands.set(command.name, command);
}

bot.on('text', (msg) => {
        const { chat, text } = msg;
        const command = text.toLowerCase();

        let objIndexAsk = global.arrayPresence.findIndex((obj => obj.idTelegram == msg.from.id));

        console.info(`Called command ${msg.from.first_name} (${msg.from.id}) : ${text} objIndexAskInCorso-> ${objIndexAsk} `);

        //attivo la routine ask per l'interazione con il bot e l'inserimento delle presenze
        if(!g.attivoAsk){
            bot.commands.get("askPresenza").execute(bot,msg,g);
            bot.commands.get("askListaPresenze").execute(bot,msg,g);
            g.attivoAsk=true;
        }

        if (!bot.commands.has(command) && objIndexAsk===-1 && !actionButton.find(o => o === text)){
            if(command!=='/start' && command!=='/help' && command!=='/annullainserimento' ){

                //analizzo il sentiment del messaggio per dare una risposta in caso di score negativo
                //todo implementare un metodo che con uno score positivo risponda in maniera simpatica con un aforisma
                var sentimentScore= sentiment(command,'it');
                if(sentimentScore.score<0){
                    return bot.sendMessage(chat.id,`Cerca di dirmi cose più carine grazie!`);
                }

                // se lo score non è negativo perchè il motore di sentiment ha fallito e ci sono delle parolacce conosciute, do un ulteriore avviso
                // lista parolacce presa da https://github.com/napolux/paroleitaliane
                var arrayBadWord = fs.readFileSync(__dirname +'/constants/badword.txt').toString().split('\n');
                var picked = arrayBadWord.find(o => o === command+'\r');
                if(picked && picked.length>0){
                    return bot.sendMessage(chat.id,`Non dire parolacce per favore!`);
                }else{
                    return bot.sendMessage(chat.id,`Scusami ma non ho capito. Clicca o digita "/help" per sapere cosa fare `);
                }
            }else{
                return;
            }
        }

        try {
            if(bot.commands.has(command))
                bot.commands.get(command).execute(bot,msg,g);
        } catch (error) {
            console.error(error);
        }
});

bot.on('/start', (msg) => {


    return bot.sendMessage(msg.from.id, 'Benvenuto!', {replyMarkup});
});

bot.on('/help', (msg) => {

    //todo da implementare un help per l'utente in HTML
    const html=`😺 🥰 <b>bold</b>, <strong>bold</strong>
                <i>italic</i>, <em>italic</em>
                <u>underline</u>, <ins>underline</ins>
                <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
                <b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>
                <a href="http://www.example.com/">inline URL</a>
                <a href="tg://user?id=123456789">inline mention of a user</a>
                <code>inline fixed-width code</code>
                <pre>pre-formatted fixed-width code block</pre>
                <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>`;

    let parseMode = 'html';
    bot.sendMessage(
        msg.from.id, html, {parseMode,replyMarkup}
    );

});

bot.start();