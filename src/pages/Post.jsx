import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Post.css'

const Post = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  
  // 获取帖子详情和评论
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取帖子详情
      const postResponse = await fetch(`http://localhost:8080/api/forum/list?forumId=${forumId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!postResponse.ok) {
        throw new Error('获取帖子详情失败');
      }
      
      const postData = await postResponse.json();
      const foundPost = Array.isArray(postData) 
        ? postData.find(p => p.forumId === forumId)
        : postData;
      
      if (!foundPost) {
        throw new Error('帖子未找到');
      }
      
      setPost(foundPost);
      
      // 获取评论
      const commentResponse = await fetch(`http://localhost:8080/api/comment/list?forumId=${forumId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!commentResponse.ok) {
        throw new Error('获取评论失败');
      }
      
      const commentData = await commentResponse.json();
      setComments(commentData);
      
    } catch (err) {
      console.error('数据获取错误:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 添加评论
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/comment/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forumId,
          content: newComment
        })
      });
      
      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [...prev, newCommentData]);
        setNewComment('');
        
        // 更新帖子回复计数
        if (post && post.replies !== undefined) {
          setPost(prev => ({ ...prev, replies: prev.replies + 1 }));
        }
      }
    } catch (error) {
      console.error('添加评论失败:', error);
      setError('添加评论失败，请重试');
    }
  };
  
  // 删除评论
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/comment/delete?commentId=${commentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.commentId !== commentId));
        
        // 更新帖子回复计数
        if (post && post.replies !== undefined) {
          setPost(prev => ({ ...prev, replies: prev.replies - 1 }));
        }
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      setError('删除评论失败');
    }
  };
  
  useEffect(() => {
    if (forumId) {
      fetchData();
    }
  }, [forumId]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }
  
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>返回论坛</button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <p>帖子未找到</p>
        <button onClick={() => navigate('/')}>返回论坛</button>
      </div>
    );
  }

  return (
    <div className="post-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 返回论坛
      </button>
      
      <div className="post-detail">
        <h1>{post.title}</h1>
        <p className="post-content">{post.content}</p>
        <div className="post-meta">
          <span>作者: {post.ownerId}</span>
          <span>分类: {post.category}</span>
          <span>时间: {new Date(post.createTime).toLocaleString()}</span>
          {/* <span>浏览: {post.views || 0} 回复: {post.replies || 0}</span> */}
        </div>
      </div>

      <div className="comments-section">
        <h2>评论 ({comments.length})</h2>
        
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="发表你的评论..."
            rows={4}
            required
          />
          <button onClick={handleAddComment}>提交评论</button>
        </div>
        
        {comments.length > 0 ? (
          comments.map(comment => {
            const canDelete = username === 'admin' || username === comment.userId;
            
            return (
              <div key={comment.commentId} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.userId}</span>
                  <span className="comment-time">
                    {new Date(comment.createTime).toLocaleString()}
                  </span>
                  {canDelete && (
                    <button 
                      className="delete-button small"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      删除
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            );
          })
        ) : (
          <p className="no-comments">暂无评论，成为第一个评论者吧！</p>
        )}
      </div>
    </div>
  );
};

export default Post;