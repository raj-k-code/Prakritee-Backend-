const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
    projectId: "prakriti-3d8ad",
    keyFilename: "prakriti-3d8ad-firebase-adminsdk-5bj2j-33feaf0a09.json"
});

let bucketName = "gs://prakriti-3d8ad.appspot.com";

exports.fireBaseStorage = async (request, response, next) => {
    try {

        await storage.bucket(bucketName).upload(path.join(__dirname, '../', "./public/images/") + request.file.filename, {
            gzip: true,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: "abcddcba"
                }
            }
        })
        console.log("Inside try==============================");

    } catch (err) {
        console.log(err);
    }
    //    console.log(request.file.filename);
    next();
}