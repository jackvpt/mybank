// 🎨 Styles
import "./CustomFilePicker.scss"

// ⚛️ React
import { useRef, useState } from "react"

import CustomButton from "../CustomButton/CustomButton"
import { parseAccountReport } from "../../../utils/parseAccountReport"

/** Extensions accepted by the picker (lowercase, with leading dot). */
const ACCEPTED_EXTENSIONS = [".json"]

/** Maximum accepted file size in bytes (5 MB). */
const MAX_SIZE_BYTES = 5 * 1024 * 1024

/**
 * A single normalized transaction produced by the statement parser.
 * @typedef {Object} ParsedTransaction
 * @property {string} date - ISO date (YYYY-MM-DD).
 * @property {string} type - Transaction type (e.g. "Virement", "Prlv").
 * @property {string} label - Trimmed transaction label.
 * @property {string} notes - Additional details, empty string if none.
 * @property {number} amount - Signed amount (negative = debit, positive = credit).
 */

/**
 * Statement metadata extracted from the imported file.
 * @typedef {Object} StatementMeta
 * @property {string} account - Account number.
 * @property {string} iban - Account IBAN.
 * @property {number} statementNumber - Statement sequence number.
 * @property {string} from - Period start (ISO date).
 * @property {string} to - Period end (ISO date).
 */

/**
 * Result of a successful statement parsing.
 * @typedef {Object} ParsedStatement
 * @property {ParsedTransaction[]} transactions - Normalized transactions.
 * @property {StatementMeta} meta - Statement metadata.
 * @property {string[]} errors - Validation errors (always empty when delivered to the parent).
 */

/**
 * Extracts the lowercase extension (with leading dot) from a file name.
 * Returns an empty string when the name has no extension.
 *
 * @param {string} fileName - The file name to inspect.
 * @returns {string} The lowercase extension, e.g. ".json".
 */
const getExtension = (fileName) =>
  fileName.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? ""

/**
 * Drag-and-drop / click file picker for bank statement JSON files.
 *
 * Validates the file (extension, size), parses its JSON content, runs the
 * statement validation and hands the normalized result to the parent.
 * Any invalid file clears the current selection and notifies the parent
 * with `null`, so parent and picker never get out of sync.
 *
 * @param {Object} props
 * @param {(file: File | null, result: ParsedStatement | null) => void} [props.onFileLoaded]
 *   Called with the selected file and its parsed statement, or `(null, null)`
 *   when the selection is cleared (reset or rejected file).
 * @param {string} [props.title] - The title to display above the file picker.
 * @returns {JSX.Element}
 */
const CustomFilePicker = ({title="JSON", onFileLoaded }) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")

  /**
   * Clears the current selection and notifies the parent.
   * Does not touch the error message, so callers can set it afterwards.
   */
  const clearSelection = () => {
    setFile(null)
    onFileLoaded?.(null, null)
  }

  /**
   * Rejects the current file: clears the selection and displays an error.
   *
   * @param {string} message - Error message to display.
   */
  const rejectFile = (message) => {
    clearSelection()
    setError(message)
  }

  /**
   * Validates, reads and parses the selected file.
   *
   * @param {File | undefined} selectedFile - File coming from the input or a drop event.
   * @returns {Promise<void>}
   */
  const handleFile = async (selectedFile) => {
    if (!selectedFile) return

    if (!ACCEPTED_EXTENSIONS.includes(getExtension(selectedFile.name))) {
      rejectFile(`Format non supporté (${ACCEPTED_EXTENSIONS.join(", ")})`)
      return
    }
    if (selectedFile.size > MAX_SIZE_BYTES) {
      rejectFile("Fichier trop volumineux (5 Mo max)")
      return
    }

    try {
      const text = await selectedFile.text()
      // Strip the BOM if present (common on Windows exports)
      const data = JSON.parse(text.replace(/^\uFEFF/, ""))
      const result = parseAccountReport(data)

      setError("")
      setFile(selectedFile)
      onFileLoaded?.(selectedFile, result)
    } catch (err) {
      rejectFile(
        err instanceof SyntaxError
          ? "JSON invalide"
          : "Impossible de lire le fichier",
      )
    }
  }

  /**
   * Handles file selection through the native file dialog.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0])
    // Allow re-selecting the same file by resetting the input value
    event.target.value = ""
  }

  /**
   * Handles a file dropped on the drop zone (only the first file is used).
   *
   * @param {React.DragEvent<HTMLDivElement>} event
   */
  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  /**
   * Keeps the drop zone in its "dragging" state while a file hovers over it.
   *
   * @param {React.DragEvent<HTMLDivElement>} event
   */
  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  /**
   * Leaves the "dragging" state, ignoring leave events fired by child elements.
   *
   * @param {React.DragEvent<HTMLDivElement>} event
   */
  const handleDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    setIsDragging(false)
  }

  /** Removes the selected file and clears any displayed error. */
  const handleReset = () => {
    clearSelection()
    setError("")
  }

  return (
    <div className="container__filePicker">
      <div
        className={`container__filePicker-filePicker ${isDragging ? "container__filePicker-dragging" : ""}`}
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
          <div className="container__filePicker-file">
            <div className="container__filePicker-file-nameSize">
              <div
                className="container__filePicker-file-nameSize-name"
                title={file.name}
              >
                {file.name}
              </div>
              <div className="container__filePicker-file-nameSize-size">
                {(file.size / 1024).toFixed(1)} Ko
              </div>
            </div>
            <CustomButton action="reset" onClick={handleReset}>
              Retirer
            </CustomButton>
          </div>
        ) : (
          <div className="container__filePicker-file">
            <div className="container__filePicker-file-nameSize">
              <div className="container__filePicker-file-nameSize-name">
                {title}
              </div>
              <div className="container__filePicker-file-nameSize-size">
                (5 Mo max)
              </div>
            </div>
            <div className="container__filePicker-file-button">
              <CustomButton
                action="file"
                onClick={() => inputRef.current?.click()}
              ></CustomButton>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="container__filePicker-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default CustomFilePicker
