module.exports = {
  /**
   * Upload the image file to Google Storage
   * @param {Bucket} bucket reference to Google Storage
   * @param {File} file object that will be uploaded to Google Storage
   */
  uploadImageToStorage: function (bucket, file) {
    console.log("Start upload");

    return new Promise((resolve, reject) => {
      // todo check if the file type and let the user know if
      // that file type is allowed
      // then if it is all good upload the file, with the data
      // from the file IE: file name, type, and data.

      // TODO: figure out a way to make uploading the image directly
      // using uploadImageToStorage(file);
      // or write the file then upload the written file.

      console.log(file);

      if (!file) {
        reject("No image file");
      }

      console.log(`Name: ${file.originalname}`);

      let newFileName = `images/${file.originalname}_${Date.now()}.jpg`;

      let fileUpload = bucket.file(newFileName);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        reject("Something is wrong! Unable to upload at the moment.");
      });

      blobStream.on("finish", () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(
          `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
        );
        resolve(url);
      });

      blobStream.end(file.buffer);
    });
  },
};
