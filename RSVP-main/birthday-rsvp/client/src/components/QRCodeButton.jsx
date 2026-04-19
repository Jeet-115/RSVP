import { useState } from 'react'
import QRCode from 'qrcode.react'

export default function QRCodeButton() {
  const [open, setOpen] = useState(false)
  const url = window.location.href
  return (
    <div>
      <button onClick={() => setOpen(v=>!v)} className="px-3 py-2 rounded bg-accentPurple text-white hover:opacity-90">
        Show QR Code
      </button>
      {open && (
        <div className="mt-3 p-4 bg-white dark:bg-slate-800 rounded shadow inline-block">
          <QRCode value={url} size={180} includeMargin />
        </div>
      )}
    </div>
  )
}
