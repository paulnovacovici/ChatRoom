import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, socket }) => {

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') sendMessage(event);
    else {
      socket.emit("new-user-typing")
    }
  }

  const handleChange = ({ target: { value } }) => {
    setMessage(prevMessage => {
      if (!value) socket.emit("delete-typing");
      return value;
    })
  }

  return (
    < form className="form" >
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        autoFocus
        onKeyPress={handleKeyPress}
      />
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
    </form >
  )
}

export default Input;