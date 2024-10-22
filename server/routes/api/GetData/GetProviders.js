const router = require('express').Router();
const config = require('../../../config/connectionProductionCustom');
const sql = require('mssql');

router.get('/:accountGroup?', async (req, res) => {
  let accountGroup = req.params.accountGroup;
  let query;
  let queryResults;
  console.log(accountGroup);
  switch (accountGroup) {
    case 'agnesian':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[Agnesian_Doctors]`;
      break;
    case 'aspirus_at_home_central_88403':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[88403_AspAtHome]`;
      break;
    case 'aspirus_at_home_eastern_88405':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[88405_AspAtHomeMI]`;
      break;
    case 'aurora':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[Aurora_Doctors]`;
      break;
    case 'beloit':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[9715_Beloit_Health]`;
      break;
    case 'corvallis':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[Corvallis]`;
      break;
    case 'forefront_dermatology':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[1278_Dermatology_Associates]`;
      break;
    case 'nova_health':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[NovaHealthProviders]`;
      break;
    case 'peace_health':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[Peace_Health_Providers]`;
      break;
    case 'rome_medical':
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[RomeMedical]`;
      break;
    default:
      query = ` SELECT 
                  *
                FROM 
                  [Accounts].[dbo].[0_AnSer_Doctor_Database]`;
      break;
  }

  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  res.json(queryResults);

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;