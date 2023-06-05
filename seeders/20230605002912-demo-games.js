'use strict';
const axios = require('axios');
const { steamID } = require('../server');
// ${steamID}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await axios.get(`https://store.steampowered.com/wishlist/profiles/76561198975964527/wishlistdata/?p=0`)
      .then(async response => {
        let result = [];
        for (let i in response.data) {
          let game = response.data[i];
          let newTags;
          if (game.tags) {
            newTags = Object.values(game.tags).toString().split(',').join(', ');
          }
          let somethingDifferent = {
            name: game.name,
            review_desc: game.review_desc,
            release_string: game.release_string,
            tags: newTags,
            is_free_game: game.is_free_game,
            background: game.background,
            deck_compat: game.deck_compat,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          result.push(somethingDifferent);
          // console.log('Tag, you are it!', result);
          // console.log('1337 gamer', newTags);
        }
        await queryInterface.bulkInsert('games', result, {});
      })
      .catch(function (error) {
        console.log('It did not work!', error);
      });
    //   await axios.get(`https://store.steampowered.com/wishlist/profiles/76561198975964527/wishlistdata/?p=0`)
    //     .then(async response => {
    //       const game = response.data.map(c => {
    //         let newTags;
    //         if (c.tags) {
    //           newTags = Object.values(c.tags).toString().split(',').join(', ');
    //         }
    //         // console.log(currencies, currencies_name, capital, tags);
    //         const result = {
    //           name: c.name,
    //           review_desc: c.review_desc,
    //           release_string: c.release_string,
    //           tags: newTags,
    //           is_free_game: c.is_free_game,
    //           background: c.background,
    //           deck_compat: c.deck_compat
    //         };
    //         return result;
    //       });
    //       console.log('dajsdlkfadlf;', game);
    //       // await queryInterface.bulkInsert('countries', countries, {});
    //     });
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
