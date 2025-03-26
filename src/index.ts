/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { generateObject, streamText } from 'ai';
import { createWorkersAI } from 'workers-ai-provider';
import { z } from 'zod';

export interface Env {
	AI: Ai;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// const response = env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		// 	prompt: 'What is the origin of the phrase Hello, World',
		// 	stream: true,
		// });

		// return new Response(response, {
		// 	headers: { 'content-type': 'text/event-stream' },
		// });

		const workersai = createWorkersAI({ binding: env.AI });

		// const text = await streamText({
		// 	messages: [
		// 		{
		// 			role: 'user',
		// 			content: 'What is the origin of the phrase Hello, World',
		// 		},
		// 	],
		// 	model: workersai('@cf/meta/llama-3.1-8b-instruct'),
		// });

		// return text.toTextStreamResponse({
		// 	headers: {
		// 		'Content-Type': 'text/x-unknown',
		// 		'content-encoding': 'identity',
		// 		'transfer-encoding': 'chunked',
		// 	},
		// });

		const result = await generateObject({
			model: workersai('@cf/meta/llama-3.1-8b-instruct'),
			prompt: 'Generate a Lasagna recipe',
			schema: z.object({
				recipe: z.object({
					description: z.string(),
					ingredients: z.array(z.string()),
				}),
			}),
		});

		return Response.json(result.object);
	},
} satisfies ExportedHandler<Env>;
