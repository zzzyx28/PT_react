import React, { useState, useEffect } from 'react';
import './Announcement.css'

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取公告数据
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/announcement/list');
        const data = await response.json();
        setAnnouncements(data.records);
        setLoading(false);
      } catch (error) {
        console.error('获取公告失败:', error);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // 搜索功能（前端过滤）
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      fetch('http://localhost:8080/api/announcement/list')
        .then(res => res.json())
        .then(data => setAnnouncements(data.records));
      return;
    }
    const filtered = announcements.filter(announcement =>
      announcement.title.includes(searchKeyword) ||
      announcement.content.includes(searchKeyword)
    );
    setAnnouncements(filtered);
  };

  // 删除公告
  const handleDelete = (id) => {
    if (window.confirm('确定删除该公告？')) {
      fetch(`http://localhost:8080/api/announcement/${id}`, { method: 'DELETE' })
        .then(() => setAnnouncements(prev => prev.filter(a => a.id !== id)))
        .catch(err => console.error('删除失败:', err));
    }
  };

  // 更新公告
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/announcement/${editingAnnouncement.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingAnnouncement)
    })
      .then(res => res.json())
      .then(updated => {
        setAnnouncements(prev => prev.map(a => a.id === updated.id ? updated : a));
        setEditingAnnouncement(null);
      })
      .catch(err => console.error('更新失败:', err));
  };

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="announcement-container">
      {/* 搜索栏 */}
      <div className="search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="搜索公告标题或内容..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>搜索</button>
        {isAdmin && (
          <button 
            className="add-button"
            onClick={() => setEditingAnnouncement({ id: '', title: '', content: '', status: 1 })}
          >
            + 新增公告
          </button>
        )}
      </div>

      {/* 公告列表 */}
      <div className="announcement-list">
        {announcements.length > 0 ? (
          announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="card-header">
                <h3>{announcement.title}</h3>
                <span className="time">{announcement.updateTime}</span>
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => setEditingAnnouncement(announcement)}>编辑</button>
                    <button onClick={() => handleDelete(announcement.id)}>删除</button>
                  </div>
                )}
              </div>
              <p className="content">{announcement.content}</p>
              <div className="card-footer">
                <span>发布者: {announcement.publisherId}</span>
                <span className={`status ${announcement.status === 1 ? 'published' : 'draft'}`}>
                  {announcement.status === 1 ? '已发布' : '草稿'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-message">暂无公告</div>
        )}
      </div>

      {/* 编辑/新增公告弹窗 */}
      {editingAnnouncement && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>{editingAnnouncement.id ? '编辑公告' : '新增公告'}</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>内容</label>
                <textarea
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={editingAnnouncement.status}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, status: +e.target.value })}
                >
                  <option value={1}>已发布</option>
                  <option value={2}>草稿</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">保存</button>
                <button type="button" onClick={() => setEditingAnnouncement(null)}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;