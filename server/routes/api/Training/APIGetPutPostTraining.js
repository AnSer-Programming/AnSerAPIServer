const router = require('express').Router();
const { TestDatabaseTable } = require('../../../models');
const { sequelize } = require('../../../models/TestDatabaseTable');

router.get('/', async (req, res) => {
  try {
    const testData = await TestDatabaseTable.findAll();

    if (!testData) {
      res.status(404).json({ message: 'Nothing! There is nothing here!' });
      return;
    }

    let data = JSON.parse(JSON.stringify(testData))

    for(let i = 0; i < testData.length; i++) {
      data[i].jsonIndex = i;
    }

    console.log(data);

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const testData = await TestDatabaseTable.create(req.body);
    res.status(200).json(testData);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/:index', async (req, res) => {
  try {
    const testData = await TestDatabaseTable.update(req.body, {
      where: {
        index: req.params.index 
      }
    });
    if(!testData[0]) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }
    res.status(200).json(testData);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/:index', async (req, res) => {
  try {
    const testData = await TestDatabaseTable.destroy({
      where: {
        index: req.params.index
      }
    });
    if(!testData) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }
    res.status(200).json(testData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;