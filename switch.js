import fs from 'fs';
import process from 'process';
//import { exec as execCb } from "node:child_process";
//import { promisify } from "node:util";

//const exec = promisify(execCb);

if(fs.existsSync(process.argv[2])) {
  fs.rmSync('./src/App.jsx');
  fs.symlinkSync(process.argv[2].split('/').slice(1).join('/'), './src/App.jsx', 'file');
}

//const { error, stdout, stderr } = await exec("npm run dev");
  
