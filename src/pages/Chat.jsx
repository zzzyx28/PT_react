import React, { useState, useEffect } from 'react';
import './Chat.css'
import axios from 'axios';

const PrivateMessageSystem = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyReceiver, setReplyReceiver] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 当前用户ID
  const currentUserId = localStorage.getItem('username'); 

  // 创建带有token授权的axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/message',
});

// 添加请求拦截器，为每个请求添加Authorization头部
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

  // 获取私信数据
const fetchMessages = async () => {
  setIsLoading(true);
  try {
    console.log(currentUserId)
    if (activeTab === 'inbox') {
      // 获取收件箱消息
      const response = await apiClient.get(`/received?userId=${currentUserId}`);
      setMessages(response.data || []);
    } else {
      // 获取全部消息
      const allResponse = await apiClient.get(`/all?userId=${currentUserId}`);
      const allMessages = allResponse.data || [];

      if (activeTab === 'sent') {
        // 过滤出当前用户发送的消息
        const sentMessages = allMessages.filter(
          msg => msg.senderId === currentUserId
        );
        setMessages(sentMessages);
      } else {
        // 显示全部消息
        setMessages(allMessages);
      }
    }
  } catch (error) {
    console.error('获取私信失败:', error);
  } finally {
    setIsLoading(false);
  }
};

  // 标记消息为已读
  const markAsRead = async (messageId) => {
    try {
      // 使用apiClient替代axios，自动添加token
      await apiClient.post('/mark-read', null, {
        params: { messageId }
      });
      // 更新本地消息状态
      setMessages(messages.map(msg => 
        msg.messageId === messageId ? {...msg, isRead: true} : msg
      ));
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  // 发送新消息
  const sendMessage = async (receiverId, content) => {
    try {
      // 使用apiClient替代axios，自动添加token
      await apiClient.post('/send', {
        receiverId,
        content
      });
      fetchMessages(); // 刷新列表
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // 查看消息详情
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // 如果是收件箱消息且未读，则标记为已读
    if (message.receiverId === localStorage.getItem('username') && !message.isRead) {
      markAsRead(message.messageId);
    }
  };

  // 回复消息
  const handleReply = (senderId) => {
    setReplyReceiver(senderId);
    setIsReplying(true);
  };

  // 获取消息类型
  const getMessageType = (message) => {
    if (message.senderId === currentUserId) return 'sent';
    if (message.receiverId === currentUserId) return 'received';
    return null;
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  return (
    <div className="private-messages">
      {/* 标签导航 */}
      <div className="tabs">
        <button 
          className={activeTab === 'inbox' ? 'active' : ''}
          onClick={() => setActiveTab('inbox')}
        >
          收件箱
        </button>
        <button 
          className={activeTab === 'sent' ? 'active' : ''}
          onClick={() => setActiveTab('sent')}
        >
          已发送
        </button>
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          全部私信
        </button>
      </div>
      
      {/* 新建消息按钮 */}
      <button className="compose-btn" onClick={() => setIsComposing(true)}>
        新建私信
      </button>
      
      {/* 消息列表 */}
      <div className="message-list">
        {isLoading ? (
          <p>加载中...</p>
        ) : messages.length === 0 ? (
          <p>暂无消息</p>
        ) : (
          messages.map((message) => (
            <div 
              key={message.messageId} 
              className={`message-item ${getMessageType(message)}`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="message-header">
                <span className="sender">{message.senderId}</span>
                <span className="receiver">→ {message.receiverId}</span>
                <span className="time">{message.createTime}</span>
                
                <div className="status">
                  {activeTab === 'inbox' ? (
                    message.isRead ? '已读' : <strong>未读</strong>
                  ) : (
                    message.isRead ? '已读' : '未读'
                  )}
                </div>
                
                {activeTab === 'inbox' && (
                  <button 
                    className="reply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(message.senderId);
                    }}
                  >
                    回复
                  </button>
                )}
              </div>
              <div className="message-preview">
                {message.content.length > 30 
                  ? `${message.content.substring(0, 30)}...` 
                  : message.content}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 消息详情弹窗 */}
      {selectedMessage && (
        <div className="message-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedMessage(null)}>×</button>
            <h2>私信详情</h2>
            <div className="message-header">
              <p><strong>发件人:</strong> {selectedMessage.senderId}</p>
              <p><strong>收件人:</strong> {selectedMessage.receiverId}</p>
              <p><strong>时间:</strong> {new Date(selectedMessage.createTime).toLocaleString()}</p>
              <p><strong>状态:</strong> {selectedMessage.isRead ? '已读' : '未读'}</p>
            </div>
            <div className="message-body">
              {selectedMessage.content}
            </div>
          </div>
        </div>
      )}
      
      {/* 新建消息弹窗 */}
      {(isComposing || isReplying) && (
        <div className="compose-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setIsComposing(false);
              setIsReplying(false);
            }}>×</button>
            
            <h2>{isReplying ? '回复私信' : '新建私信'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const receiver = isReplying 
                ? replyReceiver 
                : e.target.receiverId.value;
              
              sendMessage(receiver, e.target.content.value);
              
              setIsComposing(false);
              setIsReplying(false);
            }}>
              <div className="form-group">
                <label>收件人ID:</label>
                <input 
                  type="text" 
                  name="receiverId" 
                  defaultValue={isReplying ? replyReceiver : ''} 
                  disabled={isReplying}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>内容:</label>
                <textarea name="content" rows="4" required></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit">发送</button>
                <button type="button" onClick={() => {
                  setIsComposing(false);
                  setIsReplying(false);
                }}>
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateMessageSystem;
