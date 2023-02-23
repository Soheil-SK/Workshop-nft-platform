const session = require('express-session');
const redisStore = require('connect-redis')(session);
const createClient = require('redis');

const redis_client = createClient.createClient({ // 6379
    legacyMode: true
});

module.exports.redisInit = function () {
    redis_client.connect();
    redis_client.on('error', (err) => console.log('Redis: \x1B[31mconnection refused\x1B[0m', err));
    redis_client.on('connect', (err) => console.log('Redis: \x1b[33mconnected\x1b[0m'));
};

const sessionStore = new redisStore({ client: redis_client });

module.exports.redis_client = redis_client;
module.exports.sessionStore = sessionStore;