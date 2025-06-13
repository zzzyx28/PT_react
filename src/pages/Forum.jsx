
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum.css'

const Forum = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 0 });
  
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  
  // 定义板块名称映射
  const categoryNames = {
    0: '资源交流区',
    1: '技术研究院',
    2: '影音会客厅',
    3: '玩客实验室',
    4: '优惠推广区'
  };
  
  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      let url = `http://localhost:8080/api/forum/list?page=1&size=200`;
      if (activeTab >= 0 && activeTab <= 4) {
        url = `http://localhost:8080/api/forum/listByCategory?category=${activeTab}&page=1&size=200`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('获取帖子失败:', error);
    }
  };
  
  // 创建新帖子
  const handleCreatePost = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/forum/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: username,
          forum: newPost
        })
      });
      
      if (response.ok) {
        const newPostData = await response.json();
        setPosts([newPostData, ...posts]);
        setNewPost({ title: '', content: '', category: 0 });
        setShowForm(false); // 创建成功后自动隐藏表单
      }
    } catch (error) {
      console.error('创建帖子失败:', error);
    }
  };
  
  // 删除帖子
  const handleDeletePost = async (forumId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/forum/delete?forumId=${forumId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setPosts(posts.filter(post => post.forumId !== forumId));
      }
    } catch (error) {
      console.error('删除帖子失败:', error);
    }
  };
  
  // 根据标签筛选帖子
// 根据标签筛选帖子并按时间排序
const getFilteredPosts = () => {
  let filtered = [];
  if (activeTab === 'all') filtered = [...posts];
  else if (activeTab === 'mine') filtered = posts.filter(post => post.ownerId === username);
  else filtered = posts.filter(post => post.category.toString() === activeTab);
  
  // 按创建时间降序排序
  return filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
};

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  // 修复的表单切换逻辑
  const handleTabClick = (tab) => {
    if (tab === 'new') {
      // 切换发帖表单的显示状态
      setShowForm(prev => !prev);
      // 如果用户点击发帖按钮但表单是打开的，需要重置活动标签
      if (showForm) {
        setActiveTab('all');
      }
    } else {
      setActiveTab(tab);
      setShowForm(false); // 切换到其他标签时隐藏发帖表单
    }
  };

  return (
    <div className="forum-container">
      {/* 顶部导航 */}
      <div className="forum-tabs">
        {['all', '0', '1', '2', '3', '4', 'new', 'mine'].map(tab => (
          <button 
            key={tab} 
            className={`tab-button ${
              tab === 'new' ? (showForm ? 'active' : '') : 
              (activeTab === tab ? 'active' : '')
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === 'all' ? '全部论坛' : 
             tab === 'new' ? '发帖' : 
             tab === 'mine' ? '我的帖子' : categoryNames[tab]}
          </button>
        ))}
      </div>

      {/* 发帖表单 */}
      {showForm && (
        <div className="post-form">
          <h3>创建新帖子</h3>
          <input 
            type="text" 
            placeholder="标题" 
            value={newPost.title}
            onChange={e => setNewPost({...newPost, title: e.target.value})}
            required
          />
          <textarea 
            placeholder="内容" 
            value={newPost.content}
            onChange={e => setNewPost({...newPost, content: e.target.value})}
            required
          />
          <select 
            value={newPost.category} 
            onChange={e => setNewPost({...newPost, category: parseInt(e.target.value)})}
          >
            {[0,1,2,3,4].map(num => (
              <option key={num} value={num}>{categoryNames[num]}</option>
            ))}
          </select>
          <div className="form-buttons">
            <button onClick={handleCreatePost}>提交</button>
            <button onClick={() => {
              setShowForm(false);
              setActiveTab('all');
            }}>取消</button>
          </div>
        </div>
      )}

      {/* 帖子列表 */}
      <div className="post-list">
        {getFilteredPosts().map(post => {
          const canDelete = username === 'admin' || username === post.ownerId;
          
          return (
            <div key={post.forumId} className="post-item">
              <div className="post-header">
                <h3 onClick={() => navigate(`/post/${post.forumId}`)}>
                  {post.title}
                </h3>
                {canDelete && (
                  <button 
                    className="delete-button"
                    onClick={() => handleDeletePost(post.forumId)}
                  >
                    删除
                  </button>
                )}
              </div>
              <p className="post-content-1">{post.content}</p>
              <div className="post-meta">
                <span>作者: {post.ownerId}</span>
                <span>分类: {categoryNames[post.category]}</span>
                <span>时间: {new Date(post.createTime).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forum;