export const LanguagesList = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Java",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
] as const;

export const QUERY_KEYS = {
  upload_files: "upload",
  generate_feedback: "generateFeedback",
};
export const DATA_DIRECTORY = {
  upload: "src/data/uploads",
  existing_response: "src/data/generated",
};

export const PROMPTS = {
  system_prompt: {
    question_generation_for_javascript_and_react: `Act as a JavaScript and React interviewer based in India. Generate a structured list of interview questions in JSON format to evaluate a candidate’s proficiency in JavaScript (covering topics like ES6 features, closures, promises, async/await, and DOM manipulation) and React (covering hooks, life cycle methods, state management, context API, and performance optimization).`,

    feedback_for_answer_uploaded: (question: string) =>
      `You are a javascript and react expert, give feedback for audio for the question ${question}, do not be nice , you are here to help, give feedback based on technical answer and also give feedback for the clarity of speech of the answer given in the audio`,
  },
  user_prompt: {
    new_question: "give me a new question",
  },
} as const;

export const LLM_MODELS = {
  gemini_flash_lite_preview: "gemini-2.5-flash-lite",
  gemini_3_pro_preview: "gemini-3-pro-preview",
} as const;

export const FORMAT_CONFIG = {
  webm: { type: "audio/webm", extension: ".webm" },
  json: { type: "application/json", extension: ".json" },
} as const;
