import React, { useState, useEffect } from 'react';

// 公告界面组件
const AnnouncementPanel = () => {
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('announcements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [userRole, setUserRole] = useState('user');

  // 从本地存储获取用户身份
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  }, []);

  // 保存公告到本地存储
  const saveAnnouncement = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleString()
    };
    
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
    setShowModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div style={{
      width: '70%',
      margin: '20px auto',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: '24px',
      position: 'relative'
    }}>
      {/* 公告列表 */}
      <div style={{ color: '#fff' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '12px' }}>
          站点公告
        </h2>
        {announcements.map(ann => (
          <div key={ann.id} style={{
            padding: '16px',
            margin: '12px 0',
            backgroundColor: '#262626',
            borderRadius: '8px',
            borderLeft: '4px solid #007bff'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <h3 style={{ margin: 0 }}>{ann.title}</h3>
              <span style={{ 
                fontSize: '0.8em',
                color: '#888'
              }}>{ann.date}</span>
            </div>
            <p style={{ 
              margin: 0,
              lineHeight: 1.6,
              color: '#ccc'
            }}>{ann.content}</p>
          </div>
        ))}
      </div>

      {/* 发布按钮（管理员可见） */}
      {userRole === 'admin' && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            position: 'fixed',
            right: '18%',
            bottom: '40px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#007bff',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s',
            ':hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          +
        </button>
      )}

      {/* 发布弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '24px',
            borderRadius: '12px',
            width: '500px'
          }}>
            <form onSubmit={saveAnnouncement}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#fff', margin: 0 }}>发布新公告</h3>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <input
                type="text"
                placeholder="公告标题"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#262626',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#fff'
                }}
              />

              <textarea
                placeholder="公告内容"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#262626',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#fff',
                  resize: 'vertical'
                }}
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                发布公告
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementPanel;