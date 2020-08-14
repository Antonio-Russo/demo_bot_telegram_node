// esempio di command per pilotare risposta su richieste specifiche
module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(bot,msg,g) {
        if(!g.askInCorso) {
            const {chat} = msg;
            return bot.sendMessage(chat.id, `Pong`);
        }
    },
};