const { response } = require("express");
const Cart = require("../model/cart.model");

exports.addToCart = async (request, response) => {
    let cart = await Cart.findOne({ userId: request.body.userId });

    if (cart) {
        for (i in cart.productList) {
            if (cart.productList[i] == request.body.productId)
                return response.status(200).json({ message: 'Already added in cart' });
        }


        await cart.productList.push(request.body.productId);
        cart.save()
            .then(result => {
                console.log(result);
                return response.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ message: 'Internal Server Error' });
            });
    } else {

        let newCart = await new Cart();
        newCart.userId = await request.body.userId;

        await newCart.productList.push(request.body.productId);
        newCart.save()
            .then(result => {
                console.log(result);
                return response.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ message: 'Internal Server Error' });
            });
    }
}


exports.view = (request, response) => {
    Cart.findOne({ userId: request.body.userId }).populate("productList")
        .then(result => {
            if (result)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "No Cart Found" });
        }).catch(err => {
            return response.status(500).json(err);
        });
}

exports.removeProduct = (request, response) => {
    console.log(request.body);
    Cart.updateOne({ userId: request.body.userId }, {
        $pullAll: {
            productList: [
                request.body.productId
            ]
        }
    }).then(result => {
        if (result.modifiedCount == 1)
            return response.status(200).json(result);
        else
            console.log(result)
        return response.status(200).json({ message: "Not Removed" });
    })
        .catch(err => {
            return response.status(500).json(err);
        })
}

exports.delete = (request, response) => {
    Cart.deleteOne({ userId: request.body.userId })
        .then(result => {
            if (result.deletedCount == 1)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "Not Deleted" });
        }).catch(err => {
            return response.status(500).json({ error: "Internal Server Error" });
        })
}