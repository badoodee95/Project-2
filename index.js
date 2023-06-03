const express = require('express');
const axios = require('axios');
const app = express();
const ejslayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
require('dotenv').config();
apiKey = process.env.STEAM_API_KEY;

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('index');
});

// app.get('/wishlist', (req, res) => {
//     res.render('wishlist');
// });

app.get('/data'), (req, res) => {
    res.render('data');
};


app.get('/steamProfileDetails', function (req, res) {
    axios.get('https://api.steamapis.com/steam/profile/76561199475352311?api_key=' + apiKey)
        .then(function (response) {
            console.log('response', response.data);
            return res.json({ steam: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/freegames', function (req, res) {
    axios.get('https://api.steamapis.com/market/apps?api_key=' + apiKey)
        .then(function (response) {
            console.log('response', response.data);
            let freeGames = [];
            for (let i = 0; i < response.data.length; i++) {
                let game = response.data[i];
                if (game.is_free === true) {
                    freeGames.push(game);
                }
            }
            return res.json({ steam: freeGames });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/freegames/search', function (req, res) {
    axios.get('https://api.steampis.com/market/apps?api_key-' + apiKey);
    return res.render('freeGames/search');
});

app.get('/discount50orAbove', function (req, res) {
    axios.get('https://api.steampis.com/market/apps?api_key=' + apiKey)
        .then(function (response) {
            console.log('response', response.data);
            return res.json({ steam: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});


app.get('/discountBelow50%', function (req, res) {
    axios.get('https://api.steampis.com/market/apps?api_key=' + apiKey)
        .then(function (response) {
            console.log('response', response.data);
            return res.json({ steam: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});


app.get('/wishlist', function (req, res) {
    axios.get('https://store.steampowered.com/wishlist/profiles/76561198388597357/wishlistdata/?p=0')
        .then(function (response) {
            let result = [];
            console.log('response', response.data);
            for (let i in response.data) {
                let obj = response.data[i];
                result.push(obj);
            }
            // return res.json({ steam: result });
            return res.render('wishlist', { steam: result });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});


app.post('/wishlist/search', function (req, res) {
    axios.get('https://store.steampowered.com/wishlist/profiles/76561198388597357/wishlistdata/?p=0')
        .then(function (response) {
            console.log(response.data.name);
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/wishlist/*', function (req, res) {
    axios.get('https://store.steampowered.com/wishlist/profiles/76561198388597357/wishlistdata/?p=0')
        .then(function (response) {
            let result = [];
            console.log('req.params', req.params);
            for (let i in response.data) {
                let obj = response.data[i];
                result.push(obj);
            }
            return res.json({ steam: result });
            // return res.render('wishlist', { steam: result });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});




const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});

module.exports = {
    server,
    app,
    PORT,
    axios
};