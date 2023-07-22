"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const wordJson = jsonFetch('words.json');
const output = document.getElementById('output');
const errorOutput = document.getElementById('errorOutput');
let inputs = document.getElementsByTagName('input');
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = lowercase.toUpperCase();
const digits = '1234567890';
const symbols = '/=!@#$%&*()';
function jsonFetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        return response.json();
    });
}
function titlecaseStringArray(arrP) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield arrP.then(arr => {
            return arr.map(word => {
                const firstLetter = word.charAt(0).toUpperCase();
                const rest = word.slice(1).toLowerCase();
                return firstLetter + rest;
            });
        });
    });
}
function wordGenerate(result, length, words) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);
        yield words.then(val => {
            for (let i of randomValues) {
                result.push(val[i % val.length]);
            }
        });
        return result.join('-');
    });
}
function charGenerate(combinedSequence, length) {
    let result = "";
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let value of randomValues) {
        result += combinedSequence.charAt(value % combinedSequence.length);
    }
    return result;
}
function runPasswordGenerator(length = 10, wordsArg = false, uppercaseArg = false, digitsArg = false, symbolsArg = false) {
    while (errorOutput === null || errorOutput === void 0 ? void 0 : errorOutput.firstChild) {
        errorOutput.firstChild.remove();
    }
    let sequenceArray = [];
    let combinedSequence = '';
    let words = wordJson;
    if (digitsArg) {
        combinedSequence += digits;
        sequenceArray.push(charGenerate(digits, 2));
    }
    if (symbolsArg) {
        combinedSequence += symbols;
        sequenceArray.push(charGenerate(symbols, 2));
    }
    if (wordsArg) {
        if (length < 2) {
            let errLine = document.createElement('li');
            errLine.textContent = 'Minimum word length is 2!';
            errorOutput === null || errorOutput === void 0 ? void 0 : errorOutput.prepend(errLine);
            return;
        }
        if (length > 16) {
            let errLine = document.createElement('li');
            errLine.textContent = 'Max word length is 16!';
            errorOutput === null || errorOutput === void 0 ? void 0 : errorOutput.prepend(errLine);
            return;
        }
        if (uppercaseArg) {
            words = titlecaseStringArray(wordJson);
        }
        let li = document.createElement('li');
        wordGenerate(sequenceArray, length, words)
            .then(pw => { li.textContent = pw; });
        output === null || output === void 0 ? void 0 : output.prepend(li);
    }
    else {
        if (length > 64) {
            let errLine = document.createElement('li');
            errLine.innerText = 'Max character length is 64!';
            errorOutput === null || errorOutput === void 0 ? void 0 : errorOutput.prepend(errLine);
            return;
        }
        if (length < 6) {
            let errLine = document.createElement('li');
            errLine.innerText = 'Minimum character length is 6!';
            errorOutput === null || errorOutput === void 0 ? void 0 : errorOutput.prepend(errLine);
            return;
        }
        if (uppercaseArg) {
            combinedSequence += uppercase;
        }
        combinedSequence += lowercase;
        let li = document.createElement('li');
        li.textContent = charGenerate(combinedSequence, length);
        output === null || output === void 0 ? void 0 : output.prepend(li);
    }
}
