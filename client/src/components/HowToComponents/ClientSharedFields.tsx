// Contents provided by Stephen Merki
// Page Built by Stephen Merki

const ClientSharedFields = () => {
  return (
    <>
      <div id="clientSharedFields">
        <p>
          There are several client shared fields that exist in IS. 
          Below we are going to categorize them as <span style={{color: '#55FF55'}}>Green Light</span>, <span style={{color: '#FFFF55'}}>Yellow Light</span>, and <span style={{color: '#FF5533'}}>Red Light</span> shared fields. 
        </p>
        <ul>
          <li><span style={{color: '#55FF55'}}>Green Light:</span> These shared fields are more descriptive and will not impact the script.</li>
          <li><span style={{color: '#FFFF55'}}>Yellow Light:</span> These shared fields could potentially affect the script and adjust how we reach the on call or even who the on call is.</li>
          <li><span style={{color: '#FF5533'}}>Red Light:</span> These shared fields are designed to keep the script running. Please submit a support ticket if any of these need to be adjusted.</li>
        </ul>
        <h1 style={{color: '#55FF55'}}>Green Light Shared Fields</h1>
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
        <h1 style={{color: '#FFFF55'}}>Yellow Light Shared Fields</h1>
        <h1 style={{color: '#FF5533'}}>Red Light Shared Fields</h1>
        
      </div>
    </>
  );
};

export default ClientSharedFields;