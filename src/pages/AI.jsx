import React, { useState } from 'react';

const AIChatWindow = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 处理发送消息到后端API
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // 将用户消息添加到对话框
    const userMessage = { text: inputText, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    setIsLoading(true);
    
    try {
      // 调用后端API（与截图中的接口一致）
      const response = await fetch('http://localhost:8080/ai/aiService?question=' + encodeURIComponent(inputText), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      // 获取API返回的文本（假设为纯文本格式）
      const resultText = await response.text();
      
      // 添加AI回复到对话框
      const aiMessage = { 
        text: resultText, 
        isUser: false,
        timestamp: new Date(),

      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // 处理错误情况
      const errorMessage = {
        text: `请求出错: ${error.message}`,
        isUser: false,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理回车键发送
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>AI 对话助手</h2>
        <div style={styles.apiInfo}>由百炼API提供AI问答服务支持 </div>
      </div>
      
      <div style={styles.chatArea}>
        {messages.length === 0 ? (
          <div style={styles.placeholder}>
            <p>输入问题开始对话 (例: "魔力值是什么?")</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index}
              style={{
                ...styles.messageBubble,
                ...(msg.isUser ? styles.userBubble : styles.aiBubble),
                ...(msg.isError && styles.errorBubble)
              }}
            >
              <div style={styles.messageContent}>
                {msg.text}
              </div>
              
              <div style={styles.metaInfo}>
                <span style={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                
                {/* {!msg.isUser && !msg.isError && (
                  <span style={styles.apiStatus}>
                    {`状态: ${msg.apiStatus.status} | 耗时: ${msg.apiStatus.responseTime}`}
                  </span>
                )} */}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.typingIndicator}>AI 思考中...</div>
          </div>
        )}
      </div>
      
      <div style={styles.inputArea}>
        <textarea
          style={styles.textInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          disabled={isLoading}
        />
        <button 
          style={styles.sendButton} 
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
};

// UI样式配置
const styles = {
container: {
    width: '80vw',
    height: '90vh',
    marginTop: '1.5cm',
    backgroundColor: '#f5f7fb',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden'
},
  header: {
    backgroundColor: '#4285f4',
    color: 'white',
    padding: '16px 24px',
    borderBottom: '1px solid #dadce0'
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 500
  },
  apiInfo: {
    fontSize: '0.8rem',
    opacity: 0.9,
    marginTop: '6px'
  },
  chatArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#fff'
  },
  placeholder: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#757575'
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '14px 18px',
    marginBottom: '15px',
    borderRadius: '18px',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    lineHeight: 1.5
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    marginLeft: 'auto',
    borderTopRightRadius: '4px'
  },
  aiBubble: {
    backgroundColor: '#f1f1f1',
    marginRight: 'auto',
    borderTopLeftRadius: '4px'
  },
  errorBubble: {
    backgroundColor: '#ffebee',
    border: '1px solid #ffcdd2'
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    marginTop: '8px',
    color: '#757575'
  },
  apiStatus: {
    fontSize: '0.7rem'
  },
  loading: {
    padding: '15px',
    textAlign: 'center',
    color: '#5f6368'
  },
  typingIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    fontStyle: 'italic'
  },
  inputArea: {
    display: 'flex',
    padding: '16px',
    borderTop: '1px solid #dadce0',
    backgroundColor: '#fff'
  },
  textInput: {
    flex: 1,
    minHeight: '60px',
    maxHeight: '120px',
    padding: '14px 18px',
    border: '1px solid #dadce0',
    borderRadius: '24px',
    fontSize: '1rem',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    ':focus': {
      borderColor: '#4285f4',
      boxShadow: '0 0 0 2px rgba(66,133,244,0.2)'
    }
  },
  sendButton: {
    marginLeft: '12px',
    padding: '0 24px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    ':disabled': {
      backgroundColor: '#a3c6ff',
      cursor: 'not-allowed'
    }
  }
};

export default AIChatWindow;