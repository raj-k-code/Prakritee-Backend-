const { response } = require("express");
const request = require("request");
const Cart = require("../model/cart.model");

exports.addToCart = async (request,response) =>{
    console.log(request.body);
    let cart = await Cart.findOne({userId : request.body.userId})
    if(!cart){
        cart = new Cart(); 
        cart.userId  = request.body.userId;
    }
   
    cart.productList.push(request.body.productId);
    cart.save().then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    });

}
exports.view = (request,response) =>{
    Cart.findOne({userId : request.body.userId}).populate("productList")
    .then(result=>{
        if(result)
            return response.status(200).json(result);
        else
            return response.status(200).json({message : "No Cart Found"});
    }).catch(err=>{
        return response.status(500).json(err);
    });
}

exports.removeProduct = (request,response) =>{
    Cart.updateOne({userId : request.body.userId},{
        $pullAll : {
            productList : [
                {_id : request.body.productId}
            ]
        }
    }).then(result=>{
        return response.status(200).json(result);
    })
    .catch(err=>{
        return response.status(500).json(err);
    })
}

exports.delete = (request,response) =>{
   Cart.deleteOne({userId : request.body.userId})
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    })
}


