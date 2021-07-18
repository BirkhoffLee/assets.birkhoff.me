export async function purgeCloudflareCache (files) {
  const req = await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CF_API_TOKEN}`
    },
    body: JSON.stringify({ files }),
  })

  const resp = await req.json()

  if (!resp.success) {
    throw new Error(JSON.stringify(resp))
  }
}
