import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
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

  // 使用ref存储轮询定时器和第一条消息的时间
  const pollIntervalRef = useRef(null);
  const firstMessageTimeRef = useRef(null);

  // 获取私信数据
  const fetchMessages = async (tab = activeTab) => {
    setIsLoading(true);
    try {
      console.log(currentUserId)
      if (tab === 'inbox') {
        // 获取收件箱消息
        const response = await apiClient.get(`/received?userId=${currentUserId}`);
        setMessages(response.data || []);
        // 存储第一条消息的时间（如果有消息）
        if (response.data && response.data.length > 0) {
          firstMessageTimeRef.current = response.data[0].createTime;
        } else {
          firstMessageTimeRef.current = null;
        }
      } else {
        // 获取全部消息
        const allResponse = await apiClient.get(`/all?userId=${currentUserId}`);
        const allMessages = allResponse.data || [];
        let newMessages = [];

        if (tab === 'sent') {
          // 过滤出当前用户发送的消息
          newMessages = allMessages.filter(
            msg => msg.senderId === currentUserId
          );
          // 存储第一条消息的时间（如果有消息）
          if (newMessages.length > 0) {
            firstMessageTimeRef.current = newMessages[0].createTime;
          } else {
            firstMessageTimeRef.current = null;
          }
        } else {
          // 显示全部消息
          newMessages = allMessages;
          // 存储第一条消息的时间（如果有消息）
          if (allMessages.length > 0) {
            firstMessageTimeRef.current = allMessages[0].createTime;
          } else {
            firstMessageTimeRef.current = null;
          }
        }
        
        setMessages(newMessages);
      }
    } catch (error) {
      console.error('获取私信失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 轮询获取新消息数据（只适用于收件箱和全部）
  const pollForNewMessages = async () => {
    // 只对收件箱和全部消息标签进行轮询
    if (activeTab !== 'inbox' && activeTab !== 'all') {
      return;
    }
    
    try {
      let newMessages = [];
      
      if (activeTab === 'inbox') {
        // 获取收件箱消息
        const response = await apiClient.get(`/received?userId=${currentUserId}`);
        newMessages = response.data || [];
      } else {
        // 获取全部消息
        const allResponse = await apiClient.get(`/all?userId=${currentUserId}`);
        newMessages = allResponse.data || [];
      }
      
      // 检查是否有新消息
      let shouldUpdate = false;
      
      if (newMessages.length === 0) {
        // 列表为空，但之前有消息
        if (messages.length > 0) {
          shouldUpdate = true;
        }
      } else if (firstMessageTimeRef.current === null) {
        // 之前没有消息，现在有消息了
        shouldUpdate = true;
      } else {
        // 比较第一条消息的时间（最新的消息在数组开头）
        const latestMessageTime = newMessages[0].createTime;
        
        // 时间不同的两种可能：
        // 1. 有更新的消息（时间更大）
        // 2. 消息被删除，第一条消息改变了（时间变小）
        if (latestMessageTime !== firstMessageTimeRef.current) {
          shouldUpdate = true;
        }
      }
      
      // 只有检测到变化时才更新消息列表
      if (shouldUpdate) {
        setMessages(newMessages);
        // 更新存储的第一条消息时间
        if (newMessages.length > 0) {
          firstMessageTimeRef.current = newMessages[0].createTime;
        } else {
          firstMessageTimeRef.current = null;
        }
      }
    } catch (error) {
      console.error('轮询获取私信失败:', error);
    }
  };

  // 开始轮询
  const startPolling = () => {
    // 每1000毫秒(1秒)执行一次轮询
    pollIntervalRef.current = setInterval(pollForNewMessages, 1000);
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
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
        senderId: currentUserId,
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
    // 组件挂载时启动轮询
    startPolling();
    
    // 组件卸载时停止轮询
    return () => {
      stopPolling();
    };
  }, []);

  useEffect(() => {
    // 标签切换时刷新消息
    fetchMessages();
    
    // 更新轮询函数
    stopPolling();
    startPolling();
  }, [activeTab]);

  return (
    <div className="private-messages-container">
      {/* 顶部固定区域 */}
      <div className="messages-header">
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
          <i className="fas fa-plus"></i> 新建私信
        </button>
      </div>
      
      {/* 消息列表区域 - 可滚动 */}
      <div className="message-list-container">
        {isLoading ? (
          <div className="loading-indicator">
            <i className="fas fa-spinner fa-spin"></i> 加载中...
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-message">
            <i className="fas fa-envelope-open-text"></i>
            <p>暂无消息</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.messageId} 
              className={`message-item ${getMessageType(message)} ${!message.isRead ? 'unread' : ''}`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="message-header">
                <span className="sender">{message.senderId}</span>
                <span className="receiver">→ {message.receiverId}</span>
                <span className="time">{message.createTime}</span>
                
                <div className="status">
                  {activeTab === 'inbox' ? (
                    message.isRead ? (
                      <span className="read-status"><i className="fas fa-check"></i> 已读</span>
                    ) : (
                      <span className="unread-status"><i className="fas fa-exclamation"></i> 未读</span>
                    )
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
                    <i className="fas fa-reply"></i> 回复
                  </button>
                )}
              </div>
              <div className="message-preview">
                {message.content.length > 50 
                  ? `${message.content.substring(0, 50)}...` 
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
            <button className="close-btn" onClick={() => setSelectedMessage(null)}>
              <i className="fas fa-times"></i>
            </button>
            <h2><i className="fas fa-envelope"></i> 私信详情</h2>
            <div className="message-header">
              <p><strong><i className="fas fa-user"></i> 发件人:</strong> {selectedMessage.senderId}</p>
              <p><strong><i className="fas fa-user"></i> 收件人:</strong> {selectedMessage.receiverId}</p>
              <p><strong><i className="fas fa-clock"></i> 时间:</strong> {new Date(selectedMessage.createTime).toLocaleString()}</p>
              <p><strong><i className={selectedMessage.isRead ? "fas fa-check" : "fas fa-exclamation"}></i> 状态:</strong> {selectedMessage.isRead ? '已读' : '未读'}</p>
            </div>
            <div className="message-body">
              {selectedMessage.content}
            </div>
            {selectedMessage.receiverId === currentUserId && (
              <button 
                className="reply-btn"
                onClick={() => {
                  setSelectedMessage(null);
                  handleReply(selectedMessage.senderId);
                }}
              >
                <i className="fas fa-reply"></i> 回复
              </button>
            )}
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
            }}>
              <i className="fas fa-times"></i>
            </button>
            
            <h2><i className="fas fa-edit"></i> {isReplying ? '回复私信' : '新建私信'}</h2>
            
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
                <label><i className="fas fa-user"></i> 收件人ID:</label>
                <input 
                  type="text" 
                  name="receiverId" 
                  defaultValue={isReplying ? replyReceiver : ''} 
                  disabled={isReplying}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label><i className="fas fa-align-left"></i> 内容:</label>
                <textarea name="content" rows="6" required></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="send-btn">
                  <i className="fas fa-paper-plane"></i> 发送
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setIsComposing(false);
                    setIsReplying(false);
                  }}
                >
                  <i className="fas fa-times"></i> 取消
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