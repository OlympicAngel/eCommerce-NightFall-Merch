const rl = require("express-rate-limit")

const limiter = rl.rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 15, // Limit each IP to 15 requests per `window` (here, per 5 minutes).
    message: "שלחת יותר מיד בקשת... צ'יל",
    skipSuccessfulRequests: true,
})

// Apply the rate limiting middleware to requests.
module.exports = limiter