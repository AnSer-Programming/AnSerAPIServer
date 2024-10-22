const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/ByAccountNum/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  const query = `SELECT client.[cltId], client.[ClientNumber], client.[ClientName], dirListings.[listID], dirListings.[Description] as 'name', role_list = STUFF((
		                SELECT roleDef.[Name] + ', '
		                FROM [Intellegent].[dbo].[dirRoleDefinitions] roleDef
                    LEFT JOIN [dirContactRoles] contactRoles ON contactRoles.[roledefID] = roleDef.[roledefID]
                    WHERE contactRoles.[Inactive] = 0 AND dirListings.[listID] = contactRoles.[listID]
                    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 0, ' ')
                  FROM [Intellegent].[dbo].[dirListingDescriptions] dirListings
                  LEFT JOIN [Intellegent].[dbo].[dirListings] listings ON listings.[listId] = dirListings.[listID]
                  LEFT JOIN [Intellegent].[dbo].[cltClients] client on listings.[subId] = client.[subId]
                  WHERE [ClientNumber] = :accountNum`;

  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: { accountNum: `${accountNum}` }, type: seq.QueryTypes.SELECT });

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