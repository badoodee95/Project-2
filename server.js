require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const methodOverride = require('method-override');
const axios = require('axios');
const { game, index, user } = require('./models');
const router = express.Router();
let steamID;
let appID;

// environment variables
SECRET_SESSION = process.env.SECRET_SESSION;
const steamApiKey = process.env.STEAM_API_KEY;
const dealApiKey = process.env.ISTHEREANYDEAL_API_KEY;
const dealOAuthKey = process.env.ISTHEREANYDEAL_OAUTH_CLIENT;
const dealSecretKey = process.env.ISTHEREANYDEAL_SECRET_CLIENT;
const officialSteamApiKey = process.OFFICIAL_STEAM_API_KEY;
// console.log('>>>>>>>>>>>>', SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(layouts);

app.use(flash());            // flash middleware

app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

// add passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.steamID = steamID;
  next();
});


// app.use('/wishlist', require('./controllers/wishlist'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/wishlist', (req, res) => {
  if (user.steamID) {
    game.findAll()
      .then(games => {
        console.log('raw data', games);
        // clean capsules
        const cleaned_game = games.map(c => c.toJSON());
        console.log('cleaned game', cleaned_game);
        // return a webpage
        res.render('wishlist', { steam: cleaned_game });
      })
      .catch(error => {
        console.log('Error', error);
        res.render('no result');
      });
  } else {
    res.render('search');
  }
});


app.get('/data'), (req, res) => {
  res.render('data');
};

app.get('/profile', isLoggedIn, function (req, res) {
  const user = req.user;
  res.render('profile', { user });
});

app.get('/wishlist/search', isLoggedIn, function (req, res) { // this is the get route
  const user = req.user;
  res.render('search.ejs', { user }); // this is the page that I want to render
});

app.get('/wishlist/new', function (req, res) {
  res.render('wishlist/new.ejs');
});

app.get('/wishlist/edit/:name', function (req, res) {
  res.render('wishlist/edit.ejs');
});

app.get('/games', function (req, res) {
  game.findAll()
    .then(games => {
      console.log('raw data', games);
      const cleaned_games = games.map(c => c.toJSON());
      console.log('cleaned capsules', cleaned_games);
      res.render('games', { games: cleaned_games });
    })
    .catch(err => {
      console.log('Error', err);
      res.render('no result');
    });
});

app.get('/games/:id', function (req, res) {
  console.log('id', req.params.id);
  game.findOne({
    where: { id: parseInt(req.params.id) }
  }).then(foundGame => {
    console.log('found game', foundGame);
    res.render('single-game(info)', { game: foundGame });
  })
    .catch(function (error) {
      console.log('error', error);
      res.render('no-result');
    });
});

// app.get('/steam', function (req, res) {
//   axios.get('https://api.steamapis.com/steam/profile/76561199475352311?api_key=' + apiKey)
//     .then(function (response) {
//       return res.json({ steam: response.data });
//     })
//     .catch(function (error) {
//       return res.json({ message: 'Data not found. Please try again later.' });
//     });
// });

// app.get('/data', function (req, res) {
//   axios.get('https://store.steampowered.com/wishlist/profiles/76561198187182533/wishlistdata/?p=0')
//     .then(function (response) {
//       let result = [];

//       for (let i in response.data) {
//         let obj = response.data[i];
//         result.push(obj.name);
//       }
//       return res.json({ steam: result });
//     })
//     .catch(function (error) {
//       return res.json({ message: 'Data not found. Please try again later.' });
//     });
// });


// // this will render a page with each game individually
// app.get('/wishlist/:name', function (req, res) {
//   axios.get('https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0')
//     .then(function (response) {
//       let found = false;
//       for (let i in response.data) {
//         let game = response.data[i];
//         if (game.name === req.params.name) {
//           found = true;
//           return res.render('single-game', { game: response.data[i], steam: response.data });
//         }
//       }
//       if (!found) {
//         res.json({ data: 'Game is not currently on your wishlist.' });
//       }
//     })
//     .catch(function (error) {
//       res.json({ message: 'Data not found. Please try again later.' });
//     });
// });

