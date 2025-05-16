import React, { useState, useEffect } from 'react';

// 模拟用户列表数据
const initialUsers = [
  { id: 1, name: '用户A' },
  { id: 2, name: '用户B' },
  { id: 3, name: '用户C' }
];

// 模拟消息数据（按用户ID分类）
const initialMessages = {
  1: [
    { id: 1, text: '你好，最近怎么样？', sender: 'user', timestamp: '10:30' },
    { id: 2, text: '还不错，你呢？', sender: 'other', timestamp: '10:31' }
  ],
  2: [],
  3: [
    { id: 1, text: '项目进展如何？', sender: 'other', timestamp: '09:15' }
  ]
};

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [users, setUsers] = useState(initialUsers);

  // 轮询消息更新[9,10](@ref)
  useEffect(() => {
    const interval = setInterval(() => {
      // 这里替换为实际的API请求
      console.log('轮询消息更新...');
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedUserId]); // 用户切换时重新启动轮询

  // 发送消息处理
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages[selectedUserId].length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedUserId]: [...prev[selectedUserId], newMessage]
    }));
    setInputText('');
  };

  return (
    <div style={{
      display: 'flex',
      height: '93.5vh',
      width: '80vw',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      {/* 左侧用户列表 */}
      <div style={{
        width: '300px',
        borderRight: '1px solid #333',
        padding: '16px'
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
              alignItems: 'center'
            }}
          >
            <span>{user.name}</span>
            {user.unread > 0 && (
              <span style={{
                background: '#007bff',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '0.8em'
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
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                background: msg.sender === 'user' ? '#007bff' : '#333',
                borderRadius: '12px',
                padding: '8px 12px',
                maxWidth: '60%'
              }}>
                <div>{msg.text}</div>
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
        <form onSubmit={handleSend} style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <textarea
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入消息..."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '20px',
                border: 'none',
                background: '#333',
                color: 'white',
                height: '50px',
                fontSize: '16px'
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
        </form>
      </div>
    </div>
  );
};

export default Chat;