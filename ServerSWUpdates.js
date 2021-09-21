function ServerSWUpdates(tables) {
	// var myrange = null
	var CyberServerName = ''
	var CyberComponentName = ''
	var CyberSoftwareName = ''
	var CyberSoftwareID = ''
	var CyberDB = ''
	// var ServerSWUpdatesName = ''
	// var ServerSWUpdatesComponentName = ''
	// var ServerSWUpdatesSoftwareName = ''
	// var ServerSWUpdatesSoftwareID = ''
	// var CyberRowCnt = 0
	// var ServerSWUpdatesRowCnt = 0

	var CyberServerNameCol
	var CyberComponentNameCol
	var CyberSoftwareNameCol
	var CyberSoftwareIDCol
	var CyberDBCol

	// var ServerSWUpdatesNameCol
	// // var ServerSWUpdatesComponentCol
	// var ServerSWUpdatesSoftwareNameCol
	// var ServerSWUpdatesSoftwareIDCol
	var SoftwareNameAry = []
	var SoftwareIDAry = []
	var DBAry = []
	var CyberServerGEARSAry = []
	var CyberServerGEARSNSLookupAry = []
	var iSoftwareName = 0
	// var GEARSComponentNameCol
	// var GEARSSoftwareIDCol
	// var GEARSServerCol
	// var GEARSNSLookupCol
	// var GEARSDatabaseCol
	// var GEARSServerSWUpdatesMarkedCol
	var ServerSWUpdatesServerSoftwareCol
	var ServerSWUpdatesBigFixCol
	var ServerSWUpdatesYesCol

	// var CyberEnd = 0
	// var ServerSWUpdates = 0
	var CyberServerGEARS = ''
	var CyberServerGEARSCol
	var CyberServerGEARSNSLookup = ''
	var CyberServerGEARSNSLookupCol
	var ServerSWUpdatesServerIDCol
	// var ServerRowCnt = 0
	// var ServerEnd = 0
	var ServerNameCol
	var ServerIDCol
	var ServerName = ''
	var ServerID = ''

	var cyberTable = tables['ecmo']
	var serverTable = tables['server']
	// var gearsTable = tables['gears']
	var serverswTable = []
	tables['serversw'] = serverswTable // Delete the table if one exists


	// Application.ScreenUpdating = False

	// GEARSComponentNameCol = 'ComponentLookup'
	// GEARSSoftwareIDCol = 'ProductLookup:EXTERNALID'
	// GEARSServerCol = 'Server'
	// GEARSDatabaseCol = 'DatabaseInstance'
	// GEARSNSLookupCol = 'NSLOOKUP'
	// GEARSServerSWUpdatesMarkedCol = 13

	CyberServerNameCol = 'Computer Name'
	CyberComponentNameCol = 'Final Combined'
	CyberSoftwareNameCol = 'Software Name'
	CyberSoftwareIDCol = 'Software ID'
	CyberDBCol = 'Database'
	CyberServerGEARSCol = 'Server'
	CyberServerGEARSNSLookupCol = 'NSLookup'

	var ServerSWUpdatesNameCol = 'CyberServer'
	var ServerSWUpdatesComponentNameCol = 'Component'
	var ServerSWUpdatesSoftwareNameCol = 'Software'
	ServerSWUpdatesServerSoftwareCol = 'ServerSoftware'
	ServerSWUpdatesServerIDCol = 'ServerID'
	ServerSWUpdatesBigFixCol = 'BigFix (ECMO)'
	ServerSWUpdatesYesCol = 'Yes'
	var ServerSWUpdatesSoftwareIDCol = 'SoftwareID'
	var ServerSWUpdatesDBCol = 'Database'
	var ServerSWUpdatesServerGEARSCol = 'GEARSEquivalent'
	var ServerSWUpdatesServerGEARSNSLookupCol = 'NSLookup'

	ServerNameCol = 'ServerName'
	ServerIDCol = 'SRV-ID'

	// CyberEnd = cyberTable.length
	var ServerSWUpdatesEnd = serverswTable.length
	// ServerEnd = serverTable.length

	// Performed at initialization above
	// for(var ServerSWUpdatesRowCnt = 0;
	// 		ServerSWUpdatesRowCnt < ServerSWUpdatesEnd;
	// 		ServerSWUpdatesRowCnt++ ) {
	// 	Worksheets("ServerSWUpdates").Range("A2").EntireRow.Delete
	// } // Next ServerSWUpdatesRowCnt
	ServerSWUpdatesEnd = serverswTable.length

	for(var CyberRowCnt = 0;
			CyberRowCnt < cyberTable.length;
			CyberRowCnt++) {
		var cyberRow = cyberTable[CyberRowCnt]
		CyberSoftwareName = (cyberRow[CyberSoftwareNameCol] || '').trim()
		SoftwareNameAry = CyberSoftwareName.split(";")
		
		if (CyberSoftwareName != "") {
			CyberServerName = (cyberRow[CyberServerNameCol] || '').toUpperCase().trim()
			CyberComponentName = (cyberRow[CyberComponentNameCol] || '').toUpperCase().trim()
			CyberSoftwareID = (cyberRow[CyberSoftwareIDCol] || '').toUpperCase().trim()
			CyberDB = (cyberRow[CyberDBCol] || '').toUpperCase().trim()
			CyberServerGEARS = (cyberRow[CyberServerGEARSCol] || '').toUpperCase().trim()
			CyberServerGEARSNSLookup = (cyberRow[CyberServerGEARSNSLookupCol] || '').toUpperCase().trim()

			ServerID = ""
			for(var ServerRowCnt = 0;
					ServerRowCnt < serverTable.length;
					ServerRowCnt++) {
				var serverRow = serverTable[ServerRowCnt]
				ServerName = (serverRow[ServerNameCol] || '').toUpperCase().trim()
				if (CyberServerName == ServerName ) {
					ServerID = (serverRow[ServerIDCol] || '').toUpperCase().trim()
				} // End If
			} // Next ServerRowCnt


			SoftwareIDAry = CyberSoftwareID.split(";")
			
			if (CyberDB == "" ) {
				CyberDB = ";"
			} // End If

			DBAry = CyberDB.split(";")
			CyberServerGEARSAry = CyberServerGEARS.split(";")
			CyberServerGEARSNSLookupAry = CyberServerGEARSNSLookup.split(";")
			
			// eslint-disable-next-line no-redeclare
			for(var iSoftwareName = 0;
					iSoftwareName < SoftwareNameAry.length;
					iSoftwareName++) {
				serverswTable[ServerSWUpdatesEnd] = {}
				var serverswRow = serverswTable[ServerSWUpdatesEnd]
				CyberServerName = (CyberServerName || '').toLowerCase()
				serverswRow[ServerSWUpdatesNameCol] = CyberServerName
				serverswRow[ServerSWUpdatesComponentNameCol] = CyberComponentName
				serverswRow[ServerSWUpdatesSoftwareNameCol] = SoftwareNameAry[iSoftwareName]
				serverswRow[ServerSWUpdatesServerSoftwareCol] = SoftwareNameAry[iSoftwareName] + " on " + CyberServerName
				serverswRow[ServerSWUpdatesServerIDCol] = ServerID
				serverswRow[ServerSWUpdatesBigFixCol] = "BigFix (ECMO)"
				serverswRow[ServerSWUpdatesYesCol] = "Yes"
				serverswRow[ServerSWUpdatesSoftwareIDCol] = SoftwareIDAry[iSoftwareName]
				serverswRow[ServerSWUpdatesDBCol] = DBAry[iSoftwareName]
				serverswRow[ServerSWUpdatesServerGEARSCol] = CyberServerGEARSAry[iSoftwareName]
				serverswRow[ServerSWUpdatesServerGEARSNSLookupCol] = CyberServerGEARSNSLookupAry[iSoftwareName]
				ServerSWUpdatesEnd = ServerSWUpdatesEnd + 1
			} // Next iSoftwareName
		} // End If
	} // Next CyberRowCnt

	// ResolveGEARSServersOneToOne(
	// 	ServerSWUpdatesNameCol, 
	// 	ServerSWUpdatesComponentNameCol, 
	// 	ServerSWUpdatesSoftwareIDCol, 
	// 	ServerSWUpdatesEnd, 
	// 	GEARSComponentNameCol, 
	// 	GEARSSoftwareIDCol, 
	// 	GEARSServerCol, 
	// 	GEARSNSLookupCol, 
	// 	GEARSServerSWUpdatesMarkedCol, 
	// 	ServerSWUpdatesServerGEARSCol,
	// 	tables
	// )

} // End Sub ServerSWUpdates

