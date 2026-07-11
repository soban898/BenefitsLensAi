import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ANALYSIS_PROMPT = `You are an expert employee benefits consultant.

Analyze the following document.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

Return a JSON object with exactly these keys:

{
  "documentType": string — the type of benefits document (e.g., "COBRA Notice", "HSA Document", "FSA Document", "HRA Document", "ICHRA Document", "Employee Benefits Guide", "Insurance Document"),
  "summary": string — a clear, plain-English summary of the document (2-4 sentences),
  "keyDeadlines": string[] — critical deadlines the reader must not miss,
  "importantDates": string[] — other important dates mentioned in the document,
  "planType": string — the type of plan (e.g., "Health Reimbursement Arrangement", "Health Savings Account", "Flexible Spending Account", "COBRA Continuation Coverage"),
  "coverage": string[] — what is covered under this plan/document,
  "employeeResponsibilities": string[] — what the employee must do,
  "employerResponsibilities": string[] — what the employer is responsible for,
  "importantWarnings": string[] — important warnings or caveats,
  "nextSteps": string[] — actionable next steps for the reader,
  "commonQuestions": array of { "question": string, "answer": string } — 3-5 common questions with answers about this document
}

Rules:
- If a field has no relevant information, return an empty array [].
- All text must be in plain English, easy for a non-expert to understand.
- Do NOT include markdown formatting.
- Return ONLY the JSON object.`;

const CHAT_PROMPT = `You are an expert employee benefits consultant.

Answer the user's question based ONLY on the document text provided below.

Rules:
- Answer in plain, clear English.
- If the answer is not in the document, say: "I couldn't find information about that in your document."
- Do not make up information or use outside knowledge.
- Be concise but thorough.

Return ONLY valid JSON with this structure:
{
  "answer": string — your answer to the question,
  "citations": array of {
    "source": string — the document name or "Document",
    "pageNumber": string or null — page number if identifiable, otherwise null,
    "confidence": "high" | "medium" | "low" — how confident you are the answer is in the document
  }

Do not return markdown. Only JSON.`;

export async function analyzeDocument(text: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `${ANALYSIS_PROMPT}

--- DOCUMENT TEXT ---
${text}
--- END DOCUMENT TEXT ---`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const jsonText = response.text();

  return JSON.parse(jsonText);
}

export async function chatAboutDocument(
  question: string,
  documentText: string,
  history: { role: string; content: string }[]
) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const historyContext = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `${CHAT_PROMPT}

--- DOCUMENT TEXT ---
${documentText.slice(0, 50000)}
--- END DOCUMENT TEXT ---

--- CONVERSATION HISTORY ---
${historyContext}
--- END HISTORY ---

User question: ${question}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const jsonText = response.text();

  return JSON.parse(jsonText);
}
