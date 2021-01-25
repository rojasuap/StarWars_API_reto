'use strict';
//Imports
const Request = require('request');

const CrudConfig = require('../settings/crud.config');

class CrudService {

    constructor() {
    }

    invokeURL(urlTarget,payload) {
        //console.log('info', '[SERVICE][MESSAGE] invokeURL -> urlTarget: ' + urlTarget);
        return new Promise((resolve, reject) => {

            Request(urlTarget, function (error, response, body) {
                //console.log('error:', error); // Print the error if one occurred
                //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                //console.log('body:', body); // Print the HTML for the Google homepage.
                 if (error || response.statusCode != 200) {
                    reject(error);
                }
                //console.log(body)
                resolve(body);
            });

        });
    }

    generate(payload, id) {
        //console.log('info', '[SERVICE] [MESSAGE] generate -> url: ' + CrudConfig.API_SWAPI_OPTIONS.endpoint +  id + '/');
        return this.invokeURL(CrudConfig.API_SWAPI_OPTIONS.endpoint + '/'+ id + '/',payload)
    }

}

module.exports = {
    CrudService
}