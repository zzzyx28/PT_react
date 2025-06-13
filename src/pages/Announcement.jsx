import React, { useState, useEffect } from 'react';
import './Announcement.css'

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [updatingAnnouncement, setUpdatingAnnouncement] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // 新增当前用户状态
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem('token');

  // 获取公告数据和当前用户
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/announcement/list?page=1&size=200');
        const data = await response.json();
        setAnnouncements(data.records);
        
        const mockCurrentUser = localStorage.username ; // 实际项目中从API或context获取
        setCurrentUser(mockCurrentUser);
        setIsAdmin(mockCurrentUser === 'admin');
        console.log(localStorage.username);
        console.log(localStorage.token);
        setLoading(false);
      } catch (error) {
        console.error('获取数据失败:', error);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // 过滤显示公告的函数
  const getFilteredAnnouncements = () => {
    return announcements.filter(announcement => {
      // 管理员可以看到所有公告
      if (isAdmin) return true;
      
      // 非管理员只能看到已发布的公告
      return announcement.status === 1;
    });
  };

// 搜索功能（前端过滤）
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      fetch(`http://localhost:8080/api/announcement/list?page=1&size=200`)
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
  
  fetch(`http://localhost:8080/api/announcement/update`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // 添加认证头
    },
    body: JSON.stringify(updatingAnnouncement)
  })
  .then(res => res.json())
  .then(updated => {
    setAnnouncements(prev => prev.map(a => a.id === updated.id ? updated : a));
    setUpdatingAnnouncement(null);
    alert('更新成功!');
    console.log('更新成功')
  })
  .catch(err => {
    console.error('更新失败:', err);
    alert(`更新失败: ${err.message}`)}
    );
};

  //新增公告
const handleEditSubmit = (e) => {
  e.preventDefault();
  
  // 1. 从本地存储获取认证token
  const token = localStorage.getItem('token'); // 确保token存储使用正确的键名
  
  // 2. 发送POST请求到新建公告接口
  fetch('http://localhost:8080/api/announcement/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 添加认证头
    },
    body: JSON.stringify({
      title: editingAnnouncement.title,
      content: editingAnnouncement.content,
      status: editingAnnouncement.status
    })
  })
  .then(response => {
    // 3. 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
    return response.json();
  })
  .then(newAnnouncement => {
    console.log('新增公告成功:', newAnnouncement);   
    // 4. 关闭新增公告弹窗
    setEditingAnnouncement(null); 
    // 5. 刷新公告列表 - 可根据实际需求选择以下任一方式
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    // 6. 显示成功提示（可选）
    alert('公告创建成功!');
  })
  .catch(error => {
    console.error('新增公告失败:', error);
    // 7. 显示错误提示（可选）
    alert(`创建失败: ${error.message}`);
  });
};


  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="announcement-container">
      {/* 搜索栏 - 保持不变... */}
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
      
      {/* 公告列表 - 使用过滤后的公告 */}
      <div className="announcement-list">
        {getFilteredAnnouncements().length > 0 ? (
          getFilteredAnnouncements().map(announcement => (
            <div key={announcement.id} className="announcement-card">
              {/* 卡片头部 */}
              <div className="card-header">
                <h3>{announcement.title}</h3>
                <span className="time">{announcement.updateTime}</span>
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => setUpdatingAnnouncement(announcement)}>编辑</button>
                    <button onClick={() => handleDelete(announcement.id)}>删除</button>
                  </div>
                )}
              </div>
              
              {/* 内容区域 */}
              <p className="content">{announcement.content}</p>
              
              {/* 卡片底部 */}
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

      {/* 新增公告 */}
      {editingAnnouncement && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>新增公告</h2>
            <form onSubmit={handleEditSubmit}>
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

    {/* 更新公告 */}
      {updatingAnnouncement && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>更新公告</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  value={updatingAnnouncement.title}
                  onChange={(e) => setUpdatingAnnouncement({ ...updatingAnnouncement, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>内容</label>
                <textarea
                  value={updatingAnnouncement.content}
                  onChange={(e) => setUpdatingAnnouncement({ ...updatingAnnouncement, content: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={updatingAnnouncement.status}
                  onChange={(e) => setUpdatingAnnouncement({ ...updatingAnnouncement, status: +e.target.value })}
                >
                  <option value={1}>已发布</option>
                  <option value={2}>草稿</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">保存</button>
                <button type="button" onClick={() => setUpdatingAnnouncement(null)}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;