import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { Button } from "../../button";
import { IconTidyUp, IconCopy, IconChevronDown, IconPlay } from "../../icon";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-django";
import "ace-builds/src-noconflict/mode-typescript";

import { ref, onValue, set, update } from "firebase/database";

import styles from "./style.module.scss";

export const CodePanel = ({
  codeContent,
  setCodeContent,
  language,
  setLanguage,
  database,
  id,
  date,
}) => {
  // This sets the initial listener for the database code
  useEffect(() => {
    const databaseCodePath = ref(database, date + "/" + id + "/code/");
    // attach listener to the database path
    onValue(databaseCodePath, (snapshot) => {
      const data = snapshot.val();
      setCodeContent(data);
    });
  }, [database, date, id]);

  const onChangeCodeContent = async (ev) => {
    setCodeContent(ev);

    // Try to update if there is text there. If it doesn't work, replace
    try {
      update(ref(database, date + "/" + id + "/code/"), ev);
    } catch (error) {
      set(ref(database, date + "/" + id + "/code/"), ev);
    }
  };

  const onClickCopyCode = () => navigator.clipboard.writeText(codeContent);

  const [executionResult, setExecutionResult] = useState('');


  const onRunCode = async () => {
    if (!codeContent.trim()) {
      console.log("No code to run");
      setExecutionResult("No code to run");
      return;
    }

    //Hardcoded Token for testing REMOVE AFTER
    const hardcodedToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4YmY1YzM3NzJkZDRlN2E3MjdhMTAxYmY1MjBmNjU3NWNhYzMyNmYiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF6cCI6IjExMjE5NjUzMjA2MjIwMzQzNDIxMSIsImV4cCI6MTcxMDE5NTE2MCwiaWF0IjoxNzEwMTkxNTYwLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMTIxOTY1MzIwNjIyMDM0MzQyMTEifQ.m0CeD9X4NiaQ1QVHYUpNI1ERlwzOkMXJ54OO47PEn0-wn7sOQSUvltnwoksNphGgoyw_ZhN50oZ7X1Wwdn_Y7bZpYXLFB1MMBtc5BVB4msp96ZH68V_cqU3CzuV5nZ_ka_5JK3uneHtcRd8UzZ1CYYxicLPWS7vtgHfOCB7YGm-4o-9bdPG-E3KXapj3HaBhhjDKcKvMdkRwj4P7IMAuvN_6gk2K-HJpblAkBkVApqgydbNUm-22c3GPSHY9s79XTsISgvv1h0Sl_L6o-t80YZwt1YmK34mhbcwr1lDlOp9VgM8GIi4AdcirxL_vOW2RhaIDcq8KFn3NO5THHt-vng";
  
    // Prepare the file to be sent
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const file = new File([blob], 'payload.py', { type: 'text/plain' });
  
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      // Get the current user's ID token
      //const user = firebase.auth().currentUser;
      //const idToken = user ? await user.getIdToken() : null;
  
      const response = await fetch('https://us-west1-phaylanx.cloudfunctions.net/run_python', {
        method: 'POST',
        headers: {
          // Add the Authorization header if your cloud function expects it
          // Authorization: `Bearer ${idToken}`
          'Authorization': `Bearer ${hardcodedToken}`
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Execution result:", result.output);
      setExecutionResult(result.output);
    } catch (error) {
      console.error('Failed to run code:', error);
      setExecutionResult(`Error: ${error.message}`);
    }
  };


  return (
    <div className={styles.codePanel}>
      <header className={styles.header}>
        <div className={styles.languageSelect}>
          <select
            onChange={(ev) => {
              ev.preventDefault();
              setLanguage(ev.target.value);
            }}
          >
            <option value="python">Python</option>
          </select>
          <IconChevronDown />
        </div>
        <div className={styles.actions}>
        <Button variant="tetriary" onClick={onRunCode}>
            <IconPlay />
            Run
          </Button>
         
          <Button variant="tetriary">
            <IconTidyUp />
            Tidy Up
          </Button>
        </div>
      </header>
      <AceEditor
        className={styles.editor}
        mode={language}
        theme="chaos"
        name="editor"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={codeContent}
        onChange={onChangeCodeContent}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    <div className={styles.executionResult}>
      <h3>Execution Result:</h3>
      <pre>{executionResult || "Run your code to see the results here."}</pre>
    </div>
    </div>
  );
};
