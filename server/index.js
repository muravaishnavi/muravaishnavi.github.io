import fs  from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import async from 'async';

const GetSongIndex = (fileNames) => {
  return new Promise((resolve, reject) => {
    async.map(fileNames, fs.readFile, (err, data) => {
      if (err) {
        console.error('Error reading file:');
        return reject(err);
      }
      const songIndex = data.map((song) => {
        const parsedJson = JSON.parse(song);
        return {
          id: parsedJson.id,
          title: parsedJson.title,
          genre: parsedJson.genre,
          album: parsedJson.album,
          composer: parsedJson.composer,
          tag: parsedJson.tag,
          }
      });
      resolve(songIndex);
    });
  });
}


// Usage example
const directoryPath = '../data';
const dirFiles = await readdir(directoryPath, {recursive: true, withFileTypes: true,encoding: 'utf8'}); 
// Exclude index.json and schema.json
const excludeFiles = ['index.json', 'schema.json'];
const fileNames = dirFiles.filter(file => file.name.endsWith('.json') && !excludeFiles.includes(file.name)).map(file => `${file.path}\\${file.name}`);


GetSongIndex(fileNames).then((songIndex) => {
  fs.writeFile('../data/index.json', JSON.stringify(songIndex), (err) => {
    if (err) {
      console.error('Error writing file:');
      console.error(err);
      return;
    }
    console.log('Finished writing file');
  });
}).catch((err) => {
  console.error(err);
});




