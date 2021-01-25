'use strict';
//Imports
const Boom = require('boom');
require('dotenv').config({ path: './variables.env' });
const CrudService = require('../services/crud.service').CrudService;
const connectToDatabase = require('../repositories/db');
const Vehicle = require('../models/Vehicle');


//Attributes
let crudService = new CrudService();
let crudModificado;

//Handler Function

//Función PruebaLeer ApiExterna
module.exports.LeerExternoVehicles = (event, context, callback) => {
  console.log('info', '[HANDLER] [MESSAGE] createVehicles -> id :: '+ event.pathParameters.id );
  let id = event.pathParameters.id

  crudService.generate(event.body, id)
  .then((crud)=> {
      
    const response = {
        statusCode: 200,
       // body: JSON.stringify(crud),
       body: crud,
    };
    
    callback(null, response);
  })
  .catch((err) => {
      console.log('info', 'ERROR' );
      throw Boom.badRequest(err);
  });
};

//Función PruebatranslateVehicles
module.exports.translateVehicles = (event, context, callback) => {
  console.log('info', '[HANDLER] [MESSAGE] translateVehicles -> id :: '+ event.pathParameters.id );
  let id = event.pathParameters.id
  var crudTraducido;

  crudService.generate(event.body, id)
  .then((crud)=> {

    var crudOriginal = [];    
    crudOriginal.push(JSON.parse(crud))    
    let crudModified = crudOriginal.map(
      obj => {
          return {
              "nombre" : obj.name,
              "modelo":obj.model,
              "fabricante":obj.manufacturer,
              "costo_en_creditos":obj.cost_in_credits,
              "longitud":obj.length,
              "velocidad_maxima_atmosfera":obj.max_atmosphering_speed,
              "tripulacion":obj.crew,
              "pasajeros":obj.passengers,
              "capacidad_carga":obj.cargo_capacity,
              "consumibles":obj.consumables,
              "clase_vehiculo":obj.vehicle_class,
              "pilotos":obj.pilots,
              "peliculas":obj.films,
              "creado":obj.created,
              "editado":obj.edited,
              "url":obj.url,
          }
      }
  );  
  
  crudModified.forEach(element => crudTraducido= element);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(crudTraducido)
    };
    
    callback(null, response);
  })
  .catch((err) => {
      console.log('info', 'ERROR' );
      throw Boom.badRequest(err);
  });
};

//Crear Vehicles
module.exports.createDbVehicles = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  //Declaración de variables
  let json = JSON.parse(event.body)
  let paramId;
  var crudOriginal = [];
  
  //Recuperando el id del post.
  for (var id in json){
    // Controlando que json realmente tenga esa propiedad
    if (json.hasOwnProperty(id)) {
      // Mostrando en pantalla la clave junto a su valor
      paramId = json.id
    }
  }

  //traduciendo json
  crudService.generate(event.body, paramId)
  .then((crud)=> {         
    crudOriginal.push(JSON.parse(crud))    
    let crudModified = crudOriginal.map(
      obj => {
          return {
              "nombre" : obj.name,
              "modelo":obj.model,
              "fabricante":obj.manufacturer,
              "costo_en_creditos":obj.cost_in_credits,
              "longitud":obj.length,
              "velocidad_maxima_atmosfera":obj.max_atmosphering_speed,
              "tripulacion":obj.crew,
              "pasajeros":obj.passengers,
              "capacidad_carga":obj.cargo_capacity,
              "consumibles":obj.consumables,
              "clase_vehiculo":obj.vehicle_class,
              "pilotos":obj.pilots,
              "peliculas":obj.films,
              "creado":obj.created,
              "editado":obj.edited,
              "url":obj.url,
          }
      }
  );
  //recorrer el json origian y cambiar el key 
  crudModified.forEach(element => crudModificado= element);
    })
  .catch((err) => {
      console.log('info', 'ERROR' );
      throw Boom.badRequest(err);
  });
    
  //Registrando en Base de datos
  connectToDatabase()
    .then(() => {      
      Vehicle.create(crudModificado)  
        .then(vehicle => callback(null, {
          statusCode: 200,
          body: JSON.stringify(vehicle)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the vehicle.'
        }));
    });
};

//Listar vehicle
module.exports.getOneVehicle = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Vehicle.findById(event.pathParameters.id)
        .then(vehicle => callback(null, {
          statusCode: 200,
          body: JSON.stringify(vehicle)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the vehicle.'
        }));
    });
};


//Listar todos los vehicles
module.exports.getAllVehicles = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('info', '[HANDLER] [VEHICLE] [INICIO] getAllVehicles');
  connectToDatabase()
    .then(() => {
      Vehicle.find()
        .then(vehicles => callback(null, {
          statusCode: 200,
          body: JSON.stringify(vehicles)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the vehicles.'
        }))
    });
};

//Función modificar vehicle
module.exports.updateVehicle = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('info', '[HANDLER] [VEHICLE] [INICIO] updateVehicle -> id :: '+  event.pathParameters.id);
  connectToDatabase()
    .then(() => {
      Vehicle.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(vehicle => callback(null, {
          statusCode: 200,
          body: JSON.stringify(vehicle)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the vehicles.'
        }));
    });
};

//Función eliminar vehicle
module.exports.deleteVehicle = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('info', '[HANDLER] [VEHICLE] [INICIO] deleteVehicle -> id :: '+  event.pathParameters.id);
  connectToDatabase()
    .then(() => {
      Vehicle.findByIdAndRemove(event.pathParameters.id)
        .then(vehicle => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed vehicle with id: ' + vehicle._id, vehicle: vehicle })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the vehicle.'
        }));
    });
};