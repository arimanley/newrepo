// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require('../utilities/index'); //I ADD THESE for the middleware

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route for an specific inventory item detail view
router.get("/detail/:invId", invController.buildByInvId); //WEEK 7



// Wrap all routes with error handling //I ADD THESE for the middleware
router.use(Util.handleErrors);


module.exports = router;
