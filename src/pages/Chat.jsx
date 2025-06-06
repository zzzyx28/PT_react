import React, { useState, useEffect, useRef } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import 'emoji-picker-element';

const initialUsers = [
  { id: 1, name: '用户A', unread: 3 },
  { id: 2, name: '用户B', unread: 0 },
  { id: 3, name: '用户C', unread: 0 }
];

const initialMessages = {
  1: [
    { id: 1, text: '你好，最近怎么样？', sender: 'user', timestamp: '10:30' },
    { id: 2, text: '还不错，你呢？😊', sender: 'other', timestamp: '10:31', isNew: true },
    { id: 3, text: '周末有空吗？', sender: 'other', timestamp: '10:32', isNew: true },
    { id: 4, text: '一起吃饭吧！', sender: 'other', timestamp: '10:33', isNew: true }
  ],
  2: [],
  3: [
    { id: 1, text: '项目进展如何？👍', sender: 'other', timestamp: '09:15', isNew: true }
  ]
};

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [users, setUsers] = useState(initialUsers);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // 初始化表情选择器
  useEffect(() => {
    if (emojiPickerRef.current && !emojiPickerRef.current.shadowRoot) {
      const picker = document.createElement('emoji-picker');
      emojiPickerRef.current.appendChild(picker);
      
      picker.addEventListener('emoji-click', (event) => {
        const emoji = event.detail.unicode;
        setInputText(prev => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current.focus();
      });
    }
  }, []);

  // 模拟接收新消息
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机选择一个用户发送新消息
      const randomUserId = Math.floor(Math.random() * 3) + 1;
      if (randomUserId !== selectedUserId) {
        const newMessage = {
          id: Date.now(),
          text: `这是新消息 ${new Date().toLocaleTimeString()}`,
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        };

        setMessages(prev => ({
          ...prev,
          [randomUserId]: [...prev[randomUserId], newMessage]
        }));

        setUsers(prev => prev.map(user => 
          user.id === randomUserId 
            ? { ...user, unread: user.unread + 1 } 
            : user
        ));
      }
    }, 1000); // 每10秒模拟一条新消息

    return () => clearInterval(interval);
  }, [selectedUserId]);

  // 当切换用户时，清除该用户的新消息标记
  useEffect(() => {
    if (selectedUserId) {
      // 清除未读计数
      setUsers(prev => prev.map(user => 
        user.id === selectedUserId 
          ? { ...user, unread: 0 } 
          : user
      ));

      // 清除消息的isNew标记
      setMessages(prev => {
        const updatedMessages = { ...prev };
        if (updatedMessages[selectedUserId]) {
          updatedMessages[selectedUserId] = updatedMessages[selectedUserId].map(msg => ({
            ...msg,
            isNew: false
          }));
        }
        return updatedMessages;
      });
    }
  }, [selectedUserId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedUserId]: [...prev[selectedUserId], newMessage]
    }));
    setInputText('');
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  return (
    <div style={{
      display: 'flex',
      height: '93.5vh',
      width: '80vw',
      backgroundColor: '#1a1a1a',
      color: 'white',
      position: 'relative'
    }}>
      {/* 左侧用户列表 */}
      <div style={{
        width: '300px',
        borderRight: '1px solid #333',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '16px' }}>联系人</h3>
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: selectedUserId === user.id ? '#333' : 'transparent',
              cursor: 'pointer',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <span>{user.name}</span>
            {user.unread > 0 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ff4d4f',
                boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)'
              }}></div>
            )}
            {user.unread > 0 && (
              <span style={{
                background: '#ff4d4f',
                borderRadius: '12px',
                padding: '2px 6px',
                fontSize: '0.7em',
                color: 'white',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {user.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 右侧聊天区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 消息展示区域 */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          borderBottom: '1px solid #333'
        }}>
          {messages[selectedUserId].map(msg => (
            <div
              key={msg.id}
              style={{
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                position: 'relative'
              }}
            >
              {msg.isNew && msg.sender === 'other' && (
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: msg.sender === 'user' ? 'auto' : '-10px',
                  right: msg.sender === 'user' ? '-10px' : 'auto',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ff4d4f',
                  boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)'
                }}></div>
              )}
              <div style={{
                background: msg.sender === 'user' ? '#007bff' : '#333',
                borderRadius: '12px',
                padding: '8px 12px',
                maxWidth: '60%',
                position: 'relative'
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                <div style={{
                  fontSize: '0.8em',
                  opacity: 0.7,
                  textAlign: 'right',
                  marginTop: '4px'
                }}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <form onSubmit={handleSend} style={{ padding: '24px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={toggleEmojiPicker}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '8px'
              }}
            >
              <SmileOutlined />
            </button>
            
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="输入消息..."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '20px',
                border: 'none',
                background: '#333',
                color: 'white',
                minHeight: '50px',
                maxHeight: '150px',
                fontSize: '16px',
                resize: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              发送
            </button>
          </div>
          
          {/* 表情选择器 */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '40px',
                zIndex: 1000
              }}
            ></div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;