const config = require('../config/connection');
const seq = require('sequelize');

// Fetch records from the newClientPaperWork table by account number
const getClientInfoByAccount = async (accountNum) => {
  const query = `
    SELECT 
      [id],
      [client_name],
      [contact_name],
      [contact_email],
      [contact_phone_number],
      [account_number]
    FROM [isapi].[dbo].[newClientPaperWork]
    WHERE [account_number] = :accountNum
    ORDER BY [client_name] ASC
  `;

  try {
    // Execute the query using Sequelize
    const result = await config.query(query, {
      replacements: { accountNum },
      type: seq.QueryTypes.SELECT,
    });
    return result;
  } catch (error) {
    console.error('Error fetching ClientInfo:', error);
    throw error;
  }
};

module.exports = {
  getClientInfoByAccount,
};

