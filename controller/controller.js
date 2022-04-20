const utility = require("../utils");
const config = require('../configNode.json');
const jwt    = require('jsonwebtoken'); 

const wrapWithTryCatch = fn => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const withErrorHandling = (wrapper, controllerObj) =>
    Object.entries(controllerObj).reduce((accCur, [key, fn]) => ({ ...accCur, [key]: wrapper(fn) }), {});

module.exports = ({ service, repository }) => withErrorHandling(wrapWithTryCatch, {

    async getUsers(req, res) {
        const users = await repository.getUsers();
        res.json(users);
    },

    async sendOtp(req, res) {
        const { mobileNumber } = req.body;
        if (!mobileNumber) {
            res.json({ "message": `Mobile Number Cannot be empty` })
            return
        }
        user = await repository.findUser({ mobileNumber })
        var otp = await utility.generateOTP()
        var password = "";

        // checking if the user exists or not
        if (!user) {
            service.createUser({ mobileNumber, otp })
        } else {
            service.updateUser({ mobileNumber, password, otp })
        }
        utility.sendSms(`Your OTP for Pass Manager is ${otp}`, mobileNumber)
        res.json({ "message": `Your OTP for Pass Manager is ${otp}` })
        return;
    },

    async signIn(req, res) {
        const { mobileNumber, password } = req.body;
        if (!(mobileNumber && password)) {
            res.json({ "message": `mobileNumber and password are Mandatory` })
            return
        }
        user = await repository.findUser({ mobileNumber })
        if (user) {
            if (password && user.password == password) {
                var result = await generateToken(mobileNumber)
                res.send({ "message": "Sign In Successfull", token: result })
                return
            } else {
                res.send({ success: false, message: "Authentication failed. Wrong password." })
                return
            }
        } else {
            res.send({ "message": "User not found" })
        }
    },

    async updateUser(req, res) {
        const { mobileNumber, otp, password } = req.body;
        if (!(mobileNumber && otp)) {
            res.json({ "message": `mobileNumber and otp are Mandatory` })
            return
        }
        user = await repository.findUser({ mobileNumber })
        if (user) {
            if (user["otp"] != otp) {
                res.json({ status: 400, message: "INCORRECT_OTP_ERR" });
                return;
            }
            
            if (password) {
                await service.updateUser({ mobileNumber, password, otp })
                var result = await generateToken(mobileNumber)
                res.send({ "message": "Sign In Successfull", token: result })
                return
            } else {
                res.send({ success: false, message: "Authentication failed. Wrong password." })
                return
            }
        } else {
            res.send({ "message": "User not found" })
        }
    },

    async createSite(req, res) {
        const { url, siteName, folder, userName, password, notes, mobileNumber } = req.body;
        if (!(url && siteName && folder && userName && password && mobileNumber)) {
            res.json({ "message": `Please pass all the required parameters` })
            return
        }
        result = await repository.getSite({ mobileNumber, siteName })
        if (!result) {
            site = await repository.createSite({ url, siteName, folder, userName, password, notes, mobileNumber })
            res.send(site)
        } else {
            res.json({ "message": "This site already exists" })
            return;
        }
    },

    async findSite(req, res) {
        const { mobileNumber, siteName } = req.body;
        if (!(siteName && mobileNumber)) {
            res.json({ "message": `Please pass all the required parameters` })
            return
        }
        result = await repository.findSite({ mobileNumber, siteName })
        res.send(result)
    },

    async updateSite(req, res) {
        const { url, siteName, folder, userName, password, notes, mobileNumber } = req.body;
        if (!(url && siteName && folder && userName && password && mobileNumber)) {
            res.json({ "message": `Please pass all the required parameters` })
            return
        }
        result = await repository.updateSite({ url, siteName, folder, userName, password, notes, mobileNumber })
        res.send(result)
    }
});

var generateToken = async (mobileNumber) => {
        // if user is found and password is right
        // create a token
        var payload = {
            mobilenumber: mobileNumber
        }

        var token = jwt.sign(payload, config.authSecret, {
            expiresIn: 86400 // expires in 24 hours
        });

        var resObj = { success: true, message: 'Token created successfully..!', token: token }
        return resObj

}

