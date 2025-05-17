import React, { useState, useEffect } from 'react';

const AnnouncementBoard = () => {
  // 初始示例公告（前端展示用）
  const initialAnnouncements = [
    { 
      id: 1,
      title: '系统维护通知',
      content: '服务器将于5月20日进行升级维护',
      updateTime: '2023-05-15 14:30'
    },
    {
      id: 2,
      title: '用户协议更新',
      content: '请及时查阅最新用户协议条款请及时查阅最新用户协议条款请及时查阅最新用户协议条款请及时查阅最新用户协议条款请及时查阅最新用户协议条款',
      updateTime: '2023-05-16 09:15'
    }
  ];

const containerStyle = {
    maxWidth: '800px',
    margin: '32px auto',
    padding: '24px',
    backgroundColor: '#f5f7fa',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const searchBarStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e0e7ff',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const buttonBase = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease',
    position: 'relative'
  };

  // 状态管理
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 权限验证
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // setIsAdmin(!!token);
    setIsAdmin(1);
  }, []);

  // 搜索功能
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/announcements?search=${encodeURIComponent(searchKeyword)}`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  // 删除公告
  const handleDelete = async (id) => {
    if (window.confirm('确定删除该公告？')) {
      try {
        await fetch(`/api/announcements/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  // 更新公告
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(editingAnnouncement)
      });
      
      if (response.ok) {
        setAnnouncements(prev => 
          prev.map(a => 
            a.id === editingAnnouncement.id ? {...editingAnnouncement} : a
          )
        );
        setEditingAnnouncement(null);
      }
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  return (
    <div style={containerStyle}>
      {/* 搜索栏 */}
      <div style={searchBarStyle}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="输入搜索关键词"
          style={{ 
            ...inputStyle,
            ':focus': { borderColor: '#6366f1' } // 伪类需通过状态实现
          }}
        />
        <button 
          style={{ 
            ...buttonBase,
            backgroundColor: '#6366f1',
            color: 'white'
          }}
          onClick={handleSearch}
        >
          搜索
        </button>
      </div>

      {/* 公告列表 */}
      {announcements.map(announcement => (
        <div key={announcement.id} style={cardStyle}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#1e293b',
              fontSize: '20px'
            }}>{announcement.title}</h3>
            <br/>
            <span style={{ 
              color: '#64748b',
              fontSize: '14px',
              marginRight: '150px'
            }}>{announcement.updateTime}</span>
            {isAdmin && (
              <div style={{ 
                display: 'flex',
                gap: '8px',
                position: 'absolute',
                top: '16px',
                right: '16px'
              }}>
                <button 
                  style={{ 
                    ...buttonBase,
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '8px 16px'
                  }}
                  onClick={() => setEditingAnnouncement({...announcement})}
                >
                  更新
                </button>
                <button 
                  style={{ 
                    ...buttonBase,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '8px 16px'
                  }}
                  onClick={() => handleDelete(announcement.id)}
                >
                  删除
                </button>
              </div>
            )}
          </div>
          <p style={{ 
            color: '#475569',
            lineHeight: '1.6',
            margin: 0
          }}>{announcement.content}</p>
        </div>
      ))}

      {/* 编辑模态框 */}
      {editingAnnouncement && (
        <div style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          width: '500px'
        }}>
          <form onSubmit={handleUpdateSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>标题:</label>
              <input
                type="text"
                value={editingAnnouncement.title}
                onChange={e => setEditingAnnouncement(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                style={{ 
                  ...inputStyle,
                  width: '100%'
                }}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>内容:</label>
              <textarea
                value={editingAnnouncement.content}
                onChange={e => setEditingAnnouncement(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
                style={{ 
                  ...inputStyle,
                  width: '100%',
                  height: '120px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ 
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end'
            }}>
              <button 
                type="submit"
                style={{ 
                  ...buttonBase,
                  backgroundColor: '#3b82f6',
                  color: 'white'
                }}
              >
                提交修改
              </button>
              <button 
                type="button"
                onClick={() => setEditingAnnouncement(null)}
                style={{ 
                  ...buttonBase,
                  backgroundColor: '#94a3b8',
                  color: 'white'
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


export default AnnouncementBoard;

