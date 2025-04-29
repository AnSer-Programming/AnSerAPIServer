const NoCoverage = require('../../assets/img/OCGroupListWalkThroughIMGS/NoCoverage.PNG');
const SelectEnableEditing = require('../../assets/img/OCGroupListWalkThroughIMGS/SelectEnableEditing.PNG');
const SelectOrType = require('../../assets/img/OCGroupListWalkThroughIMGS/SelectOrType.PNG');
const UpdateOCButton = require('../../assets/img/OCGroupListWalkThroughIMGS/UpdateOCButton.PNG');
const UpdateOCScreen = require('../../assets/img/OCGroupListWalkThroughIMGS/UpdateOCScreen.PNG');

const OCGroupList = () => {
  return (
    <>
      <div>
        <ol>
          <li>
            First click the purple button "Click Here To Update The On Call Group List."<br /><br />
            <img src={UpdateOCButton} style={{maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            Once you have arrived to the Update On Call screen you will be able to access the website for updating the On Call Group List.<br /><br />
            <img src={UpdateOCScreen} style={{maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            Click the drop down list above and then select the account that you are updating. 
            Once the website opens the on call list for the account you want to update you will be able to select the Enable Editing Button.<br /><br />
            <img src={SelectEnableEditing} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            With editing enabled you will have auto-fill drop down lists to select an OC Group from. 
            You can either select from the drop down or if you want to type in your selection you can. 
            The website won't save your update unless the OC Group is a part of the provided list. <br />
            If the list needs more OC groups added, please submit a ticket VIA freshdesk so that a programmer can add additional groups for you to select from.<br /><br />
            <img src={SelectOrType} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            If one of the facilities does not have coverage for a specific option or time please select the No Coverage option from the drop down list. 
            The script will be programmed to look for this option and behave according to the info pages. <br /><br />
            <img src={NoCoverage} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            When you are done editing the OC Group List, click the "Save and View" button. This will then send you back to the review screen for the OC Group List.<br /><br />
          </li>
        </ol>
      </div>
    </>
  );
};

export default OCGroupList;