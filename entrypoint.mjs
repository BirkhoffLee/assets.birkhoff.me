import { purgeCloudflareCache } from './cloudflare.mjs'
import hashFile from './util/hash.mjs'
import getClashRelease from './util/cfw.mjs'

await $`b2 authorize-account ${process.env.B2_KEYID} ${process.env.B2_KEY}`

const {
  windowsUrl,
  windowsFilename,
  macosUrl,
  macosFilename,
  sha256sum
} = await getClashRelease()

const expectedWindowsSha256Hash = sha256sum.match(/^exe: (.*?)$/m)[1]
const expectedMacosSha256Hash = sha256sum.match(/^dmg: (.*?)$/m)[1]

await Promise.all([
  (async () => {
    await $`wget -q -O ${windowsFilename} ${windowsUrl}`

    const sha256Hash = await hashFile(windowsFilename, "sha256")
    const sha1Hash = await hashFile(windowsFilename, "sha1")
    
    if (sha256Hash !== expectedWindowsSha256Hash)
      throw new Error(`sha256sum doesn't match for downloaded ${windowsFilename}`)

    await $`b2 upload-file --quiet --noProgress --sha1 ${sha1Hash} assets-birkhoff-me ./${windowsFilename} clash.exe`
    await purgeCloudflareCache(["https://assets.birkhoff.me/clash.exe"])
  })(),
  (async () => {
    await $`wget -q -O ${macosFilename} ${macosUrl}`

    const sha256Hash = await hashFile(macosFilename, "sha256")
    const sha1Hash = await hashFile(macosFilename, "sha1")

    if (sha256Hash !== expectedMacosSha256Hash)
      throw new Error(`sha256sum doesn't match for downloaded ${macosFilename}`)

    await $`b2 upload-file --quiet --noProgress --sha1 ${sha1Hash} assets-birkhoff-me ./${macosFilename} clash.dmg`
    await purgeCloudflareCache(["https://assets.birkhoff.me/clash.dmg"])
  })()
])

await $`b2 clear-account`
