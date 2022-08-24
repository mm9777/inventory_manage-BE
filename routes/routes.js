 const routes = require('express').Router();
 const {controller, updateStock, addStock,postProductDetail} = require('../controller/result_controller');
const {result_validator} = require('../middleware/globalmiddleware');
const{product_validator, addProduct_validator} = require('../validation/product_validation');

 (()=>{
    post_request()
    patch_request()
    
 })();

 function post_request(){
    routes.post("/invetoryProduct",product_validator(),result_validator,controller)
    routes.post("/product",postProductDetail)

 }
 function patch_request(){
    routes.patch("/updatestock",updateStock)
    routes.patch('/addStock',addProduct_validator(),result_validator,addStock)



 }

    

module.exports = routes