function FindServersNSLookup(tables) {
  // var ComponentNameAry = []
  var CyberServerListAry = []
  // var ComponentName = ''
  // var i = 0
  var FoundServer = false
  // var iCyberServerList = 0
  // var FoundComponentGreen = 0
  // var GEARSRowCnt = 0
  // var CyberRowCnt = 0
  // var ComponentNameCyber = ''
  // var ComponentNamePML = ''
  // var ComponentNamePMLAry = []
  // var iPML = 0
  // var ConcatComponentNamePML = ''
  // var HeaderRow = 0
  // var GreenCnt = 0
  // var CommentValue = ''
  // var CommentValueIn = ''
  // var CyberServerNameChk = ''
  // var GEARSServerNameChk = ''
  // var ServerMatchCnt = 0
  // var SelectedGreenCnt  = 0
  // var ConcatenationFound = false
  // var CyberServerAllAry = []
  // var CyberComputerNameLong = ''
  var GEARSEnd = 0
  var CyberEnd = 0
  // var CyberGEARSServerCol = 'Server'
  // var CyberGEARSServerNSLookupCol = 'NSLookup'
  var CompareNSLookupServersComponentNameCol = 'Component'
  var CompareNSLookupServersGEARSNotFoundCntCol = 'NotFoundGEARS'
  var CompareNSLookupServersCyberCntCol = 'FoundCyber'
  var CompareNSLookupServersGEARSServersCol = 'GEARS Servers'
  var CompareNSLookupServersCyberServersCol = 'Cyber Servers'
  var CompareNSLookupServersReplaceEqualCol = 'Lifecycle'
  var CyberComponentServerCnt = 0
  var CyberComputerName = ''
  var CyberListfromCNSLookupSRowCnt = 0

  var FoundComponent = false

  // var ServerName = ''
  var ServerID = ''
  // var ServerRowCnt = 0
  var ServerEnd = 0

  // ServerMatchCnt = 0
  // GreenCnt = 0
  // SelectedGreenCnt = 0

  const GEARSComponentNameCol = 'ComponentLookup'
  // const GEARSSoftwareNameCol = 'ProductLookup'
  // const GEARSSoftwareIDCol = 'ProductLookup:EXTERNALID'
  const GEARSServerNameCol = 'Server'
  // const GEARSDatabaseCol = 'DatabaseInstance'
  const GEARSNSLookupCol = 'NSLOOKUP'

  const CyberComputerNameCol = 'Computer Name'
  // const CyberComponentNameManualCol = 'Component Manual'
  // const CyberComponentNameFromPMLCol = 'Component from PML'
  const CyberComponentNameCombinedCol = 'Final Combined'
  const CyberSoftwareNameCol = 'Software Name'
  // const CyberSoftwareIDCol = 'Software ID'
  // const CyberDatabaseCol = 'Database'        
  // const CyberGEARSServerCol = 'Server'
  // const CyberGEARSServerNSLookupCol = 'NSLookup'

  const CyberListfromCNSLookupSServersCyberServersCol = 'Server'
  const CyberListfromCNSLookupSServersCyberComponentNameCol = 'Component'
  //  const CyberListfromCNSLookupSServersCyberSoftwareCol = 'Software'
  //  const CyberListfromCNSLookupSServersCyberServerSoftwareCol = 'ServerSoftware'
  const CyberListfromCNSLookupSServersCyberServerIDCol = 'Server ID'
  const CyberListfromCNSLookupSServersCyberBigFixCol = 'BigFix (ECMO)6'
  const CyberListfromCNSLookupSServersCyberYesCol = 'Yes'

  const ServerNameCol = 'ServerName'
  const ServerIDCol = 'SRV-ID'

  var cyberTable = tables['ecmo'].sort(cyberRow => { return cyberRow[CyberComponentNameCombinedCol]})
  var serverTable = tables['server']
  var gearsTable = tables['gears'].sort(gearsRow => { return gearsRow[GEARSComponentNameCol] })
  var comparensTable = tables['comparens']
  var cyberlistTable = tables['cyberlist']
  

  //Find Last Row in worksheets
  var CompareNSLookupServersEnd = -1
  // var CyberListfromCNSLookupSEnd = -1
  CyberEnd = cyberTable.length
  GEARSEnd = gearsTable.length
  ServerEnd = serverTable.length

  // HeaderRow = 1
  // Delete old data
  tables['comparens'] = []
  tables['cyberlist'] = []
  tables['serversw'] = []

  //sort on component
  // Gears - Handled at instantion - Sorted on Component Acronym
  // Cyber - Handled at instantion - Sorted on Final Combined
    
  //---------GEARS
  CompareNSLookupServersRowCnt = 0
  for(var GEARSRowCnt = 0;
          GEARSRowCnt < gearsTable.length;
          GEARSRowCnt++) {
    var gearsRow = gearsTable[GEARSRowCnt]
      
    var GEARSComponentName = (gearsRow[GEARSComponentNameCol] || '').toUpperCase().trim()
    var GEARSComponentNameHold = GEARSComponentName
    var GEARSServerName = (gearsRow[GEARSServerNameCol] || '').toUpperCase().trim()
    var GEARSNSLookup = (gearsRow[GEARSNSLookupCol] || '').toUpperCase().trim()
    //GEARSLifecycle = (gearsRow[GEARSLifecycleCol] || '').toUpperCase().trim()
     
    var GEARSComponentServerCnt = 0
    var GEARSServerNameHold = ""
   
    while (GEARSComponentName == GEARSComponentNameHold) {
      if (GEARSNSLookup == "NOTFOUND") {
          GEARSServerNameHold = GEARSServerNameHold + ";" + GEARSServerName
          GEARSComponentServerCnt = GEARSComponentServerCnt + 1
      } // End If
      GEARSRowCnt = GEARSRowCnt + 1
      GEARSServerName = (gearsRow[GEARSServerNameCol] || '').toUpperCase().trim()
      GEARSComponentName = (gearsRow[GEARSComponentNameCol] || '').toUpperCase().trim()
      GEARSNSLookup = (gearsRow[GEARSNSLookupCol] || '').toUpperCase().trim()
      //GEARSLifecycle = (gearsRow[GEARSLifecycleCol] || '').toUpperCase().trim()
      
      if( GEARSRowCnt >= GEARSEnd) {
        GEARSComponentName = ""
      } // End If
    } // while Loop
   
    //Trim Leading";"
    comparensTable[CompareNSLookupServersRowCnt] = {}
    comparensRow = comparensTable[CompareNSLookupServersRowCnt]
    comparensRow[CompareNSLookupServersComponentNameCol] = GEARSComponentNameHold
    comparensRow[CompareNSLookupServersGEARSServersCol] = GEARSServerNameHold.substr(1)
    comparensRow[CompareNSLookupServersGEARSNotFoundCntCol] = GEARSComponentServerCnt - 1
    //(comparensRow[CompareNSLookupServersLifecycleCol).Value = GEARSLifecycle
        
    CompareNSLookupServersRowCnt = CompareNSLookupServersRowCnt + 1
  } // Next GEARSRowCnt
     
  //-------Cyber

  CompareNSLookupServersRowCnt = 0
  CyberListfromCNSLookupSRowCnt = 0
    
  for(var CyberRowCnt = 0;
          CyberRowCnt < cyberTable.length;
          CyberRowCnt++){
    var cyberRow = cyberTable[CyberRowCnt]
    var CyberComponentName = (cyberRow[CyberComponentNameCombinedCol] || '').toUpperCase().trim()
    var CyberComponentNameHold = CyberComponentName
    CyberComputerName = (cyberRow[CyberComputerNameCol] || '').toUpperCase().trim()
    var CyberSoftwareName = (cyberRow[CyberSoftwareNameCol] || '').toUpperCase().trim()
    CyberComponentServerCnt = 1
    CyberServerList = ""
      
    while (CyberComponentName == CyberComponentNameHold && CyberComponentName !=  "") {
      ServerID = ""
      for(var ServerRowCnt = 0;
              ServerRowCnt < ServerEnd;
              ServerRowCnt++) {
        var serverRow = serverTable[ServerRowCnt]
        var ServerName = (serverRow[ServerNameCol] || '').toUpperCase().trim()
        if( CyberComputerName == ServerName) {
            ServerID = (serverRow[ServerIDCol] || '').toUpperCase().trim()
        } // End If
      } // Next ServerRowCnt
          
      if (CyberSoftwareName == "") {
          CyberComponentServerCnt = CyberComponentServerCnt + 1
          CyberServerListAry = CyberServerList.split(";")

        //Look for delimited Component Names Only - Reduces error by separating name parts that are significant and insignificant
        FoundServer = false
        
        for(var iCyberServerList = 0;
                iCyberServerList < CyberServerListAry.length;
                iCyberServerList++) {
            if (CyberServerListAry[iCyberServerList] == CyberComputerName) {
                FoundServer = true
            } // End If
        } // Next iCyberServerList
          
        var cyberlistRow = cyberlistTable[CyberListfromCNSLookupSRowCnt]
        if (FoundServer == false) {
            var CyberServerList = CyberServerList + ";" + CyberComputerName
            cyberlistRow[CyberListfromCNSLookupSServersCyberServersCol] = CyberComputerName.toLowerCase()
            cyberlistRow[CyberListfromCNSLookupSServersCyberComponentNameCol] = CyberComponentName
            cyberlistRow[CyberListfromCNSLookupSServersCyberServerIDCol] = ServerID
            cyberlistRow[CyberListfromCNSLookupSServersCyberBigFixCol] = "BigFix (ECMO)"
            cyberlistRow[CyberListfromCNSLookupSServersCyberYesCol] = "Yes"
            CyberListfromCNSLookupSRowCnt = CyberListfromCNSLookupSRowCnt + 1
        } // End If
      } // End If
      
      CyberComputerName = (cyberRow[CyberComputerNameCol] || '').toUpperCase().trim()
      CyberComponentName = (cyberRow[CyberComponentNameCombinedCol] || '').toUpperCase().trim()
      CyberSoftwareName = (cyberRow[CyberSoftwareNameCol] || '').toUpperCase().trim()
      CyberRowCnt = CyberRowCnt + 1
      
      if (CyberRowCnt > CyberEnd) {
        CyberComponentName = ""
      } //End If
    } // while Loop
    
    //Trim Leading";"
    CyberServerList = CyberServerList.substr(1)
    FoundComponent = false

    for(var CompareNSLookupServersRowCnt = 0;
            CompareNSLookupServersRowCnt < comparensTable.length;
            CompareNSLookupServersRowCnt++) {
      var comparensRow = comparensTable[CompareNSLookupServersRowCnt]
      if (CyberComponentNameHold == (comparensRow[CompareNSLookupServersComponentNameCol] || '').toUpperCase().trim()) { 
        comparensRow[CompareNSLookupServersComponentNameCol] = CyberComponentNameHold
        comparensRow[CompareNSLookupServersCyberCntCol] = CyberComponentServerCnt - 1
        comparensRow[CompareNSLookupServersCyberServersCol] = CyberServerList
        
        if (CyberComponentServerCnt == (comparensRow[CompareNSLookupServersGEARSNotFoundCntCol] || '')) {
          comparensRow[CompareNSLookupServersReplaceEqualCol] = "All"
        } // End If
        FoundComponent = true
      } // End If
    } // Next CompareNSLookupServersRowCnt
    
    //CompareNSLookupServersRowCnt = CompareNSLookupServersRowCnt + 1
    if (FoundComponent == false) { 
      CompareNSLookupServersEnd = CompareNSLookupServersEnd + 1
      CompareNSLookupServersRowCnt = CompareNSLookupServersEnd
      
      comparensRow[CompareNSLookupServersComponentNameCol] = CyberComponentNameHold
      comparensRow[CompareNSLookupServersCyberCntCol] = CyberComponentServerCnt - 1
      comparensRow[CompareNSLookupServersCyberServersCol] = CyberServerList
      
      if (CyberComponentServerCnt == (comparensRow[CompareNSLookupServersGEARSNotFoundCntCol] || '')) { 
        comparensRow[CompareNSLookupServersReplaceEqualCol] = "All"
      } // End If
    } //End If
  } // Next CyberRowCnt
  //Worksheets("GEARS").Activate
} // End Sub

module.exports.FindServersNSLookup = FindServersNSLookup;
