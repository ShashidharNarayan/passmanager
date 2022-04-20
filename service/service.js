module.exports = repository => ({
    createUser({ mobileNumber, otp }){
        return repository.createUser({
            mobileNumber, password, otp
        });
    },
    updateUser({ mobileNumber, password, otp }) {
        return repository.updateUser({
            mobileNumber, password, otp
        });
    }
});