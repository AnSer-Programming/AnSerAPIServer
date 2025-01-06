function mainDataHandler(data) {
  let transmitData = {
    MSM_firstname: `${data.firstName}`,
    MSM_lastname: `${data.lastName}`,
    MSM_address1: `${data.address}`,
    MSM_city: `${data.city}`,
    MSM_state: `${data.state}`,
    MSM_zip: `${data.zip}`,
    MSM_email: `${data.email ? data.email : "No Email Provided"}`,
    MSM_cellphone: `${data.phone ? data.phone : "No Phone Provided"}`,
    MSM_custom_Interests: '',
    MSM_source: "d7f03d2e-3292-4c40-b093-9a50fd12e19b",
    MSM_coy: "2244",
    MSM_formId: "d7f03d2e-3292-4c40-b093-9a50fd12e19b",
    MSM_leadCaptureName: "MarketSharp"
  };

  switch (data.reason) {
    case "Schedule":
      transmitData.MSM_custom_Interests = `
        Caller would like to schedule an appointment on ${data.date} at ${data.time} with ${data.salesPerson}. 
        Callers reach preference is ${data.reachPreference}. Message: ${data.message}`;
      break;
    case "Cancel":
      transmitData.MSM_custom_Interests = `
        Caller would like to cancel an appointment on ${data.date} at ${data.time} with ${data.salesPerson}.`;
      break;
    case "Reschedule":
      transmitData.MSM_custom_Interests = `
        Caller would like to reschedule an appointment from ${data.oldDate} at ${data.oldTime} with ${data.oldSalesPerson}. 
        Caller would like to schedule an appointment on ${data.date} at ${data.time} with ${data.salesPerson}. 
        Callers reach preference is ${data.reachPreference}. Message: ${data.message}`;
      break;
    default:
      transmitData.MSM_custom_Interests = `
        Error: Unknown Reason passed to AnSer API Server. Please reach out to us at programming@anser.com with any information that is provided.`;
      break;
  }

  return transmitData;
}

module.exports = { mainDataHandler };