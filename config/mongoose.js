const mongoose = require("mongoose");

module.exports = () =>
{
    const db = mongoose
                    .connect(process.env.DB_URL)
                    .then(() =>
                    {
                        console.log("The server is connected to the database");
                    })
                    .catch((err) =>
                    {
                        console.log("Unable to connect the database");
                    });
    return db;                
}
