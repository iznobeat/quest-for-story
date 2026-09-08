import {mkdir,copyFile,rm,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files=['index.html','style.css','game.js','story.js','characters.js','music.js','assets/castle-atlas.png','assets/characters.png'];
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
const manifest={revision:process.env.GITHUB_SHA||'local',files:{}};
for(const file of files){await copyFile(file,`dist/${file}`);manifest.files[file]=createHash('sha256').update(await readFile(file)).digest('hex')}
await writeFile('dist/build.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Built ${files.length} public files into dist/`);
