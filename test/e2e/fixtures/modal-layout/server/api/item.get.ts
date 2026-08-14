// a delayable endpoint so fetch-based pages get a deterministic timing window
export default defineEventHandler(async (event) => {
  const ms = Number(getQuery(event).ms ?? 0)
  await new Promise(resolve => setTimeout(resolve, ms))
  return { ok: true }
})
