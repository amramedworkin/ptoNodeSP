const xlsx = require('xlsx')

/**
* Read an excel book and convert a single sheet to a json object
*
* @param {String} excelFileName - workbook to read
* @param {String} sheetName - sheet to convert to json
* @return {Object} Json object containing sheet of data from workbook
*/
function excelToJson(excelFileName,sheetName) {
	// Read the excel workbook
	const book = xlsx.readFile(excelFileName)
	// Grab the sheet of interest
	const sheet = book.Sheets[sheetName]
	// Convert sheet to usable json.
	return xlsx.utils.sheet_to_json(sheet)
}
function getAllTables(inputs) {
	console.log('Get All Tables')
	var tables = {}
	inputs.forEach(input => { 
    // No file to read means put an empty table on the list
    if(typeof input.file === 'undefined') { 
      tables[input.attribute] = [] 
    } else{
      // Read the table from an excel spreadsheet
      tables[input.attribute] = excelToJson(input.file,input.sheet) 
      tables[input.attribute].forEach(row => {
        if (input.newfields) {
          input.newfields.forEach(newfield => { row[newfield] = null })
        }
        var key =
          ( row[input.column] ) 
            ? (row[input.column] || '').toUpperCase().replace('.USPTO.GOV','').trim()
            : '';
        if (input.specialConditioning) { 
          key = eval(input.specialConditioning) 
        }
        row._key = key
      })
    } // endif (no input file)
    console.log('    %s conditioned',input.file || input.attr)
	})
	return tables
}

module.exports.getAllTables = getAllTables
