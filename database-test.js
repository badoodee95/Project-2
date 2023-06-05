const { game } = require('./models');

game.create({
    name: 'Project Zomboid',
    review_desc: 'Zombie Game',
    release_string: 'November 10th, 2015',
    tags: 'Zombie, Apocalypse, Open-World',
    is_free_game: false,
    background: 'Nah',
    deck_compat: 2
})
    .then(createdGame => {
        console.log('RAW CREATED GAME', createdGame);
        console.log('CLEANED GAME', createdGame.toJSON());
    });