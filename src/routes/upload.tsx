import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import z from "zod";

export const Route = createFileRoute("/upload")({
  component: Upload,
});

export const markdownUploadSchema = z
  .instanceof(File)
  .refine(
    (file) => file.type === "text/markdown" || file.name.endsWith(".md"),
    "Only markdown (.md) files are allowed",
  )
  .refine((file) => file.size > 0, "File cannot be empty");

const isFormDataSchema = z.instanceof(FormData);

type markdownUploadSchemaType = z.Infer<typeof markdownUploadSchema>;

export const uploadFilesFn = createServerFn({ method: "POST" })
  .inputValidator(isFormDataSchema)
  .handler(async ({ data }) => {
    const file = data.get("file");
    const parsedResult = markdownUploadSchema.safeParse(file);
    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }
    const fileContent = await parsedResult.data.text();
    console.log(fileContent);
  });

function Upload() {
  const uploadFiles = useServerFn(uploadFilesFn);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (postData: FormData) => uploadFiles({ data: postData }),
    mutationKey: ["uploadFiles"],
  });

  function handlerSubmit(formData: FormData) {
    mutate(formData);
  }

  return (
    <div>
      <form action={handlerSubmit}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Pick a file</legend>
          <input
            type="file"
            name="file"
            className="file-input"
            multiple
            accept=".md"
            required
          />
          <label className="label">Max size 2MB</label>
        </fieldset>
        {isError && <span>{error.message}</span>}
        {isSuccess && <span>File was uploaded successfully</span>}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        >
          {isPending ? "Uploading" : "Upload"}
        </button>
      </form>
    </div>
  );
}
