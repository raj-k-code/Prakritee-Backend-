const Blogs = require('../model/blogs.model');
const { validationResult } = require('express-validator');
const requests = require('request');

exports.addBlog = (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    request.body.blogImage = "https://firebasestorage.googleapis.com/v0/b/productdb-eaa0c.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

    Blogs.create(request.body)
        .then(result => {
            return response.status(200).json(result);
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}

exports.deleteBlog = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    Blogs.deleteOne({ _id: request.body.blogId })
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

exports.blogList = (request, response) => {

    Blogs.find().populate('createdBy')
        .then(result => {
            if (result.length > 0)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "Result Not Found..." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}

exports.blogListByNursery = (request, response) => {

    Blogs.find({ createdBy: request.params.nurseryId }).populate('createdBy')
        .then(result => {
            if (result.length > 0)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "Result Not Found..." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}


exports.blogById = (request, response) => {
    Blogs.findOne({ _id: request.params.id }).populate('createdBy')
        .then(result => {
            if (result)
                return response.status(200).json(result);
            else
                return response.status(200).json({ message: "Result Not Found..." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}

exports.editBlog = (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    if (request.file) {
        request.body.blogImage = "https://firebasestorage.googleapis.com/v0/b/productdb-eaa0c.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"
    }

    Blogs.updateOne({ _id: request.body.blogId }, {
            $set: request.body
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                if (request.file) {
                    requests({
                        url: request.body.oldImage,
                        qs: {
                            key: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnyJ+6t98bJQwl\nBe24m7gBCH8Slb3GG9FB6avOOY5YAIGY0zsdt7vs1njzYvZitTBaE3epoxcaua1J\nya8BzHFp/u2YSOQQM/v+X7qVbbXCBS/E7M43bP2/NNwOLuoY2MmIa8EVJejqeSTT\nlssAJcNho9H8g3UbA3/28UjpC2gv2ctqAPD7gTNFbTQ3Bq2wvrNuetgAD+C88lTC\nYywncEDC9IWsWov6yL9MIp5cMpS8ISIU+25ZrIM7QmCTDHyutJOruo1Z3ZbSNGwc\nArATZ0avYVuwRRwICrUcLyMr1lfxAnDM6Lgn2uRBB1k+ISAhA+0nx/ST7FNwJprg\nhB6sDoSlAgMBAAECggEAII8IEPx/NJrxp8m7aPFG2a5N21h5ffiuXmnqnl9rZWU8\nzzDs3vHOTiiaeOXv4lG9ZwnRB11Hg5ONig3wrXoAfHk4+ulSUAxdW5Aq746nt4du\n/GSfWx3OTyuntb5VWAQr2yP3zXazzywRRj+qaGzlkzOl7aixrIfDU/b03PejPQVA\nnwOYQRPRXDjTKllM8zr2dQ2mgIe9L7b4BWiZVNFx/fH2OunCcz9hi/0Ojnv3PjXy\n70nFEhU+N9wJyOGzA1zeVRjgYuPkePRaJvHKJRw3E0I8/58LNmFY26sYJvcEzQeI\n0dOdnQbpgic3hYsyeLhmoXNR7sCw9q5Dndf5RsBbSQKBgQD5lCmO2gC4LkXAIYKK\nzOi1yUouCZYBljPObs9RdkWIzCW0nhEd1zjF+goXqpb2cnFxO2NZm7ajMZi+doHN\nc76kskqAWHyMZlmmAF07cKmvwfLttdxa+SGMPKWYYFzdfAb5HPjynGXBW5mJqU5y\nCEOhrjaCRZqjqDrXN00w2oGMhwKBgQDtv0FaGn4FhG8ozZeClxagCxNPozZcotGp\n9zzn8eHW2Q39zWIkMocb4C16allxZqEIMCselxOCkoa3YwV8wdUg6xxc/M+RNfCZ\nooQ4/Y0kmIZklT4hETson1ubwYrWRwjDkKsaAeeicw/+8edso5mMcDneXZia1Mop\n/cMbA518cwKBgQC6BBINZLKQk/xsvQ0dAqiXhRWCxqZFPHwUakafArXExdN8kStU\nwGqSNFB9XynxOU8QBCGCUiqH65laq90HEjOPcUtR6aG6yzYaIb9bZBc05it3vMom\nC/VTHoiVz4ynj59q4Isz2BmHSgxfrA7JsxslUEFUSyh8vhBNA+zGcrWH1QKBgGpK\ne3lBJt5omxnu8LHdwqvCx9tu6Lr5wCrw8jXwmjtnxy2VSS9Nt8Hqs+pq6ZodfBkh\nD+YZPQu/XqNWjfl830BcXM3l6RbOusa1NdAU66lU16DYaHJ4Na6vsFEuclfiYjSs\n1RJHj7u9HYWpuQGFEv0Kn5Se2789KzUi0rudHiepAoGAQ/Zw3PTK9xwVmm3sd5ZI\nSuvg1CHRHHAVLxQFpy+GVQy+kO/LgVWFponf4UKEL39VV1syuvzp4v9ytX57eqks\nJjzg/8+3fgsT6qo16LZgA5/ql1IRpG8zmhbItKLygx+9akqAc/oPpqVy9up4kQLC\nu62tjbyu3phwCOqp7wIBVlI=",
                        }, // you can find your private-key in your keyfile.json....
                        method: "DELETE",
                    });
                }
                return response.status(201).json({ success: "Updated Successfully" });
            } else
                return response.status(201).json({ failed: "Not Updated.." });
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: "Internal server error.." });
        });
}