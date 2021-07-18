import { basename } from 'path'

export default async function () {
  const req = await fetch(`https://api.github.com/repos/Fndroid/clash_for_windows_pkg/releases/latest`);
  const response = await req.json();

  const windowsRegex = new RegExp('^Clash\\.for\\.Windows\\.Setup\\.\\d+\\.\\d+\\.\\d+\\.exe$');
  const windowsUrl = response.assets.filter(a => windowsRegex.test(a.name))[0].browser_download_url;
  const windowsFilename = basename(windowsUrl)

  const macosRegex = new RegExp('^Clash\\.for\\.Windows-\\d+\\.\\d+\\.\\d+\\.dmg$');
  const macosUrl = response.assets.filter(a => macosRegex.test(a.name))[0].browser_download_url;
  const macosFilename = basename(macosUrl)

  const sha256Url = response.assets.filter(a => a.name === 'sha256sum')[0].browser_download_url;
  const sha256Fetch = await fetch(sha256Url)
  const sha256sum = await sha256Fetch.text()
  
  return {
    windowsUrl,
    windowsFilename,
    macosUrl,
    macosFilename,
    sha256sum
  }
}
