const wordJson = jsonFetch('words.json');
const output = document.getElementById('output');
const errorOutput = document.getElementById('errorOutput');
let   inputs = document.getElementsByTagName('input');
const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
const uppercase: string = lowercase.toUpperCase();
const digits: string    = '1234567890';
const symbols: string   = '/=!@#$%&*()';

async function jsonFetch(url:string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

async function titlecaseStringArray(arrP: Promise<string[]>): Promise<string[]> {
    return await arrP.then(arr => {
        return arr.map(word => {
            const firstLetter = word.charAt(0).toUpperCase();
            const rest = word.slice(1).toLowerCase();
            return firstLetter + rest;
        });
    })
}

async function wordGenerate(result: string[], length: number,
                    words: Promise<string[]>): Promise<string> {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    await words.then(val => {
        for (let i of randomValues) {
            result.push(val[i % val.length]);
        }
    });
    return result.join('-');
}

function charGenerate(combinedSequence: string, length: number): string {
    let result: string = "";

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues); 

    for (let value of randomValues) {
        result += combinedSequence.charAt(value % combinedSequence.length);
    }
    return result;
} 

function runPasswordGenerator(length = 10, wordsArg = false, uppercaseArg = false,
                             digitsArg = false, symbolsArg = false): void {
    while(errorOutput?.firstChild){
        errorOutput.firstChild.remove();
    }
    let sequenceArray: string[] = []; 
    let combinedSequence: string = '';
    let words = wordJson;

    if (digitsArg)  { 
        combinedSequence += digits; 
        sequenceArray.push(charGenerate(digits,2));
    }
    if (symbolsArg) { 
        combinedSequence += symbols; 
        sequenceArray.push(charGenerate(symbols,2));
    }
    if (wordsArg)   {
        if (length < 2) { 
            let errLine = document.createElement('li');
            errLine.textContent = 'Minimum word length is 2!';
            errorOutput?.prepend(errLine);
            return;
        }
        if (length > 16) { 
            let errLine = document.createElement('li');
            errLine.textContent = 'Max word length is 16!';
            errorOutput?.prepend(errLine);
            return;
        }
        if (uppercaseArg) { words = titlecaseStringArray(wordJson) }

        let li = document.createElement('li');

        wordGenerate(sequenceArray, length, words)
            .then(pw => { li.textContent = pw;});
        output?.prepend(li);
    }
    else {
    if (length > 64) { 
        let errLine = document.createElement('li');
        errLine.innerText = 'Max character length is 64!';
        errorOutput?.prepend(errLine);
        return;
    }
    if (length < 6) { 
        let errLine = document.createElement('li');
        errLine.innerText = 'Minimum character length is 6!';
        errorOutput?.prepend(errLine);
        return;
    }
        if (uppercaseArg) { combinedSequence += uppercase; }
        combinedSequence += lowercase;

        let li = document.createElement('li');

        li.textContent = charGenerate(combinedSequence, length);
        output?.prepend(li);
    }
}
