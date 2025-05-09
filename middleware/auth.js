const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // 1. Extract token
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        // 2. Validate the token
        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Token not found",
            });
        }

        // 3. Verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload; // This req.user will be used in authenticated routes.
            next();
        } catch (error) {
            console.log("Error occurred while verifying the token:", error);
            return res.status(401).json({
                success: false,
                message: "Error occurred while verifying the token",
            });
        }
    } catch (error) {
        console.log("Error occurred while validating the token:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while validating the token",
        });
    }
};
