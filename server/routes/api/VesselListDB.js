const router = require('express').Router();
const { VesselListTable } = require('../../models');

// be sure to include its associated Products
// router.get('/', async (req, res) => {
//   try {
//     const vesselListData = await VesselListTable.findAll({ });
//     res.status(200).json(vesselListData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/:accountNum', async (req, res) => {
  try {
    const vesselListData = await VesselListTable.findAll({
      where: {
        account_num: req.params.accountNum 
      }
    });

    if (!vesselListData) {
      res.status(404).json({ message: 'No vessels found for that account!' });
      return;
    }

    if(vesselListData.length < 1) {
      const vesselListData = await VesselListTable.create({vessel_name: "Unlisted", contact_name: "Misc", account_num: `${req.params.accountNum}`});
      res.status(200).json(vesselListData);
    }

    console.log(vesselListData);

    res.status(200).json(vesselListData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new vessel/contact
  try {
    const vesselListData = await VesselListTable.create(req.body);
    res.status(200).json(vesselListData);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/ByIndex/:index', async (req, res) => {
  // update a category by its `id` value
  try {
    const vesselListData = await VesselListTable.update(req.body, {
      where: {
        index: req.params.index 
      }
    });
    if(!vesselListData[0]) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }
    res.status(200).json(vesselListData);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/ByIndex/:index', async (req, res) => {
  try {
    const vesselListData = await VesselListTable.destroy({
      where: {
        index: req.params.index
      }
    });
    if(!vesselListData) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }
    res.status(200).json(vesselListData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;