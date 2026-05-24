import { useEffect, useRef, useState } from 'react'
import { apiClient } from '../api/client'
import { useToast } from '../hooks/useToast'

const initialState = {
  headline: '',
  body: '',
  file: null,
}

export default function CreatePostModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(initialState)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const headlineRef = useRef(null)
  const { showToast, updateToast } = useToast()

  useEffect(() => {
    if (!open) return
    headlineRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!form.file) {
      setPreviewUrl('')
      return
    }

    const url = URL.createObjectURL(form.file)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [form.file])

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setForm((prev) => ({ ...prev, file }))
  }

  const resetForm = () => {
    setForm(initialState)
    setError('')
    setBusy(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const toastId = showToast({
      message: 'Publishing your post...',
      tone: 'info',
      isLoading: true,
      duration: 0,
    })

    if (!form.file) {
      setError('Please attach an image to publish the post.')
      updateToast(toastId, {
        message: 'Image required to publish a post.',
        tone: 'error',
        isLoading: false,
        duration: 4000,
      })
      return
    }

    setBusy(true)

    try {
      const presign = await apiClient.presignPut({
        filename: form.file.name,
        contentType: form.file.type || 'application/octet-stream',
      })

      const uploadResponse = await fetch(presign.url, {
        method: presign.method || 'PUT',
        headers: {
          'Content-Type': form.file.type || 'application/octet-stream',
        },
        body: form.file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed. Please try again.')
      }

      const createdPost = await apiClient.createPost({
        headline: form.headline,
        body: form.body,
        imageKey: presign.key,
      })

      updateToast(toastId, {
        message: 'Post published successfully.',
        tone: 'success',
        isLoading: false,
        duration: 3000,
      })

      onCreated?.(createdPost)
      resetForm()
      onClose()
    } catch (err) {
      updateToast(toastId, {
        message: 'Publish failed. Please try again.',
        tone: 'error',
        isLoading: false,
        duration: 4500,
      })
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not create the post. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className="panel relative z-10 w-full max-w-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Create post"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Create post
            </p>
            <h2 className="font-display text-2xl text-slate-950">
              Publish a community update
            </h2>
          </div>
          <button
            type="button"
            className="btn-chip"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="label" htmlFor="headline">
              Headline
            </label>
            <input
              ref={headlineRef}
              id="headline"
              name="headline"
              type="text"
              className="input"
              value={form.headline}
              onChange={handleChange}
              placeholder="Neighborhood watch update"
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="label" htmlFor="body">
              Story
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              className="input min-h-[140px]"
              value={form.body}
              onChange={handleChange}
              placeholder="Share the details behind the headline."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="label" htmlFor="image">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
              required
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 h-48 w-full rounded-xl object-cover"
              />
            ) : null}
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Publishing...' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
