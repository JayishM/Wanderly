const { GoogleGenAI } = require("@google/genai");
const express=require("express");
const {MongoClient,ObjectId}=require("mongodb");
const cors = require("cors");
require("dotenv").config();

let app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
app.get("/rec", async (req, res) => {
    try {
        console.log("Finding...");
        let budget = req.query.budget;
        let intrest = req.query.intrest;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            Recommend a trip in India.
            Budget INR ${budget}
            Interests: ${intrest}
            Give destination, activities, estimated cost and best season.
            `
        });
        console.log(response.text)
        res.json({
            rec: response.text
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});