const cors = require("cors");
const bodyParser = require("body-parser");
const Busboy = require("busboy");
const getRawBody = require("raw-body");
const contentType = require("content-type");

module.exports = [
  cors({ origin: true }),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  }),
  (req, res, next) => {
    if (
      req.rawBody === undefined &&
      req.method === "POST" &&
      req.headers["content-type"].startsWith("multipart/form-data")
    ) {
      getRawBody(
        req,
        {
          length: req.headers["content-length"],
          limit: "10mb",
          encoding: contentType.parse(req).parameters.charset,
        },
        function (err, string) {
          if (err) return next(err);
          req.rawBody = string;
          next();
        }
      );
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (
      req.method === "POST" &&
      req.headers["content-type"].startsWith("multipart/form-data")
    ) {
      const busboy = new Busboy({
        headers: req.headers,
      });

      var fileBuffer = new Buffer("");
      var chunks = [];

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        file.on("data", (data) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
          chunks.push(data);
        });

        file.on("end", () => {
          const file_object = {
            fieldname,
            originalname: filename,
            encoding,
            mimetype,
            buffer: fileBuffer,
          };

          req.file = file_object;
        });
      });

      req.data = {};

      busboy.on("field", function (
        fieldname,
        val
        // fieldnameTruncated
        // valTruncated
        // encoding
        // mimetype
      ) {
        req.data[fieldname] = val;
      });

      busboy.on("finish", function () {
        console.log("Done parsing form!");

        next();
      });

      busboy.end(req.rawBody);
    } else {
      next();
    }
  },
];
