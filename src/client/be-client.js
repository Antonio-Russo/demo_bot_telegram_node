const axios = require("axios");
const FormData = require('form-data');
const ClientException = require("../models/client-exception");
const {auth,apiPresenza} = require("../config");


class BeClient{
    constructor() {
    }

    async getToken() {
        let response={status:null,message:null};
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            const body = {'username': auth.username, 'password': auth.password};
            let result = await axios.post(auth.authenticateURL, body, {headers: headers});

            if(result.status==200 || result.status==202) {
                response.status=result.status;
                response.message=result.data;
            }else{
                response.status=result.status;
                response.message="Errore Token non ricevuto!"
            }
            return response;
        } catch (e) {
            //throw new ClientException("INTERNAL_SERVER_ERROR", "500", e.message);
            return new ClientException("INTERNAL_SERVER_ERROR", e.code , e.message);
        }

    }

    async addPresence(bodyPresence) {
        let response={status:null,message:null};
        try {
            const responseToken = await this.getToken();
            if(responseToken.status===200){
                const token=responseToken.message.jwt;
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization-token': 'Bearer '+ token
                }
                try{
                    let result = await axios.post(apiPresenza.apiPresenza, bodyPresence, {headers: headers});
                    if(result.status==200 || result.status==202) {
                        response.status=result.status;
                        response.message=result.data;
                    }else{
                        response.status=result.status;
                        response.message="Errore Presenza non inserita correttamente!"
                    }
                }
                catch (error) {
                    response.status=error.response.status;
                    response.message=error.response.data;
                    //console.log(error.response)
                }

            }else{
                response.status=responseToken.status;
                response.message="Errore Token non ricevuto!"
            }

            return response;
        } catch (e) {
            return new ClientException("INTERNAL_SERVER_ERROR", e.code , e.message);
        }
    }

    async deletePresence(bodyPresence) {
        let response={status:null,message:null};
        try {
            const responseToken = await this.getToken();
            if(responseToken.status===200){
                const token=responseToken.message.jwt;
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization-token': 'Bearer '+ token
                }
                try{
                    let result = await axios.delete(apiPresenza.apiPresenza, {
                        headers: headers,
                        data: bodyPresence
                    });
                    if(result.status==200 || result.status==202) {
                        response.status=result.status;
                        response.message=result.data;
                    }else{
                        response.status=result.status;
                        response.message="Errore Presenza non cancellata correttamente!"
                    }
                }
                catch (error) {
                    response.status=error.response.status;
                    response.message=error.response.data;
                    //console.log(error.response)
                }

            }else{
                response.status=responseToken.status;
                response.message="Errore Token non ricevuto!"
            }

            return response;
        } catch (e) {
            return new ClientException("INTERNAL_SERVER_ERROR", e.code , e.message);
        }
    }

    async listPresences(idTelegram,month,year) {
        let response={status:null,message:null};
        try {
            const responseToken = await this.getToken();
            if(responseToken.status===200){
                const token=responseToken.message.jwt;
                try{

                    let data = new FormData();
                    data.append('idTelegram', idTelegram);
                    data.append('month', month);
                    data.append('year', year);

                    const headers = {
                        "Content-Type": "application/json",
                        'Authorization-token': 'Bearer '+ token,
                        ...data.getHeaders()
                    }

                    let result = await axios.post(apiPresenza.apiListaPresenze, data, {headers: headers});

                    if(result.status==200 || result.status==202) {
                        response.status=result.status;
                        response.message=result.data;
                    }else{
                        response.status=result.status;
                        response.message="Errore Lista Presenze non ricevute correttamente!"
                    }

                }
                catch (error) {
                    response.status=error.response.status;
                    response.message=error.response.data;
                    console.log(error);
                }

            }else{
                response.status=responseToken.status;
                response.message="Errore Token non ricevuto!"
            }

            return response;
        } catch (e) {
            return new ClientException("INTERNAL_SERVER_ERROR", e.code , e.message);
        }
    }

}

module.exports = BeClient;