import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMessages, sendMessage } from '../../services/chatService';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('/', { autoConnect: false });

const ChatConversation = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    socket.emit('join', user._id);
    getMessages(userId!).then(setMessages);
    socket.on('receiveMessage', (msg) => {
      if (msg.sender === userId || msg.recipient === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = await sendMessage(userId!, input);
    socket.emit('sendMessage', { sender: user._id, recipient: userId, content: input, chatType: 'user' });
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        {messages.map((msg, i) => (
          <div key={msg._id || i} className={`mb-2 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg ${msg.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default ChatConversation;