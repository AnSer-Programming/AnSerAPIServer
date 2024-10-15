import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { sendEmailReportIssueFeedback } from '../utils/API';

const ReportIssue = () => {
  const [urgency, setUrgency] = useState<String>("");
  const [fullName, setFullName] = useState<String>("");
  const [url, setURL] = useState<String>("");
  const [description, setDescription] = useState<String>("");
  const [errorStatement, setErrorStatement] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const buttonHandler = (button: string) => {
    if (button == "bugReport") {
      setUrgency("true");
    } else {
      setUrgency("false");
    }
  }

  useEffect(() => { setSubmitted(false); }, [submitted])

  const reportHandler = (label: string, event: any) => {
    switch (label) {
      case "FullName":
        setFullName(event);
        break;
      case "URL":
        setURL(event);
        break;
      case "Statement":
        setDescription(event);
        break;
      default:
        break;
    }
  }

  const submitHandler = async () => {
    let requiredFields: boolean[] = new Array();
    let error: any[] = new Array();

    if (urgency) {
      requiredFields[0] = true;
    } else {
      requiredFields[0] = false;

      error.push(<p>*Please Select Either Feedback or Bug Report</p>);
    }

    if (fullName) {
      requiredFields[1] = true;
    } else {
      requiredFields[1] = false;

      error.push(<p>*Please enter your full name in the Text Field labelled Full Name</p>);
    }

    if (url) {
      requiredFields[2] = true;
    } else {
      requiredFields[2] = false;

      error.push(<p>*Please copy the current URL from the Address bar and paste it into the Text Field labelled URL</p>);
    }

    if (description) {
      requiredFields[3] = true;
    } else {
      requiredFields[3] = false;

      error.push(<p>*Please give a description on how you found this issue and type it into the Text Field labelled Description</p>);
    }

    if (requiredFields[0] && requiredFields[1] && requiredFields[2] && requiredFields[3]) {
      const data: {} = {
        urgent: `${urgency}`,
        fullName: `${fullName}`,
        url: `${url}`,
        statement: `${description}`
      }
      setErrorStatement([<p>Thank you!</p>]);
      setSubmitted(true);
      setUrgency("");
      setFullName("");
      setURL("");
      setDescription("");

      await sendEmailReportIssueFeedback(data);
    } else {
      setErrorStatement(error);
    }
  }

  return (
    <>
      <div>
        <p>Please fill out all of the fields provided!</p>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={() => { buttonHandler("feedback") }} id="feedback" color={urgency == "false" ? "success" : "primary"}>Feedback</Button>
          <Button onClick={() => { buttonHandler("bugReport") }} id="bugReport" color={urgency == "true" ? "success" : "primary"}>Bug Report</Button>
        </ButtonGroup> <br /> <br />

        <TextField label="Full Name" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          reportHandler("FullName", event.target.value);
        }}
          id="fullName"
          sx={{ width: '100%', background: 'white', zIndex: 0 }}
          variant="filled"
          value={fullName} />

        <TextField label="URL" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          reportHandler("URL", event.target.value);
        }}
          id="url"
          sx={{ width: '100%', background: 'white', zIndex: 0 }}
          variant="filled"
          value={url} />

        <TextField label="Description" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          reportHandler("Statement", event.target.value);
        }}
          id="description"
          multiline
          minRows={4}
          maxRows={8}
          sx={{ width: '100%', background: 'white', zIndex: 0 }}
          variant="filled"
          value={description} /> <br /> <br />

        <div id="errorHolder">{errorStatement}</div> <br /> <br />

        <Button onClick={submitHandler} color="error" variant="contained">{urgency == "true" ? "! " : ""}Submit{urgency == "true" ? " !" : ""}</Button>
      </div>
    </>
  )
}

export default ReportIssue;