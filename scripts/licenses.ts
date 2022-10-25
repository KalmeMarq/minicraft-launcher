import * as path from 'https://deno.land/std@0.160.0/path/mod.ts';

interface License {
  id: string;
  name: string;
  version: string;
  author?: string;
  homepage?: string;
  license: string;
  licenseText?: string;
}

let cacheRndStr: string[] = [];

async function existsFile(path: string) {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch (e) {
    return false;
  }
}

function generateRandomStr(length = 20) {
  const gen = () => {
    const arr = new Uint8Array((length || 40) / 2);
    window.crypto.getRandomValues(arr);
    const dec2hex = (dec: number) => dec.toString(16).padStart(2, '0');
    return Array.from(arr, dec2hex).join('');
  };

  let res = gen();
  while (cacheRndStr.includes(res)) res = gen();
  return res;
}

const npmLicensesJson = await (async () => {
  const process = Deno.run({
    stdout: 'piped',
    cmd: [...(Deno.build.os === 'windows' ? ['cmd', '/c'] : []), 'npx', 'license-checker', '--json', '--production', '--excludePrivatePackages']
  });

  const [, stdout] = await Promise.all([process.status(), process.output()]);
  const json = JSON.parse(new TextDecoder().decode(stdout));

  process.close();

  return json;
})();

Deno.chdir(path.resolve('.', 'src-tauri'));

const cargoLicensesJson = await (async () => {
  const process = Deno.run({
    stdout: 'piped',
    cmd: ['cargo', 'license', '--avoid-dev-deps', '--direct-deps-only', '--json']
  });

  const [, stdout] = await Promise.all([process.status(), process.output()]);
  const json = JSON.parse(new TextDecoder().decode(stdout));

  process.close();

  return json;
})();

Deno.chdir(path.resolve('..'));

const licenses: License[] = [];

for (const lic of cargoLicensesJson) {
  const name = lic.name;
  const version = lic.version;
  const author = (() => {
    let txt: string | undefined = lic.author;

    if (txt !== undefined) {
      if (txt.indexOf('<') >= 0 && txt.indexOf('@') >= 0) {
        txt = txt.substring(0, txt.indexOf('<'));
      }
    }

    return txt;
  })();
  const homepage: string | undefined = lic.repository;
  const license = lic.license;

  console.log(`%c${name} %c${version} %c${author} %c${homepage} %c${license}`, 'color: red;', 'color: blue;', 'color: magenta;', 'color: green;', 'color: orange;');

  let licenseText: undefined | string;

  if (homepage !== undefined && version !== '0.0.0' && name !== 'minicraft-launcher') {
    try {
      const licUrl = homepage.replace('https://github.com/', 'https://api.github.com/repos/') + '/contents';

      const data = await (await fetch(licUrl)).json();
      licenseText = await (await fetch(data.find((f: any) => (f.name as string).startsWith('LICENSE')).download_url)).text();
      licenseText = licenseText.trim();
    } catch (e) {}
  }

  if (version !== '0.0.0' && name !== 'minicraft-launcher') {
    licenses.push({
      id: generateRandomStr(22),
      name,
      version,
      author,
      homepage,
      license,
      licenseText
    });
  }
}

for (const [licname, data] of Object.entries<any>(npmLicensesJson)) {
  const name = licname.substring(0, licname.lastIndexOf('@'));
  const version = licname.substring(licname.lastIndexOf('@') + 1);
  const author = data.publisher;
  const homepage = data.repository;
  const license = data.licenses;
  let licenseText: string | undefined;

  console.log(`%c${name} %c${version} %c${author} %c${homepage} %c${license}`, 'color: red;', 'color: blue;', 'color: magenta;', 'color: green;', 'color: orange;');

  if (await existsFile(data.licenseFile)) {
    licenseText = (await Deno.readTextFile(data.licenseFile)).trim();
  }

  licenses.push({
    id: generateRandomStr(22),
    name,
    version,
    author,
    homepage,
    license,
    licenseText
  });
}

await Deno.writeTextFile('src/assets/licenses.json', JSON.stringify(licenses));
