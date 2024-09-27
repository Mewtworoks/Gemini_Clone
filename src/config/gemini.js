import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyBmG0VysURQ7M4iGx2b18EWSCXRT_bIpWU";

async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Fetch the model properly with await
    const model = await genAI.getGenerativeModel({model: MODEL_NAME});
    
    const generationConfig = {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSEMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    // Ensure model is being used after it's awaited
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    // Send the message and wait for the response
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    // Log the response correctly
    console.log(response.text());
}

export default runChat;
