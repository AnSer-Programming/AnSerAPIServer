const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');
const xml2js = require('xml2js');

async function dataConverter(data) {
  let jsonData;

  if(data) {
    // Refactor for dynamic XML to JSON Array support
    async function xmlToJSON(xmlData) {
      let combinedObj = "{"; // intiialize the object
      const regexXMLRules = {
        xmlSelfClose: /<[A-Za-z0-9]+ \/>/,
        xmlKeyWithValue: /<[A-Za-z0-9]+>([A-Za-z0-9]|-[A-Za-z0-9]|\*[A-Za-z0-9])+/,
        xmlKeyOpenerOnly: /<[A-Za-z0-9]+>/,
        xmlKeyCloserOnly: /<\/[A-Za-z0-9]+>/,
        xmlExceptionsOpen: /<Exceptions>/,
        xmlExceptionsClosing: /<\/Exceptions>/,
        xmlStatusExceptionsOpen: /<cmnStatusException>/,
        xmlStatusExceptionsClosing: /<\/cmnStatusException>/,
        xmlOverrideTagOpen: /<cmnStatusRuleOverride xsi:type="[A-Za-z0-9]+">/,
        xmlOverrideTagClose: /<\/cmnStatusRuleOverride>/,
        xmlStatusOverride: /<Status xsi:type="[A-Za-z0-9]+">/,
        xmlStatusOverrideOpen: /<Status xsi:type="/,
        xmlStatusOverrideClose: /">/,
        xmlDefaultWithProperty: /<Default xsi:type="[A-Za-z0-9]+">/,
        xmlOpeningTag: /</,
        xmlClosingTag: />/,
        xmlSelfCloseCloseTag: / \/>/
      }; // the regular expression rules stored in an object
      let xmlArray = new Array(); // initialize the new array
    
      xmlArray = await xmlData.split('\n'); // Split the XML file up by the new line character \n (enter on the keyboard)
      xmlArray.splice(0, 2); // Remove the first two xml tags
      xmlArray.splice(xmlArray.length-1, 1); // Remove the last xml tag
    
      for(let i = 0; i < xmlArray.length; i++) { 
        xmlArray[i] = await xmlArray[i].trim();
    
        if(xmlArray[i].match(regexXMLRules.xmlSelfClose)) { // Identify tags that close immediately. Example: <Overrides />
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOpeningTag, `"`).trim(); // Replace the opening <
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlSelfCloseCloseTag, `": "null"`).trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlStatusOverride)) {
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlStatusOverrideOpen, ', "').trim(); 
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlStatusOverrideClose, '": {').trim(); 
        } else if(xmlArray[i].match(regexXMLRules.xmlKeyWithValue)) { // Identify Keys that have Values. Example: <ID>21132</ID>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlKeyCloserOnly, `"`).trim();
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOpeningTag, `"`).trim(); // Replace the opening <
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlClosingTag, `": "`).trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlExceptionsOpen)) { // Identify specific tag for array support. XML Tag: <Exceptions>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOpeningTag, `"`).trim(); // Replace the opening <
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlClosingTag, `": [`).trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlExceptionsClosing)) { // Identify specific tag for array support. XML Tag: </Exceptions>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlKeyCloserOnly, ']').trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlStatusExceptionsOpen)) { // Identify specific tag for array support. XML Tag: <cmnStatusException>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOpeningTag, `{"`).trim(); // Replace the opening <
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlClosingTag, `": {`).trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlStatusExceptionsClosing)) { // Identify specific tag for array support. XML Tag: </cmnStatusException>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlKeyCloserOnly, '}}').trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlOverrideTagOpen)) { // Identify specific tag for array support. XML Tag: <cmnStatusOverride>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOverrideTagOpen, `"cmnStatusOverride": {`).trim(); 
        } else if(xmlArray[i].match(regexXMLRules.xmlOverrideTagClose)) { // Identify specific tag for array support. XML Tag: </cmnStatusOverride>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlKeyCloserOnly, '}').trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlKeyOpenerOnly)) { // Identify tags that hold an object. Example: <Default> <tag>value</tag> </Default>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlOpeningTag, `"`).trim(); // Replace the opening <
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlClosingTag, `": {`).trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlKeyCloserOnly)) { // Identify tags that hold an object. Example: <Default> <tag>value</tag> </Default>
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlKeyCloserOnly, '}').trim();
        } else if(xmlArray[i].match(regexXMLRules.xmlDefaultWithProperty)) {
          xmlArray[i] = await xmlArray[i].replace(regexXMLRules.xmlDefaultWithProperty, `"Default": {`).trim();
        }
        
        if(i>0) {
          if(xmlArray[i-1][xmlArray[i-1].length-1]==='}' && xmlArray[i][0]==='"' 
            || xmlArray[i-1][xmlArray[i-1].length-1]==='"' && xmlArray[i][0]==='"' 
            || xmlArray[i-1][xmlArray[i-1].length-1]===']' && xmlArray[i][0]==='"' 
            || xmlArray[i-1][xmlArray[i-1].length-1]==='}' && xmlArray[i][0]==='{'
            || xmlArray[i-1][xmlArray[i-1].length-1]==='"' && xmlArray[i][0]==='{') {
            xmlArray[i-1] += ",";
          }
        }
      }
    
      for(let i = 0; i < xmlArray.length; i++) {
        combinedObj += xmlArray[i];
      }
      combinedObj += "}";
      return await JSON.parse(combinedObj);
    }
    
    function timeConverter() {
      let startTime = '0:00:00';
      let startTimeHour;
      let startTimeMinute;
      let startTimeSecond;
      let endTime = '0:00:00';
      let endTimeHour;
      let endTimeMinute;
      let endTimeSecond;
      if(jsonData.Exceptions) {
        for(let i = 0; i < jsonData.Exceptions.length; i++) {
          if(jsonData.Exceptions[i]) {
            if(jsonData.Exceptions[i].cmnStatusException) {
              if(jsonData.Exceptions[i].cmnStatusException.Start) {
                startTimeSecond = (((jsonData.Exceptions[i].cmnStatusException.Start/10)/1000)/1000)%60;
                startTimeMinute = (((((jsonData.Exceptions[i].cmnStatusException.Start/10)/1000)/1000)-startTimeSecond)/60)%60;
                startTimeHour = ((((((jsonData.Exceptions[i].cmnStatusException.Start/10)/1000)/1000)-startTimeSecond)/60)-startTimeMinute)/60;
                if(startTimeSecond <= 9) {
                  startTimeSecond = `0${startTimeSecond}`;
                }
                if(startTimeMinute <= 9) {
                  startTimeMinute = `0${startTimeMinute}`;
                }
              }
              if(jsonData.Exceptions[i].cmnStatusException.End) {
                endTimeSecond = (((jsonData.Exceptions[i].cmnStatusException.End/10)/1000)/1000)%60;
                endTimeMinute = (((((jsonData.Exceptions[i].cmnStatusException.End/10)/1000)/1000)-endTimeSecond)/60)%60;
                endTimeHour = ((((((jsonData.Exceptions[i].cmnStatusException.End/10)/1000)/1000)-endTimeSecond)/60)-endTimeMinute)/60;
                if(endTimeSecond <= 9) {
                  endTimeSecond = `0${endTimeSecond}`;
                }
                if(endTimeMinute <= 9) {
                  endTimeMinute = `0${endTimeMinute}`;
                }
                startTime = `${startTimeHour}:${startTimeMinute}:${startTimeSecond}`;
                endTime = `${endTimeHour}:${endTimeMinute}:${endTimeSecond}`;
              }
              jsonData.Exceptions[i].cmnStatusException.Start = startTime;
              jsonData.Exceptions[i].cmnStatusException.End = endTime;
            }
          }
        }
      }
      return jsonData;
    }
    
    jsonData = await xmlToJSON(data);
    jsonData = await timeConverter();
  
    return await jsonData;
  } else {
    jsonData = {};
    
    jsonData = JSON.parse(JSON.stringify(jsonData));
    return jsonData;
  }
}

