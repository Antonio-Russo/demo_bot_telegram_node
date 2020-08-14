class date_utils {
    constructor(){
        this.mese = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
        this.giorno = ["domenica", "lunedì", "martedì", "mercoledì","giovedì", "venerdì","sabato"];
        //this.oggi = new Date(2020,0,1);
        this.oggi = new Date();
    }


    checkBussinessDay(dateCheck){
        try {
            let part = dateCheck.split("-");
            let dataTest = new Date(parseInt(part[0]),(parseInt(part[1])-1),parseInt(part[2]));
            return "<b><u>" + this.giorno[dataTest.getDay()] +" "+ dataTest.getDate()+" "+ this.mese[dataTest.getMonth()]+" "+  dataTest.getFullYear()+"</u></b>";
        }catch{
            return "Errore data non valida";
        }
    }

    getNameThisMonth(){
        return this.mese[this.oggi.getMonth()]+' '+this.oggi.getFullYear();
    }

    getNumberThisMonthYear(){
        return [this.oggi.getMonth()+1,this.oggi.getFullYear()];
    }

    getThisDatePart(){
        let month=this.oggi.getMonth()+1;
        if(month<10){
            month='0'+month;
        }
        let datePart=this.oggi.getFullYear()+'-'+month+'-';
        return datePart;
    }

    getNamePrevMonth(){
        const prevMonthYear=this.calulatePrevMonthYear();
        return this.mese[prevMonthYear[0]-1]+' '+prevMonthYear[1];
    }

    getPrevDatePart(){
        const prevMonthYear=this.calulatePrevMonthYear();
        let datePart=prevMonthYear[1]+'-'+prevMonthYear[0]+'-';
        return datePart;
    }

    calulatePrevMonthYear(){
        let year = this.oggi.getFullYear();
        let month=this.oggi.getMonth()+1;
        if(month===1){
            year=year-1;
            month=12;
        }else{
            month=month-1;
        }

        if(month<10){
            month='0'+month;
        }
        return [month,year];
    }

}

module.exports = date_utils;