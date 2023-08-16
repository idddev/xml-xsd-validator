# XML Validator

XML Validator is a small TypeScript wrapper around `xmllint` that allows for easy XML validation against XSD schemas. It handles paths to XML and XSD files, as well as Buffers containing the content of these files. If `xmllint` is not installed, an error will be thrown.

## Installation

Since this library depends on `xmllint`, ensure that it is installed on your system. You can usually install it through your system's package manager. For example, on Ubuntu:

```bash
sudo apt-get install libxml2-utils
```

Clone the repository or include it in your project as a module.

## Usage

### As a Library

Here's a simple example of how to use the XML Validator:

```typescript
import { XMLValidator } from './path/to/XMLValidator';

const xsdPath = './path/to/your.xsd';
const xmlPath = './path/to/your.xml';

const validator = new XMLValidator(xsdPath, xmlPath);
validator.validate()
  .then(result => {
    if (result === true) {
      console.log("XML document is valid");
    } else {
      console.log("XML document is invalid");
      console.log(result); // Array of validation errors
    }
  });
```

You can also pass `Buffer` objects for the XSD and XML content.

### As a Command-Line Interface (CLI)

You can use the XML Validator as a CLI tool by running the following command:

```bash
node cli.js <xsdPath> <xmlPath>
```

Ensure that the `cli.js` file is executable, and provide the paths to the XSD and XML files you want to validate. The tool will print the validation results, including a table of errors if the XML is not valid.

## Author

Ivan Dario Diaz ([@idddev](https://github.com/idddev))

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.