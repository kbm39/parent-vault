import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { parseDocumentWithAI, parseTextWithAI } from '../../lib/parseWithAI'
import { extractTextFromImage } from '../../lib/ocr'
import { Upload, File, X, CheckCircle, AlertCircle, Loader, Sparkles } from 'lucide-react'

interface FieldDef {
  key: string
  label: string
}

interface UploadDropZoneProps {
  section: string
  userId: string
  fields?: FieldDef[]
  onExtracted?: (data: Record<string, string>) => void
}

interface UploadedFile {
  name: string
  url?: string
  size: number
}

export default function UploadDropZone({ section, userId, fields, onExtracted }: UploadDropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError('')
    setUploading(true)
    const uploaded: UploadedFile[] = []

    for (const file of Array.from(fileList)) {
      const path = `${userId}/${section}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage
        .from('vault-documents')
        .upload(path, file, { upsert: false })

      if (upErr) {
        setError(`Failed to upload ${file.name}: ${upErr.message}`)
        continue
      }

      // Avoid permanent public links for sensitive files; use short-lived signed URLs.
      const { data: signedData, error: signedErr } = await supabase.storage
        .from('vault-documents')
        .createSignedUrl(path, 3600)

      if (signedErr) {
        console.warn('Could not create signed URL for uploaded file', signedErr)
      }

      uploaded.push({ name: file.name, url: signedData?.signedUrl, size: file.size })

      // Auto-parse PDFs or images if fields and callback are provided
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|gif|bmp)$/i.test(file.name)

      if (isPdf && fields && onExtracted) {
        setUploading(false)
        setParsing(true)
        try {
          const extracted = await parseDocumentWithAI(file, fields, section)
          console.log('Extracted fields:', extracted)
          if (Object.keys(extracted).length === 0) {
            setError('No information could be extracted from this document.')
          } else {
            onExtracted(extracted)
          }
        } catch (err: any) {
          console.error('Parse error:', err)
          setError(`Could not auto-fill fields: ${err.message}`)
        } finally {
          setParsing(false)
        }
      } else if (isImage && fields && onExtracted) {
        setUploading(false)
        setParsing(true)
        try {
          const text = await extractTextFromImage(file)
          const extracted = await parseTextWithAI(text, fields, section)
          console.log('Extracted from image:', extracted)
          if (Object.keys(extracted).length === 0) {
            setError('No information could be extracted from this image.')
          } else {
            onExtracted(extracted)
          }
        } catch (err: any) {
          console.error('Image OCR/Parse error:', err)
          setError(`Could not auto-fill fields from image: ${err.message}`)
        } finally {
          setParsing(false)
        }
      }
    }

    setFiles(prev => [...prev, ...uploaded])
    setUploading(false)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const status = parsing ? 'parsing' : uploading ? 'uploading' : 'idle'

  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Documents & Files
      </label>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${dragging
            ? 'border-teal-400 bg-teal-500/10'
            : 'border-slate-700 hover:border-teal-500/50 hover:bg-slate-800/40 bg-slate-800/20'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.csv"
        />

        {status === 'uploading' && (
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-7 h-7 text-teal-400 animate-spin" />
            <p className="text-sm text-teal-400">Uploading…</p>
          </div>
        )}

        {status === 'parsing' && (
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-7 h-7 text-teal-400 animate-pulse" />
            <p className="text-sm text-teal-400">Reading document and filling fields…</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-7 h-7 ${dragging ? 'text-teal-400' : 'text-slate-500'}`} />
            <div>
              <p className="text-sm font-medium text-slate-300">
                Drop files here or <span className="text-teal-400">browse</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Drop a PDF to auto-fill fields · PDF, Word, images, spreadsheets
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
              <File className="w-4 h-4 text-slate-400 shrink-0" />
              {f.url ? (
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-300 hover:text-teal-400 flex-1 truncate transition-colors">
                  {f.name}
                </a>
              ) : (
                <span className="text-xs text-slate-300 flex-1 truncate" title="Signed URL unavailable">
                  {f.name}
                </span>
              )}
              <span className="text-xs text-slate-600 shrink-0">{formatSize(f.size)}</span>
              <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
