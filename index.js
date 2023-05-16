import { createReadStream, createWriteStream, mkdirSync, existsSync } from "fs";
import { createInterface } from "readline";
import events from "events";

import { parseFirebase, parseGA4, parseGAU } from "./src/logParser.js";

async function processLine(line, outputPath, options = {
  firebase: true,
  ga4: true,
  gau: true
}) {
  const streamOptions = { flags: 'a' };
  const { firebase, ga4, gau } = options;
  if (firebase) {
    const firebaseLogFile = `${outputPath}/firebaseLog.json`;
    const firebaseLogger = createWriteStream(firebaseLogFile, streamOptions);
    const firebaseFilter = "Passing event to registered event handler (FE)";
    if (line.includes(firebaseFilter)) firebaseLogger.write(JSON.stringify(parseFirebase(line)) + "\n");
  }

  if (gau) {
    const gaUniversalFile = `${outputPath}/universal.json`;
    const gauLogger = createWriteStream(gaUniversalFile, streamOptions);
    const gauFilter = "Hit delivery requested";
    if (line.includes(gauFilter)) gauLogger.write(JSON.stringify(parseGAU(line)) + "\n");
  }

  if (ga4) {
    const ga4File = `${outputPath}/ga4.json`;
    const ga4Logger = createWriteStream(ga4File, streamOptions);
    const ga4Filter = "Logging event: origin=app+gtm";
    if (line.includes(ga4Filter)) ga4Logger.write(JSON.stringify(parseGA4(line)) + "\n");
  }
}

export async function readLines(input_file, options = {
  firebase: true,
  ga4: true,
  gau: true
}) {
  try {

    const today = new Date().toISOString().slice(0, 10);

    const fileStream = createReadStream(input_file + ".txt");
    const folderPath = `outputs/${input_file}/${today}`;
    if (!existsSync(folderPath))
      mkdirSync(folderPath, { recursive: true })

    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => processLine(line, folderPath, options));


    await events.once(rl, "close");
  } catch (error) {
    console.error(error);
  }
}


readLines("teste_sil")