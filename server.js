// Import necessary modules
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");


const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Create Express application
const app = express();

const port = 3000;
app.use(cors()); // Enable CORS for all routes
// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set your Google Generative AI credentials
const MODEL_NAME = "gemini-pro-vision";
const API_KEY = "AIzaSyBbuZeBvV_jt_kxRB_BN6wCXwUxT3WLnC4";

// Create Google Generative AI instance
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Define safety settings and generation config
const generationConfig = {
  temperature: 0.4,
  topK: 32,
  topP: 1,
  maxOutputTokens: 4096,
};

const safetySettings = [
  // Add your safety settings here
];

// Define route to handle file upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Check if the file was uploaded
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    // Use the file buffer for image data
    const imageData = req.file.buffer.toString("base64");

    // Create parts array with image data
    const parts = [
      { text: "\n\n\n\n\n" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
      {text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nafter get ouput from image to text ,please convert like this,do not use space\n {\n \"NIK\": \"3210114505950121\",\n \"Nama\": \"HENNY NURHAYATI\",\n \"TempatLahir\": \"MAJALENGKA\",\n \"JenisKelamin\": \"Perempuan\",\n \"TanggalLahir\": \"21-04-1998\",\n \"GolDarah\": \"O\",\n \"Alamat\": \"BLOK JUMAAN\",\n \"RT/RW\": \"002/012\",\n \"KelDesa\": \"BURUMUL WETAN\",\n \"Kecamatan\": \"JATIWANGI\",\n \"Agama\": \"ISLAM\",\n \"Pekerjaan\": \"MENGURUS RUMAH TANGGA\",\n \"StatusPerkawinan\": \"KAWIN\"\n}\nafter blur image please extract image to text with OCR\nif this image contains people,please blur this image﻿ and"},
    ];

    // Generate content using Google Generative AI
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    // Send the response text
    const responseText = result.response.text();
    res.send(responseText);
  } catch (error) {
    // Handle errors
    res.status(500).send(error.message);
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});