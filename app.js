const express = require("express");
const bodyParser = require("body-parser");
const date = require(`${__dirname}/date.js`);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const db = "todolistDB";
const mongoURL = `mongodb+srv://xcarter93:ISXi7JvzRagD6Ub3@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

const itemsSchema = new mongoose.Schema({
	name: String,
});
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
	name: "Welcome to your ToDo List!",
});
const item2 = new Item({
	name: "Hit the + button to add a new item.",
});
const item3 = new Item({
	name: "<--- Hit this to delete an item.",
});
const defaultItems = [item1, item2, item3];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	let day = date();
	Item.find({}, (err, items) => {
		if (items.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfully added items to database.");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", { listTitle: day, newListItems: items });
		}
	});
});

app.post("/", (req, res) => {
	const itemName = req.body.newItem;
	const item = new Item({
		name: itemName,
	});
	item.save();
	res.redirect("/");
});

app.post("/delete", (req, res) => {
	const checkedItemId = req.body.checkbox;
	Item.findByIdAndRemove(checkedItemId, (err) => {
		if (!err) {
			console.log("Successfully deleted database entry.");
			res.redirect("/");
		}
	});
});

app.get("/work", (req, res) => {
	res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is running`);
});
