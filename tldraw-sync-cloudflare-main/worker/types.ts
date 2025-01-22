// the contents of the environment should mostly be determined by wrangler.toml. These entries match
// the bindings defined there.
export interface Environment {
	TLDRAW_BUCKET: R2Bucket
	TLDRAW_DURABLE_OBJECT: DurableObjectNamespace
	MY_RATE_LIMITER: RateLimit
	MY_SECRET: string
	OPENAI_API_KEY: string
}
