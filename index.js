import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv"

env.config();

const app = express();
const port = 3000;

const db = new  pg.Client({
  user : process.env.POST_USER,
  host : process.env.POST_HOST,
  database : process.env.POST_DATABASE,
  password : process.env.POST_PASSWORD,
  port : 5432
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },


async function getAllItems(){
  items = []
  const result = await db.query("SELECT * FROM items")
  result.rows.forEach(item => {
    items.push(item)
  });
}

app.get("/", async (req, res) => {
  await getAllItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const editId = req.body.updatedItemId;
  const editTitle = req.body.updatedItemTitle;
  db.query("UPDATE items SET title = $1 WHERE id = $2",[editTitle,editId])
  res.redirect("/")
});

app.post("/delete", (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  db.query("DELETE FROM items WHERE id = $1",[deleteItemId])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
