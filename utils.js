const fast2sms = require("fast-two-sms");
const config = require('./configNode.json');

/**
 * generateOTP function will generate 4 digit number
 * @returns 
 */
exports.generateOTP = () => {
  var otp =  Math.floor(1000 + Math.random() * 9000);
  return otp;
};

/**
 * sendSms function will send 4 digit otp to the given contactNumber using fast-two-sms sdk
 * @param {*} message 
 * @param {*} contactNumber 
 */
exports.sendSms = async (message, contactNumber) => {
  try {
    var options = {authorization : config.smsAuthTocken , message : message ,  numbers : [contactNumber]}
    const res = await fast2sms.sendMessage(options);
    console.log(res);
  } catch (error) {
    console.error("found an error while generating otp", error)
    throw error
  }
};