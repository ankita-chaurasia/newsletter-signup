
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// HOME ROUTE 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const reqBody = req.body;
    const data = {
        members: [
            {
                email_address: reqBody.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: reqBody.firstName,
                    LNAME: reqBody.lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/f544cfb30";
    const options = {
        method: "POST",
        auth: "newsletter:q6cd105586aeff94c8d2e4bf065b8da-us21"
    };
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

// FAILURE ROUTE 

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("Server running on port 3000...");
})

// API Key - 6cd105586aeff94c8d2e4b12f065b8da-us21
// List ID - ef544cfb30
