import { LogoBig } from "./logo-big";
import { Logo } from "./logo";
import { Blob } from "./blob1";
import { IconSparkle, IconCheck } from "../icon";
import { Button } from "../button";
import { useNavigate } from "react-router-dom";
import { Wave } from "./wave";
import { Wave2 } from "./wave2";

import styles from "./style.module.scss";
import { useState } from "react";

<script
  src="
https://cdn.jsdelivr.net/npm/kute.js@2.2.4/dist/kute.min.js
"
></script>;

export const LandingPage = () => {
  const [codeInput, setCodeInput] = useState("");
  const navigate = useNavigate();

  const generateRandomNumber = () => {
    const min = 1000;
    const max = 9999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const onClickCreateRoom = () => {
    navigate(`/room/${generateRandomNumber()}`);
  };

  const onClickJoinRoom = () => {
    if (codeInput.trim() === "") {
      return;
    }
    navigate(`/room/${codeInput}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onClickJoinRoom();
    }
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.lowerMargin}></div>
      <div className={styles.upperMargin}></div>
      <div className={styles.waveContainer2}>
        <Wave2 />
      </div>

      <div className={styles.waveContainer}>
        <Wave />
      </div>

      <header>
        <LogoBig />

        <p>Code alongside friends, colleagues, and ChatGPT</p>
      </header>

      <div className={styles.actions}>
        <Button size="big" onClick={onClickCreateRoom}>
          <IconSparkle />
          Create Room
        </Button>
        <p>or</p>
        <div className={styles.joinRoomCodeInput}>
          <input
            type="text"
            placeholder="Enter code"
            value={codeInput}
            onChange={(ev) => setCodeInput(ev.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="secondary" onClick={onClickJoinRoom}>
            <IconCheck />
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
};
