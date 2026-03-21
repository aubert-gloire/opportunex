import { GoogleGenerativeAI } from '@google/generative-ai';

// ---------------------------------------------------------------------------
// Gemini AI Service — Free tier: 15 RPM, 1M tokens/day
// Setup: aistudio.google.com → Get API Key → add GEMINI_API_KEY to .env
// ---------------------------------------------------------------------------

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const safeJson = (text) => {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
};

// Generate job description for employers
export const generateJobDescription = async (title, type, sector, requirements = [], skills = []) => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Write a professional job description for a ${type || 'full-time'} ${title} position in the ${sector || 'general'} sector based in Rwanda.
Requirements: ${requirements.filter(Boolean).join('; ') || 'not specified'}.
Required skills: ${skills.filter(Boolean).join(', ') || 'not specified'}.
Write 3 focused paragraphs: (1) role overview and impact, (2) key responsibilities, (3) what we offer. Keep it engaging and professional. Do not include a title header or bullet points.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate a tailored cover letter for youth applicants
export const generateCoverLetter = async (jobTitle, companyName, candidate) => {
  const model = getModel();
  if (!model) return null;

  const { firstName = 'Candidate', skills = [], education = [], experience = [] } = candidate;
  const latestEdu = education[0];
  const latestExp = experience[0];

  const prompt = `Write a professional cover letter for ${firstName} applying for ${jobTitle} at ${companyName} in Rwanda.
Skills: ${skills.slice(0, 6).join(', ') || 'various professional skills'}.
${latestEdu ? `Education: ${latestEdu.degree} from ${latestEdu.institution}.` : ''}
${latestExp ? `Recent experience: ${latestExp.title} at ${latestExp.company}.` : ''}
Write 3 concise paragraphs. Start with "Dear Hiring Manager," and be enthusiastic but professional. Do not include postal addresses or date headers.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate interview prep questions for a job
export const getInterviewQuestions = async (jobTitle, skills = []) => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Generate 6 interview questions for a ${jobTitle} position that tests relevant knowledge and skills: ${skills.slice(0, 5).join(', ') || 'general professional skills'}.
Mix behavioral, technical, and situational questions. Return as a JSON array of objects with "question" (string) and "tip" (brief answer strategy, 1 sentence) fields. Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return safeJson(result.response.text()) || [];
};

// Get personalised career tips based on youth profile
export const getCareerTips = async (profile) => {
  const model = getModel();
  if (!model) return null;

  const { skills = [], verifiedSkills = [], preferredSectors = [], profileCompletionPercentage = 0 } = profile;

  const prompt = `Give 4 concise, actionable career development tips for a young professional in Rwanda.
Profile: skills: ${skills.slice(0, 5).join(', ') || 'general'}, verified in: ${verifiedSkills.map(s => s.skill).slice(0, 3).join(', ') || 'none yet'}, target sectors: ${preferredSectors.join(', ') || 'open'}, profile completion: ${profileCompletionPercentage}%.
Return as a JSON array of objects with "tip" (1 sentence insight) and "action" (1 sentence specific next step) fields. Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return safeJson(result.response.text()) || [];
};

// Generate assignment questions for a course lesson
export const generateAssignmentQuestions = async (courseTitle, lessonTitle, lessonContent = '') => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Generate 5 assessment questions for a lesson titled "${lessonTitle}" from the course "${courseTitle}".
${lessonContent ? `Lesson content summary: ${lessonContent.slice(0, 400)}` : ''}
Create a mix of question types. Return as a JSON array of objects with these fields:
- "text": the question text
- "type": one of "multiple-choice", "open-ended", or "true-false"
- "options": array of 4 strings (only for multiple-choice, empty array otherwise)
- "correctAnswer": string (the correct option text for MCQ/true-false, empty string for open-ended)
- "points": number (10 for open-ended, 5 for MCQ/true-false)
Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return safeJson(result.response.text()) || [];
};

// Grade an open-ended answer with AI
export const gradeOpenAnswer = async (question, studentAnswer, courseContext = '') => {
  const model = getModel();
  if (!model) return { score: 50, feedback: 'Answer received.' };

  const prompt = `Grade this student answer for a course assessment${courseContext ? ` on ${courseContext}` : ''}.
Question: ${question}
Student Answer: ${studentAnswer}
Evaluate accuracy, relevance, and completeness. Return a JSON object with:
- "score": number 0-100 (how correct the answer is)
- "feedback": string (1-2 sentence constructive feedback mentioning what was good and what could be improved)
Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const parsed = safeJson(result.response.text());
  if (parsed && typeof parsed.score === 'number') return parsed;
  return { score: 50, feedback: 'Answer received and noted.' };
};

// Explain a concept in simple terms for a learner
export const explainConcept = async (concept, courseTitle = '', lessonTitle = '') => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Explain the concept "${concept}" simply and clearly for a student learning${courseTitle ? ` ${courseTitle}` : ''}${lessonTitle ? ` (lesson: ${lessonTitle})` : ''} in Rwanda.
Use 2-3 short paragraphs. Use a practical example relevant to everyday life or work in Africa. Avoid jargon.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate a session agenda for mentorship
export const generateMentorshipAgenda = async (topic, duration = 60) => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Create a structured ${duration}-minute mentorship session agenda on the topic: "${topic}".
Return as a JSON array of objects with "time" (e.g., "0:00–5:00"), "activity" (title), and "description" (1-sentence detail) fields.
Include: intro/goal-setting, main discussion, skill exercise or Q&A, action items, wrap-up. Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return safeJson(result.response.text()) || [];
};

// Generate a post-session summary
export const generateSessionSummary = async (topic, mentorNotes = '', menteeNotes = '') => {
  const model = getModel();
  if (!model) return null;

  const prompt = `Write a concise post-mentorship session summary on the topic: "${topic}".
${mentorNotes ? `Mentor notes: ${mentorNotes}` : ''}
${menteeNotes ? `Mentee notes: ${menteeNotes}` : ''}
Write 2-3 short paragraphs covering: what was discussed, key insights, and 3 concrete next steps the mentee should take. Be direct and actionable.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Provide CV/profile improvement feedback
export const getCVFeedback = async (profile) => {
  const model = getModel();
  if (!model) return null;

  const { skills = [], education = [], experience = [], bio, profileCompletionPercentage = 0 } = profile;

  const prompt = `Analyze this young professional's profile from Rwanda and provide 3 specific CV improvement suggestions.
Bio: ${bio || 'Not provided'}. Education: ${education.length} entries. Skills: ${skills.join(', ') || 'none listed'}. Experience: ${experience.length} entries. Profile completion: ${profileCompletionPercentage}%.
Return as a JSON array of objects with "area" (category like "Summary", "Skills", "Experience") and "suggestion" (specific actionable advice) fields. Be constructive. Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return safeJson(result.response.text()) || [];
};
