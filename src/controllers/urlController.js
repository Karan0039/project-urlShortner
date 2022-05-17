const urlModel = require("../models/urlModel")
const nanoId = require("nanoid")
const validUrl = require("valid-url")


const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
};

const createShortUrl = async function (req, res) {
    try {
        let requestBody = req.body
        //  IF BODY  NOT PRESENT
        if (Object.keys(requestBody).length == 0)
            return res.status(400).send({ status: false, message: "Enter data in body" })
        //   URL  VALIDATION
        if (!isValid(requestBody.longUrl))
            return res.status(400).send({ status: false, message: "Enter Url in LongUrl key" })
        if (!validUrl.isUri(requestBody.longUrl))
            return res.status(400).send({ status: false, message: "Enter valid url" })

        //requestBody.urlCode=(parseInt(Math.random()*10**8)).toString(36)

        requestBody.urlCode = nanoId.nanoid(); //  URL CODE CREATION

        requestBody.shortUrl = "http://localhost:3000/" + requestBody.urlCode; // URL  SHORTING  CONCATINAION  
        //  document creation in DB
        const urlCreated = await urlModel.create(requestBody);
        res.status(201).send({ status: true, data: urlCreated });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

const getUrl = async function (req, res) {
    try {
        const requestBody = req.params.urlCode;

        if (Object.keys(requestBody).length === 0)
            return res.status(400).send({ status: false.valueOf, message: "Enter Urlcode in params" })
        //  FINDING   THE  DOCUMENT  IN  DB
        const url = await urlModel.findOne({ urlCode: requestBody });
        if (!url)
            return res.status(404).send({ status: false, message: "Url Not Found for Given UrlCode" });
        //  SENDING   RESPONSE
        res.status(301).redirect(url.longUrl)
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
module.exports = { createShortUrl, getUrl }

