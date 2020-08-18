# Demo Bot Telegram per la gestione delle presenze
In questo progetto impareremo le basi per la creazione di un BOT telegram per la gestionde delle prensenze
di un operatore, ci integrimamo al servizio demo_backend_java per le chiamate API

In questa versione è possibile inserire le presenze del mese corrente e di quello precedente e visualizzare 
le rispettive liste di inserimento.

E' in TODO la possibilità di cancellare una presenza.

### Requisiti 
- Consigliato un IDE tipo Intellij o VsCode

Enviroment Variable
popolare il file .env locale con le seguenti variabili
```
ENV=dev
APP_NAME=TelBot
APP_VERSION=1.0
TOKEN_BOT=...(token che ricevete alla creazione del BOT telegram)

APP_AUTH_URL=http://...(indirizzo Server API))/authenticate
APP_AUTH_USERNAME=... (username scelta)
APP_AUTH_PASSWORD=... (password scelta)

APP_API_PRESENZA=http://...(indirizzo Server API)/presence
APP_API_LISTA_PRESENZE=http://...(indirizzo Server API)/listpresences

```

Just launch
```
*creazione di un Bot telegram da cui prendere TOKEN tramite @BotFather /newbot
npm install
```

Seguendo la linea dei commit imparerai in ordine a :

* Inizializzare un progetto NodeJs 
* Aggiungere e utilizzare la dipendenza Telebot per comunicare con il bot Telegram
* Integrare la dipendenza Multilang-Sentiment per avere una piccola iterazione con il bot ed esempio capire vengono scritte parole offensive o parolaccie
* Creare un layout grafico con dei Button sul BOT e gestire una iterazione "ask" con l'utente
* Aggiunta la dipendenza axios per gestire le chiamate alle API del Backend
* Aggiunte chiamate al Backend per inserire una presenza e ottenere la lista delle presenze inserite
* Aggiunto un file di config globale per gestire le env nel progetto