// function ResolveGEARSServersOneToOne(
// 	ServerSWUpdatesNameCol, 
// 	ServerSWUpdatesComponentNameCol, 
// 	ServerSWUpdatesSoftwareIDCol, 
// 	ServerSWUpdatesEnd, 
// 	GEARSComponentNameCol, 
// 	GEARSSoftwareIDCol, 
// 	GEARSServerCol, 
// 	GEARSNSLookupCol, 
// 	GEARSServerSWUpdatesMarkedCol, 
// 	ServerSWUpdatesServerGEARSCol,
// 	tables){
// 	//Find GEARS Components with equal servers to be replaced
 
//    var ServerSWUpdatesComponentName = ''
//    var ServerSWUpdatesSoftwareID = ''
//    var ServerSWUpdatesServerName = ''
//    var GEARSComponentName = ''
//    var GEARSSoftwareID = ''
//    var ServerSWUpdatesRowCnt = 0
//    var GEARSRowCnt = 0
//    var GEARSLastRow = 0
//    var FoundServerSWUpdatesServerName As Boolean
//    var iGEARSServerSWUpdatesMarked = 0
//    var GEARSServerSWUpdatesMarkedAry = []
//    var GEARSServerSWUpdatesMarked = ''
//    var FoundServerSWUpdatesServerGEARS As Boolean
//    var ServerSWUpdatesServerGEARS = ''
//    var iServerSWUpdatesServerGEARS = 0
//    var ServerSWUpdatesServerGEARSAry = []

