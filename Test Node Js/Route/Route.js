const {Router} =require('express');

const router =Router();
const {Insert,GetAllData,Update,getbySpecificId,remove,imageupload,insertmanydata} =require('../Controller/Controller');

router.post('/Insert',Insert);
router.get('/GetAllData',GetAllData);
router.post('/Update/:id',Update);
router.post('/getbySpecificId/:id',getbySpecificId);
router.post('/remove/:id',remove);
router.post('/imageUpload',imageupload);
router.post('/insertmanydata',insertmanydata);

module.exports=router;