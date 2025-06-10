import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Post = ({ username }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // 获取帖子详情
    const fetchPost = async () => {
      // 实际后端应提供单个帖子接口，这里暂用全部接口过滤
      const response = await fetch('http://localhost:8080/api/forum/list');
      const data = await response.json();
      const foundPost = data.find(p => p.forumId === postId);
      setPost(foundPost);
    };

    // 获取评论列表
    const fetchComments = async () => {
      // 实际后端应提供按帖子ID查询评论接口，这里在前端模拟
      const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
      const postComments = storedComments.filter(c => c.forumId === postId);
      setComments(postComments);
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      forumId: postId,
      userId: username,
      content: newComment,
      commentId: `comment-${Date.now()}`
    };

    const response = await fetch('http://localhost:8080/api/comment/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        forumId: postId,
        content: newComment
      })
    });

    if (response.ok) {
      // 保存到本地和状态
      const savedComments = [...comments, newCommentObj];
      setComments(savedComments);
      localStorage.setItem('comments', JSON.stringify(savedComments));
      setNewComment('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定删除该评论吗?')) return;
    
    const response = await fetch(`http://localhost:8080/api/comment/delete?commentId=${commentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const updatedComments = comments.filter(c => c.commentId !== commentId);
      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    }
  };

  if (!post) return <div>加载中...</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{post.title}</h1>
        <p className="meta">作者: {post.ownerId} | 发布时间: {post.createTime}</p>
      </div>
      
      <div className="post-content">
        {post.content}
      </div>
      
      <div className="comment-section">
        <h2>评论 ({comments.length})</h2>
        
        <div className="add-comment">
          <textarea 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="写下您的评论..."
          />
          <button onClick={handleAddComment}>发表评论</button>
        </div>
        
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-header">
                <strong>{comment.userId}</strong>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
              
              {(username === 'admin' || comment.userId === username) && (
                <button 
                  className="delete-comment"
                  onClick={() => handleDeleteComment(comment.commentId)}
                >
                  删除
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;