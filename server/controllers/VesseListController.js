const { VesselListTable } = require('../models');

module.exports = {
  getVesselList(req, res) {
    VesselListTable.findAll({
      where: {account_num: req.params.accountNum }
    })
      .then((vesselsContacts) => res.json(vesselsContacts))
      .catch((err) => res.status(500).json(err));
  },
  
  getSingleVesselContact(req, res) {
    VesselListTable.findOne({ index: req.params.index })
      .then((vesselContact) => {
        if(!vesselContact) {
          res.status(404).json({ message: thoughtMessage });
        }
        res.json(vesselContact);
      })
      .catch((err) => res.status(500).json(err));
  },
  
  createVesselContact(req, res) {
    VesselListTable.create(req.body)
      .then((vesselContact) => res.json(vesselContact))
      .catch((err) => res.status(500).json(err));
  },

  updateVesselContact(req, res) {
    VesselListTable.update(req.body, { 
      where: { index: req.params.index } 
    },)
      .then((vesselContact) => {
        if(!vesselContact) {
          res.status(404).json({ message: thoughtMessage });
        }
        res.json(vesselContact);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  deleteVesselContact(req, res) {
    VesselListTable.destroy({ 
      where: {index: req.params.index} 
    })
      .then((vesselContact) => {
        if(!vesselContact) {
          res.status(404).json({ message: row });
        }
      })
      .then(() => res.json({ message: 'Vessel has been deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
};