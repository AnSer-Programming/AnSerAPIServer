const AnswerPhraseGuide = () => {
  return (
    <>
      <div id="acronym">
        <h1>Answer Phrase Acronyms</h1>
        <p>
          These acronyms are primarily used in Infinity because the answer phrase has a character limit.
          If you are having issues with getting everything included in the answer phrase please submit a ticket to programming.
        </p>
        <ul>
          <h3>
            TYFC
          </h3>
          <li>
            <p>
              Thank you for calling
            </p>
          </li>
          <h3>
            HMIHU
          </h3>
          <li>
            <p>
              How May I Help You
            </p>
          </li>
        </ul>
      </div>
      <div id="infinity">
        <h1>Infinity Answer Phrase Structure</h1>
        <ul>
          <li>
            <p>{"{"}T = [Good Morning!, Good Afternoon!, Good Evening!] (this changes based off of the time of day)</p>
            <p>T = Time of day</p>
          </li>
          <li>
            <p>{"{"}C = [Company Name] (this adjusts based off of the account that is brought up)</p>
            <p>C = Client/Company Name</p>
          </li>
          <li>
            <p>{"{"}O = [Agent Name] (this changes based off of who the call is assigned to)</p>
            <p>O = Operator(Agent) Name</p>
          </li>
          <li>
            How may I help you?
          </li>
        </ul>
        <p>
          All together the answer phrase should look like: {"{"}T {"{"}C. This is {"{"}O. How may I help you?
        </p>
      </div>
      <div id="is">
        <div>
          <h1>IS Answer Phrase Structure</h1>
          <p>[ ] shows the sections of the answer phrase that either changes by the time of day, by account, or by who is currently in the account.</p>
          <ul>
            <li>
              Greeting: [Good Morning!, Good Afternoon!, Good Evening!] (this changes based off of the time of day)
            </li>
            <li>
              [Company Name] (this adjusts based off of the account that is brought up)
            </li>
            <li>
              This is [Agent Name] (this changes based off of who the call is assigned to)
            </li>
            <li>
              How may I help you?
            </li>
          </ul>
          <p>
            All together the answer phrase should look like: [Good Morning!, Good Afternoon!, Good Evening!] [Company Name]. This is [Agent Name]. How may I help you?
          </p>
        </div>
      </div>
    </>
  );
};

export default AnswerPhraseGuide;