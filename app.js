const fs = require('fs');
const cheerio = require('cheerio');

const log = `./storage/log.html`;
// Read the HTML file
const htmlContent = fs.readFileSync(log, 'utf-8');

// Function to parse HTML and extract table data
function parseHtml(html) {
  const $ = cheerio.load(html);
  const result = [];

  // Find the div with class "image-container"
  $('.image-container').each((containerIndex, containerElement) => {
    const imgSrc = $(containerElement).find('img').attr('src');

    // Initialize variable to store metadata and tables inside the container
    let metadata;

    // Find the table with class "metadata"
    const metadataTable = $(containerElement).find('table.metadata');
    if (metadataTable.length) {
      // Extract data from the metadata table
      const metadataTableData = {};

      metadataTable.find('tr').each((rowIndex, rowElement) => {
        const label = $(rowElement).find('td.label').text().trim();
        const value = $(rowElement).find('td.value').text().trim();

        // Create an associative array without explicit quoting
        metadataTableData[label] = value;
      });

      metadata = metadataTableData;
    }

    // Push metadata and other tables inside the container as one entry
    result.push({
      [imgSrc]: metadata,
    });
  });

  return result;
}

// Parse HTML and convert to JSON
const jsonData = parseHtml(htmlContent);

// Create a timestamp for the filename
const timestamp = Date.now();

// Define the file path
const filePath = `./storage/${timestamp}.json`;

// Write JSON data to the file
fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

console.log(`JSON data written to ${filePath}`);
