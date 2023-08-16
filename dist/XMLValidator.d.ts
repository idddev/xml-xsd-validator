/// <reference types="node" />
type ValidationError = {
    file: string;
    line: number;
    message: string;
};
export declare class XMLValidator {
    xsdPath: string | Buffer;
    xmlPath: string | Buffer;
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
    constructor(xsdPath: string | Buffer, xmlPath: string | Buffer);
    /**
     * Asynchronous validation method that returns a Promise with validation result.
     * @returns {Promise<true | ValidationError[]>} - Validation result.
     */
    validate(): Promise<true | ValidationError[]>;
    /**
     * Synchronous validation method.
     * @returns {true | ValidationError[]} - Validation result.
     */
    validateSync(): true | ValidationError[];
    private parseValidationErrors;
    private getTempPaths;
    private cleanupTempFiles;
    private checkXmlLintInstallation;
    private writeTempFile;
}
export {};
