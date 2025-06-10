import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Forum.css'

const Forum = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [posts, setPosts] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 从本地存储获取用户信息
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let response;
      if (activeTab === 'my') {
        // 获取我的帖子
        response = await axios.get('http://localhost:8080/api/forum/list', {
          params: { page: currentPage, size: pageSize },
          ...config
        });
        // 前端过滤当前用户的帖子
        const myPosts = response.data.filter(post => post.ownerId === username);
        setPosts(myPosts);
      } else {
        // 按分类获取帖子
        response = await axios.get('http://localhost:8080/api/forum/listByCategory', {
          params: { category: activeTab, page: currentPage, size: pageSize },
          ...config
        });
        setPosts(response.data);
      }
      
      // 计算总页数（实际项目中应从响应头获取）
      setTotalPages(Math.ceil(100 / pageSize)); // 假设总数100条
    } catch (error) {
      console.error('获取帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

    // 发帖
  const sendPost = async (title, content) => {
    try {

      await axios.post('http://localhost:8080/api/forum/send', {
        params: { title , content },
        headers: { Authorization: `Bearer ${token}` }
    });
      fetchPosts(); // 刷新列表
    } catch (error) {
      console.error('发帖失败:', error);
    }
  };

  // 删除帖子
  const handleDeletePost = async (forumId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.delete('http://localhost:8080/api/forum/delete', {
        params: { forumId },
        ...config
      });
      
      // 更新帖子列表
      setPosts(posts.filter(post => post.forumId !== forumId));
    } catch (error) {
      console.error('删除帖子失败:', error);
    }
  };

  // 监听标签页、分页变化
  useEffect(() => {
    fetchPosts();
  }, [activeTab, currentPage, pageSize]);

  // 渲染删除按钮（条件判断）
  const renderDeleteButton = (post) => {
    const canDelete = username === 'admin' || username === post.ownerId;
    return canDelete && (
      <button 
        className="delete-btn"
        onClick={() => handleDeletePost(post.forumId)}
      >
        删除
      </button>
    );
  };

  // 分页控件
  const renderPagination = () => (
    <div className="pagination">
      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        {[5, 10, 20, 50].map(size => (
          <option key={size} value={size}>{size}条/页</option>
        ))}
      </select>
      
      <button 
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        上一页
      </button>
      
      <span>{currentPage} / {totalPages}</span>
      
      <button 
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        下一页
      </button>
    </div>
  );

  return (
    <div className="forum">
      <div className="tabs">
        {['0', '1', '2', '3', '4', 'my'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab === 'my' ? '我的帖子' : `板块 ${tab}`}
          </button>
        ))}
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <>
          <div className="post-list">
            {posts.map(post => (
              <div key={post.forumId} className="post-item">
                <h3 onClick={() => navigate(`/post/${post.forumId}`)}>
                  {post.title || 'null'}
                </h3>
                <p>作者: {post.ownerId}</p>
                <p>时间: {new Date(post.createTime).toLocaleString()}</p>
                {renderDeleteButton(post)}
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}

            {/* 新建消息按钮 */}
      <button className="compose-btn" onClick={() => setIsComposing(true)}>
        发帖
      </button>

{/* 新建消息弹窗 */}
      {(isComposing) && (
        <div className="compose-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setIsComposing(false);
            }}>×</button>
            
            <h2>发帖</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              
              sendPost(e.target.title.value, e.target.content.value);
              
              setIsComposing(false);
            }}>
              <div className="form-group">
                <label>标题:</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>正文:</label>
                <textarea name="content" rows="4" required></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit">发送</button>
                <button type="button" onClick={() => {
                  setIsComposing(false);
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

export default Forum;