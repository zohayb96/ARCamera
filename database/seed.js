const { db } = require('./index');
const art = require('./models/art');
const user = require('./models/user');

newArt = [];

newUsers = [];

const seed = () =>
  Promise.all(newUsers.map(user => users.create(user))).then(() =>
    Promise.all(newArt.map(post => oPosts.create(post)))
  );

const main = () => {
  console.log('Syncing db...');
  db.sync({ force: true })
    .then(() => {
      console.log('Seeding databse...');
      return seed();
    })
    .catch(err => {
      console.log('Error while seeding');
      console.log(err.stack);
    })
    .then(() => {
      db.close();
      return null;
    });
};

main();
