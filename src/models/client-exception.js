class ClientException extends Error {
    constructor(status, code, message) {
        super();
        this.date = new Date();
        this.status = status;
        this.code = code;
        this.message = message;
        this.name = "ClientException";
    }
}

module.exports = ClientException;