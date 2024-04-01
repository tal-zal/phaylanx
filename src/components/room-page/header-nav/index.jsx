import { Logo } from "./Logo";
import { Button } from "../../button";
import { IconLink, IconQRCode, IconMenu, IconSparkle } from "../../icon";
import { ChatGPTUserIcon } from "./chat-gpt-user-icon";
import { useParams, Link } from "react-router-dom";
import QRCodePNG from "./qr-code.png";

import styles from "./styles.module.scss";
import { useState } from "react";

export const HeaderNav = ({ showChat, setShowChat }) => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const { id } = useParams();

  const onClickCopyCode = () => navigator.clipboard.writeText(id);

  const onClickToggleChat = () => setShowChat(!showChat);

  const handleEmailButtonClick = () => {
    setShowSupportModal(true); 
    console.log("Email button clicked!");
  };

  return (
    <>
      <header className={styles.header}>
        <Link to="/">
          <Logo/>
        </Link>
        <label className={styles.menuIcon} htmlFor="menuIconCheckbox">
          <IconMenu />
        </label>
        <input type="checkbox" id="menuIconCheckbox" />
        <div className={styles.actions}>
          {/* <UserAvatarList users={["Frodo", "Sam"]} /> */}
          <Button variant="tetriary" onClick={() => setShowQRCodeModal(true)}>
            <IconQRCode />
            Show QR Code
          </Button>
          <Button variant="tetriary" onClick={onClickCopyCode}>
            <IconLink />
            Copy Room Code
          </Button>
          <Button onClick={handleEmailButtonClick}>
            Contact Us
          </Button>
          <Button onClick={onClickToggleChat} className={styles.toggleChatBtn}>
            <IconSparkle />
            Toggle Chat
          </Button>
        </div>
      </header>
      {showSupportModal && (
        <SupportModal setShowSupportModal={setShowSupportModal} />
      )}
      {showQRCodeModal && (
        <QRCodeModal setShowQRCodeModal={setShowQRCodeModal} />
      )}
    </>
  );
};

const UserAvatarList = ({ users = [] }) => {
  const [currentUserToolTip, setCurrentUserToolTip] = useState("");

  return (
    <div className={styles.userAvatarList}>
      {users.map((name, index) => (
        <div
          className={styles.avatarContainer}
          key={index}
          onMouseEnter={() => setCurrentUserToolTip(name)}
          onMouseLeave={() => setCurrentUserToolTip("")}
        >
          <div className={styles.avatar}>{name[0]}</div>
          <span
            className={`${styles.toolTip} ${
              currentUserToolTip === name ? styles.showToolTip : ""
            }`}
          >
            {name}
          </span>
        </div>
      ))}
      <ChatGPTUserAvatar />
    </div>
  );
};

const ChatGPTUserAvatar = () => {
  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <div
      className={styles.avatarContainer}
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
    >
      <div className={styles.chatGptUserAvatar}>
        <ChatGPTUserIcon />
        <span
          className={`${styles.toolTip} ${
            showToolTip ? styles.showToolTip : ""
          }`}
        >
          ChatGPT
        </span>
      </div>
    </div>
  );
};

const QRCodeModal = ({ setShowQRCodeModal }) => {
  return (
    <div
      className={styles.qrCodeModal}
      onClick={() => setShowQRCodeModal(false)}
    >
      <div className={styles.content}>
        <h1>Scan the QR code to join the room</h1>
        <img src={QRCodePNG} alt="QR Code" />
      </div>
    </div>
  );
};

// SupportModal Component
const SupportModal = ({ setShowSupportModal }) => {
  console.log("SupportModal rendered");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketContent = `Subject: ${subject}\nDescription: ${description}`;

    try {
      const response = await fetch(
        import.meta.env.VITE_CLOUD_SUPPORTTICKET_URL, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         
          body: JSON.stringify({ ticket: ticketContent }),
        }
      );

      if (response.ok) {
        alert("Your message has been sent to support.");
        setShowSupportModal(false); 
      } else {
        const errorData = await response.json(); 
        alert(`Error sending message: ${errorData.error || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className={styles.supportModal}>
      <form onSubmit={handleSubmit}>
        <h2>Contact Support</h2>
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>
        <label>
          Please provide a brief description of the issue:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <div>
          <button type="submit">Send</button>
          <button type="button" onClick={() => setShowSupportModal(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};