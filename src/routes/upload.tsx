// import path from "node:path";
// import fs from "node:fs";
// import { useMutation } from "@tanstack/react-query";
// import { createFileRoute } from "@tanstack/react-router";
// import { createServerFn, useServerFn } from "@tanstack/react-start";
// import z from "zod";
// import { DATA_DIRECTORY } from "@/constants/constants";

// export const Route = createFileRoute("/upload")({
//   component: Upload,
// });

// export const markdownUploadSchema = z
//   .instanceof(File)
//   .refine(
//     (file) => file.type === "text/markdown" || file.name.endsWith(".md"),
//     "Only markdown (.md) files are allowed",
//   )
//   .refine((file) => file.size > 0, "File cannot be empty");

// const isFormDataSchema = z.instanceof(FormData);

// export const uploadFilesFn = createServerFn({ method: "POST" })
//   .inputValidator(isFormDataSchema)
//   .handler(async ({ data }) => {
//     // const unParsedFile = data.get("file");
//     // const parsedResult = markdownUploadSchema.safeParse(unParsedFile);
//     // if (!parsedResult.success) {
//     //   const errorMsg = parsedResult.error.issues
//     //     .map((i) => i.message)
//     //     .join(", ");
//     //   throw new Error(`Invalid upload: ${errorMsg}`);
//     // }
//     // const file = parsedResult.data;
//     // // Directory where markdown files are saved
//     // const MARKDOWN_DIR = path.join(process.cwd(), DATA_DIRECTORY.upload);
//     // // Ensure directory exists
//     // if (!fs.existsSync(MARKDOWN_DIR)) {
//     //   fs.mkdirSync(MARKDOWN_DIR, { recursive: true });
//     // }
//     // const filePath = path.join(MARKDOWN_DIR, "questions.md");
//     // const fileContents = await file.text();
//     // if (fs.existsSync(filePath)) {
//     //   // If file exists → append content
//     //   fs.appendFileSync(filePath, fileContents);
//     // } else {
//     //   // If file does not exist → create new file
//     //   fs.writeFileSync(filePath, fileContents);
//     // }
//   });

// function Upload() {
//   const uploadFiles = useServerFn(uploadFilesFn);

//   const { mutate, isPending, isSuccess, isError, error } = useMutation({
//     mutationFn: (postData: FormData) => uploadFiles({ data: postData }),
//     mutationKey: ["uploadFiles"],
//   });

//   function handlerSubmit(formData: FormData) {
//     mutate(formData);
//   }

//   return (
//     <div>
//       <form action={handlerSubmit}>
//         <fieldset className="fieldset">
//           <legend className="fieldset-legend">Pick a file</legend>
//           <input
//             type="file"
//             name="file"
//             className="file-input"
//             multiple
//             accept=".md"
//             required
//           />
//           <label className="label">Max size 2MB</label>
//         </fieldset>
//         {isError && <span>{error.message}</span>}
//         {isSuccess && <span>File was uploaded successfully</span>}
//         <button
//           type="submit"
//           disabled={isPending}
//           className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
//         >
//           {isPending ? "Uploading" : "Upload"}
//         </button>
//       </form>
//     </div>
//   );
// }
