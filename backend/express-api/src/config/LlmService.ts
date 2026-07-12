import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
        console.warn("LLM_API_KEY not set. Returning fallback summary.");
        return "AI summary unavailable — LLM API key not configured.";
    }

    const isOpenRouter = apiKey.startsWith("sk-or-");
    const url = isOpenRouter ? OPENROUTER_API_URL : GROQ_API_URL;
    
    // Fallback models in case one is unavailable or has incorrect pricing/access tier
    const candidateModels = isOpenRouter 
        ? ["meta-llama/llama-3.1-8b-instruct", "meta-llama/llama-3-8b-instruct:free", "google/gemma-2-9b-it:free"]
        : ["llama-3.1-8b-instant"];

    let lastError: any = null;
    for (const model of candidateModels) {
        try {
            console.log(`Attempting LLM summary generation with model: ${model} on ${isOpenRouter ? 'OpenRouter' : 'Groq'}`);
            const response = await axios.post(
                url,
                {
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.4,
                    max_tokens: 512
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 25000
                }
            );

            const content = response.data?.choices?.[0]?.message?.content;
            if (content) {
                return content;
            }
        } catch (error: any) {
            lastError = error;
            console.warn(`Model ${model} failed: ${error.response?.status || error.message}. Trying next candidate model...`);
        }
    }

    console.error("All LLM candidate models failed. Last error:", lastError instanceof Error ? lastError.message : lastError);
    return "AI summary generation failed. Please try again later.";
}

export async function generatePreVisitSummary(
    patientName: string,
    patientAge: string,
    patientGender: string,
    concern: string,
    appointmentType: string
): Promise<{ summary: string; urgencyLevel: "low" | "medium" | "high" | "critical" }> {
    const systemPrompt = `You are a medical triage assistant. Given patient intake information, generate a concise pre-visit briefing for the doctor. Include:
1. A brief patient profile summary
2. Key symptoms and potential differential diagnoses to consider
3. Suggested questions for the doctor to ask
4. An urgency assessment

At the very end of your response, on a new line, write exactly one of these urgency tags: [URGENCY:low] [URGENCY:medium] [URGENCY:high] [URGENCY:critical]

Keep the summary professional and under 300 words.`;

    const userPrompt = `Patient: ${patientName}, Age: ${patientAge}, Gender: ${patientGender}
Appointment Type: ${appointmentType}
Primary Concern: ${concern}`;

    const rawSummary = await callLLM(systemPrompt, userPrompt);

    // Parse urgency from response
    let urgencyLevel: "low" | "medium" | "high" | "critical" = "medium";
    const urgencyMatch = rawSummary.match(/\[URGENCY:(low|medium|high|critical)\]/);
    if (urgencyMatch) {
        urgencyLevel = urgencyMatch[1] as "low" | "medium" | "high" | "critical";
    }

    // Remove the urgency tag from the summary text
    const summary = rawSummary.replace(/\[URGENCY:(low|medium|high|critical)\]/, "").trim();

    return { summary, urgencyLevel };
}

export async function generatePostVisitSummary(
    patientName: string,
    concern: string,
    doctorNotes: string,
    prescription: string
): Promise<string> {
    const systemPrompt = `You are a patient communication assistant. Given the doctor's consultation notes and prescription, generate a clear, patient-friendly post-visit summary. Include:
1. What was discussed during the visit
2. Diagnosis or findings (in simple language)
3. Treatment plan and medications prescribed
4. Follow-up instructions or lifestyle recommendations

Use simple, non-medical language. Be reassuring and professional. Keep under 300 words.`;

    const userPrompt = `Patient: ${patientName}
Original Concern: ${concern}
Doctor's Notes: ${doctorNotes}
Prescription: ${prescription || "No medication prescribed"}`;

    return await callLLM(systemPrompt, userPrompt);
}
