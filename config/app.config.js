module.exports = {
  API_URL: process.env.API_URL || "http://localhost:8000",
  PORT: process.env.PORT || 8000,
  CORS_URLS: process.env.CORS_URLS || "http://localhost:5173" ||  "http://localhost:5174",
};
