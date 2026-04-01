#!/usr/bin/env node

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter your question: ', (question) => {
  const timestamp = new Date().toISOString();
  console.log(`Your question: ${question} - Timestamp: ${timestamp}`);
  rl.close();
});
