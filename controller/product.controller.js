const Product = require("../model/product.model");
const { validationResult } = require("express-validator");
const requests = require("request");

exports.addProduct = (request, response) => {
    console.log(request.file);

    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    request.body.productImage = "https://firebasestorage.googleapis.com/v0/b/prakriti-3d8ad.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

    Product.create(request.body)
        .then(result => {
            return response.status(200).json(result);
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}


exports.delete = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    Product.deleteOne({ _id: request.body.productId })
        .then(result => {
            if (result.deletedCount == 1) {
                return response.status(201).json({ Delete: "Deleted Successfully" });
            } else
                return response.status(201).json({ notDelete: "Not Deleted " });

        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.productList = (request, response, next) => {
    console.log(Date.now + "====================");
    Product.find().sort({ _id: -1 })
        .then(result => {
            if (result.length > 0)
                return response.status(201).json(result);
            else
                return response.status(401).json({ message: "No Product Found..." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.edit = (request, response, next) => {
    console.log(request.file);
     
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    if (request.file) {
        request.body.productImage = "https://firebasestorage.googleapis.com/v0/b/prakriti-3d8ad.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba";
    }
    Product.updateOne({
            _id: request.body.productId
        }, {
            $set: {
                productName: request.body.productName,
                categoryName: request.body.categoryName,
                productPrice: request.body.productPrice,
                productDescription: request.body.productDescription,
                productImage: request.body.productImage
            }
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                if (request.file) {
                    requests({
                        url: request.body.oldImage,
                        qs: {
                            key: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDf137SRk5j7vyH\nbP9dJVy/O0NYPcA7skFUtQDwoVzs8Wu6ct1i6HECaYDhTEto0xwPyNGhMtStx/X6\n1msQpiKS2qhTBKM9PgYiEAD0A/WH0E5zb7DODPoI3jBhK7UjPGiOk/c0gJI/OWv3\nePelFpd+KjondH084KTeVVz4hegPQl0B4zJybZN+WBNTf6suS56M8tdi7ho4WyIx\nRpd51LU6uguw/VpgaVmN4jqmvt5vIrSpho0ycDbXXA1jCWNpeiG8YHB/Lkffo9H3\nrSwLbi9t6aGWVsnnscC2ABp8NVnk/DFZIkD5Ys7y1pRyLCnTO2crqG2E9aJeZgw0\nl1V0fNTtAgMBAAECggEAHCBs7Ckvcnk2PCIjGGY4eEMPHEhuHlIwyV8RJitwjMlt\nOvlx/hqtEJuHOUgn9Z0JWqZmSPYlKU0GCKXmwCnQEFnvarcbd/eSN7eBFyhkMtOm\n9/Rh6BJTXMfmll8ynKHblYbcOjmpps4lVexaWeEz2gOeWRTXI84qiVF6pDPXTAtT\ne6rNkmrJ5SdxCV4qT5u/0A8Tpmhf3aQ6ZMDwqOPtAgcdJkbz+p7MngxmFtsq4u3g\nMXPrCbKDjvzrR97JWCggGQ3kaV1s1awCmi5/6Ri1z4fADjvxzxEaX3HtNoTYD5yc\nzXpOM+g/Yi0vQgCRUBQ7oHlyVn1BXEx1OoKvneyHtQKBgQD8iH2P+DqHDEBrVK7g\nibwdjamrGxe6CAzlgDnEf4iIdYQfn2x3+zIYxJCDrUBKcF8gZAYtCbWeE5/aKRTv\nW/k4kVVIE9AqMvbzmMT0g87A7tNtQG6Z6/gkkVmoj6iqhnrSG8vnznvojwJ+D2qn\nSvbirrH6RDLkrhpRfkOu3dsVIwKBgQDi6ivORZbb0+GPKbWJ1XVQ0Y+AG1H/4ZdC\nSa0QWS/7d9Ts/TNt7SJi7KoXHkMd9JshpOdJ8agvdTngMzT7n8iW0EU2riWv52cx\nzUMcpvhXw7WBljnCB2Kle7cOVs1zswpjznpzNjQcT/o3rIfFmPmzYExhSWpdpOx2\ngjpXk+w2rwKBgC0jMF5FXiC5XeJRVpinxcn6gjMlOo5z1epHiwvGR98sMht84WRo\nr8GhkLsYgn9LqpUdi8UNETtaAp557VYDOH6V64pgkDqatW1BByM1VAVEKuJCPAKj\nHM1cdYwdcWZZdyaK9V1PmPIubaGem8+fJJXL59/1xKr/O5EJYouk9/3FAoGBAL/K\nz+XT+dOqPe8EgPWUX0lFJzZPYTqXEYMsxMOZrq2stmLtDGgwU60rfgR2RqJuGiUQ\nvZFJWS9rtNRkU7cOcbvPI4E5Jo+MVjPI252/Hw8HU0XJlN4D4gQfEjVjdtoBDZoY\nbnUs7lSz4Ljn8gY4620KyuQ76lRmTptILUnStIfvAoGAGecTT+N2sTHIAZLTX2dZ\nCMJ7tG39d2v7Bh5k9H9pLJq4UZLCG68Ig31glyGN05R4R0mnFUxWnFL2F99Vkp0a\nyOPFzESJmN9gWaxJrPWfVU4JvQw/q27F/h/cofWJ6EEIxEev++W/+Pav7JCyE1sd\nozt/ZtGewJLII7zOEDI5BpE=",
                        }, // you can find your private-key in your keyfile.json....
                        method: "DELETE",

                    });
                }
                return response.status(201).json({ success: "Updated Successfully" });
            } else
                return response.status(201).json({ failed: "Not Updated.." });
        })
        .catch(err => {
            console.log(err)
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.searchProduct = (request, response, next) => {
    var regex = new RegExp(request.body.searchText, 'i');
    Product.find({
            $or: [
                { productName: regex },
                { categoryName: regex },
                { productDescription: regex }

            ]
        })
        .then(result => {
            if (result.length > 0)
                return response.status(201).json(result);
            else
                return response.status(201).json({ message: "No Result Found...." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.productListSimilar = (request, response, next) => {
    Product.find({
            $and: [
                { categoryName: request.body.categoryName },
                { _id: { $ne: request.body.productId } }
            ]
        })
        .then(result => {
            if (result.length > 0)
                return response.status(201).json(result);
            else
                return response.status(201).json({ message: "Result Not Found......." });
        })
        .catch(err => {
            console.log(err + "===========================errrrr");
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.productListByCategory = (request, response, next) => {
    Product.find({ categoryName: request.params.name })
        .then(result => {
            if (result.length > 0)

                return response.status(201).json(result);
            else
                return response.status(401).json({ message: "Result Not Found......." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.productListByNurseryOwner = (request, response, next) => {
    Product.find({ createdBy: request.body.nurseryOwnerId }).sort({ _id: -1 })
        .then(result => {
            if (result.length > 0)
                return response.status(201).json(result);
            else
                return response.status(201).json({ message: "Result Not Found......." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.productById = (request, response, next) => {
    Product.findOne({ _id: request.params.productId })
        .then(result => {
            if (result)
                return response.status(201).json(result);
            else
                return response.status(201).json({ message: "Result Not Found......." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.rateTheProduct = async(request, response) => {

    let product = await Product.findOne({ _id: request.body.productId })

    if (!product) {
        console.log(product);
        return response.status(200).json({ message: "This Product Dosen't Exist Now" })
    }
    let flag = false;

    for (let item of product.productRating) {
        if (item.userId == request.body.userId) {

            let hello = await Product.updateOne({
                _id: request.body.productId,
                "productRating.userId": request.body.userId,
            }, { $set: { "productRating.$.rate": request.body.rate } });

            if (hello.modifiedCount == 1) {
                flag = true;
                return response.status(200).json({ succes: "Success" });
            } else {
                return response.status(200).json({ failed: "Not Success" });
            }
        }
    }
    if (!flag) {
        console.log(flag);
        product.productRating.push({
            userId: request.body.userId,
            rate: request.body.rate,
        });
        product.save().then(result => {
            if (result)
                return response.status(200).json({ data: result, succes: "Rated Successfully" })
            else
                return response.status(200).json({ data: result, failed: "Not Rated Successfully" })
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ error: "oops something went wrong" })
        })
    }

}