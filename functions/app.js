// import functions from "firebase-functions";
// import express from "express";
// import path from "path";
const functions = require("firebase-functions");
const express = require("express");
const { Storage } = require("@google-cloud/storage");

const app = express();
app.set("views", __dirname + "/views/pages");
app.set("view engine", "ejs");

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/images", express.static(__dirname + "/images"))
app.use("/css", express.static(__dirname + "/imports/css/main"));

console.log(__dirname);

// TODO: Start server: npm run watch
// TODO: Start server: firebase serve --only functions,hosting
app.get("/timestamp", (req, res) => {
  res.send(`${Date.now()}`);
});

app.get("/believe", (req, res) => {
  res.render("believe");
});

app.get("/education", (req, res) => {
  res.render("education");
});

app.get("/experience", (req, res) => {
  res.render("experience");
});

app.get("/getInTouch", (req, res) => {
  res.render("getInTouch");
});

app.get("/getToKnow", (req, res) => {
  res.render("getToKnow");
});

app.get("/resume", (req, res) => {
  res.render("resume");
});

app.get("/skills", (req, res) => {
  res.render("skills");
});

app.get("/home", function (req, res) {
  res.redirect("/");
});

app.get("/index", function (req, res) {
  res.redirect("/");
});

app.get("/index.html", function (req, res) {
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.render("../index.ejs");
});

// bucket
// https://console.cloud.google.com/storage/browser/sophwebsite-eb0d2.appspot.com/images/?project=sophwebsite-eb0d2
const gcStorage = new Storage({
  // keyFilename: admin.credential.applicationDefault().toString(),
  keyFilename: "../sophwebsite-eb0d2-firebase-adminsdk-z9cn8-87b0d58613.json",
  projectId: "sophwebsite-eb0d2",
});

// const bucket = gcStorage.bucket("images");
const bucket = gcStorage.bucket("sophwebsite-eb0d2.appspot.com");

const checkImage = require("./controllers/checkImage"); // required for converting the uploaded file into something that I can use
const saveImage = require("./controllers/saveImage");

// The following code came from here as a solution for uploading images from /upload
// https://github.com/expressjs/multer/issues/411
app.post("/upload", checkImage, function (req, res, next) {
  // request handler
  const file = req.file;
  // console.log(file);

  try {
    saveImage.uploadImageToStorage(bucket, file);
  } catch (err) {
    console.log(err);
  }

  res.send("success");
});

// app.get("*", function (req, res) {
//   console.log("Going to 404");
//   res.status(404).render("error/404");
// });

// Route not found (404)
app.use(function (req, res, next) {
  return res.status(404).render("error/404");
});
// Any error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

// app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );

exports.app = functions.https.onRequest(app);
