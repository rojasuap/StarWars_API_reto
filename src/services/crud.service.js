'use strict';
//Imports
const Request = require('request');

const CrudConfig = require('../settings/crud.config');

class CrudService {

    constructor() {
    }

    invokeURL(urlTarget,payload) {
        return new Promise((resolve, reject) => {

            Request(urlTarget, function (error, response, body) {                
                 if (error || response.statusCode != 200) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }

    generate(payload, id) {
        return this.invokeURL(CrudConfig.API_SWAPI_OPTIONS.endpoint + '/'+ id + '/',payload)
    }
}

module.exports = {
    CrudService
}