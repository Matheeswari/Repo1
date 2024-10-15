const {Schema,model} = require('mongoose')

const sampleSchema = new Schema({

    name:{type:String},
    age:{type:Number}
})

module.exports = model('sample',sampleSchema)