const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(resumeText, jobDescription) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

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

  const result = await model.generateContent(prompt);

  return result.response.text();

}

module.exports = {
  analyzeResume,
};