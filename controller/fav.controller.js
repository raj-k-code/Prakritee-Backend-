const { response } = require("express");
const request = require("request");
const Fav = require("../model/fav.model");

exports.addTofav = async (request,response) =>{
    console.log(request.body);
    let fav = await Fav.findOne({userId : request.body.userId})
    if(!fav){
        fav = new Fav(); 
        fav.userId  = request.body.userId;
    }
   
    fav.productList.push(request.body.productId);
    fav.save().then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    });

}
exports.view = (request,response) =>{
    Fav.findOne({userId : request.body.userId}).populate("productList")
    .then(result=>{
        if(result)
            return response.status(200).json(result);
        else
            return response.status(200).json({message : "No Faverait Found"});
    }).catch(err=>{
        return response.status(500).json(err);
    });
}

exports.removeProduct = (request,response) =>{
    Fav.updateOne({userId : request.body.userId},{
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
   Fav.deleteOne({userId : request.body.userId})
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    })
}


