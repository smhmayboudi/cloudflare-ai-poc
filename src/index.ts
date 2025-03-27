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

import { autoTrimTools, createToolsFromOpenAPISpec, runWithTools } from '@cloudflare/ai-utils';
// import { generateObject, streamText } from 'ai';
// import { createWorkersAI } from 'workers-ai-provider';
// import { z } from 'zod';

export interface Env {
	AI: Ai;
	WEATHERAPI_TOKEN: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// # 1 Test
		// const response = env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		// 	prompt: 'What is the origin of the phrase Hello, World',
		// 	stream: true,
		// });

		// return new Response(response, {
		// 	headers: { 'content-type': 'text/event-stream' },
		// });

		// const workersai = createWorkersAI({ binding: env.AI });

		// # 2 Test
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

		// # 3 Test
		// const result = await generateObject({
		// 	model: workersai('@cf/meta/llama-3.1-8b-instruct'),
		// 	prompt: 'Generate a Lasagna recipe',
		// 	schema: z.object({
		// 		recipe: z.object({
		// 			description: z.string(),
		// 			ingredients: z.array(z.string()),
		// 		}),
		// 	}),
		// });

		// return Response.json(result.object);

		// # 4 Test
		// const response = await runWithTools(
		// 	env.AI as unknown as import('@cloudflare/workers-types').Ai,
		// 	'@hf/nousresearch/hermes-2-pro-mistral-7b',
		// 	{
		// 		messages: [{ role: 'user', content: 'Who is Cloudflare on github?' }],
		// 		tools: [
		// 			// You can pass the OpenAPI spec link or contents directly
		// 			...(await createToolsFromOpenAPISpec(
		// 				'https://gist.githubusercontent.com/mchenco/fd8f20c8f06d50af40b94b0671273dc1/raw/f9d4b5cd5944cc32d6b34cad0406d96fd3acaca6/partial_api.github.com.json',
		// 				{
		// 					overrides: [
		// 						{
		// 							// for all requests on *.github.com, we'll need to add a User-Agent.
		// 							matcher: ({ url, method }) => {
		// 								return url.hostname === 'api.github.com';
		// 							},
		// 							values: {
		// 								headers: {
		// 									'User-Agent':
		// 										'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
		// 								},
		// 							},
		// 						},
		// 					],
		// 				}
		// 			)),
		// 		],
		// 	},
		// 	{
		// 		// maxRecursiveToolRuns: 0,
		// 		// streamFinalResponse: true,
		// 		// strictValidation: true,
		// 		trimFunction: autoTrimTools,
		// 		verbose: true,
		// 	}
		// );

		// # 5 Test
		// const response = await runWithTools(
		// 	env.AI as unknown as import('@cloudflare/workers-types').Ai,
		// 	'@hf/nousresearch/hermes-2-pro-mistral-7b',
		// 	{
		// 		messages: [{ role: 'user', content: "What's the weather in Austin, Texas?" }],
		// 		tools: [
		// 			{
		// 				description: 'Return the weather for a latitude and longitude',
		// 				function: async ({ latitude, longitude }) => {
		// 					const url = `https://api.weatherapi.com/v1/current.json?key=${env.WEATHERAPI_TOKEN}&q=${latitude},${longitude}`;
		// 					const res = await fetch(url).then((res) => res.json());

		// 					return JSON.stringify(res);
		// 				},
		// 				name: 'getWeather',
		// 				parameters: {
		// 					properties: {
		// 						latitude: {
		// 							description: 'The latitude for the given location',
		// 							type: 'string',
		// 						},
		// 						longitude: {
		// 							description: 'The longitude for the given location',
		// 							type: 'string',
		// 						},
		// 					},
		// 					required: ['latitude', 'longitude'],
		// 					type: 'object',
		// 				},
		// 			},
		// 		],
		// 	},
		// 	{
		// 		maxRecursiveToolRuns: 5,
		// 		streamFinalResponse: true,
		// 		strictValidation: true,
		// 		trimFunction: autoTrimTools,
		// 		verbose: true,
		// 	}
		// );

		// # 6 Test
		const sum = (args: { a: number; b: number }): Promise<string> => {
			const { a, b } = args;
			return Promise.resolve((a + b).toString());
		};

		const response = await runWithTools(
			env.AI as unknown as import('@cloudflare/workers-types').Ai,
			'@hf/nousresearch/hermes-2-pro-mistral-7b',
			{
				messages: [
					{
						content: 'What the result of 123123123 + 10343030?',
						role: 'user',
					},
				],
				tools: [
					{
						description: 'Sum up two numbers and returns the result',
						function: sum,
						name: 'sum',
						parameters: {
							properties: {
								a: { type: 'number', description: 'the first number' },
								b: { type: 'number', description: 'the second number' },
							},
							required: ['a', 'b'],
							type: 'object',
						},
					},
				],
			}
		);

		return new Response(JSON.stringify(response));

		// https://raw.githubusercontent.com/github/rest-api-description/main/descriptions-next/api.github.com/api.github.com.json
	},
} satisfies ExportedHandler<Env>;
