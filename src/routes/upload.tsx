import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/upload')({
  component: Upload,
})

function Upload() {
  return (
    <div>
      <form action="/api" method="post" encType="multipart/form-data">
        <label htmlFor="file">File</label>
        <input id="file" name="file" type="file" />
        <button>Upload</button>
      </form>
    </div>
  )
}
