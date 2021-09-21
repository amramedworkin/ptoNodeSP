function  FindComponentinPML(tables)
{  // fuzzy logic to find component to server association
  // does delimited server name to component exact match
  // does server pattern match using archserversoftware and archdatabase
  var ComponentNameAry = []
  // var ComponentName = ''
  // var i = 0
  var FoundComponentGreen = 0
  var PMLRowCnt = 0
  // var CyberRowCnt = 0
  var ComponentNameCyber = ''
  var ComponentNamePML = ''
  var ComponentNamePMLStart = ''
  var ComponentNamePMLAry = []
  // var ComponentNamePMLAry = []
  // var iPML = 0
  // var ConcatComponentNamePML = ''
  // var GreenCnt = 0
  // var CommentValue = ''
  // var CommentValueIn = ''
  // var CyberServerNameChk = ''
  // var GEARSServerNameChk = ''
  var ServerMatchCnt = 0
  var SelectedGreenCnt  = 0
  // var ConcatenationFound = false
  // var CyberServerAllAry = []
  var PMLComponentNameMatchAllAry = new Array(800).fill('')
  var PMLComponentNameAllAry = new Array(800).fill('')
  var PMLComponentNameAllCnt = 0
  var CyberComputerNameLong = ''

  ServerMatchCnt = 0
  // GreenCnt = 0
  SelectedGreenCnt = 0

  // PML Table column names
  var PMLComponentNameCol = 'ComponentAcronym'
  
  // Gears Table column names
  var GEARSSoftwareNameCol = 'ProductLookup'
  var GEARSSoftwareIDCol = 'ProductLookup:EXTERNALID'
  var GEARSDatabaseCol = 'DatabaseInstance'
  
  // Cyber/Ecmo Table column names
  var CyberComputerNameCol = 'Computer Name'
  var CyberSDAPComponentCol = 'SDAP EXACT MATCH'
  var CyberComponentNameManualCol = 'Component Manual'
  var CyberComponentNameFromPMLCol = 'Component from PML'
  var CyberComponentNameFromGEARSCol = 'Component from GEARS'
  var CyberComponentServerFuzzyLogicMatchCol = 'LOGIC Match'
  var CyberDiamondComponentCol = 'Diamond lookup'
  var CyberComponentNameCombinedCol = 'Final Combined'
  var CyberSoftwareNameCol = 'Software Name'
  var CyberSoftwareIDCol = 'Software ID'
  var CyberDatabaseCol = 'Database'
  var CyberGEARSServerCol = 'Server'
  var CyberGEARSServerNSLookupCol = 'NSLookup'

  var cyberTable = tables['ecmo']
  var pmlTable = tables['pml']
  // var gearsTable = tables['gears']

  // Find Last Row in worksheets
  var CyberEnd = cyberTable.length
  // var PMLEnd = pmlTable.length
  // var HeaderRow = -1

  //  Delete old data
  cyberTable.forEach(cyberRow => {
    cyberRow[CyberComponentNameFromPMLCol] = ''
    cyberRow[CyberComponentNameFromGEARSCol] = ''
    cyberRow[CyberComponentServerFuzzyLogicMatchCol] = ''
    cyberRow[CyberSoftwareNameCol] = ''
    cyberRow[CyberSoftwareIDCol] = ''
    cyberRow[CyberDatabaseCol] = ''
    cyberRow[CyberGEARSServerCol] = ''
    cyberRow[CyberGEARSServerNSLookupCol] = ''
  })

  //  Creating a Array of PML
  pmlTable.forEach(pmlRow => {
    ComponentNamePMLStart = (pmlRow[PMLComponentNameCol] || '').toUpperCase().trim()
    ComponentNamePML = ComponentNamePMLStart.replace(' ','-')
    ComponentNamePMLAry = ComponentNamePML.split('-')
    // Look for delimited Component Names Only - 
    // Reduces error by separating name parts that are significant and insignificant
    for(var iPML = 0;
            iPML < ComponentNamePMLAry.length;
            iPML++) {
      ComponentNamePML = ComponentNamePMLAry[iPML]
      
      if(	ComponentNamePML.length > 1 && 
        !['WEB','SERVICE','INFRA','DB','APP','USPTO','MGMT'].includes(ComponentNamePML) ) {
        PMLComponentNameMatchAllAry[PMLComponentNameAllCnt] = ComponentNamePML
        PMLComponentNameAllAry[PMLComponentNameAllCnt] = ComponentNamePMLStart
      
        if( ComponentNamePMLStart.indexOf('-') > -1 || ComponentNamePMLStart.indexOf(' ') > -1) {
          for(var i = 0;
                  i < PMLComponentNameMatchAllAry.length;
                  i++) {
            if (ComponentNamePML == PMLComponentNameMatchAllAry[i] && ComponentNamePMLStart != PMLComponentNameAllAry[i] ) {
              PMLComponentNameMatchAllAry[PMLComponentNameAllCnt] = ComponentNamePMLStart
              PMLComponentNameMatchAllAry[PMLComponentNameAllCnt] = ComponentNamePMLStart.replace(' ','-')
            } // End if
          } // Next i
        } // End if
        PMLComponentNameAllCnt = PMLComponentNameAllCnt + 1
      } // End if
    } // Next iPML
  })


  // Loop through Orginal ECMO/Cyber worksheet with added columns for Component identification
  for(var CyberRowCnt = 0;
          CyberRowCnt < cyberTable.length;
          CyberRowCnt++) {
    var cyberRow = cyberTable[CyberRowCnt]
    var CyberComputerName = (cyberRow[CyberComputerNameCol] || '').toUpperCase().trim()
    if(CyberComputerName.substring(0,2) == 'W-') {
      CyberComputerName = CyberComputerName.substring(2)
    } // End if
    
    //  Check Patterns of Servers
    var CyberComputerNameHold = CyberComputerName

    // ServerCheck looks for exact match of the pattern and a string search of the pattern.  
    //	if exact match, it picks up the software otherwise it does not
    // 	TODO: is the string search accurate enough to pickup software too
    ServerCheck(
        CyberComputerNameHold, 
        CyberRowCnt, 
        CyberComponentServerFuzzyLogicMatchCol, 
        CyberComponentNameFromGEARSCol, 
        ServerMatchCnt, 
        GEARSSoftwareNameCol, 
        GEARSSoftwareIDCol, 
        CyberSoftwareNameCol, 
        CyberSoftwareIDCol, 
        GEARSDatabaseCol, 
        CyberDatabaseCol, 
        CyberGEARSServerCol, 
        CyberGEARSServerNSLookupCol,
        tables
    )
      
    if(cyberRow[CyberComponentNameFromGEARSCol] == '') {

      if(CyberComputerName.indexOf('-') == -1) {
        FoundComponentGreen = 99
      } else {
        ComponentNameAry = CyberComputerName.split("-")
        CyberComputerNameLong = CyberComputerName.replace("-", '')
        CyberComputerNameLong = CyberComputerNameLong.replace(".", '')
        FoundComponentGreen = 99

        for(var i = 0;
                i < ComponentNameAry.length;
                i++) {
          // Look for delimited Component Names Only - 
          // Reduces error by separating name parts that are significant and insignificant
          for(var iPML = 0;
                  iPML < PMLComponentNameMatchAllAry.length;
                  iPML++) {
            var ComponentNameOut = ''
            ComponentNamePML = PMLComponentNameMatchAllAry[iPML]
            ComponentNameCyber = ComponentNameAry[i]
            ComponentNameCyber = ComponentNameCyber.removeNum()
            CyberComputerNameLong = RemoveNumbers(CyberComputerNameLong)
            
            if (ComponentNamePML == CyberComputerNameLong) {
              FoundComponentGreen = i
              ComponentNameOut = CyberComputerNameLong
              iPML = PMLComponentNameMatchAllAry.length
              i = ComponentNameAry.length
            } else {
              if (ComponentNameCyber.length > 1 && 
                  ComponentNameCyber != "WEB" && 
                  ComponentNameCyber != "SERVICE" && 
                  ComponentNameCyber != "INFRA" && 
                  ComponentNameCyber != "DB" && 
                  ComponentNameCyber != "APP") {
                
                if(ComponentNamePML == ComponentNameCyber) {
                  FoundComponentGreen = i
                  ComponentNameOut = PMLComponentNameAllAry[iPML]
                  iPML = PMLComponentNameMatchAllAry.length
                  i = ComponentNameAry.length
                } // End if
              } // End if
            } // End if
          } //Next iPML
        } // Next i
      } // End if else
    } // End if

    // eslint-disable-next-line no-empty
    if(FoundComponentGreen == 99) {}
    else {
      cyberRow[CyberComponentNameFromPMLCol] = ComponentNameOut
    } // End if
  } // Next CyberRowCnt

  //  Second Pass to find hyphenated

  CorrectPMLwithDash(
    CyberEnd,
    CyberComputerName,
    iPML,
    CyberComputerNameCol,
    ComponentNamePML,
    PMLComponentNameCol,
    CyberRowCnt,
    PMLRowCnt,
    ComponentNamePMLStart,
    PMLComponentNameAllCnt,
    PMLComponentNameMatchAllAry,
    CyberComponentNameFromGEARSCol,
    CyberComponentServerFuzzyLogicMatchCol,
    CyberComponentNameFromPMLCol,
    CyberComponentNameManualCol,
    tables
  )
  // CommentValueIn = ''
  // CommentValue = ''
  // CommentValue = GreenCnt+ "*" + "Green = Exact Match in '-' Seperated "
  // CommentValueIn = ''
  // CommentValue = ''
  // // Add ServerMatchCnt Header
  // CommentValue = Str(ServerMatchCnt) + "* " + "Component that matches Servers in GEARS"
  // CommentValue = CommentValue + "\n" + SelectedGreenCnt + " " + "are Match exact"

  // eslint-disable-next-line no-redeclare
  for(var CyberRowCnt = 0;
          CyberRowCnt < cyberTable.length;
          CyberRowCnt++) {
    cyberRow = cyberTable[CyberRowCnt]
    
    FieldsEqualChk(
      CyberComponentServerFuzzyLogicMatchCol,
      CyberComponentNameCombinedCol,
      CyberComponentNameFromPMLCol,
      CyberComponentNameFromGEARSCol,
      CyberRowCnt,
      CyberComponentNameManualCol,
      SelectedGreenCnt,
      tables
    )
    
    var CyberComponentSDAP = ''
    var CyberComponentDiamond = ''
    var CyberComponentManual = ''
    var CyberFuzzyLogic = ''
      
    CyberComponentSDAP = cyberRow[CyberSDAPComponentCol]
    CyberComponentDiamond = cyberRow[CyberDiamondComponentCol]
    CyberComponentManual =  cyberRow[CyberComponentNameManualCol]
    CyberFuzzyLogic =  cyberRow[CyberComponentServerFuzzyLogicMatchCol]
    if( (CyberComponentSDAP || '').toUpperCase().trim() != '' ) 
    {
        cyberRow[CyberComponentNameCombinedCol] = CyberComponentSDAP
    } 
    else 
    {
      if((CyberComponentDiamond || '').toUpperCase().trim() != '') 
      { 
          cyberRow[CyberComponentNameCombinedCol] = CyberComponentDiamond
      } 
      else 
      {
        if((CyberComponentManual || '').toUpperCase().trim() != '') 
        {
              cyberRow[CyberComponentNameCombinedCol] = CyberComponentManual
        } 
        else 
        {
          if((CyberFuzzyLogic || '').toUpperCase().trim() != '')
          {
              cyberRow[CyberComponentNameCombinedCol] = CyberFuzzyLogic
          }
        }
      }
    }
  } // Next CyberRowCnt
} // End Sub


