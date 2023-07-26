const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required: true,
        ref: "Category",
    },
    brand:{
        type: String,
        required: true
    },
    quantity:{
    type: Number,
    required: true,
    select: false
    },
    sold:{
        type:Number,
        default:0,
        select: false
    },
    images:{
        type: Array
    },
    Color:{
        type:String,
        required: true
    },
    Rating:{
        star: Number,
        posteBy: {type: mongoose.Schema.Types.ObjectId, ref:"User" }
    }
},
{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);