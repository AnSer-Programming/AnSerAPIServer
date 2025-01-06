const groups = {
  customerSupport: { groupID: 155, groupName: "Customer Support" },
  operators: { groupID: 3, groupName: "Operators" },
  programming: { groupID: 91, groupName: "Programming" },
  supervisors: { groupID: 1, groupName: "Supervisors" }
};
const hasGroups = { customerSupport: false, operators: false, programming: false, supervisors: false };

const groupCheck = async (data) => {
  let currentDirectory = data[0].directoryName;
  let currentView = data[0].viewName;
  let viewCounter = 0;
  let returnData = new Object();
  returnData[currentDirectory] = new Array();
  returnData[currentDirectory][viewCounter] = { viewName: `${currentView}` };

  for (let i = 0; i < data.length; i++) {
    if (data[i].directoryName == currentDirectory) {
      if (data[i].viewName == currentView) {
        if (data[i].pmId == groups.customerSupport.groupID) {
          hasGroups.customerSupport = true;
        } else if (data[i].pmId == groups.operators.groupID) {
          hasGroups.operators = true;
        } else if (data[i].pmId == groups.programming.groupID) {
          hasGroups.programming = true;
        } else if (data[i].pmId == groups.supervisors.groupID) {
          hasGroups.supervisors = true;
        }
      } else {
        if (!hasGroups.customerSupport) {
          returnData[currentDirectory][viewCounter].customerSupport = "Permissions Missing";
        }
        if (!hasGroups.operators) {
          returnData[currentDirectory][viewCounter].operators = "Permissions Missing";
        }
        if (!hasGroups.programming) {
          returnData[currentDirectory][viewCounter].programming = "Permissions Missing";
        }
        if (!hasGroups.supervisors) {
          returnData[currentDirectory][viewCounter].supervisors = "Permissions Missing";
        }

        if (!returnData[currentDirectory][viewCounter].customerSupport && !returnData[currentDirectory][viewCounter].operators
          && !returnData[currentDirectory][viewCounter].programming && !returnData[currentDirectory][viewCounter].supervisors
        ) {
          returnData[currentDirectory].splice(viewCounter, 1);
          viewCounter--;
        }

        currentView = data[i].viewName;
        viewCounter++;

        hasGroups.customerSupport = false;
        hasGroups.operators = false;
        hasGroups.programming = false;
        hasGroups.supervisors = false;

        returnData[currentDirectory][viewCounter] = { viewName: `${currentView}` };

        if (data[i].pmId == groups.customerSupport.groupID) {
          hasGroups.customerSupport = true;
        } else if (data[i].pmId == groups.operators.groupID) {
          hasGroups.operators = true;
        } else if (data[i].pmId == groups.programming.groupID) {
          hasGroups.programming = true;
        } else if (data[i].pmId == groups.supervisors.groupID) {
          hasGroups.supervisors = true;
        }
      }
    } else {
      if (!hasGroups.customerSupport) {
        returnData[currentDirectory][viewCounter].customerSupport = "Permissions Missing";
      }
      if (!hasGroups.operators) {
        returnData[currentDirectory][viewCounter].operators = "Permissions Missing";
      }
      if (!hasGroups.programming) {
        returnData[currentDirectory][viewCounter].programming = "Permissions Missing";
      }
      if (!hasGroups.supervisors) {
        returnData[currentDirectory][viewCounter].supervisors = "Permissions Missing";
      }

      if (!returnData[currentDirectory][viewCounter].customerSupport && !returnData[currentDirectory][viewCounter].operators
        && !returnData[currentDirectory][viewCounter].programming && !returnData[currentDirectory][viewCounter].supervisors
      ) {
        returnData[currentDirectory].splice(viewCounter, 1);
        viewCounter--;
      }

      if(returnData[currentDirectory].length < 1) {
        delete returnData[currentDirectory];
      }

      currentDirectory = data[i].directoryName;
      currentView = data[i].viewName;
      viewCounter = 0;

      hasGroups.customerSupport = false;
      hasGroups.operators = false;
      hasGroups.programming = false;
      hasGroups.supervisors = false;

      returnData[currentDirectory] = new Array();
      returnData[currentDirectory][viewCounter] = { viewName: `${currentView}` };

      if (data[i].pmId == groups.customerSupport.groupID) {
        hasGroups.customerSupport = true;
      } else if (data[i].pmId == groups.operators.groupID) {
        hasGroups.operators = true;
      } else if (data[i].pmId == groups.programming.groupID) {
        hasGroups.programming = true;
      } else if (data[i].pmId == groups.supervisors.groupID) {
        hasGroups.supervisors = true;
      }
    }
  }
  if (!hasGroups.customerSupport) {
    returnData[currentDirectory][viewCounter].customerSupport = "Permissions Missing";
  }
  if (!hasGroups.operators) {
    returnData[currentDirectory][viewCounter].operators = "Permissions Missing";
  }
  if (!hasGroups.programming) {
    returnData[currentDirectory][viewCounter].programming = "Permissions Missing";
  }
  if (!hasGroups.supervisors) {
    returnData[currentDirectory][viewCounter].supervisors = "Permissions Missing";
  }

  if (!returnData[currentDirectory][viewCounter].customerSupport && !returnData[currentDirectory][viewCounter].operators
    && !returnData[currentDirectory][viewCounter].programming && !returnData[currentDirectory][viewCounter].supervisors
  ) {
    returnData[currentDirectory].splice(viewCounter, 1);
    viewCounter--;
  }

  if(returnData[currentDirectory].length < 1) {
    delete returnData[currentDirectory];
  }
  console.log(returnData);

  return await returnData;
}

module.exports = { groupCheck }; 