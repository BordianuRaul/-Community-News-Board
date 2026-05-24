import { useEffect, useMemo, useRef, useState } from 'react'
import PostCard from './PostCard'

const PAGE_SIZE = 10

export default function PostsFeed({
  posts,
  isLoading,
  error,
  onRetry,
  onOpenCreate,
}) {
  const [page, setPage] = useState(1)
  const sentinelRef = useRef(null)

  const orderedPosts = useMemo(() => {
    if (!posts?.length) return []
    return [...posts].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    )
  }, [posts])

  const visiblePosts = orderedPosts.slice(0, page * PAGE_SIZE)
  const hasMore = visiblePosts.length < orderedPosts.length

  useEffect(() => {
    setPage(1)
  }, [orderedPosts.length])

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((current) => current + 1)
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [hasMore])

  if (isLoading) {
    return (
      <section className="grid gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel h-40 animate-pulse" />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <section className="panel flex flex-col items-start gap-4 p-6">
        <h2 className="font-display text-xl text-slate-950">
          We could not load the feed.
        </h2>
        <p className="text-sm text-slate-600">
          Please retry or create a new post to refresh the timeline.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={onRetry}>
            Retry
          </button>
          <button type="button" className="btn-secondary" onClick={onOpenCreate}>
            Create Post
          </button>
        </div>
      </section>
    )
  }

  if (!visiblePosts.length) {
    return (
      <section className="panel flex flex-col items-start gap-4 p-6">
        <h2 className="font-display text-xl text-slate-950">
          No reports yet.
        </h2>
        <p className="text-sm text-slate-600">
          Be the first to publish a verified update.
        </p>
        <button type="button" className="btn-primary" onClick={onOpenCreate}>
          Create the first post
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      {visiblePosts.map((post, index) => (
        <PostCard key={post.postId || index} post={post} index={index} />
      ))}
      {hasMore ? (
        <div className="flex justify-center py-4">
          <div ref={sentinelRef} className="h-1 w-full" />
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500">
          You have reached the end of the feed.
        </p>
      )}
    </section>
  )
}
