// Contents provided by Stephen Merki
// Page Built by Stephen Merki

const ClientSharedFields = () => {
  return (
    <>
      <div id="clientSharedFields">
        <p>
          There are several client shared fields that exist in IS.
          Below we are going to categorize them as <span style={{ color: '#55FF55' }}>Green Light</span>, <span style={{ color: '#FFFF55' }}>Yellow Light</span>, and <span style={{ color: '#FF5533' }}>Red Light</span> shared fields.
        </p>
        <ul>
          <li><span style={{ color: '#55FF55' }}>Green Light:</span> These shared fields are more descriptive and will not impact the script.</li>
          <li><span style={{ color: '#FFFF55' }}>Yellow Light:</span> These shared fields could potentially affect the script and adjust how we reach the on call or even who the on call is.</li>
          <li><span style={{ color: '#FF5533' }}>Red Light:</span> These shared fields are designed to keep the script running. Please submit a support ticket if any of these need to be adjusted.</li>
        </ul>
        <h1 style={{ color: '#55FF55' }}>Green Light Shared Fields</h1>
        <ul>
          <li>Client_02_Description</li>
          <li>Client_07_Address</li>
          <li>Client_08_Suite</li>
          <li>Client_09_City_State_Zip</li>
          <li>Client_10_Phone</li>
          <ul>
            <li>Any others that being with Client_10 can be updated as well</li>
          </ul>
          <li>Client_11_Alt_Phone_1</li>
          <li>Client_12_Alt_Phone_2</li>
          <li>Client_14_Call_ForwardingOtherOffices</li>
          <li>Client_16_Office_Contact</li>
          <li>Client_31_Website</li>
          <li>Client_33_CueTime</li>
          <ul>
            <li>This is different than the morning cue.  This would be used in certain scripts that are using the 'Delivery' screen and will only be minutes (10, 15, 60, etc)</li>
          </ul>
          <li>Client_34_Directions</li>
          <li>Rates - XX</li>
          <ul>
            <li>
              These are used for clients that may have multiple rates that we quote to callers.
              The shared field will most often link up with the info pages and script.
            </li>
          </ul>
        </ul>
        <h1 style={{ color: '#FFFF55' }}>Yellow Light Shared Fields</h1>
        <ul>
          <li>Client_01_Name</li>
          <ul>
            <li>IS client anme and Infinity client name will also need to be udpated</li>
          </ul>
          <li>Client_03_Hours</li>
          <ul>
            <li>Recordings may need to be remade</li>
            <li>The directory listing for the Office will need to be updated</li>
            <ul>
              <li>Send a ticket to programming if the script has different protocols for business and after hours but you can't find the Office listing in the directory</li>
            </ul>
          </ul>
          <li>Client_03_Timezone</li>
          <ul>
            <li>You'll need to make sure that the time zone has been adjusted in Infinity and in IS</li>
            <li>Office listing in the directory may need to be adjusted</li>
          </ul>
          <li>Client_04_Lunch</li>
          <ul>
            <li>Office directory list might need to be updated</li>
          </ul>
          <li>Client_13_Fax</li>
          <ul>
            <li>Ultracomm, IS System Schedule, and/or the Directory will need to be updated</li>
          </ul>
          <li>Call_14_Call_Forwarding</li>
          <ul>
            <li>The Source would need to be confirmed in Infinity and IS</li>
          </ul>
          <li>Call_15_Cue_Info</li>
          <ul>
            <li>IS or Infinity System Schedule will need to be updated</li>
          </ul>
          <li>Client_18_Take_Routine</li>
          <ul>
            <li>Setting this field to 'No' will make it so that Routine messages cannot be taken if the script is using this field</li>
          </ul>
          <li>Client_19_Take_Urgent</li>
          <ul>
            <li>Setting this field to 'No' will make it so that Urgent messages cannot be taken if the script is using this field</li>
          </ul>
          <li>Client_20_Take_Cancellations</li>
          <ul>
            <li>Setting this field to 'No' will make it so that Cancellations cannot be taken if the script is using this field</li>
          </ul>
          <li>Client_20_Take_UrgentRxRefills</li>
          <ul>
            <li>Setting this field to 'No' will make it so that Urgent Rx Refills cannot be taken if the script is using this field</li>
          </ul>
          <li>Client_24_Lockouts</li>
          <ul>
            <li>Setting this field to 'No' will make it so that Lockouts cannot be taken if the script is using this field</li>
          </ul>
          <li>Client_25_Office_Email</li>
          <ul>
            <li>Ultracomm, IS System Schedule, and/or the Directory may need to be changed</li>
          </ul>
          <li>Client_XX_Alternate_Email_XX</li>
          <ul>
            <li>Ultracomm, IS System Schedule, and/or the Directory may need to be changed</li>
          </ul>
          <li>Client_36_Holidays</li>
          <ul>
            <li>The directory listing should be confirmed that it has Holiday/Days checked</li>
            <li>Confirm that the Holidays section of the client has the days needed as well</li>
          </ul>
          <li>Client_36_Holidays_ReducedHours</li>
          <ul>
            <li>The directory listing should be confirmed that it has Holiday/Days checked</li>
            <li>Confirm that the Holidays section of the client has the days needed as well</li>
          </ul>
          <li>Client_999_DateOffService</li>
          <ul>
            <li>Only use if you are deactivating a client</li>
          </ul>
          <li>Contact_XX</li>
          <ul>
            <li>
              These listing will more than likely be used in the Info Pages nad in the Script. 
              Make sure that when changing them you match it exactly to whatever is in the Directory.
            </li>
          </ul>
          <li>Website_XX</li>
          <ul>
            <li>
              These fields will be used for usernames and passwords for certain websites.
              These should only ever be changed if there is an update requested by the client or a prompt for an updated password when we try to log-in.
            </li>
            <li>Verify that the username and password work before saving them to avoid potential account errors</li>
          </ul>
        </ul>
        <h1 style={{ color: '#FF5533' }}>Red Light Shared Fields</h1>
        <ul>
          <li>Client_05_Routine_Instructions</li>
          <ul>
            <li>This will require a script change</li> 
            <li>These changes should be done either in conjuntion with the changes or after the changes have been made</li>
          </ul>
          <li>Client_05_Routine_Instructions_Business_Hours</li>
          <ul>
            <li>This will require a script change</li> 
            <li>These changes should be done either in conjuntion with the changes or after the changes have been made</li>
          </ul>
          <li>Client_06_Urgent_Instructions</li>
          <ul>
            <li>This will require a script change</li> 
            <li>These changes should be done either in conjuntion with the changes or after the changes have been made</li>
          </ul>
          <li>Client_06_Urgent_Instructions_Business_Hours</li>
          <ul>
            <li>This will require a script change</li> 
            <li>These changes should be done either in conjuntion with the changes or after the changes have been made</li>
          </ul>
          <li>Client_17_AutoDispatch_Switch</li>
          <ul>
            <li>This is an old field that could potentially break older script</li>
          </ul>
          <li>Client_21_Use_Triage</li>
          <ul>
            <li>This will require a script change</li> 
            <li>These changes should be done either in conjuntion with the changes or after the changes have been made</li>
          </ul>
          <li>Client_22_Filter</li>
          <ul>
            <li>This field is used when querying the database</li>
            <li>If this field is adjusted drop down lists that use the database will no longer have anything in them</li>
          </ul>
          <li>Client_22_Filter_Alt</li>
          <ul>
            <li>This field is used when querying the database</li>
            <li>If this field is adjusted drop down lists that use the database will no longer have anything in them</li>
          </ul>
          <li>Client_32_APIKey</li>
          <ul>
            <li>If this field is cleared or changed we will no longer be able to connect to an API that the client has provided for us</li>
            <li>Send to programming to update so that we can test the API connection before updating it into the script</li>
          </ul>
          <li>Client_35_OnCallScheduleNameXX</li>
          <ul>
            <li>These are most likely used for sub-accounts and/or if the account has multiple on call schedules</li>
            <li>These should be changed by a programmer so that we can also update the scripts while changing these fields</li>
          </ul>
          <li>Client_37_DailyEmailThrough</li>
          <ul>
            <li>This field is used state if we are using Ultracomm or the System Schedule for the Hold event auto-emails that we send out</li>
          </ul>
          <li>Client_38_IndividualEmailThrough</li>
          <ul>
            <li>This field states if we are using Ultracomm or if we are getting the email from the directory for Auto-Email as taken messages</li>
          </ul>
          <li>Client_39_OCEnteredThrough</li>
          <ul>
            <li>This field states whether the O/C is changed in the OnCall Schedule in the directory, in script, or if there is a MergeComm job that adjusts the O/C</li>
          </ul>
          <li>Client_40_OCSkillGrp</li>
        </ul>
      </div>
    </>
  );
};

export default ClientSharedFields;