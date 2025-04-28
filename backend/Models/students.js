const mongoose= require("mongoose")
const studentschema=mongoose.Schema({
    studentname:{type:String}

})
const model = mongoose.model("model",studentschema)
module.exports=model