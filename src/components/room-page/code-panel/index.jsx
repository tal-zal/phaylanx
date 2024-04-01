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

  const [executionResult, setExecutionResult] = useState("");

  const onRunCode = async () => {
    if (!codeContent.trim()) {
      console.log("No code to run");
      setExecutionResult("No code to run");
      return;
    }

    //Hardcoded Token for testing REMOVE AFTER

    // Prepare the file to be sent
    const blob = new Blob([codeContent], { type: "text/plain" });
    const file = new File([blob], "payload.py", { type: "text/plain" });

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Get the current user's ID token
      //const user = firebase.auth().currentUser;
      //const idToken = user ? await user.getIdToken() : null;

      const pythonURL = import.meta.env.VITE_CLOUD_PYTHONRUN_URL;

      const response = await fetch(pythonURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Execution result:", result.output);
      setExecutionResult(result.output);
    } catch (error) {
      console.error("Failed to run code:", error);
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
        
        <div className={styles.terminalLine}>
          <pre>
          <div className={styles.greenArrow}></div>
            {executionResult || "Run your code to see the results here."}
          </pre>
          <div className={styles.cursor}></div>
        </div>
      </div>
    </div>
  );
};