// function  CheckConcatenation (
//     ComponentNamePMLAry,
//     iPML,
//     ComponentNameAry,
//     i,
//     ConcatenationFound,
//     ConcatComponentNamePML
//   ) {
//   var ConcatComponentNameCyber = ''
  
//   if(iPML == ComponentNamePMLAry.length || i == ComponentNameAry.length ) {} 
//   else {
//     ConcatComponentNamePML = ComponentNamePMLAry[iPML] + ComponentNamePMLAry[iPML + 1]
//     ConcatComponentNameCyber = ComponentNameAry[i + 1]
//     ConcatComponentNameCyber = RemoveNumbers( ConcatComponentNameCyber)
    
//     if(ConcatComponentNamePML == ComponentNameAry[i] || 
//         ConcatComponentNamePML == ComponentNameAry[i] + ConcatComponentNameCyber) {
//       ConcatenationFound = true
//       ConcatComponentNamePML = ComponentNamePMLAry[iPML] + "-" + ComponentNamePMLAry[iPML + 1]
       
//     } // End if
//   } // End if
// } // End Sub

function  RemoveNumbers(stringToChange) {
  return stringToChange.replace(/\d+/g, '')
} // End Sub

function  ServerCheck(
     CyberComputerNameHold
		,CyberRowCnt
		,CyberComponentServerFuzzyLogicMatchCol
		,CyberComponentNameFromGEARSCol
		,ServerMatchCnt
		,GEARSSoftwareNameCol
		,GEARSSoftwareIDCol
		,CyberSoftwareNameCol
		,CyberSoftwareIDCol
		,GEARSDatabaseCol
		,CyberDatabaseCol
		,CyberGEARSServerCol
		,CyberGEARSServerNSLookupCol
    ,tables) {

  // var NumCyberComputerNameHold
  // var LenComputerName
  // var CharCnt = 0
  var CyberRowCntHold = 0
  var SoftwareNameGEARS = ''
  var SoftwareIDGEARS = ''
  var DatabaseGEARS = ''
  var FoundSoftware
  var SoftwareNameGEARSAry = []
  // var iSoftwareNameAry
  // var FoundDatabase
  // var DatabaseGEARSAry = []
  // var iDatabaseAry
  // var GEARSServerNameCol
  // var GEARSServerNSLookupCol
  // var GEARSComponentNameCol
  var ServerNSLookupGEARS = ''
  // var GEARSEnd = 0
  // var CyberFuzzyLogic = ''
  
  var gearsTable = tables['gears']
  var cyberTable = tables['ecmo']
  // GEARSEnd = gearsTable.length
  // CharCnt = 1
  CyberRowCntHold = CyberRowCnt
  // LenComputerName = CyberComputerNameHold.length
  CyberComputerNameHold = RemoveNumbers(CyberComputerNameHold)
  // LenComputerName = CyberComputerNameHold.length

  if( CyberComputerNameHold.substr(-1) == "-" ) {
    CyberComputerNameHold = CyberComputerNameHold.substring(0,CyberComputerNameHold.length-1)
  } // End if

  var GEARSServerNameCol = 'Server'
  // var GEARServerIDCol = 'ServerExternalID'
  var GEARSServerNSLookupCol = 'NSLOOKUP'
  var GEARSComponentNameCol = 'ComponentLookup'

  ServerNSLookupGEARS = ''
  for (var GEARSRowCnt = 0;
           GEARSRowCnt < gearsTable.length;
           GEARSRowCnt++) {
      var gearsRow = gearsTable[GEARSRowCnt]
      var ServerNameGEARS = (gearsRow[GEARSServerNameCol] || '').toUpperCase().trim()
      // ServerIDGEARS = UCase(RTrim(LTrim(Worksheets("GEARS").Cells(GEARSRowCnt, GEARSServerIDCol])))
      ServerNSLookupGEARS = (gearsRow[GEARSServerNSLookupCol] || '').toUpperCase().trim()
      SoftwareNameGEARS = (gearsRow[GEARSSoftwareNameCol] || '').trim()
      SoftwareIDGEARS = (gearsRow[GEARSSoftwareIDCol] || '').toUpperCase().trim()
      DatabaseGEARS = (gearsRow[GEARSDatabaseCol] || '').toUpperCase().trim()

      var ComponentNameGEARS = (gearsRow[GEARSComponentNameCol] || '').toUpperCase().trim()
      // CyberFuzzyLogic = (gearsRow[CyberComponentServerFuzzyLogicMatchCol] || '').toUpperCase().trim()
      
      var ServerNameGEARSHold = ServerNameGEARS
      ServerNameGEARS = RemoveNumbers(ServerNameGEARS)
      // LenComputerName = ServerNameGEARS.length

      if(ServerNameGEARS.substr(-1) == "-") {
        ServerNameGEARS = ServerNameGEARS.substring(0,ServerNameGEARS.length-1)
      } // End if

      var cyberRow = cyberTable[CyberRowCntHold]

      if( ServerNameGEARS == CyberComputerNameHold ) 
      {
         if( (cyberRow[CyberSoftwareNameCol] || '').trim() == '' ) 
         {
            cyberRow[CyberSoftwareNameCol] = SoftwareNameGEARS
            cyberRow[CyberSoftwareIDCol] = SoftwareIDGEARS
            cyberRow[CyberDatabaseCol] = DatabaseGEARS
            cyberRow[CyberGEARSServerCol] = ServerNameGEARSHold
           
            cyberRow[CyberGEARSServerNSLookupCol] = ServerNSLookupGEARS
         } 
         else 
         {
            FoundSoftware = false
            SoftwareNameGEARSAry = (cyberRow[CyberSoftwareNameCol] || '').trim().split(";")
            for(var iSoftwareNameAry = 0;
                    iSoftwareNameAry < SoftwareNameGEARSAry.length;
                    iSoftwareNameAry++) 
            {
              if (SoftwareNameGEARS == SoftwareNameGEARSAry(iSoftwareNameAry)) 
              {
                FoundSoftware = true
                cyberRow[CyberGEARSServerCol] = cyberRow[CyberGEARSServerCol] + "," + ServerNameGEARSHold
                cyberRow[CyberGEARSServerNSLookupCol] = cyberRow[CyberGEARSServerNSLookupCol] + "," + ServerNSLookupGEARS
              } // End if
              
            } // Next iSoftwareNameAry
            
            if( FoundSoftware == false) 
            {
                cyberRow[CyberSoftwareNameCol] = cyberRow[CyberSoftwareNameCol] + ";" + SoftwareNameGEARS
                cyberRow[CyberSoftwareIDCol] = cyberRow[CyberSoftwareIDCol] + ";" + SoftwareIDGEARS
                cyberRow[CyberDatabaseCol] = cyberRow[CyberDatabaseCol] + ";" + DatabaseGEARS
                cyberRow[CyberGEARSServerCol] = cyberRow[CyberGEARSServerCol] + ";" + ServerNameGEARSHold
                cyberRow[CyberGEARSServerNSLookupCol] = cyberRow[CyberGEARSServerNSLookupCol] + ";" + ServerNSLookupGEARS
            } // End if
            
          
        } 
      } else 
        {
     
          ServerMatchCnt = ServerMatchCnt + 1
      } // End If
        
    ServerNameGEARS = (gearsRow[GEARSServerNameCol] || '').toUpperCase().trim()
    ServerNSLookupGEARS = (gearsRow[GEARSServerNSLookupCol] || '').toUpperCase().trim()
    ComponentNameGEARS = (gearsRow[GEARSComponentNameCol] || '').toUpperCase().trim()

    if( ServerNameGEARS.indexOf(CyberComputerNameHold) > -1 ) {
      cyberRow[CyberComponentNameFromGEARSCol] = ComponentNameGEARS
      ServerMatchCnt = ServerMatchCnt + 1
    } // End if
  } // Next GEARSRowCnt
} // End Sub

