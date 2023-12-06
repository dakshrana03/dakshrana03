const {verify} = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    // Retrieve the access token from the request headers
    const accessToken = req.header("accessToken");
    console.log(accessToken)
    // Check if the access token is missing
    if (!accessToken) {
        return res.status(401).json({error: "Authentication failed: Access token missing."});
    }

    try {
        // Verify the access token using the secret key
        const decodedToken = verify(accessToken, "importantsecret");

        // Attach the user information to the request for future use
        req.user = decodedToken;

        // Continue to the next middleware if the token is valid
        if (decodedToken) {
            return next();
        }
    } catch (err) {
        // Handle token verification errors
        return res.status(401).json({error: "Authentication failed: Invalid token."});
    }
};

module.exports = {authenticateUser};
