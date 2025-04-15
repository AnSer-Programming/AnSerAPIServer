const router = require('express').Router();
const config = require('../../config/connection');
const sql = require('mssql');

const dataBaseData = async () => {
  const query = `SELECT * FROM [isapi].[dbo].[44233_OnCallGroup]`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      console.log(result);
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  sql.on('error', err => {
    // ... error handler
    console.log("sql on: " + err);
    return "Database Error in File RadiologyAssociatesOCGroup.js";
  });

  return await queryResults;
}

const updateDataBaseData = async (id, data) => {
  let key = Object.keys(data);
  const query = `UPDATE [isapi].[dbo].[44233_OnCallGroup] SET ${key} = '${data[key]}' WHERE id=${id}`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      console.log(result);
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      console.log("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  sql.on('error', err => {
    // ... error handler
    console.log("sql on: " + err);
    return "Database Error in File RadiologyAssociatesOCGroup.js";
  });

  return await queryResults;
}

router.get('/:accountNum', async (req, res) => {
  try {
    res.json(await dataBaseData());
  } catch (err) {
    res.send(err);
  }
});

router.put('/ByID/:index', async (req, res) => {
  // update a category by its `id` value
  const index = req.params.index;
  const data = req.body
  console.log(index, data);
  try {
    const onCallGroupData = updateDataBaseData(index, data);
    if (!onCallGroupData[0]) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }
    res.status(200).json(onCallGroupData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;