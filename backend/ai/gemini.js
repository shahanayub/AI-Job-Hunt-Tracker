const { GoogleGenAI } = require("@google/genai");

async function analyzeResume(resumeText, jobDescription) {
  // Pass the key explicitly
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
You are an ATS (Applicant Tracking System).

Compare this resume with this job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this format:

{
  "matchScore": number,
  "strengths": [],
  "missingSkills": [],
  "suggestions": []
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return response.text;
}

module.exports = {
  analyzeResume,
};