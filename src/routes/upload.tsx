import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/upload')({
  component: Upload,
})

export const markdownUploadSchema = z.object({
  files: z.instanceof(File).refine((val) => {
    const files = Array.isArray(val) ? val : [val]
    return files.every((file) => file.type === 'text/markdown')
  }, 'Only markdown (.md) files are allowed'),
})

type markdownUploadSchemaType = z.Infer<typeof markdownUploadSchema>

export const uploadFilesFn = createServerFn({ method: 'POST' })
  .inputValidator(markdownUploadSchema)
  .handler(async ({ data }) => {
    console.log(data.toString())
  })

function Upload() {
  const uploadFiles = useServerFn(uploadFilesFn)
  const [clientError, setClientError] = useState<string | null>(null)

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (postData: markdownUploadSchemaType) =>
      uploadFiles({ data: postData }),
    mutationKey: ['uploadFiles'],
  })

  function handlerSubmit(formData: FormData) {
    const files = formData.get('file')
    if (!files || !(files instanceof File)) {
      setClientError('failed to fetch files from device')
      return
    }
    mutate({ files })
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
        {clientError && <span>{clientError}</span>}
        {isError && <span>{error.message}</span>}
        {isSuccess && <span>File was uploaded successfully</span>}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        >
          {isPending ? 'Uploading' : 'Upload'}
        </button>
      </form>
    </div>
  )
}
