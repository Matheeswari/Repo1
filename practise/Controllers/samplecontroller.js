const SampleModel = require('../Models/samplemodel')
const multer = require('multer');
const path = require('path');

exports.create = async(req,res,next)=>{
    try
    {
    const {name,age} = req.body;
    const SampleDoc = new SampleModel({name,age});
    await SampleDoc.save();

    return res.status(201).json({message:"Created Successfully",data:SampleDoc});
    }
    catch(err){
        return res.status(400).json({error:'Something is wrong',message:err.message})
    }
}


exports.getall = async(req,res,next)=> {
    try{
        const SampleDoc = await SampleModel.find({},{_id:0});
        return res.status(200).json({data:SampleDoc})
    }
    catch(err){
        return res.status(404).json({message:err.message})
    }
}

exports.remove = async(req,res,next)=>{
  
    try{
        const {id} = req.params;

        const deletedRecord = await SampleModel.findByIdAndDelete(id);

        if(!deletedRecord){
            return res.status(404).json({message:"Data not found"});
        }
        
        return res.json({message:"Record deleted successfully",data:deletedRecord})
    }
    catch(err){
        console.log(err );
        return res.status(500).json({message:err.message})
    }
}

exports.update = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const{name,age} = req.body;

        const updatedObject = {};

        if(name) updatedObject.name = name ;
        if(age) updatedObject.age = age;
        const updatedRecord = await SampleModel.findByIdAndUpdate(id,updatedObject, {new:true});

        if(!updatedRecord){
            return res.status(400).json({error:'Record not found'});
        }
        
        res.status(200).json({message:"Record Updated Successfully", data : updatedRecord})
        
    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}

exports.getbyid = async(req,res)=>{
    try{
    const {id} = req.params;

    const data = await SampleModel.findById(id);
    return res.status(200).json({data});       

    }
    catch(err){
        return res.status(400).json({message:err.message});
    }    
}

exports.imageupload = async(req,res,next)=>{
    try
    {
        let uploadedFileName = '';
        const filePath = path.join(__dirname + '/Data/Image');
        const UploadStorage = multer.diskStorage({
            destination:filePath,
            filename:(req,file,cb)=>{
                const originalname = file.originalname;
                const fileExtension = path.extname(originalname);
                const uniqueSuffix = Date.now();
                const newFileName = path.basename(originalname,fileExtension)+ '_' + uniqueSuffix + fileExtension;
                uploadedFileName = '/Data/Image/' + newFileName ;
                cb(null,newFileName)
            }
        });
        const upload = multer({storage:UploadStorage},).single('image');

        upload(req,res,async function(err){
            if(err){
                return res.status(500).json({command :"Error Uploading file",err})
            }
            res.status(200).json({ImageUploaded:uploadedFileName})
        })
    }
    catch(err){
        res.status(500).json({message : err.message});
    }
}