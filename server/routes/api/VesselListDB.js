// const router = require('express').Router();
// const {
//   getVesselList,
//   getSingleVesselContact,
//   createVesselContact,
//   updateVesselContact,
//   deleteVesselContact,
// } = require('../../controllers/VesseListController');

// router.route('/:accountNum').get(getVesselList).post(createVesselContact);
// router.route('/ByIndex/:index').get(getSingleVesselContact).put(updateVesselContact).delete(deleteVesselContact);

// module.exports = router;

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
      res.status(404).json({ message: `No category with that id!` });
      return;
    }
    res.status(200).json(vesselListData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;