const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
//************************************************************
let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Exercise 1: Get All Restaurants
async function fetchAllRestaurant() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurant();
    if (results.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurants found' });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 2: Get Restaurant by ID
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchRestaurantById(id);
    if (results.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurants found by ID: ' + id });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 3: Get Restaurants by Cuisine
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantByCuisine(cuisine);
    if (results.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurants found with cuisine: ' + cuisine });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 4: Get Restaurants by Filter
async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message:
          'No restaurants found with isVeg: ' +
          isVeg +
          ' hasOutdoorSeating: ' +
          hasOutdoorSeating +
          ' isLuxury: ' +
          isLuxury,
      });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating
async function sortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortByRating();
    if (results.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurants found' });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 6: Get All Dishes
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found' });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 7: Get Dish by ID
async function fetchDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchDishById(id);
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found by ID ' + id });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 8: Get dishes by Filter
async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await filterDishes(isVeg);
    if (results.dishes.length === 0)
      return res
        .status(404)
        .json({ message: 'No dishes found with isVeg: ' + isVeg });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Exercise 9: Get Dishes Sorted by Price
async function sortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortByPrice();
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found' });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//************************************************************** */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
