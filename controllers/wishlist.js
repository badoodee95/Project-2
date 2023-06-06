// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const { game } = require('../models');
// let steamID;
// let appID;

// // environment variables
// SECRET_SESSION = process.env.SECRET_SESSION;
// const steamApiKey = process.env.STEAM_API_KEY;
// const dealApiKey = process.env.ISTHEREANYDEAL_API_KEY;
// const dealOAuthKey = process.env.ISTHEREANYDEAL_OAUTH_CLIENT;
// const dealSecretKey = process.env.ISTHEREANYDEAL_SECRET_CLIENT;
// const officialSteamApiKey = process.OFFICIAL_STEAM_API_KEY;
// // console.log('>>>>>>>>>>>>', SECRET_SESSION);


// router.get('/', (req, res) => {
//     res.render('index');
// });

// router.get('/search', function (req, res) {
//     res.render('wishlist/search');
// });

// // router.get('/wishlist', (req, res) => {
// //     res.render('wishlist');
// // });


// router.get('/new', function (req, res) {
//     return res.render('wishlist/new');
// });

// router.post('/', function (req, res) {
//     steamID = req.body.item;
//     // console.log('req.body', req.body);
//     axios.get('https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0')
//         .then(function (response) {
//             let result = [];
//             console.log('response.data', response.data);
//             // console.log('games list', response.data);
//             for (let i in response.data) {
//                 let obj = response.data[i];
//                 result.push(obj.name);
//             }
//             return res.render('wishlist', { steam: result, steamResponse: response.data });
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

// router.get('/wishlist', (req, res) => {
//     res.render('wishlist');
// });


// router.get('/:name', function (req, res) {
//     const steamWishlistURL = 'https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0';
//     const dealsListURL = `https://api.isthereanydeal.com/v01/deals/list/?key=${dealApiKey}&offset=0&limit=200&region=US&country=US&shops=steam%2Cgog`;
//     const steamGameURL = 'http://store.steampowered.com/api/appdetails?appids=' + appID;
//     axios.all([
//         axios.get(steamWishlistURL),
//         axios.get(dealsListURL),
//     ])
//         .then(axios.spread(async function (steamResponse, dealsResponse) {
//             let found = false;
//             for (let i in steamResponse.data) {
//                 let game = steamResponse.data[i];
//                 appID = i.toString();
//                 const steamGameStorePage = 'https://store.steampowered.com/router/' + appID;
//                 // console.log('gameid', appID); // THIS GIVES ME BACK THE APP/GAME ID DONT FORGET THIS !!!
//                 if (game.name === req.params.name) {
//                     found = true;
//                     await axios.get('http://store.steampowered.com/api/appdetails?appids=' + appID.toString())
//                         .then(function (steamStoreResponse) {
//                             // console.log('alsdfj;alsdjf;la', steamStoreResponse.data[appID].data);
//                             // console.log('?????? or some shit', steamStoreResponse.data[appID].data.price_overview);
//                             let initialPrice;
//                             let finalPrice;
//                             let discountPercent;

//                             if (!steamStoreResponse.data[appID].data.price_overview) {
//                                 initialPrice = 'Free';
//                             } else {
//                                 initialPrice = steamStoreResponse.data[appID].data.price_overview.initial_formatted;
//                             }
//                             if (!steamStoreResponse.data[appID].data.price_overview) {
//                                 finalPrice = 'Free';
//                             } else {
//                                 finalPrice = steamStoreResponse.data[appID].data.price_overview.final_formatted;
//                             }
//                             if (!steamStoreResponse.data[appID].data.price_overview) {
//                                 discountPercent = 'Free';
//                             } else {
//                                 discountPercent = steamStoreResponse.data[appID].data.price_overview.discount_percent;
//                             }
//                             console.log('steam store page', steamGameStorePage);
//                             // console.log('steam store data', steamStoreResponse.data);
//                             // console.log('l;akfjdflajsl;kjfalksdj', steamStoreResponse.data[appID].data.price_overview);
//                             // console.log('initial Price', initialPrice);
//                             return res.render('single-game', { game: steamResponse.data[i], steam: steamResponse.data, appID, deals: dealsResponse.data, initialPrice, finalPrice, discountPercent, steamGameStorePage });
//                         });
//                     // .then(function (response) {
//                     //   return res.render('single-game', { game: steamResponse.data[i], steam: steamResponse.data, appID, deals: dealsResponse.data, initialPrice, finalPrice, discountPercent, steamGameStorePage });
//                     // });
//                 }
//             }
//             if (!found) {
//                 res.json({ data: 'Game is not currently on your wishlist.' });
//             }
//         }))
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });



// // router.post('/wishlist', function (req, res) {
// //     steamID = req.body.item;
// //     // console.log('req.body', req.body);
// //     axios.get('https://store.steampowered.com/wishlist/profiles/' + steamID + '/wishlistdata/?p=0')
// //         .then(function (response) {
// //             let result = [];
// //             console.log('response.data', response.data);
// //             // console.log('games list', response.data);
// //             for (let i in response.data) {
// //                 let obj = response.data[i];
// //                 result.push(obj.name);
// //             }
// //             return res.render('wishlist', { steam: result, steamResponse: response.data });
// //         })
// //         .catch(function (error) {
// //             res.json({ message: 'Data not found. Please try again later.' });
// //         });
// // });

// router.post('/wishlist/new', function (req, res) {
//     // console.log('form data', req.body);
//     const parsed_game = { ...req.body };
//     if (parsed_game.is_free_game === 'false') {
//         parsed_game.is_free_game = false;
//     } else if (parsed_game.is_free_game === 'true') {
//         parsed_game.is_free_game = true;
//     }
//     // console.log('parsed game', parsed_game);
//     game.create(parsed_game)
//         .then(createdGame => {
//             console.log('game created', createdGame.toJSON());
//             res.redirect('/wishlist');
//         })
//         .catch(function (error) {
//             console.log('error', error);
//             // res.render('no-result');
//         });
// });

// module.exports = router;
