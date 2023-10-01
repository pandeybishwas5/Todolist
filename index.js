import express from "express";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
var items = [];
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})


app.post("/submit", (req,res) =>{
    var newList = req.body["newItem"];
    items.push(newList);
    res.render("index.ejs", {items});
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

