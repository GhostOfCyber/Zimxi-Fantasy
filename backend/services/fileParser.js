const { parse } = require('csv-parse/sync');

/**
 * Parses raw data into an array of objects
 * @param {string|Buffer} input - The raw file data or JSON string
 * @param {string} type - 'json' or 'csv'
 * @returns {Array} - Array of data objects
 */
const parseData = (input, type = 'json') => {
  try {
    // If input is a Buffer, convert to string
    const dataString = Buffer.isBuffer(input) ? input.toString('utf8') : input;

    if (type === 'json') {
      const parsed = JSON.parse(dataString);
      // Ensure we always return an array
      return Array.isArray(parsed) ? parsed : [parsed];
    } 
    
    if (type === 'csv') {
      return parse(dataString, {
        columns: true,        // Treat first row as headers
        skip_empty_lines: true,
        trim: true,
        cast: true            // Auto-convert numbers/booleans
      });
    }

    throw new Error(`Unsupported file type: ${type}`);
  } catch (error) {
    console.error('File Parser Error:', error.message);
    throw new Error('Failed to parse data');
  }
};

module.exports = { parseData };