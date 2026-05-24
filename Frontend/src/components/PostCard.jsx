import { usePresignedImage } from '../hooks/usePresignedImage'

const formatTimestamp = (value) => {
  if (!value) return 'Unknown time'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString()
}

export default function PostCard({ post, index }) {
  const imageKey = post.thumbnailImageUrl || post.originalImageUrl
  const { url, loading } = usePresignedImage(imageKey)
  const bodyText = post.body || ''

  return (
    <article
      className="panel grid gap-4 p-5 sm:grid-cols-[160px_1fr] sm:items-start"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        {url ? (
          <img
            src={url}
            alt={post.headline}
            className="h-40 w-full object-cover sm:h-full"
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-xs uppercase tracking-widest text-slate-400 sm:h-full">
            {loading ? 'Loading image' : 'No preview'}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>Community report</span>
          <span className="h-1 w-1 rounded-full bg-rose-500" />
          <time>{formatTimestamp(post.timestamp)}</time>
        </div>
        <h3 className="font-display text-xl text-slate-950 sm:text-2xl">
          {post.headline}
        </h3>
        <p className="text-sm text-slate-700">
          {bodyText.length > 220 ? `${bodyText.slice(0, 220)}...` : bodyText}
        </p>
      </div>
    </article>
  )
}
