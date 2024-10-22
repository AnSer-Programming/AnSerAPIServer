const router = require('express').Router();
const { VesselListTable } = require('../../models');
const { sequelize } = require('../../models/OnTimeTable');

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
  let isSorted = false;
  try {
    const vesselListData = await VesselListTable.findAll({
      where: {
        account_num: req.params.accountNum 
      },
      order: sequelize.col('vessel_name'),
    });

    if (!vesselListData) {
      res.status(404).json({ message: 'No vessels found for that account!' });
      return;
    }

    if(vesselListData.length < 1) {
      try {
        const vesselListData = await VesselListTable.create({vessel_name: "Unlisted", contact_name: "Misc", account_num: `${req.params.accountNum}`});
        res.status(200).json(vesselListData);
      } catch(err) {
        res.status(500).json(err);
      }
    }

    let vesselData = await JSON.parse(JSON.stringify(vesselListData));
    let i = vesselData.length-1;
    let placeHolder;
    while(i > -1) {
      console.log(JSON.stringify(placeHolder));
      if(vesselData[i].vessel_name == "Unlisted") {
        placeHolder = vesselData[i];
        for(let x = i; x < vesselData.length-1; x++) {
          vesselData[x] = vesselData[x+1];
        }
        vesselData[vesselData.length-1] = placeHolder;
        isSorted = true;
      }
      i--;
    }

    if(isSorted) {
      res.status(200).json(vesselData);
    } else {
      try {
        const vesselListData = await VesselListTable.create({vessel_name: "Unlisted", contact_name: "Misc", account_num: req.params.accountNum });
        const vesselListNewData = await VesselListTable.findAll({
          where: {
            account_num: req.params.accountNum 
          },
          order: sequelize.col('vessel_name'),
        });
        res.status(200).json(vesselListNewData);
      } catch(err) {
        console.log(err);
      }
    }

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