function  FieldsEqualChk(CyberComponentServerFuzzyLogicMatchCol, CyberComponentNameCombinedCol, CyberComponentNameFromPMLCol, CyberComponentNameFromGEARSCol, CyberRowCnt, CyberComponentNameManualCol, SelectedGreenCnt,tables){

  var CyberComponentNameFromGEARS = ''
  var CyberComponentNameFromPML = ''
  // var CyberComponentNameManual = ''
  // var CyberLogic = ''
  var cyberTable = tables['ecmo']  

  var cyberRow = cyberTable[CyberRowCnt]
  CyberComponentNameFromGEARS = cyberRow[CyberComponentNameFromGEARSCol]
  CyberComponentNameFromPML = cyberRow[CyberComponentNameFromPMLCol]
  // CyberComponentNameManual = cyberRow[CyberComponentNameManualCol]
  // var CyberComponentCombined = cyberRow[CyberComponentNameCombinedCol]

   
  if ((CyberComponentNameFromGEARS || '').toUpperCase().trim() != '') {
      cyberRow[CyberComponentServerFuzzyLogicMatchCol] == CyberComponentNameFromGEARS
      SelectedGreenCnt = SelectedGreenCnt + 1
  } else {
   
    if((CyberComponentNameFromPML || '').toUpperCase().trim() != '') {
      cyberRow[CyberComponentServerFuzzyLogicMatchCol] = CyberComponentNameFromPML
      SelectedGreenCnt = SelectedGreenCnt + 1
    } // End if
  } // End if
} // End Sub


