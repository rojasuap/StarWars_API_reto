const mongoose = require('mongoose');
const VehicleSchema = new mongoose.Schema({  
    nombre : String,
    modelo: String,
    fabricante:String,
    costo_en_creditos:String,
    longitud:String,
    velocidad_maxima_atmosfera:String,
    tripulacion:String,
    pasajeros:String,
    capacidad_carga:String,
    consumibles:String,
    clase_vehiculo:String,
    pilotos:Array,
    peliculas:Array,
    creado:String,
    editado:String,
    url:String
});
module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);