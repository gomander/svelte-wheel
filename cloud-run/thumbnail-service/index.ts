import express from 'express'
import cors from 'cors'
import 'module-alias/register'
import validateColor from 'validate-color'
import { getWheel } from '$lib/server/FirebaseAdmin'
import Wheel from '$lib/utils/Wheel'
import { createThumbnail } from '$lib/server/Thumbnail'

const app = express()
app.use(cors())

app.get('/thumbnails', (_, res) => res.send('OK'))

app.get('/thumbnails/:path', async (req, res) => {
  const uid = req.headers.authorization
  const wheelData = await getWheel(req.params.path, uid)
  if (!wheelData) {
    return res.status(404).send({ error: 'Wheel not found' })
  }
  const size = Math.max(Math.min(Number(req.query.size) || 300, 700), 50)
  let background = req.query.background?.toString()
  if (background && !validateColor(background)) {
    background = undefined
  }
  const image = await createThumbnail(new Wheel(wheelData), size, background)
  res.setHeader('Content-Type', 'image/webp').setHeader(
    'Content-Length', image.byteLength.toString()
  ).send(image)
})

app.listen(8080, () => console.log('Server listening on port 8080'))
