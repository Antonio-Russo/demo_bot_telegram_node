
// 🏢🏬🔨⚒🛠⚙️🧹🛎📅📆🔍🌍⌨👤

const BUTTONS = {
    ins: {
        label: '📅 Ins. Presenza Mese',
        command: '/this'
    },
    insprev: {
        label: '📆 Ins. Presenza Mese Scorso',
        command: '/prev'
    },
    list: {
        label: '👤 Lista Presenze Mese',
        command: '/listThis'
    },
    listprev: {
        label: '👤 Lista Presenze Scorso',
        command: '/listPrev'
    }
};

module.exports =
    Object.freeze(BUTTONS);
