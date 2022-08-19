const moduleSchema = require('../model/module_schema')
const billSchema = require('../model/billSchema')
var mongoXlsx = require('mongo-xlsx');

exports.controller = async(req, res)=>{
   // console.log(req.body)
    moduleSchema(req.body).save(async (err, result) => {
        
        if (err) {
          next(new Error("Data not saved"));}
          else{
          res.status(200).send({result})
        }
        })
    
}
exports.getProductDetails = async (req, res)=>{
    const product = req.body.product 
    console.log(req.body.product)
    // const amount = parseInt(req.body.amount)
    const {quantity,payment,billing_to} = req.body
    const find = await moduleSchema.findOne({product:product})
    if(find){
    
    console.log(product,quantity,payment,billing_to)
    let data ={
        product:product,
        gst : "5%",
        amount :10,
        quantity : quantity,
        date : new Date(),
        discount : 10,
        payment : payment,
        status :"success",
        billing_to:billing_to
        
        
    }
    // console.log("qqqqqq",find)
    // var model = mongoXlsx.buildDynamicModel(find);
    
    // mongoXlsx.mongoData2Xlsx(data, model, function(err, data){
    //   res.send(data); 
// });
 
    
 
    
    let result = await moduleSchema.findOne({product})
    console.log("vvvvvvvvvv",result)
    let myprice = (result.myprice/result.quantity)*quantity
    console.log(myprice,"price")
    let pricewithgst = (myprice*5/100+myprice);
    console.log("priceGst",pricewithgst)
    let resPrice =parseInt( pricewithgst- (pricewithgst*10/100))
    console.log("final price",resPrice)
    data.amount=resPrice
   
    

    // res.status(200).send({data})
    billSchema(req.body).save({data})
    res.send({data})
}
else{
    res.status(400).send({msg:"product is not in our stock"})
}
}
exports.billingProduct = async(req, res)=>{
    console.log(req.query)
    const {product} = req.query
    // console.log(_id)
    const billFind = await billSchema.findOne({product})
    console.log(billFind)
     res.send({billFind})
}



exports.updateStock = async(req, res)=>{
    let  {product,quantity,amount} = req.body
    let productDetail= await moduleSchema.findOne({product})
    let myprice = (productDetail.myprice)-(amount)
    priceAccount  = (productDetail.price)/(productDetail.quantity)
    console.log("aaaaaaaa",priceAccount)   
    
    let productQuantity = await billSchema.findOne({product})
    custemorquantity = (productQuantity.quantity)
    console.log("ssssss",custemorquantity)
    let price = (productDetail.price) - (custemorquantity*priceAccount)
    
     
     quantity =  productDetail.quantity - quantity
     console.log(quantity)
    

     
    if((quantity)<(custemorquantity)){
        
        res.send(`i have product quantity: ${ quantity}`);
    }

    
    else{
    

       const resData = await moduleSchema.findOneAndUpdate({product},{$set:{quantity,myprice,price}},{new:true})
        if(resData) res.send({resData})
        else res.send({err:"err occured"})
    
    }
}



exports.addStock = async(req,res)=>{
    let  {product,quantity,price,myprice} = req.body
    let productDetail= await moduleSchema.findOne({product})
    if(productDetail){
    const netQuantity = productDetail.quantity + req.body.quantity
    const netMyprice = productDetail.myprice + req.body.myprice
    const netPrice = productDetail.price + req.body.price
    console.log(netPrice)
    console.log("ddddd",netMyprice)
    req.body.quantity = netQuantity
    const resuData = await moduleSchema.updateOne({product},{$set:{quantity:netQuantity,myprice:netMyprice,price:netPrice}},{new:true})
    
    if(resuData) res.send({resuData})
    else res.send({err:"err occured"})
}
 else{
    res.send({msg:"product is not in our stock "})
 }
}


