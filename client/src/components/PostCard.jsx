import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import LevelBadge from './LevelBadge'

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [liked, setLiked] = useState(post.likes?.includes(user?._id))

  const handleLike = async () => {
    try {
      const res = await postsAPI.like(post._id)
      setLikeCount(res.data.likes)
      setLiked(res.data.liked)
    } catch (err) {
      console.error(err)
    }
  }

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true)
      try {
        const res = await postsAPI.getComments(post._id)
        setComments(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingComments(false)
      }
    }
    setShowComments(!showComments)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      const res = await postsAPI.comment(post._id, { text: commentText })
      setComments([...comments, res.data])
      setCommentText('')
    } catch (err) {
      console.error(err)
    }
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Link to={`/profile/${post.user?._id}`}>
          <Avatar name={post.user?.name} avatar={post.user?.avatar} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/profile/${post.user?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {post.user?.name}
            </Link>
            {post.user?.level && <LevelBadge level={post.user.level} />}
            {post.user?.role === 'employer' && (
              <span className="badge badge-blue">Employer</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
        >
          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
        <button
          onClick={loadComments}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comments
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {loadingComments ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : (
            <>
              {comments.map(c => (
                <div key={c._id} className="flex gap-2">
                  <Avatar name={c.user?.name} avatar={c.user?.avatar} size="sm" />
                  <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-gray-800">{c.user?.name}</p>
                    <p className="text-sm text-gray-700">{c.text}</p>
                  </div>
                </div>
              ))}
              <form onSubmit={handleComment} className="flex gap-2 mt-2">
                <Avatar name={user?.name} size="sm" />
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="input-field text-sm py-1.5"
                />
                <button type="submit" className="btn-primary text-sm py-1.5 px-3">Post</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
