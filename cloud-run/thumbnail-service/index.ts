import express from 'express'
import 'module-alias/register'
import { getWheel } from '$lib/server/FirebaseAdmin'
import Wheel from '$lib/utils/Wheel'
import { createThumbnail } from '$lib/server/Thumbnail'

const app = express()

app.get('/thumbnails', (_, res) => res.send('OK'))

app.get('/thumbnails/:path', async (req, res) => {
  const wheelData = await getWheel(req.params.path)
  if (!wheelData) {
    return res.status(404).send({ error: 'Wheel not found' })
  }
  const image = await createThumbnail(new Wheel(wheelData))
  res.setHeader('Content-Type', 'image/webp').setHeader(
    'Content-Length', image.byteLength.toString()
  ).send(image)
})

app.listen(8080, () => console.log('Server listening on port 8080'))
