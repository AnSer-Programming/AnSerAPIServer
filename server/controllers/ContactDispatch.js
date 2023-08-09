const { ContactDispatchTable } = require('../models');

module.exports = {
  async getContactDispatch({}, res) {
    const foundContactDispatchTable = await ContactDispatchTable.findAll({ });

    if (!foundContactDispatchTable) {
      return res.status(400).json({ message: 'Cannot find table data!' });
    }

    res.json(foundContactDispatchTable);
  },

  getGroupContactDispatch({ params }, res) {
    const foundGroupContactDispatchTable = ContactDispatchTable.findAll({ where: {account: params.groupNum}});

    if (!foundGroupContactDispatchTable) {
      return res.status(400).json({ message: 'Cannot find table data!' });
    }

    res.json(foundGroupContactDispatchTable);

  },

  async setContactDispatch({ body }, res) {
    try {
      // body = JSON.stringify(body);
      console.log(body);
      let updateContactDispatch;
      for(let i = 0; i < body.Data.length; i++) {
        updateContactDispatch = await ContactDispatchTable.update (
          {status: body.Data[i].Status, account_type: body.Data[i].AccountType, api: body.Data[i].API},
          {where: {account: body.Data[i].Account}}
        )
      }
      return res.json(updateContactDispatch);
    } catch(err) {
      console.log(`Controller: ${err}`);
    }
  }
}