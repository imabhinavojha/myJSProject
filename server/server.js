const express = require('express');
const app = express();

app.get("/api", (req, res) =>{
    res.json({
        "users":["userOne", "userTwo", "userThree"]
    })
})

app.listen(5001, () =>{
    console.log("Server Started on 5001")
})