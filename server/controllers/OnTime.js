const { OnTimeTable } = require('../models');

module.exports = {
  async onTime({}, res) {
    const foundOnTimeTable = await OnTimeTable.findAll({ });

    if (!foundOnTimeTable) {
      return res.status(400).json({ message: 'Cannot find table data!' });
    }

    res.json(foundOnTimeTable);
  }
}