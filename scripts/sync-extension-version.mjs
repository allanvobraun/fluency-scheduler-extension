import { readFile, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

const packageJsonPath = new URL('../package.json', import.meta.url);
const manifestJsonPath = new URL('../public/manifest.json', import.meta.url);

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const manifestJson = JSON.parse(await readFile(manifestJsonPath, 'utf8'));

manifestJson.version = packageJson.version;

await writeFile(manifestJsonPath, `${JSON.stringify(manifestJson, null, 2)}\n`);

globalThis.console.log(`Synced extension manifest version to ${packageJson.version}`);
