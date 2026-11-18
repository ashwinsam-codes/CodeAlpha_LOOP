import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Check } from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../utils/photoPresets';
import CommentItem from './CommentItem';

const PostCard = ({ post, onDeletePost, onProfileClick }) => {
  const { user: currentUser, isAuthenticated } = useAuth();

  const author = post.user || {};
  const isPostOwner = currentUser?._id === author._id;

  const [likes, setLikes] = useState(post.likes || []);
  const [hasLiked, setHasLiked] = useState(
    post.likes?.some((id) => (id._id || id) === currentUser?._id) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Like / Unlike Toggle
  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like posts.');
      return;
    }

    // Optimistic UI update
    const previousHasLiked = hasLiked;
    const previousLikeCount = likeCount;

    setHasLiked(!previousHasLiked);
    setLikeCount(previousHasLiked ? previousLikeCount - 1 : previousLikeCount + 1);

    try {
      const res = await postAPI.toggleLike(post._id);
      setHasLiked(res.data.liked);
      setLikeCount(res.data.likesCount);
    } catch (err) {
      console.error('Like toggle error:', err);
      // Revert on error
      setHasLiked(previousHasLiked);
      setLikeCount(previousLikeCount);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to join the conversation.');
      return;
    }
    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      const res = await postAPI.addComment(post._id, commentText.trim());
      setComments([...comments, res.data.comment]);
      setCommentText('');
    } catch (err) {
      console.error('Add comment error:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setCommenting(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await postAPI.deleteComment(post._id, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err);
      alert('Failed to delete comment.');
    }
  };

  // Delete Post
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      setDeleting(true);
      await postAPI.delete(post._id);
      if (onDeletePost) onDeletePost(post._id);
    } catch (err) {
      console.error('Delete post error:', err);
      alert('Failed to delete post.');
      setDeleting(false);
    }
  };

  // Share post link
  const handleShare = () => {
    const postLink = `${window.location.origin}?post=${post._id}`;
    navigator.clipboard.writeText(postLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author-row" onClick={() => onProfileClick(author.username)}>
          <img
            src={author.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={author.name || 'User'}
            className="post-avatar"
          />
          <div className="post-meta">
            <div className="post-author-name">{author.name || 'LOOP Member'}</div>
            <div className="post-handle-time">
              <span>@{author.username}</span>
              <span className="meta-dot">·</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {isPostOwner && (
          <button
            className="post-delete-btn"
            onClick={handleDeletePost}
            disabled={deleting}
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="post-body">
        <p className="post-text">{post.content}</p>

        {/* Post Image (Natural photograph) */}
        {post.image && (
          <div className="post-image-container">
            <img
              src={post.image}
              alt="Post media"
              className="post-image"
              loading="lazy"
              onError={(e) => {
                // If broken URL, hide image container
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="post-actions-row">
        {/* Like Button */}
        <button
          className={`action-btn ${hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title={hasLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={18} fill={hasLiked ? '#ef4444' : 'none'} color={hasLiked ? '#ef4444' : 'currentColor'} />
          <span className="action-count">{likeCount > 0 ? likeCount : ''}</span>
        </button>

        {/* Comment Button */}
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
          title="Comments"
        >
          <MessageCircle size={18} />
          <span className="action-count">{comments.length > 0 ? comments.length : ''}</span>
        </button>

        {/* Share Button */}
        <button className="action-btn" onClick={handleShare} title="Share post">
          {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
          <span className="action-count">{copied ? 'Copied' : ''}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {/* Add Comment Input */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <img
                src={currentUser?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name}
                className="comment-input-avatar"
              />
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="comment-input"
                maxLength={300}
              />
              <button
                type="submit"
                className="btn-comment-submit"
                disabled={commenting || !commentText.trim()}
              >
                {commenting ? '...' : 'Post'}
              </button>
            </form>
          ) : (
            <div className="comment-login-hint">
              Log in to join the conversation and comment on this post.
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments-msg">No comments yet. Be the first to reply!</div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postAuthorId={author._id}
                  onDelete={handleDeleteComment}
                  onProfileClick={onProfileClick}
                />
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
