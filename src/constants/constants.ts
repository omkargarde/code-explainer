export const LanguagesList = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "C++",
  "C",
  "PHP",
  "Ruby",
  "Kotlin",
  "Swift",
  "Dart",
  "Scala",
  "Perl",
  "R",
  "Elixir",
  "Haskell",
  "Objective-C",
  "Lua",
  "Shell",
  "SQL",
  "HTML",
  "CSS",
] as const;

export const DATA_DIRECTORY = {
  upload: "src/data/uploads",
  existing_response: "src/data/generated",
};

export const PROMPTS = {
  question_generation_for_javascript_and_react: `Act as a JavaScript and React interviewer based in India. Generate a structured list of interview questions in JSON format to evaluate a candidate’s proficiency in JavaScript (covering topics like ES6 features, closures, promises, async/await, and DOM manipulation) and React (covering hooks, life cycle methods, state management, context API, and performance optimization).
    Each question should be a JSON object containing the following fields:
   	[
      {
        "id": Number,
        "topic": string,
        "difficulty": string,
        "question": string,
        "expected_answer_outline": string
      },
    ]
    `,
  feedback_for_answer_uploaded: (question: string) =>
    `Your are a javascript and react expert, give feedback for audio for the question ${question}, do not be nice , your are here to help, give feedback based on technical answer and also give feedback for the clarity of speech of the answer give in the audio`,
} as const;

export const MODELS = {
  flash_lite_preview: "gemini-2.5-flash-preview-09-2025",
} as const;

export const AUDIO_TYPE = {
  webm: "audio/webm",
} as const;
