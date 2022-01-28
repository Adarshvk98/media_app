module.exports = {
    database: "mongodb://localhost:27017/my_database",
    secret: 'supersecret',
    openWeatherAPIKey: "", // Add your open Weather API Key
    sendGridConfig: {
        apiKey: "", // Add your send Grid API Key
        to: "test@example.com", // Change to your recipient
        from: "test@example.com" // Change to your verified sender
    }
}