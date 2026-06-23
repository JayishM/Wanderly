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
        let duration = req.query.duration;
        let travel = req.query.travel;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `Return ONLY valid JSON.
            {
                "trips":[
                    {
                        "destination":"",
                        "descriptionKey":"",
                        "descriptionLong":"",
                        "cost":"",
                        "duration":"",
                        "bestSeason":"",
                        "activities":[],
                        "imageQuery":""
                    }
                ]
            }

            Rules:
            - Return exactly 5 trips.
            - Only Indian locations.
            - cost must contain only a number.
            - imageQuery should be suitable for finding destination photos.
            - No markdown.
            - No explanation.
            - No text outside JSON.

            Budget: inr${budget}
            Duration: ${duration} days
            Travelers: ${travel}`
        });

        let text = response.text;

        console.log("RAW RESPONSE:");
        console.log(text);

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let start = text.indexOf("{");
        let end = text.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("Gemini did not return valid JSON");
        }

        text = text.substring(start, end + 1);

        const data = JSON.parse(text);

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
});
app.get("/image", async (req, res) => {

    try {

        const imageQuery = req.query.q;

        console.log("Searching Pexels:", imageQuery);
        console.log("API Key Exists:", !!process.env.PIXEL_API_KEY);

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(imageQuery)}&per_page=1`,
            {
                headers: {
                    Authorization: process.env.PIXEL_API_KEY
                }
            }
        );

        console.log("Pexels Status:", response.status);

        const data = await response.json();

        console.log("Pexels Data:", JSON.stringify(data, null, 2));

        if(data.photos && data.photos.length > 0){

            return res.json({
                image: data.photos[0].src.large
            });

        }

        return res.json({
            image: null
        });

    } catch(err){

        console.error("IMAGE ERROR:", err);

        res.status(500).json({
            error: err.message
        });

    }

});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});