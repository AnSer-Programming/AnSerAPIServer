const StepOne = require('../../assets/img/HowToIMGs/Status/StepOne.png');
const StepTwo = require('../../assets/img/HowToIMGs/Status/StepTwoNoScheduledStatus.png');
const StepThree = require('../../assets/img/HowToIMGs/Status/StepThreeWithScheduledStatus.png');
const StepFour = require('../../assets/img/HowToIMGs/Status/StepFourMissingRules.png');
const StepFive = require('../../assets/img/HowToIMGs/Status/StepFiveContactOrderEditor.png');
const StepSix = require('../../assets/img/HowToIMGs/Status/StepSixWithRules.png');

const Status = () => {
  return (
    <>
    <div>
      <h1>Setting Up Status's</h1> 
    </div>
      <div>
        <ol>
          <li>
            <p>
              In order to update the status for a contact you will first need to find the assigned directory for the client that you are doing the update for. 
              After you get into the correct directory you will be able to select the specific listing and select "Edit" from the listings toolbar.
            </p>
            <img src={StepOne} style={{maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            <p>
              After selecting the "Edit" you will need to select the Status tab and in there you should see a Default Status along with two additional tabs. 
              The Status Schedule and Contact Order tabs. 
              For this How To we will be setting up the Contact Order for the status of "Call Cell First".
            </p>
            <p>
              If you do not need to set up a Scheduled Status skip step 3.
            </p>
            <img src={StepTwo} style={{maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            <p>
              A Scheduled Status will allow IS Supervisor to automatically assign a status to a contact depending on the specified time range and which days of the week that time range is assigned to.
              If a status is expected to go overnight then it should be assigned to the Default Status. 
              Otherwise you will need to mark the status as ending at 11:59pm then starting back up at 12:00AM the next day.
            </p>
            <p>
              If you would like to learn more about how to handle the Office Open/Office Closed status's <strong>COMING SOON</strong>.
            </p>
            <img src={StepThree} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            <p>
              Currently there isn't a Contact Order set up for the status of Call Cell First. 
              In order to get the Contact Order set up you will need to click the "New" with the green plus in front of it in the Contact Order ribbon.
            </p>
            <img src={StepFour} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            <ul>
              <li>
                <p>
                  In the editor window you will need to select the status of Call Cell First from the drop down list. 
                  You can manually type it in but that has inconsistent results so you are better off selecting it instead.
                </p>
              </li>
              <li>
                <p>
                  After you have your status selected you will need to assign a Contact Method to it.
                  The Contact Method drop down will only include options that have data in them from the Fields tab.
                </p>
              </li>
              <li>
                <p>
                  The Attempts option will cover the number of times we should use this specific method in a row.
                  (Example: If a contact wanted to be called 2x then text you will set the number of attempts to 2. 
                  If the contact watned to be called then texted then called again you would set the attempts to 1 add a Text Contact Method then add another Cell Contact Method after the Text method.)
                </p>  
              </li>
              <li>
                <p>
                  The last option is the Interval in Minutes option. This will set the Auto-Cue for each attempt of the specified Contact Method.
                </p>
              </li>
              <li>
                <p>
                  Don't forget to save after setting up your Contact Method for the Status.
                </p>
              </li>
            </ul>
            <img src={StepFive} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
          <li>
            <p>
              After you finished with setting up your Contact Methods for a status you should see it as the last status in the Contact Order window.
              In order to get your changes to save be sure to select the Apply button.
            </p>
            <img src={StepSix} style={{border: "2px solid white", maxWidth: "100%"}} /><br /><br /><br />
          </li>
        </ol>
      </div>
    </>
  );
};

export default Status;