const {default : mongoose} = require('mongoose');

const dbconnect = () => {
try{    
        const conn = mongoose.connect(process.env.MONGODB);
        console.log('db is connected');
    }
catch(error){
    console.log("db is not connected yet");
}

}

module.exports = dbconnect;