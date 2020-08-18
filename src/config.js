require('dotenv').config();
const config = {
    env: process.env.ENV || "local",
    app: {
        name: process.env.APP_NAME ,
        version: process.env.APP_VERSION,
        tokenTelegram: process.env.TOKEN_TELEGRAM
    },
    auth: {
        authenticateURL: process.env.APP_AUTH_URL,
        username: process.env.APP_AUTH_USERNAME,
        password: process.env.APP_AUTH_PASSWORD
    },
    apiPresenza:{
        apiPresenza: process.env.APP_API_PRESENZA,
        apiListaPresenze: process.env.APP_API_LISTA_PRESENZE
    }
};

module.exports = config;