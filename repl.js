import { Interpreter } from './interpreter.js';
import * as readline from 'readline';

const i = new Interpreter();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.stdout.write('> ');
for await (const line of rl) {
    console.log(i.eval(JSON.parse(line)));
    process.stdout.write('> ');
}
