const {Router} = require('express');

const router = Router();

const {create,getall,remove,update,getbyid, imageupload}  = require('../Controllers/samplecontroller');

router.post('/create',create);
router.get('/getall',getall);
router.post('/delete/:id',remove);
router.post('/update/:id',update);
router.get('/getbyid/:id',getbyid);
router.post('/imageupload',imageupload);


module.exports = router;
