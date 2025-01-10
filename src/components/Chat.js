// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, and, or } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

function Chat({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages between the current user and the selected user
  useEffect(() => {
    if (!selectedUser) return;

    const userEmail = auth.currentUser.email;

    // Use `and` to group the `or` conditions
    const q = query(
      collection(db, 'messages'),
      and(
        or(
          and(where('from', '==', userEmail), where('to', '==', selectedUser.email)),
          and(where('from', '==', selectedUser.email), where('to', '==', userEmail))
        )
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '' || !selectedUser) return;

    await addDoc(collection(db, 'messages'), {
      text: message,
      to: selectedUser.email,
      from: auth.currentUser.email,
      createdAt: new Date(),
    });
    setMessage('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h2>Select User to Chat</h2>
        {users.map(user => (
          <button key={user.id} onClick={() => setSelectedUser(user)}>
            {user.name} ({user.email})
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ textAlign: msg.from === auth.currentUser.email ? 'right' : 'left' }}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
