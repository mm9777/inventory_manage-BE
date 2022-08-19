 const routes = require('express').Router();
 const {controller, getProductDetails,billingProduct, updateStock, addStock} = require('../controller/result_controller');
const {result_validator} = require('../middleware/globalmiddleware');
const{product_validator, addProduct_validator} = require('../validation/product_validation');

 (()=>{
    post_request()
    get_request()
    patch_request()
    
 })();

 function post_request(){
    routes.post("/invetoryProduct",product_validator(),result_validator,controller)

 }
 function patch_request(){
    routes.patch("/updatestock",updateStock)
    routes.patch('/addStock',addProduct_validator(),result_validator,addStock)



 }
 function get_request(){
    routes.get("/product",getProductDetails) 
    routes.get("/bill",billingProduct)
    
    
 }

module.exports = routes