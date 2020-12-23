const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/subscribe", (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === null ||
    req.body.captcha === ""
  ) {
    return res.json({
      success: false,
      msg: "Please select captcha",
    });
  }
  // Secret Key
  const secretKey = "6LeQsBAaAAAAAIGVDx4AouiwIMHJJNnEUSMEr8pX";

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=
${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make Request to VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    // If Not Successful
    if (body.success !== undefined && !body.success) {
      return res.json({
        success: false,
        msg: "Failed captcha verification",
      });
    }

    // If Successful
    return res.json({
      success: true,
      msg: "Captcha passed",
    });
  });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
