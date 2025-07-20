// utils/whisperTranscription.js
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Transcribes audio file using Whisper
 * @param {string} filePath - Local path to audio file
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const response = await openai.createTranscription(
        fileStream,
        'whisper-1',
        undefined,   // prompt (optional)
        'json',      // response format
        0,           // temperature
        'en'         // language (optional)
    );

    return response.data.text;
}

module.exports = { transcribeAudio };
