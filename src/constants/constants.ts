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

export const DATA_DIRECTORY = "src/data/uploads";

export const PROMPTS = {
  question_generation_for_javascript_and_react: `Act as a JavaScript and React interviewer based in India. Generate a structured list of interview questions in JSON format to evaluate a candidate’s proficiency in JavaScript (covering topics like ES6 features, closures, promises, async/await, and DOM manipulation) and React (covering hooks, life cycle methods, state management, context API, and performance optimization).
    Each question should be a JSON object containing the following fields:
   	[
      {
        "id": 1,
        "topic": "JavaScript",
        "difficulty": "Beginner",
        "question": "Explain the difference between let, const, and var.",
        "expected_answer_outline": "Discuss scope, mutability, and hoisting differences."
      },
      ...
    ]
    `,
} as const;
