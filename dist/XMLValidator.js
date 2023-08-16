"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLValidator = void 0;
/**
 * XMLValidator - A TypeScript class for XML validation against an XSD schema using xmllint command line tool.
 *
 * by Ivan Dario Diaz (https://github.com/idddev/)
 *
 * License: MIT
 */
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
class XMLValidator {
    /**
     * Constructor to initialize the validator.
     * @param {string | Buffer} xsdPath - Path to the XSD file or a Buffer containing the XSD content.
     * @param {string | Buffer} xmlPath - Path to the XML file or a Buffer containing the XML content.
     * @throws {Error} - Throws an error if xmllint is not installed.
     * @example
     * const validator = new XMLValidator('path/to/schema.xsd', 'path/to/xml.xml');
     * // Or using Buffers
     * const validator = new XMLValidator(Buffer.from('xsd content'), Buffer.from('xml content'));
     * // Validate XML asynchronously
     * validator.validate().then(result => console.log(result));
     * // Or ..
     * const result = await validator.validate();
     * // Validate XML synchronously
     * const result = validator.validateSync();
     */
    constructor(xsdPath, xmlPath) {
        this.checkXmlLintInstallation();
        this.xsdPath = xsdPath;
        this.xmlPath = xmlPath;
    }
    /**
     * Asynchronous validation method that returns a Promise with validation result.
     * @returns {Promise<true | ValidationError[]>} - Validation result.
     */
    validate() {
        return new Promise((resolve, reject) => {
            const { tempXsdPath, tempXmlPath } = this.getTempPaths();
            const command = `xmllint --noout --schema ${tempXsdPath} ${tempXmlPath}`;
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                this.cleanupTempFiles(tempXsdPath, tempXmlPath);
                resolve(this.parseValidationErrors(error, stderr));
            });
        });
    }
    /**
     * Synchronous validation method.
     * @returns {true | ValidationError[]} - Validation result.
     */
    validateSync() {
        const { tempXsdPath, tempXmlPath } = this.getTempPaths();
        const command = `xmllint --noout --schema ${tempXsdPath} ${tempXmlPath}`;
        try {
            (0, child_process_1.execSync)(command, { stdio: ['pipe', 'pipe', 'pipe'] });
            this.cleanupTempFiles(tempXsdPath, tempXmlPath);
            return true;
        }
        catch (error) {
            this.cleanupTempFiles(tempXsdPath, tempXmlPath);
            return this.parseValidationErrors(error);
        }
    }
    // Private method to parse validation errors
    parseValidationErrors(error, stderr) {
        let validationErrors = stderr || '';
        // Read stderr if exists
        if (error && error.stderr) {
            validationErrors = error.stderr.toString();
        }
        // Read error message if exists
        if (error && error.message) {
            validationErrors = error.message;
        }
        // Parse validation errors
        if (validationErrors.trim()) {
            const errors = validationErrors.trim().split('\n')
                .map(line => {
                const match = line.match(/(.*):(\d+): (.*)/);
                return {
                    file: match ? match[1] : '',
                    line: match ? parseInt(match[2], 10) : 0,
                    message: match ? match[3] : ''
                };
            })
                .filter(errorObj => errorObj.file && errorObj.message);
            return errors;
        }
        // Return true if no errors
        return true;
    }
    // Private method to get temporary file paths
    getTempPaths() {
        const tempXsdPath = this.xsdPath instanceof Buffer ? this.writeTempFile(this.xsdPath) : this.xsdPath;
        const tempXmlPath = this.xmlPath instanceof Buffer ? this.writeTempFile(this.xmlPath) : this.xmlPath;
        return { tempXsdPath, tempXmlPath };
    }
    // Private method to clean up temporary files
    cleanupTempFiles(tempXsdPath, tempXmlPath) {
        if (this.xsdPath instanceof Buffer)
            (0, fs_1.unlinkSync)(tempXsdPath);
        if (this.xmlPath instanceof Buffer)
            (0, fs_1.unlinkSync)(tempXmlPath);
    }
    // Private method to check if xmllint is installed
    checkXmlLintInstallation() {
        try {
            (0, child_process_1.execSync)('xmllint --version', { stdio: 'ignore' });
        }
        catch (error) {
            throw new Error('xmllint is not installed. Please install xmllint to use this library.');
        }
    }
    // Private method to write a Buffer to a temporary file and return the file path
    writeTempFile(buffer) {
        const tmpDir = os_1.default.tmpdir();
        const filePath = `${tmpDir}/${Date.now()}`;
        (0, fs_1.writeFileSync)(filePath, buffer);
        return filePath;
    }
}
exports.XMLValidator = XMLValidator;
