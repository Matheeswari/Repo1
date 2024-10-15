const { Console } = require('console');
const GetModel=require('../Model/Model')
const multer =require('multer');
const path=require('path');


exports.Insert=async(req,res,next)=>{
    try{

       // const sampleDoc = await SampleModel.create({ name, age });
        const {Name,Address,Age,MobileNo} =req.body;
        const InsertData =new GetModel({Name,Address,Age,MobileNo});
        await InsertData.save();
        return res.status(201).json({message:"Created Successfully",data:InsertData});
    }
    catch(err){
        return res.Status(400).json({error:"Something went worng",message:err.message})
    }
}


exports.insertmanydata = async (req, res, next) => {
    try {
      const records = req.body;
      const result = await GetModel.insertMany(records);  
      return res.status(201).json({ message: "Created Successfully", data: result });
    } catch (err) {
      return res.status(400).json({ message: "Something is wrong", error: err.message });
    }
  };

  
  

exports.GetAllData=async(req,res,next)=>{
    try{
        const sampleDoc =await GetModel.find();
        return res.status(200).json({data:sampleDoc})
    }
    catch(err){
        return res.status(404).json({message:err.message})
    }
}


exports.Update =async (req,res,next)=>{
    try{
        const {id}=req.params;
        const{Name,Address,Age,MobileNo} =req.body;

        const UpdateObj={};
        if(Name) UpdateObj.Name=Name;
        if(Address) UpdateObj.Address=Address;
        if(Age) UpdateObj.Age=Age;
        if(MobileNo) UpdateObj.MobileNo=MobileNo;

        const UpdateRecored=await GetModel.findByIdAndUpdate(id,UpdateObj,{new:true});

        if(!UpdateRecored){
            return res.status(400).json({error:"Record Not Found"});
        }
            res.status(200).json({message:"Record Updated Successffully",data :UpdateRecored})
        
    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}


exports.Updatespecific =async (req,res,next)=>{
    try{
        const {id}=req.params;
        const{Name,Address,Age,MobileNo} =req.body;

        const UpdateObj={};
        if(Name) UpdateObj.Name=Name;
        if(Address) UpdateObj.Address=Address;
        if(Age) UpdateObj.Age=Age;
        if(MobileNo) UpdateObj.MobileNo=MobileNo;

        const UpdateRecored=await GetModel.findByIdAndUpdate(id,UpdateObj,{new:true});

        if(!UpdateRecored){
            return res.status(400).json({error:"Record Not Found"});
        }
            res.status(200).json({message:"Record Updated Successffully",data :UpdateRecored})
        
    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}



exports.getbySpecificId =async(req,res)=>{
    try{
        const {id} =req.params;
        const data =await GetModel.findById(id);
        return res.status(200).json({data});
    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}

exports.remove =async(req,res,next)=>{
    
    try{
        const {id}=req.params;
        const deleteRecord=await GetModel.findByIdAndDelete(id);

        if(!deleteRecord){
            return res.status(400).json({message:"Data Not Found"});
        }
        return res.json({message:"Record Deletd Successfully",data:deleteRecord});
        }
    catch(err){
        console.log(err);
        return res.status(500).json({message:err.message})
    }
}


exports.imageupload =async(req,res,next)=>{
    try{
        let uploadedFileName ='';
        const filePath = path.join(__dirname + '/Data/Image');
        const UploadStorage = multer.diskStorage({
            destination:filePath,
            filename:(req,file,cb)=>{
                const originalname =file.originalname;
                const fileExtension=path.extname(originalname);
                const uniqueSuffix=Date.now();
                const newFileName =path.basename(originalname,fileExtension)+'_'+uniqueSuffix+fileExtension;
                uploadedFileName='/Data/Image/'+newFileName;
                cb(null,newFileName);
            }
        });

        const upload = multer({storage:UploadStorage}).single('image');

        upload( req, res, async function(err){
                if (err) {
                    return res.status(500).json({ command: "Error Uploading file", err });
                }
                return res.status(200).json({ imageUploaded: uploadedFileName });
            })

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}
