import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/photoPresets';
import { useAuth } from '../context/AuthContext';

const CommentItem = ({ comment, postAuthorId, onDelete, onProfileClick }) => {
  const { user: currentUser } = useAuth();

  const commentUser = comment.user || {};
  const isCommentAuthor = currentUser?._id === commentUser._id;
  const isPostOwner = currentUser?._id === postAuthorId;
  const canDelete = isCommentAuthor || isPostOwner;

  return (
    <div className="comment-item">
      <img
        src={commentUser.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
        alt={commentUser.name || 'User'}
        className="comment-avatar"
        onClick={() => onProfileClick(commentUser.username)}
      />
      <div className="comment-body">
        <div className="comment-header">
          <div className="comment-meta" onClick={() => onProfileClick(commentUser.username)}>
            <span className="comment-author-name">{commentUser.name || 'LOOP Member'}</span>
            <span className="comment-author-handle">@{commentUser.username}</span>
            <span className="comment-dot">·</span>
            <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {canDelete && (
            <button
              className="comment-delete-btn"
              onClick={() => onDelete(comment._id)}
              title="Delete comment"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;
