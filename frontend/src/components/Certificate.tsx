import React, { useRef } from 'react'
import { X, Printer } from 'lucide-react'

const Certificate = ({ userName, courseName, score, certificateId, date, instructorName, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null)

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const handlePrint = () => {
    const printContents = certRef.current?.innerHTML
    const win = window.open('', '_blank', 'width=1100,height=800')
    if (!win || !printContents) return
    win.document.write(`
      <html><head><title>Certificate - ${userName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .cert-wrap { width: 960px; height: 680px; position: relative; background: #fafafa; font-family: 'Inter', sans-serif; }
      </style></head>
      <body><div class="cert-wrap">${printContents}</div>
      <script>window.onload=()=>{window.print();window.close()}<\/script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">

        {/* Certificate */}
        <div ref={certRef}
          className="relative w-full bg-[#fafafa] shadow-2xl"
          style={{ aspectRatio: '1.414/1', fontFamily: "'Inter', sans-serif" }}>

          {/* Outer red border */}
          <div className="absolute inset-3 border-4 border-[#8b0000] pointer-events-none"/>
          {/* Inner gold border */}
          <div className="absolute inset-5 border border-[#c8a84b] pointer-events-none"/>

          {/* Corner accents */}
          {[['top-2 left-2', 'border-t-4 border-l-4'],
            ['top-2 right-2', 'border-t-4 border-r-4'],
            ['bottom-2 left-2', 'border-b-4 border-l-4'],
            ['bottom-2 right-2', 'border-b-4 border-r-4']].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-[#8b0000] ${border} pointer-events-none`}/>
          ))}

          {/* AROHAK watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[120px] font-black text-[#8b0000] opacity-[0.04] tracking-widest">AROHAK</span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center h-full px-16 py-8">

            {/* Top header pill */}
            <div className="bg-[#8b0000] text-white text-xs font-bold tracking-[0.2em] px-8 py-2 rounded-full mb-4">
              AROHAK LEARNING PORTAL
            </div>

            {/* Gold divider */}
            <div className="w-full h-px bg-[#c8a84b] mb-4"/>

            {/* Certificate of Completion */}
            <p className="text-[#8b0000] font-bold tracking-[0.15em] text-sm mb-3">CERTIFICATE OF COMPLETION</p>

            {/* This is to certify */}
            <p className="text-gray-500 text-sm mb-2">This is to certify that</p>

            {/* Name */}
            <h1 className="text-5xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {userName || 'Student Name'}
            </h1>
            <div className="w-48 h-0.5 bg-gray-800 mb-2"/>

            {/* Department */}
            <p className="text-gray-500 text-xs tracking-widest uppercase mb-2">IT</p>

            {/* Has successfully completed */}
            <p className="text-gray-600 text-sm mb-2">has successfully completed the course</p>

            {/* Course name */}
            <h2 className="text-2xl font-bold text-[#8b0000] mb-3">{courseName}</h2>

            {/* Score badge */}
            <div className="border border-[#c8a84b] rounded-full px-6 py-1.5 mb-4">
              <span className="text-[#c8a84b] text-sm font-semibold">Score: {score}% · Pass</span>
            </div>

            {/* Spacer */}
            <div className="flex-1"/>

            {/* Signatures */}
            <div className="w-full flex justify-between items-end mb-4 px-4">
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{formattedDate}</p>
                <div className="w-40 h-px bg-gray-400 mt-1 mb-1"/>
                <p className="text-xs text-gray-500">Date of Completion</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Arohak Learning Portal</p>
                <div className="w-40 h-px bg-gray-400 mt-1 mb-1 ml-auto"/>
                <p className="text-xs text-gray-500">Authorized Signature</p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="w-full h-px bg-[#c8a84b] mb-2"/>

            {/* Footer */}
            <p className="text-[10px] text-[#c8a84b] tracking-[0.2em]">
              ATTITUDE DETERMINES ALTITUDE · arohak.com
              {certificateId && <span className="text-gray-400 ml-4">ID: {certificateId}</span>}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            <X size={15}/> Close
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-amber-600 text-white font-semibold rounded-xl text-sm hover:from-red-800 hover:to-amber-700 transition shadow-md">
            <Printer size={15}/> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default Certificate
