import { Interpreter } from './interpreter.js';
import * as fs from 'fs';

fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        console.log("Invalid File")
    } else {
        const code = JSON.parse(data);
        const interpreter = new Interpreter();
        interpreter.eval(code);
    }
});
