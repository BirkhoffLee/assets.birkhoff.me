import { basename } from 'path'

await $`b2 authorize-account ${process.env.B2_KEYID} ${process.env.B2_KEY}`

const req = await fetch(`https://api.github.com/repos/Fndroid/clash_for_windows_pkg/releases/latest`);
const response = await req.json();

const windowsRegex = new RegExp('^Clash\\.for\\.Windows\\.Setup\\.\\d+\\.\\d+\\.\\d+\\.exe$');
const windowsUrl = response.assets.filter(a => windowsRegex.test(a.name))[0].browser_download_url;
const windowsFilename = basename(windowsUrl)

const macosRegex = new RegExp('^Clash\\.for\\.Windows-\\d+\\.\\d+\\.\\d+\\.dmg');
const macosUrl = response.assets.filter(a => macosRegex.test(a.name))[0].browser_download_url;
const macosFilename = basename(macosUrl)

await Promise.all([
  $`wget -q -O ${windowsFilename} ${windowsUrl} && b2 upload-file --quiet --noProgress assets-birkhoff-me ./${windowsFilename} clash.exe`,
  $`wget -q -O ${macosFilename} ${macosUrl} && b2 upload-file --quiet --noProgress assets-birkhoff-me ./${macosFilename} clash.dmg`
])

await $`b2 clear-account`
