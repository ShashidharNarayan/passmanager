module.exports = db => {
    return {
        getUsers: async () => {
            var users = db.collection('users');
            return users.find({}).toArray()
        },

        findUser: async ({ mobileNumber }) => {
            var users = db.collection('users');
            var userExist = await users.findOne({ mobilenumber: mobileNumber })
            return userExist
        },

        createUser: async ({ mobileNumber, otp, password }) => {
            var users = db.collection('users');
            var res = await users.insertOne({ mobilenumber: mobileNumber, otp: otp, password: password })
            return res
        },

        updateUser: async ({mobileNumber, password, otp}) => {
            var users = db.collection('users');
            var res = await users.updateOne({ mobilenumber: mobileNumber }, { $set: {password: password, otp: otp} }, { upsert: true });
            return res
        },

        getWebsites: async ({mobileNumber}) => {
            var sites = db.collection('sites');
            sites.find({mobilenumber: mobileNumber}).toArray()
        },

        getSite: async ({mobileNumber, siteName}) => {
            var sites = db.collection('sites');
            var result = sites.findOne({$and: [{ mobilenumber: {$eq: mobileNumber}}, {name: {$eq: siteName}}]})
            return result
        },

        findSite: async ({mobileNumber, siteName}) => {
            var sites = db.collection('sites');
            var result = sites.find({$and: [{ mobilenumber: {$eq: mobileNumber}}, {name: {$regex :siteName}}]}).toArray()
            return result
        },

        createSite: async ({ url, siteName, folder, userName, password, notes, mobileNumber }) => {
            var sites = db.collection('sites');
            var res = await sites.insertOne({ url: url, name: siteName, username: userName, password: password, notes: notes, foldername: folder, mobilenumber: mobileNumber})
            return res
        },

        updateSite: async ({url, siteName, folder, userName, password, notes, mobileNumber}) => {
            var site = db.collection('sites');
            var res = await site.updateOne({ mobilenumber: mobileNumber }, { $set: {url: url, name: siteName, username: userName, password: password, notes: notes, foldername: folder} }, { upsert: true });
            return res
        },
    };
};