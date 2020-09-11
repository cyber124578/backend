const mongoose = require('mongoose');


let categoryScheme = new mongoose.Schema({
  nom: {type: String, unique: true, index: true},
  image: {type:String},
  description:{type:String}
});

module.exports = mongoose.model('Categorys',categoryScheme);