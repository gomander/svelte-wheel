import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})

/*
const wheelData = await getWheel(params.path)
if (!wheelData) {
  return new Response(
    JSON.stringify({ error: 'Wheel not found' }),
    { status: 404 }
  )
}
const image = await createThumbnail(new Wheel(wheelData))
setHeaders({
  'Content-Type': 'image/webp',
  'Content-Length': image.byteLength.toString()
})
*/
