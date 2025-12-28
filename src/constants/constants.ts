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
    question_generation_for_javascript_and_react: `You are an interviewer conducting JavaScript, TypeScript, and React technical interviews. Generate ONE interview question per response to evaluate candidate proficiency in:
    	- JavaScript: ES6+, closures, promises, async/await, DOM manipulation
     	- TypeScript: type system, generics, utility types
      - React: hooks, life-cycle, state management, Context API, performance optimization
    Include difficulty level (beginner/intermediate/advanced) and provide a brief hint about what a good answer should cover.only generate single question per response`,

    feedback_for_answer_uploaded: (question: string) =>
      `You are a senior JavaScript and React developer conducting a technical interview. The candidate answered this question:

      	Question: ${question}

      Analyze the transcribed audio response and provide brutally honest feedback in two sections:

      ## Technical Feedback
      	Provide specific feedback on:
        		- Technical accuracy of the answer
        		- Completeness (did they cover key concepts?)
        		- Best practices and code quality
        		- Understanding of fundamentals
        		- Ability to explain clearly

      ## Communication Feedback
      	Provide specific feedback on:
        		- Speech clarity and pronunciation
        		- Pace and fluency
        		- Excessive fillers ("um", "uh", "like")
        		- Confidence and coherence

      ## Summary
      	- Key strengths
      	- Specific areas for improvement
      	- Actionable recommendations

      Be direct and honest. If the answer is technically incorrect or shows weak understanding, say so clearly. Harsh feedback is acceptable if it's accurate and helps the candidate improve. Don't sugarcoat mistakes - point them out directly with specific examples from their response.`,
  },
  user_prompt: {
    new_question: "give me a new question",
    review_answer: "review my answer",
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
