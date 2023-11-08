import express from "express";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const items = [];
const completed = [];
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get("/", (req, res) => {
    res.render("index.ejs", {items, completed});
})


app.post("/submit", (req,res) =>{
    var newItem = req.body["newItem"];
    if (newItem) {
        items.push(newItem);
        completed.push(false);
    }
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

