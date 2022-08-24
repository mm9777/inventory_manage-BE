const moduleSchema = require('../model/module_schema')
const billSchema = require('../model/billSchema')
var mongoXlsx = require('mongo-xlsx');

exports.controller = async (req, res) => {
    // console.log(req.body)
    moduleSchema(req.body).save(async (err, result) => {

        if (err) {
            next(new Error("Data not saved"));
        }
        else {
            res.status(200).send({ result })
        }
    })

}

// -----------------addStock------------


exports.addStock = async (req, res) => {
    let { product, quantity, price, myprice } = req.body
    let productDetail = await moduleSchema.findOne({ product })
    if (productDetail) {
        const netQuantity = productDetail.quantity + req.body.quantity
        const netMyprice = req.body.myprice +req.body.myprice
        const netPrice = productDetail.price + req.body.price
        console.log(netPrice)
        console.log("ddddd", netMyprice)
        req.body.quantity = netQuantity
        const resuData = await moduleSchema.updateOne({ product }, { $set: { quantity: netQuantity, myprice: netMyprice, price: netPrice } }, { new: true })

        if (resuData) res.send({ resuData })
        else res.send({ err: "err occured" })
    }
    else {
        res.send({ msg: "product is not in our stock " })
    }
}

// -------------billing Product------------

exports.postProductDetail = async (req, res) => {
    let { product, quantity, discount, payment, billing_to } = req.body

    
    

    let products = []

    let amount = 0;
    var promise = await product.map(async (val, i) => {
        products.push({ product: val, quantity: quantity[i] })
        let result = await moduleSchema.findOne({ product: val })
        console.log("vvvvvvvvvv", result)
        let myprice = (result.myprice / result.quantity) * quantity[i]
        console.log(myprice, "price")
        let resPrice = parseInt(myprice - (myprice * discount[i] / 100))
        amount = amount + resPrice
        console.log("final price", resPrice,amount) 
        return amount;
    })


    let data = {
        products: products,
        gst: "5%",
        amount: 10,
        date: new Date(),
        discount: discount,
        payment: payment,
        status: "success",
        billing_to: billing_to


    }
    Promise.all(promise).then(function (results) {
        results.sort()
        let dat;
        let maxi = Math.max(...results)
        console.log("data",maxi)
        let pricewithgst = maxi * 5 / 100 + maxi
        console.log(pricewithgst)
        data.amount = pricewithgst
        console.log(results, "sdhb")
        billSchema(req.body).save({ data })
        res.send(data)
    })
    

    
}

// ---------------------updateStock--------------------

exports.updateStock = async (req, res) => {
    let { products } = req.body


    

    var promise = await products.map(async (val, i) => {
        let productDetail = await moduleSchema.findOne({ product: val.product })
        console.log(productDetail)

        let priceAccount = parseInt(productDetail.price) / parseInt(productDetail.quantity)
        console.log("aaaaaaaa", val.quantity)
        let totalPurchasedAmount = priceAccount*val.quantity
        let resPrice = productDetail.price - totalPurchasedAmount
        let resQuantity = productDetail.quantity - val.quantity
        console.log("hhsdfg",resPrice,resQuantity)
        let result = await moduleSchema.findOneAndUpdate({product:val.product},{quantity:resQuantity,price:resPrice},{new:true})
        return result;
        
    })


    Promise.all(promise).then((result)=>{

        res.send({msg:"successdully stock is updated",result})
    })


}



