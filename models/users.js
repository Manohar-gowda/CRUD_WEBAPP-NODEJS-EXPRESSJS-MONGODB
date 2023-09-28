const mongoose = require('mongoose')

//connection Mongodb

mongoose.set('strictQuery', false);
const url = 'mongodb+srv://Something8980:cnPVJRAzy6lksTt8@cluster0.3wkb0qu.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(url, {
useNewUrlParser:true,
useUnifiedTopology:true
}).then(( )=>{
console.log("DataBase connected successfully!")
}).catch((err) =>{
console.log('unsuccessfull connection')
})


const userSchema=new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email: {
         type:String,
         required:true,
    },
    phone: {
        type:String,
         required:true,
    },
    image: {
        type:String,
        required:true,
   },
     created: {
        type: Date,
        required:true,
        default:Date.now,
     },
});


let Users = new mongoose.model('User', userSchema);
module.exports = Users;