function  CorrectPMLwithDash(
	CyberEnd, 
	CyberComputerName, 
	iPML, 
	CyberComputerNameCol, 
	ComponentNamePML, 
	PMLComponentNameCol, 
	CyberRowCnt, 
	PMLRowCnt, 
	ComponentNamePMLStart, 
	PMLComponentNameAllCnt, 
	PMLComponentNameMatchAllAry, 
	CyberComponentNameFromGEARSCol, 
	CyberComponentServerFuzzyLogicMatchCol, 
	CyberComponentNameFromPMLCol, 
	CyberComponentNameManualCol,
	tables) {
  // var PMLEnd = 0
  var pmlTable = tables['pml']
  // PMLEnd = pmlTable.length
  PMLComponentNameAllCnt = 0
  // eslint-disable-next-line no-redeclare
  for(var PMLRowCnt = 0;
          PMLRowCnt < pmlTable.length;
          PMLRowCnt++) {
    var pmlRow = pmlTable[PMLRowCnt]
    ComponentNamePMLStart = pmlRow[PMLComponentNameCol]
    PMLComponentNameMatchAllAry[PMLComponentNameAllCnt] = ComponentNamePMLStart
    PMLComponentNameAllCnt = PMLComponentNameAllCnt + 1
  }
  var cyberTable = tables['ecmo']
  // eslint-disable-next-line no-redeclare
  for(var CyberRowCnt = 0;
          CyberRowCnt < cyberTable.length;
          CyberRowCnt++) {
    var cyberRow = cyberTable[CyberRowCnt]
    ComponentNamePML = cyberRow[CyberComponentNameFromPMLCol]
    
    if( ComponentNamePML.indexOf("-") > -1 ) {
      CyberComputerName = (cyberRow[CyberComputerNameCol] || '').toUpperCase().trim()
      if ( CyberComputerName.indexOf(ComponentNamePML) == -1) {
        // eslint-disable-next-line no-redeclare
        for(var iPML = 0;
                iPML < PMLComponentNameMatchAllAry.length;
                iPML++ ) {
          ComponentNamePML = PMLComponentNameMatchAllAry[iPML]
          if( CyberComputerName.indexOf(ComponentNamePML) > -1 && 
              ComponentNamePML != '') {
            cyberRow[CyberComponentNameFromPMLCol] = ComponentNamePML
            iPML = PMLComponentNameMatchAllAry.length
          } // End if
        } // Next iPML
      } // End if
    } // End if
      
  //     FieldsEqualChk CyberComponentServerFuzzyLogicMatchCol, CyberComponentNameFromPMLCol, CyberComponentNameFromGEARSCol, CyberRowCnt, CyberComponentNameManualCol, SelectedGreenCnt

  } //Next CyberRowCnt

} // End Sub

module.exports.FindComponentinPML = FindComponentinPML;
