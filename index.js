import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config'

const port = 3000;
const app = express();
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT 
});
db.connect();




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let items = [];


// Routes
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM items ORDER BY id ASC");
        items = result.rows;
        res.render("index.ejs", {
          listItems: items,
        });
       
      } catch (err) {
        console.log(err);
      }
    });



    app.post("/submit", async (req, res) => {
        const newItem = req.body.newItem.trim(); // Trim to remove leading/trailing spaces
    
        if (newItem !== '') {
            try {
                await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
                res.redirect("/");
            } catch (err) {
                console.log(err);
                res.status(500).send("Error adding the task.");
            }
        } else {
            // Handle empty task submission here (redirect)
            res.redirect("/"); 
        }
    });

app.post("/edit", async (req, res) => {
    const updatedItem = req.body.updatedItemTitle;
    const updatedItemId = req.body.updatedItemId;
    await db.query(
      "UPDATE items SET title = ($1) WHERE id = $2",[updatedItem, updatedItemId]
    );
    res.redirect("/");
});


app.post("/delete", async (req,res) => {
    const id = req.body.deleteItemId;
    try {
        await db.query("DELETE FROM items WHERE id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

