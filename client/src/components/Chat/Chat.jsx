import React from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css'

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import UserContainer from '../UserContainer/UserContainer';


const ENDPOINT = 'localhost:5000';

let socket;


export default function Chat() {
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userTyping, setUserTyping] = React.useState(null);

  React.useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);
    setName(name);
    setRoom(room);

    socket = io(ENDPOINT);

    socket.on('connect', () => {
      console.log("HERE");
      console.log("TODAY")
      socket.emit('join', { name, room }, () => alert("Username taken"))
    })

    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message])
    })

    socket.on('chat-users', (users) => {
      setUsers(users);
    })

    socket.on('chat-typing', (user) => {
      setUserTyping(user);
    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('send-message', message);
    }

    setMessage('');
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <div className="innerContainer" >
          <Messages messages={messages} name={name} userTyping={userTyping} />
          {userTyping &&
            <div className="messageContainer justifyStart typingHint">
              <p className="sentText pl-10 "><i>{`${userTyping.name} is typing...`}</i></p>
            </div>}
        </div>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} socket={socket} />
      </div>
      <UserContainer users={users} />
    </div>
  );
}
