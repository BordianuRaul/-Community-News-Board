import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import CreatePostModal from '../components/CreatePostModal'
import PostsFeed from '../components/PostsFeed'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'

export default function MainPage() {
  const { user, logout } = useAuth()
  const { data: posts = [], isLoading, error, refetch } = usePosts()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const bannerTimer = useRef(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      if (bannerTimer.current) {
        clearTimeout(bannerTimer.current)
      }
    }
  }, [])

  const handleCreated = (createdPost) => {
    if (createdPost) {
      queryClient.setQueryData(['posts'], (current) => {
        const list = Array.isArray(current) ? current : []
        const exists = list.some((item) => item.postId === createdPost.postId)
        if (exists) {
          return list
        }
        return [createdPost, ...list]
      })
    } else {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    setSuccessMessage('Post published to the community feed.')
    if (bannerTimer.current) {
      clearTimeout(bannerTimer.current)
    }
    bannerTimer.current = setTimeout(() => {
      setSuccessMessage('')
    }, 3500)
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Community News Board
          </p>
          <h1 className="font-display text-3xl text-slate-950 sm:text-4xl">
            Today&apos;s local headlines
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Signed in as <span className="font-semibold">{user?.username}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Create Post
          </button>
          <button type="button" className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {successMessage ? (
        <div className="panel border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900">
          {successMessage}
        </div>
      ) : null}

      <PostsFeed
        posts={posts}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
