import { AutoRouter, cors, error, IRequest } from 'itty-router'
import { handleAssetDownload, handleAssetUpload } from './assetUploads'
import { Environment } from './types'
import { getRequestErrors } from './utils/auth'

// make sure our sync durable object is made available to cloudflare
export { TldrawDurableObject } from './TldrawDurableObject'

// we use itty-router (https://itty.dev/) to handle routing. in this example we turn on CORS because
// we're hosting the worker separately to the client. you should restrict this to your own domain.
// TODO update CORS settings
const { preflight, corsify } = cors({ origin: '*' })

const router = AutoRouter<IRequest, [env: Environment, ctx: ExecutionContext]>({
	before: [preflight],
	finally: [corsify],
	catch: (e) => {
		console.error(e)
		return error(e)
	},
})
	// requests to /connect are routed to the Durable Object, and handle realtime websocket syncing
	.get('/connect/:roomId', async (request, env) => {
		const error = await getRequestErrors(request, env)
		if (error) {
			return error
		}
		const id = env.TLDRAW_DURABLE_OBJECT.idFromName(request.params.roomId)
		const room = env.TLDRAW_DURABLE_OBJECT.get(id)
		return room.fetch(request.url, { headers: request.headers, body: request.body })
	})

	// assets can be uploaded to the bucket under /uploads:
	.post('/uploads/:uploadId', handleAssetUpload)

	// they can be retrieved from the bucket too:
	.get('/uploads/:uploadId', handleAssetDownload)

	.post('/real', async (request, env) => {
		const json = await request.json<{
			developerPrompt: string
			image: string
			messages: { type: 'text' | 'image'; text?: string; image?: string }[]
		}>()
		const { developerPrompt, image, messages } = json
		// make request to openai

		const openAiMessages = []

		openAiMessages.push({
			role: "developer",
			content: developerPrompt
		})

		if (image) {
			openAiMessages.push({
				role: "user",
				content: [
					{
						"type": "image_url",
						"image_url": {
							"url": image
						}
					}
				]
			})
		}
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i]
			if (message.type === 'text') {
				openAiMessages.push({
					role: "user",
					content: message.text
				})
			} else {
				openAiMessages.push({
					role: "user",
					content: [
						{
							"type": "image_url",
							"image_url": {
								"url": message.image
							}
						}
					]
				})
			}
		}
		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				"model": "gpt-4o-mini",
				"messages": openAiMessages
			}),
		})

		const result = await res.json<{
			choices: { message: { content: string } }[]
		}>()
		return new Response(JSON.stringify({
			response: result.choices[0]?.message?.content
		}), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	})

// export our router for cloudflare
export default router
