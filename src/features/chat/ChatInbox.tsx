import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getConversations } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';

const ChatInbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getConversations().then(setConversations);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      <ul>
        {conversations.map(conv => (
          <li key={conv._id} className="border-b py-2 cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/chat/${conv.sender._id === user._id ? conv.recipient._id : conv.sender._id}`)}>
            <div className="font-semibold">{conv.sender._id === user._id ? conv.recipient.name : conv.sender.name}</div>
            <div className="text-gray-500 text-sm">{conv.content}</div>
            <div className="text-xs text-gray-400">{new Date(conv.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatInbox;