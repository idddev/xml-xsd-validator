#!/usr/bin/env node
/**
 * XMLValidator CLI - A Command-Line Interface for XML validation against an XSD schema using xmllint.
 * 
 * by Ivan Dario Diaz (https://github.com/idddev/)
 * 
 * License: MIT
 *
 * Usage: node cli.js <xsdPath> <xmlPath>
 */
const { XMLValidator } = require('./dist/XMLValidator');

class XMLValidatorCLI {
  constructor(xsdPath, xmlPath) {
    this.xsdPath = xsdPath
    this.xmlPath = xmlPath
  }

  validate() {
    console.log(`Validating XML: ${this.xmlPath}`);
    console.log(`Using XSD: ${this.xsdPath}`);
    
    const validator = new XMLValidator(this.xsdPath, this.xmlPath);

    (async () => {
      try {
        const result = await validator.validate();
        if (result === true) {
          console.log('XML is valid.');
        } else {
          console.log('XML validation errors:');
          this.drawErrorsTable(result);
        }
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
    })();
  }

  drawErrorsTable(errors) {
    const totalWidth = process.stdout.columns || 80;
    const fileWidth = 28;
    const lineWidth = 6;
    const padding = 4;
    const separatorWidth = 6;
    const messageWidth = totalWidth - (fileWidth + lineWidth + separatorWidth + padding);

    const lineSeparator = '-'.repeat(totalWidth - padding);
    const header = `| ${'File'.padEnd(fileWidth)} | ${'Line'.padEnd(lineWidth)} | ${'Message'.padEnd(messageWidth)} |`;

    console.log(lineSeparator);
    console.log(header);
    console.log(lineSeparator);

    errors.forEach((error) => {
      console.log(`| ${error.file.padEnd(fileWidth)} | ${error.line.toString().padEnd(lineWidth)} | ${error.message.padEnd(messageWidth)} |`);
    });

    console.log(lineSeparator);
  }
}

const xsdPath = process.argv[2];
const xmlPath = process.argv[3];

if (!xsdPath || !xmlPath) {
  console.error('Usage: node cli.js <xsdPath> <xmlPath>');
  process.exit(1);
}

const cli = new XMLValidatorCLI(xsdPath, xmlPath);
cli.validate();
