module.exports = db => {
    const express = require('express');
    const app = express();
    const routes = require('./router/router')(db);
    app.use(express.json());
    app.use(routes);
    return app;
};
