// 🎨 Styles
import "./CustomFilePicker.scss"

import { useRef, useState } from "react"

const ACCEPTED_EXTENSIONS = [".csv", ".json"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo

const CustomFilePicker = () => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [_content, setContent] = useState("")
  const [error, setError] = useState("")

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return

    const extension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase()

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError(`Format non supporté (${ACCEPTED_EXTENSIONS.join(", ")})`)
      return
    }
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError("Fichier trop volumineux (5 Mo max)")
      return
    }

    try {
      const text = await selectedFile.text()
      setError("")
      setFile(selectedFile)
      setContent(text) // 👉 point d'entrée de ton analyse
    } catch {
      setError("Impossible de lire le fichier")
    }
  }

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0])
    // Permet de re-sélectionner le même fichier après un reset
    event.target.value = ""
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    // Ignore les dragleave déclenchés par les enfants (évite le clignotement)
    if (event.currentTarget.contains(event.relatedTarget)) return
    setIsDragging(false)
  }

  const handleReset = () => {
    setFile(null)
    setContent("")
    setError("")
  }

  return (
    <div className="smart-check-container">
      <h2>Smart Check</h2>

      <div
        className={`file-picker ${isDragging ? "file-picker--dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          hidden
        />

        {file ? (
          <div className="container__filePicker--file">
            <span className="container__filePicker--name">{file.name}</span>
            <span className="container__filePicker--size">
              {(file.size / 1024).toFixed(1)} Ko
            </span>
            <button type="button" onClick={handleReset}>
              Retirer
            </button>
          </div>
        ) : (
          <>
            <p>Glisse un fichier CSV ou JSON ici</p>
            <button type="button" onClick={() => inputRef.current?.click()}>
              Choisir un fichier
            </button>
          </>
        )}
      </div>

      {error && <p className="container__filePicker--error">{error}</p>}
    </div>
  )
}

export default CustomFilePicker
