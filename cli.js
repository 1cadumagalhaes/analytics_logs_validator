#! /usr/bin/env node
import { Command } from 'commander';

import { readLines } from './index.js';

const program = new Command();

program.name('validate_app')
  .description('CLI to parse analytics logs on a android app')
  .version('0.0.1');

program.command('run')
  .description('Validate a given app log')
  .argument('<file>', 'File name WITHOUT EXTENSION. Expecting to be .txt')
  .option('--ga4 <ga4>')
  .option('--gau <ga4>')
  .option('--firebase <ga4>')
  .action((file, ga4 = true, gau = true, firebase = true) => {
    readLines(file, { ga4, gau, firebase });
  });

program.parse();