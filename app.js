const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const db = "todolistDB";
const mongoURL = `mongodb+srv://xcarter93:ISXi7JvzRagD6Ub3@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

const itemsSchema = new mongoose.Schema({
	name: String,
});
const listSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema],
});
const List = mongoose.model("List", listSchema);
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
	let day = "Today";
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

app.get("/:newListName", (req, res) => {
	const newListName = _.capitalize(req.params.newListName);
	List.findOne({ name: newListName }, (err, foundItem) => {
		if (!err) {
			if (!foundItem) {
				//Create new list
				const list = new List({
					name: newListName,
					items: defaultItems,
				});
				list.save();
				res.redirect(`/${newListName}`);
			} else {
				//Show existing list
				res.render("list", {
					listTitle: foundItem.name,
					newListItems: foundItem.items,
				});
			}
		} else {
			console.log(err);
		}
	});
});

app.post("/", (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
		name: itemName,
	});
	if (listName === "Today") {
		item.save();
		console.log("Successfully added database entry.");
		res.redirect("/");
	} else {
		List.findOne({ name: listName }, (err, foundList) => {
			foundList.items.push(item);
			foundList.save();
			res.redirect(`/${listName}`);
		});
	}
});

app.post("/delete", (req, res) => {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkedItemId, (err) => {
			if (!err) {
				console.log("Successfully deleted database entry.");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkedItemId } } },
			(err, foundList) => {
				if (!err) {
					res.redirect(`/${listName}`);
				}
			}
		);
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is running`);
});