// app.get('/test', function (req, res) {
//   axios.get('https://api.isthereanydeal.com/v01/game/overview/?key=55b59e82abf91b9c2e16bb2b073d3527e4dd9e90&region=us&country=US&plains=&shop=steam&ids=app%2F460930%2Csub%2F37125%2Cbundle%2F7078&allowed=&optional=')
//     .then(function (response) {
//       console.log('whatever-1', response.data.data);
//       // for (let i in response) {
//       //   for (let i in data) {
//       //     for (let i in darkwood) {
//       //       for (let i = 0; i < response.data.darkwood.list.length; i++) {
//       //         let listObject = response.data.dark.list[i];
//       //         let price_new = listObject[0].price_new;
//       //         console.log('new price', price_new);
//       //       }
//       //     }
//       //   }
//       // }

//       res.json({ response: response.data });
//     })
//     .catch(function (error) {
//       res.json({ message: 'Data not found. Please try again later.' });
//     });
// });

// app.get('/wishlist/edit/:name', function (req, res) {
//   game.findOne({
//     where: { name: req.params.name }
//   });
//   return res.render('wishlist/edit');
// });

app.get('/wishlist/:name', function (req, res) {
  const steamWishlistURL = 'https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0';
  const dealsListURL = `https://api.isthereanydeal.com/v01/deals/list/?key=${dealApiKey}&offset=0&limit=200&region=US&country=US&shops=steam%2Cgog`;
  const steamGameURL = 'http://store.steampowered.com/api/appdetails?appids=' + appID;
  axios.all([
    axios.get(steamWishlistURL),
    axios.get(dealsListURL),
  ])
    .then(axios.spread(async function (steamResponse, dealsResponse) {
      let found = false;
      for (let i in steamResponse.data) {
        let game = steamResponse.data[i];
        appID = i.toString();
        const steamGameStorePage = 'https://store.steampowered.com/app/' + appID;
        console.log('gameid', appID); // THIS GIVES ME BACK THE APP/GAME ID DONT FORGET THIS !!!
        if (game.name === req.params.name) {
          found = true;
          await axios.get('http://store.steampowered.com/api/appdetails?appids=' + appID.toString())
            .then(function (steamStoreResponse) {
              // console.log('alsdfj;alsdjf;la', steamStoreResponse.data[appID].data);
              // console.log('?????? or some shit', steamStoreResponse.data[appID].data.price_overview);
              let initialPrice;
              let finalPrice;
              let discountPercent;

              if (!steamStoreResponse.data[appID].data.price_overview) {
                initialPrice = 'Free';
              } else {
                initialPrice = steamStoreResponse.data[appID].data.price_overview.initial_formatted;
              }
              if (!steamStoreResponse.data[appID].data.price_overview) {
                finalPrice = 'Free';
              } else {
                finalPrice = steamStoreResponse.data[appID].data.price_overview.final_formatted;
              }
              if (!steamStoreResponse.data[appID].data.price_overview) {
                discountPercent = 'Free';
              } else {
                discountPercent = steamStoreResponse.data[appID].data.price_overview.discount_percent;
              }
              // console.log('steam store data', steamStoreResponse.data);
              // console.log('l;akfjdflajsl;kjfalksdj', steamStoreResponse.data[appID].data.price_overview);
              // console.log('initial Price', initialPrice);
              return res.render('single-game(wishlist)', { game: steamResponse.data[i], steam: steamResponse.data, appID, deals: dealsResponse.data, initialPrice, finalPrice, discountPercent, steamGameStorePage });
            });
          // .then(function (response) {
          //   return res.render('single-game', { game: steamResponse.data[i], steam: steamResponse.data, appID, deals: dealsResponse.data, initialPrice, finalPrice, discountPercent, steamGameStorePage });
          // });
        }
      }
      if (!found) {
        res.json({ data: 'Game is not currently on your wishlist.' });
      }
    }))
    .catch(function (error) {
      res.json({ message: 'Data not found. Please try again later.' });
    });
});

// app.get('/wishlist/edit/:name', function (req, res) {
//   game.findOne({
//     where: { name: req.params.name }
//   });
//   return res.render('wishlist/edit');
// });

app.put('wishlist/edit/:name', function (req, res) {
  // find the capsule, and then go edit page
  console.log('form data', req.body);
  let result = [];
  for (let i in response.data) {
    let obj = response.data[i];
    result.push(obj.name);
  }
  const parsed_game = { ...req.body };
  if (parsed_game.is_free_game === 'false') {
    parsed_game.is_free_game = false;
  } else if (parsed_game.is_free_game === 'true') {
    parsed_game.is_free_game = true;
  }
  // change datatype for reuse_count and water_landings
  console.log('parsed_game: ', parsed_game);

  game.update(parsed_game, {
    where: { steam: result }
  })
    .then(numOfRowsChanged => {
      console.log('how many rows got updated?', numOfRowsChanged);
      res.redirect(`/capsules/${parseInt(req.params.id)}`);
    })
    .catch(err => console.log('Error', err));
});


