const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Adding Classification Data Validation Rules
 * ********************************* */
validate.AddingClassRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkReggData= async (req, res, next) => {
    const {  classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,

      })
      return
    }
    next()
  }


  /*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
  validate.AddingInvRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("inv_description")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."),

      body("inv_image")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide an image."),

        body("inv_thumbnail")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a thumbnail."),
        
        body("inv_price")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a price."),

        body("inv_miles")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide miles."),
        
  
        body("inv_color")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a color."),
        
    
    ]
  }

  /* ******************************
 * Check data and return errors or continue with adding inventory ite
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail,inv_price,inv_year,inv_miles,inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        inv_make, inv_model, inv_description, inv_image, inv_thumbnail,inv_price,inv_year,inv_miles,inv_color,
      })
      return
    }
    next()
  }
  

  module.exports = validate