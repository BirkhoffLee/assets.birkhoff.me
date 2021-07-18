import { basename } from 'path'

await $`b2 authorize-account ${process.env.b2_keyid} ${process.env.b2_key}`

const req = await fetch(`https://api.github.com/repos/Fndroid/clash_for_windows_pkg/releases/latest`);
const response = await req.json();

const windowsRegex = new RegExp('^Clash\\.for\\.Windows\\.Setup\\.\\d+\\.\\d+\\.\\d+\\.exe$');
const windowsUrl = response.assets.filter(a => windowsRegex.test(a.name))[0].browser_download_url;
const windowsFilename = basename(windowsUrl)

const macosRegex = new RegExp('^Clash\\.for\\.Windows-\\d+\\.\\d+\\.\\d+\\.dmg');
const macosUrl = response.assets.filter(a => macosRegex.test(a.name))[0].browser_download_url;
const macosFilename = basename(macosUrl)

await Promise.all([
  $`wget -q --show-progress -O ${windowsFilename} ${windowsUrl}`,
  $`wget -q --show-progress -O ${macosFilename} ${macosUrl}`
])

await Promise.all([
  $`b2 upload-file assets-birkhoff-me ./${windowsFilename} clash.exe`,
  $`b2 upload-file assets-birkhoff-me ./${macosFilename} clash.dmg`
])

await $`b2 clear-account`