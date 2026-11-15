const fs = require('fs');
const zlib = require('zlib');

function mapPua(code) {
  const puaMap = {
    0xf700: 0x0e48, 0xf701: 0x0e49, 0xf702: 0x0e4a, 0xf703: 0x0e4b, 0xf704: 0x0e4c,
    0xf705: 0x0e48, 0xf706: 0x0e49, 0xf707: 0x0e4a, 0xf708: 0x0e4b, 0xf709: 0x0e4c,
    0xf70a: 0x0e48, 0xf70b: 0x0e49, 0xf70c: 0x0e4a, 0xf70d: 0x0e4b, 0xf70e: 0x0e4c,
    0xf710: 0x0e31, 0xf711: 0x0e34, 0xf712: 0x0e35, 0xf713: 0x0e36, 0xf714: 0x0e37,
    0xf718: 0x0e48, 0xf719: 0x0e49, 0xf71a: 0x0e4a
  };
  return puaMap[code] || code;
}

function parseCMap(cmapStr) {
  const map = new Map();
  // beginbfchar
  const bfcharBlockRegex = /\d+\s+beginbfchar([\s\S]*?)endbfchar/g;
  let bfm;
  while ((bfm = bfcharBlockRegex.exec(cmapStr)) !== null) {
    const pairRegex = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g;
    let pm;
    while ((pm = pairRegex.exec(bfm[1])) !== null) {
      const src = parseInt(pm[1], 16);
      let dstStr = '';
      const hex = pm[2];
      for (let j = 0; j < hex.length; j += 4) {
        let code = parseInt(hex.substr(j, 4), 16);
        code = mapPua(code);
        dstStr += String.fromCharCode(code);
      }
      map.set(src, dstStr);
    }
  }

  // beginbfrange
  const bfrangeBlockRegex = /\d+\s+beginbfrange([\s\S]*?)endbfrange/g;
  let brm;
  while ((brm = bfrangeBlockRegex.exec(cmapStr)) !== null) {
    const rangeDirectRegex = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g;
    let rm;
    while ((rm = rangeDirectRegex.exec(brm[1])) !== null) {
      const start = parseInt(rm[1], 16);
      const end = parseInt(rm[2], 16);
      const dstBase = parseInt(rm[3], 16);
      for (let c = start; c <= end; c++) {
        let code = dstBase + (c - start);
        code = mapPua(code);
        map.set(c, String.fromCharCode(code));
      }
    }

    const rangeArrayRegex = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*\[(.*?)\]/gs;
    let am;
    while ((am = rangeArrayRegex.exec(brm[1])) !== null) {
      const start = parseInt(am[1], 16);
      const end = parseInt(am[2], 16);
      const hexList = am[3].match(/<([0-9a-fA-F]+)>/g) || [];
      for (let c = start; c <= end; c++) {
        const idx = c - start;
        if (idx < hexList.length) {
          const h = hexList[idx].replace(/[<>]/g, '');
          let code = parseInt(h, 16);
          code = mapPua(code);
          map.set(c, String.fromCharCode(code));
        }
      }
    }
  }

  return map;
}

function parsePdfStringBytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
      if (i >= str.length) break;
      const ch = str[i];
      if (ch >= '0' && ch <= '7') {
        let oct = ch;
        if (i + 1 < str.length && str[i+1] >= '0' && str[i+1] <= '7') {
          oct += str[++i];
          if (i + 1 < str.length && str[i+1] >= '0' && str[i+1] <= '7') {
            oct += str[++i];
          }
        }
        bytes.push(parseInt(oct, 8));
      } else if (ch === 'n') bytes.push(0x0a);
      else if (ch === 'r') bytes.push(0x0d);
      else if (ch === 't') bytes.push(0x09);
      else if (ch === 'b') bytes.push(0x08);
      else if (ch === 'f') bytes.push(0x0c);
      else if (ch === '(') bytes.push(0x28);
      else if (ch === ')') bytes.push(0x29);
      else if (ch === '\\') bytes.push(0x5c);
      else bytes.push(ch.charCodeAt(0));
    } else {
      bytes.push(str.charCodeAt(i));
    }
  }
  return bytes;
}

