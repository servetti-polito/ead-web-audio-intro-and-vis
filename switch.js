import fs from 'fs';
import process from 'process';
//import { exec as execCb } from "node:child_process";
//import { promisify } from "node:util";

//const exec = promisify(execCb);

const appPath = './src/App.jsx';
if(fs.existsSync(process.argv[2])) {
  if(fs.existsSync(appPath)) fs.rmSync(appPath);
  fs.symlinkSync(process.argv[2].split('/').slice(1).join('/'), appPath, 'file');
}

//const { error, stdout, stderr } = await exec("npm run dev");
  