// 	// All this code was commented out...deleted it

//    }// End Sub ResolveGEARSServersOneToOne


// function FindDatabaseServerChanges(
// 	ServerSWUpdatesComponentNameCol, 
// 	ServerSWUpdatesSoftwareIDCol, 
// 	ServerSWUpdatesEnd, 
// 	GEARSComponentNameCol, 
// 	GEARSDatabaseCol, 
// 	GEARSServerCol, 
// 	GEARSNSLookupCol, 
// 	GEARSServerSWUpdatesMarkedCol)
// // Find Database servers not on the network and find Cyber equivelant to replace them

//    var GEARSComponentName = ''
//    var GEARSDatabase = ''
//    var ServerSWUpdatesRowCnt = 0
//    var GEARSRowCnt = 0
//    var GEARSLastRow = 0
   
//    for(var GEARSRowCnt = 2 To ServerSWUpdates
//        GEASRComponentName = Worksheets("GEARS").Cells(GEARSRowCnt, GEARSComponentNameCol).Value
//        GEARSDatabase = Worksheets("GEARS").Cells(GEARSRowCnt, GEARSDatabaseCol).Value
//        GEARSServer = Worksheets("GEARS").Cells(GEARSRowCnt, GEARSServerCol).Value
//        GEARSNSLookup = Worksheets("GEARS").Cells(GEARSRowCnt, GEARSNSLookupCol).Value
       
//          If GEARSNSLookup = "Not Found" And GEARSDatabaseCol != "" Then
// // ****TODO:Loop through Cyber Worksheet to find new database server where GEARSComponentName = CyberComponentName and CyberComputer contains "DB-" or "-DB"
// // ****TODO:If found then add a line to ServerSWUpdates
// // ****TODO:Add GEARSServerSWUpdatesMarkedCol - fill with servername from ServerSWUpdates
//        End If
//    Next GEARSRowCnt
     
   
   
// End Sub


//function ReplaceGEARSSameSoftware()
// ****TODO: Loop through GEARS ignoring already marked
// ****TODO: If the component is NSLookup = "Not found" then
// ****TODO: If same software on all servers look for(var cyber for(var all servers to replace "Not Found" servers
// ****TODO: Add GEARSServerSWUpdatesMarkedCol - fill with servername from ServerSWUpdates
  
//End Sub



module.exports.ServerSWUpdates = ServerSWUpdates