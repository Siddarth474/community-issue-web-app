import axios from "axios";

const getAISuggestions = async (topic) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: `Summarize this issue from the perspective of the person who is experiencing the problem. 
                      Write in simple, realistic, first-person language. 
                      Highlight what exactly went wrong and how it affects them, in under 60-70 words. 
                      Issue: ${topic}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "";

  } catch (error) {
    console.log("Gemini API Error:", error.response?.data || error.message);
    return "";
  }
};


export default getAISuggestions;

