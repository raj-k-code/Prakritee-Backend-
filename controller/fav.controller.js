const { response } = require("express");
const request = require("request");
const Fav = require("../model/fav.model");

exports.addTofav = async(request, response) => {
    let fav = await Fav.findOne({ userId: request.body.userId });

    if (fav) {
        for (i in fav.productList) {
            if (fav.productList[i] == request.body.productId)
                return response.status(200).json({ message: 'Already added in favourite' });
        }

        await fav.productList.push(request.body.productId)

        fav.save()
            .then(result => {
                console.log(result);
                return response.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ error: 'Internal Server Error' });
            });
    } else {

        let newFav = await new Fav();
        newFav.userId = await request.body.userId;

        await newFav.productList.push(request.body.productId);
        newFav.save()
            .then(result => {
                console.log(result);
                return response.status(201).json(result);
            })
            .catch(err => {
                console.log(err + '===========');
                return response.status(500).json({ error: 'Internal Server Error' });
            });
    }
}

exports.view = (request, response) => {
    Fav.findOne({ userId: request.body.userId }).populate("productList")
        .then(result => {
            if (result)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "No Faverait Found" });
        }).catch(err => {
            return response.status(500).json(err);
        });
}

exports.removeProduct = (request, response) => {
    Fav.updateOne({ userId: request.body.userId }, {
            $pullAll: {
                productList: [
                    request.body.productId
                ]
            }
        }).then(result => {
            return response.status(200).json(result);
        })
        .catch(err => {
            return response.status(500).json(err);
        })
}

exports.delete = (request, response) => {
    Fav.deleteOne({ userId: request.body.userId })
        .then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            return response.status(500).json(err);
        })
}