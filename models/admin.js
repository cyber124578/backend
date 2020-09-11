const mongoose = require ("mongoose");
const adminSchema = mongoose.Schema({
    user:String,
    email:{type: String, unique: true, index: true},
    tel : {type:Number},
    status:{ type: Boolean},
    password : String,
    confirmPassword : String,
    image: {type:String},

});

module.exports = mongoose.model('admin',adminSchema);