function extractPdf(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const latin = buf.toString('latin1');

  // 1. Locate all objects
  const objMap = new Map(); // objId -> decompressed or raw stream/dict
  const objStreamMap = new Map(); // objId -> decompressed stream Buffer or string

  const objRegex = /(\d+)\s+0\s+obj([\s\S]*?)endobj/g;
  let om;
  while ((om = objRegex.exec(latin)) !== null) {
    const id = parseInt(om[1]);
    const body = om[2];
    objMap.set(id, body);

    const streamIdx = om.index + om[0].indexOf('stream');
    if (body.includes('stream')) {
      // get actual stream from buffer
      const sStart = buf.indexOf('stream', om.index);
      if (sStart !== -1 && sStart < om.index + om[0].length) {
        let cStart = sStart + 6;
        if (buf[cStart] === 0x0d && buf[cStart + 1] === 0x0a) cStart += 2;
        else if (buf[cStart] === 0x0a || buf[cStart] === 0x0d) cStart += 1;
        const sEnd = buf.indexOf('endstream', cStart);
        if (sEnd !== -1) {
          const raw = buf.subarray(cStart, sEnd);
          try {
            const dec = zlib.inflateSync(raw);
            objStreamMap.set(id, dec.toString('latin1'));
          } catch(e) {
            objStreamMap.set(id, raw.toString('latin1'));
          }
        }
      }
    }
  }

  // 2. Locate all font objects & CMaps
  const fontObjMap = new Map(); // fontObjId -> CMap
  for (const [id, body] of objMap.entries()) {
    if (body.includes('/Type /Font') || body.includes('/Type/Font')) {
      const toUniMatch = body.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
      if (toUniMatch) {
        const cmapObjId = parseInt(toUniMatch[1]);
        const cmapStr = objStreamMap.get(cmapObjId);
        if (cmapStr) {
          fontObjMap.set(id, parseCMap(cmapStr));
        }
      }
    }
  }

  // 3. Find font mappings in resources: /Font << /TT1 6 0 R ... >>
  const fontNameMap = new Map(); // '/TT2' -> CMap
  const fontDictRegex = /\/Font\s*<<([\s\S]*?)>>/g;
  let fdm;
  while ((fdm = fontDictRegex.exec(latin)) !== null) {
    const inner = fdm[1];
    const pairRegex = /(\/\w+)\s+(\d+)\s+0\s+R/g;
    let pm;
    while ((pm = pairRegex.exec(inner)) !== null) {
      const fontName = pm[1];
      const fontObjId = parseInt(pm[2]);
      if (fontObjMap.has(fontObjId)) {
        fontNameMap.set(fontName, fontObjMap.get(fontObjId));
      }
    }
  }

  // 4. Now parse page content streams
  // Find all /Contents (either single ref or array of refs)
  const contents = [];
  const contentsRegex = /\/Contents\s+(?:(\d+)\s+0\s+R|\[([\s\S]*?)\])/g;
  let cm;
  while ((cm = contentsRegex.exec(latin)) !== null) {
    if (cm[1]) {
      contents.push(parseInt(cm[1]));
    } else if (cm[2]) {
      const refs = cm[2].match(/(\d+)\s+0\s+R/g) || [];
      for (const r of refs) {
        contents.push(parseInt(r));
      }
    }
  }

  // If no explicit /Contents found, look at all non-cmap streams with BT
  let streamsToProcess = [];
  if (contents.length > 0) {
    for (const cId of contents) {
      if (objStreamMap.has(cId)) {
        streamsToProcess.push(objStreamMap.get(cId));
      }
    }
  } else {
    for (const [id, str] of objStreamMap.entries()) {
      if (str.includes('BT') && !str.includes('begincmap')) {
        streamsToProcess.push(str);
      }
    }
  }

  const lines = [];

  for (const streamText of streamsToProcess) {
    const btRegex = /BT([\s\S]*?)ET/g;
    let btm;
    while ((btm = btRegex.exec(streamText)) !== null) {
      const block = btm[1];
      let currentCMap = null;
      let textLine = '';

      // Tokenize the block into commands
      // commands: /FontName size Tf, strings: (string) Tj or [ ... ] TJ
      const cmdRegex = /(\/\w+)\s+([\d.]+)\s+Tf|(\((?:\\.|[^()])*\)|<[0-9a-fA-F]+>)\s*Tj|\[([\s\S]*?)\]\s*TJ/g;
      let cmdm;
      while ((cmdm = cmdRegex.exec(block)) !== null) {
        if (cmdm[1]) {
          // Font change: e.g. /TT2
          const fn = cmdm[1];
          currentCMap = fontNameMap.get(fn) || null;
        } else if (cmdm[3]) {
          // Tj
          const op = cmdm[3];
          if (op.startsWith('(')) {
            const bytes = parsePdfStringBytes(op.slice(1, -1));
            for (const b of bytes) {
              if (currentCMap && currentCMap.has(b)) {
                textLine += currentCMap.get(b);
              } else {
                textLine += String.fromCharCode(b);
              }
            }
          } else if (op.startsWith('<')) {
            const hex = op.slice(1, -1);
            for (let i = 0; i < hex.length; i += 2) {
              const b = parseInt(hex.substr(i, 2), 16);
              if (currentCMap && currentCMap.has(b)) {
                textLine += currentCMap.get(b);
              } else {
                textLine += String.fromCharCode(b);
              }
            }
          }
        } else if (cmdm[4]) {
          // TJ
          const inner = cmdm[4];
          const tokenRegex = /(?:\((?:\\.|[^()])*\)|<[0-9a-fA-F]+>|[-+]?[0-9.]+)/g;
          let tok;
          while ((tok = tokenRegex.exec(inner)) !== null) {
            const t = tok[0].trim();
            if (t.startsWith('(')) {
              const bytes = parsePdfStringBytes(t.slice(1, -1));
              for (const b of bytes) {
                if (currentCMap && currentCMap.has(b)) {
                  textLine += currentCMap.get(b);
                } else {
                  textLine += String.fromCharCode(b);
                }
              }
            } else if (t.startsWith('<')) {
              const hex = t.slice(1, -1);
              for (let i = 0; i < hex.length; i += 2) {
                const b = parseInt(hex.substr(i, 2), 16);
                if (currentCMap && currentCMap.has(b)) {
                  textLine += currentCMap.get(b);
                } else {
                  textLine += String.fromCharCode(b);
                }
              }
            } else {
              const num = parseFloat(t);
              if (num < -150) textLine += ' ';
            }
          }
        }
      }

      if (textLine.trim()) {
        lines.push(textLine.trim());
      }
    }
  }

  return lines.join('\n');
}

const file = process.argv[2] || 'docs_private/10 เทพกับอาชีพ.pdf';
console.log('Extracting:', file);
const out = extractPdf(file);
console.log('Total characters:', out.length);
console.log('\n--- FULL EXTRACTED TEXT ---');
console.log(out);
