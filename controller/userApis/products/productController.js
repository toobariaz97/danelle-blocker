const { apiError, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const {products}= require('../../../models')

exports.productById=async(req,res)=>{

try {
    let product= await products.findByPk(req.params.id)
    if(!product) return res.status(404).json(apiError("product not found"));

    return res.json(apiSuccessWithData("View Product details",product))
    
} catch (error) {
    console.log(error)
    return res.status(500).json(error)
    
}

}


exports.allProducts=async(req,res)=>{

    try {
        let product= await products.findAll({})
        if(!product) return res.status(404).json(apiError("product not found"));
    
        return res.json(apiSuccessWithData("Product listing",product))
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    
    }
    
    }