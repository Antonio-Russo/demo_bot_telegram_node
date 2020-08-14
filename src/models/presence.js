class presence {
    constructor(){
        this.reset();
    }

    initModel (data) {
        this.idTelegram = data.idTelegram;
        this.name = data.name;
        this.dateOfPresence = data.dateOfPresence;
        this.workingHours = data.workingHours
    }

    setIdTelegram (idTelegram) { this.idTelegram = idTelegram; }
    setName (name) {this.name = name;}
    setDateOfPresence (dateOfPresence) {this.dateOfPresence = dateOfPresence;}
    setWorkingHours (workingHours) {this.workingHours = workingHours;}

    getDateOfPresence () {return this.dateOfPresence;}

    reset() {
        this.idTelegram = null;
        this.name = null;
        this.dateOfPresence = null;
        this.workingHours = null
    }
}

module.exports = presence;