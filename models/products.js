
const mongoose = require('mongoose');
let productsScheme = new mongoose.Schema({

        nom: {type: String, unique: true, index: true},
        category:{type: mongoose.Schema.Types.ObjectId, required: true,ref: 'Categorys'},
        quantity:{type:Number},
        image: {type:String},
        CodeaBarres:{type:Number},
        price:{type:Number},
       description:{type:String}
  });
  
  module.exports = mongoose.model('products',productsScheme);

