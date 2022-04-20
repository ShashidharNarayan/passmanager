This app follows three layered architecture in-order to differenciate the work process between three different layers which are seperated by different folders.
    
    1. controller - which contains the front end api calls 
    2. service - which contains the business logic part
    3. repository - which contains the database related stuff

    configNode.json file contains the credentials related to sms sending and json web token secrets

    connection.js file contains the database connection client

    utils.js is a common file.

    In-order to run the app enter the command `npm start`

    In-order to fetch the api data you need to login and get the access token, that token we need to pass it as a param in the url

        ex: http://localhost:8080/user/site/search?token= "you-token"

    The apis related to OTP and FORGOT OTP,are not authenticating with jsw token