app.post('/wishlist', isLoggedIn, function (req, res) {
  steamID = req.body.item;
  user.update({
    steam_id: req.body.item
  }, {
    where: {
      id: req.user.id
    }
  });
  axios.get(`https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/?p=0`)
    .then(function (response) {
      console.log('user.steam_id', req.user.steam_id);
      if (req.user.steam_id) {
        let result = [];
        for (let i in response.data) {
          let obj = response.data[i];
          result.push(obj.name);
        }
        res.render('wishlist', { steam: result, steamResponse: response.data });
      }
    })
    .catch(function (error) {
      res.json({ message: 'Data not found. Please try again later.' });
      console.log('error', error);
    });
});

// app.post('/wishlist', isLoggedIn, function (req, res) {
//   steamID = req.body.item;
//   user.update({
//     steam_id: req.body.item
//   }, {
//     where: {
//       id: req.user.id
//     }
//   });
//   axios.get(`https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/?p=0`)
//     .then(function (response) {
//       console.log('req.body', req.body);
//       console.log('req.user', req.user);
//       if (user.steam_id) {
//         let result = [];
//         for (let i in response.data) {
//           let obj = response.data[i];
//           result.push(obj.name);
//         }
//         res.render('wishlist', { steam: result, steamResponse: response.data, steamID, user: req.user });
//       }
//     })
//     .catch(function (error) {
//       res.json({ message: 'Data not found. Please try again later.' });
//       console.log('error', error);
//     });
// });



// axios.get('https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0')
//   .then(function (response) {
//     let result = [];
//     // console.log('games list', response.data);
//     for (let i in response.data) {
//       let obj = response.data[i];
//       result.push(obj.name);
//     }
//     res.render('wishlist', { steam: result, steamResponse: response.data });
//   })
//   .catch(function (error) {
//     res.json({ message: 'Data not found. Please try again later.' });
//   });


app.post('/wishlist/newgame', function (req, res) {
  // console.log('form data', req.body);
  axios.get('https://store.steampowered.com/wishlist/profiles/' + user.steam_id + '/wishlistdata/?p=0')
    .then(function (response) {
      let result = [];
      for (let i in response.data) {
        let obj = response.data[i];
        result.push(obj.name);
      }
      const parsed_game = { ...req.body };
      if (parsed_game.is_free_game === 'false') {
        parsed_game.is_free_game = false;
      } else if (parsed_game.is_free_game === 'true') {
        parsed_game.is_free_game = true;
      }
      game.create(parsed_game);
      res.redirect('/wishlist');
      // console.log('parsed game', parsed_game);
      // async function createGame() {
      //   try {
      //     const newGame = await db.game.create(parsed_game);
      //     console.log('my new game >>>', newGame);
      //     res.redirect('/wishlist');
      //   } catch (error) {
      //     // console.log(‘new game was not created b / c of >>>’, error);
      //   }
      // }
    })
    // game.create(parsed_game)
    //   .then(createdGame => {
    //     console.log('game created', createdGame.toJSON());
    //     res.render('wishlist', { steam: result });
    //     // res.redirect('/wishlist');
    //   })
    //   .catch(function (error) {
    //     console.log('error', error);
    //     // res.render('no-result');
    //   });
    // })
    .catch(function (error) {
      console.log('error', error);
    });
});

// app.delete('/wishlist/:name', function (req, res) {
//   game.destroy({
//     where: { name: req.params.name }
//   })
//     .then(numOfRowsDeleted => {
//       console.log('How many rows were deleted?', numOfRowsDeleted);
//       res.redirect('/wishlist');
//     })
//     .catch(err => {
//       console.log('Error', err);
//       res.render('no-result');
//     });
// });

app.delete('/games/:id', function (req, res) {
  game.destroy({
    where: { id: parseInt(req.params.id) }
  })
    .then(numOfRowsDeleted => {
      console.log('How many rows were deleted?', numOfRowsDeleted);
      res.redirect('/games');
    })
    .catch(err => {
      console.log('Error', err);
      res.render('no-result');
    });
});






app.use('/auth', require('./controllers/auth'));

// Add this below /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  res.render('profile', { id, name, email });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});



module.exports = {
  server,
  app,
  PORT,
  axios,
  steamID,
  appID
};


// Induces