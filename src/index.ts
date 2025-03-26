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

export interface Env {
	// If you set another name in the Wrangler config file as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: Ai;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				prompt: 'What is the origin of the phrase Hello, World',
				stream: true,
			});

			return new Response(JSON.stringify(response), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
				},
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return new Response(`Error processing your request: ${errorMessage}`, {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	},
} satisfies ExportedHandler<Env>;