router.get('/', async (req, res) => {
  const query = `SELECT DISTINCT [Name], [Field], [Status]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        LEFT JOIN [dbo].[dirListings] ON [dbo].[dirListingFields].[listId] = [dbo].[dirListings].[listId]
        WHERE [Title] = 'Name'`;
  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      for(let i = 0; i<result.length; i++) {
        result[i].Status = await dataConverter(result[i].Status); 
      }

      result.splice(0, 1);

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

router.get('/ByDirectoryName/:directoryName', async (req, res) => {
  let directoryName = req.params.directoryName;
  const query = `SELECT DISTINCT [Name], [Field], [Status]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        LEFT JOIN [dbo].[dirListings] ON [dbo].[dirListingFields].[listId] = [dbo].[dirListings].[listId]
        WHERE [Title] = 'Name' AND [Name] = '${directoryName}'`;
  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      for(let i = 0; i<result.length; i++) {
        result[i].Status = await dataConverter(result[i].Status);
      }

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

router.get('/ByPersonName/:personName', async (req, res) => {
  let personName = req.params.personName;
  const query = `SELECT DISTINCT [Name], [Field], [Status]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        LEFT JOIN [dbo].[dirListings] ON [dbo].[dirListingFields].[listId] = [dbo].[dirListings].[listId]
        WHERE [Title] = 'Name' AND [Field] LIKE '%${personName}%'`;
  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      for(let i = 0; i<result.length; i++) {
        result[i].Status = await dataConverter(result[i].Status);
      }

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;