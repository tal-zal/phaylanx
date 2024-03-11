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
    const hardcodedToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4YmY1YzM3NzJkZDRlN2E3MjdhMTAxYmY1MjBmNjU3NWNhYzMyNmYiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF6cCI6IjExMjE5NjUzMjA2MjIwMzQzNDIxMSIsImV4cCI6MTcxMDEyMDA2MSwiaWF0IjoxNzEwMTE2NDYxLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMTIxOTY1MzIwNjIyMDM0MzQyMTEifQ.AfqppWY2ZD3ncdkbXyEI1biwU0gkFlNRxJH-c4fyFq9TSSBnz79SkW9CBitWdZspLnf9CE3mDbcI9Kv-EuONTtL1fJSu4KhEK6nIEDSDpAFpl9vbG5xDJENDIp0Hhrwwz_pWJIi-_cwurqLyKcHlKAZ9wQeG_yP1xU0YZpoQcfs398W67v6srayTBTg9tCn2p2M1qTWkctmh0dHGpTSQ2gn5-UsmWHsBmH1oTTwNPz6jO1FUOgo5soLLOtjz4rnuKucvnhzutobC9Rsz2WcgOs7MMf5b1x8Lnl40ySr8qVi9Fypl8Yoq5G-ccwfh_P0DIFLK3bNdOGGUaAq3bUDajQ";
  
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
  
      const response = await fetch('https://us-west1-phaylanx.cloudfunctions.net/repl_it', {
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
            <option value="html">HTML</option>
            <option value="xml">XML</option>
            <option value="css">CSS</option>
            <option value="sass">Sass</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="django">Django</option>
            <option value="java">Java</option>
            <option value="kotlin">Kotlin</option>
            <option value="c_cpp">C/C++</option>
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
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
