module.exports = db => {
    const config = require('../configNode.json');
    const router = require('express').Router();
    const jwt    = require('jsonwebtoken'); 
    const repository = require('../repository/repository')(db);
    const service = require('../service/service')(repository);
    const { getUsers, sendOtp, updateUser, createSite, findSite, updateSite, signIn } = require('../controller/controller')({
        service,
        repository,
    });

    router.get("/user", getUsers); // get all the users
    router.post("/otp", sendOtp);
    router.put("/forgotpassword", sendOtp);
    router.get("/login", signIn); // if we have the password and dont have token this will gen token
    router.put("/user", updateUser); // update the user details
    router.use("", function (req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.authSecret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    })
    router.post("/user/site", createSite); // To create a new item
    router.get("/user/site/search", findSite); // To get all the website lists for the given input
    router.put("/user/site", updateSite) // To edit the website

    return router;
}