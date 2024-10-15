const {Schema,model} =require('mongoose')
 

const sampleSchema =new  Schema({
    Name:{type:String},
    Address:{type:String},
    Age:{type:Number},
    MobileNo:{type:Number}

})

module.exports=model('Student',sampleSchema)