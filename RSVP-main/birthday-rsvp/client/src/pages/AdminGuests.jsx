import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { clearToken, getToken } from '../lib/auth.js'
import Card from '../components/Card.jsx'

function toCSV(rows) {
  const header = ['Name','Attending','Email','Message','Submitted At']
  const lines = [header.join(',')]
  for (const r of rows) {
    const vals = [r.name, r.attending ? 'Yes' : 'No', r.email || '', (r.message||'').replace(/"/g,'""'), new Date(r.createdAt).toLocaleString()]
    lines.push(vals.map(v=>`"${String(v).replace(/\n/g,' ')}"`).join(','))
  }
  return lines.join('\n')
}

export default function AdminGuests() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const fetchData = async () => {
    const { data } = await api.get('/guests')
    setList(data)
  }

  useEffect(() => {
    fetchData().catch(() => {
      clearToken()
      navigate('/admin', { replace: true })
    })
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'yes') return list.filter(x => x.attending)
    if (filter === 'no') return list.filter(x => !x.attending)
    return list
  }, [list, filter])

  const exportCSV = () => {
    const csv = toCSV(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guests.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const logout = () => {
    clearToken()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Guests</h1>
          <p className="text-sm text-white/60">Filter, export, and review RSVPs.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <select
            value={filter}
            onChange={e=>setFilter(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="rounded-xl border border-white/10 bg-ink-900/90 px-3 py-2 text-sm text-white/90 outline-none backdrop-blur-sm transition hover:bg-ink-900 focus:border-brand-300/60 focus:ring-4 focus:ring-brand-400/20"
          >
            <option value="all">All</option>
            <option value="yes">Attending: Yes</option>
            <option value="no">Attending: No</option>
          </select>
          <button
            onClick={exportCSV}
            className="rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
          >
            Export CSV
          </button>
          <button
            onClick={logout}
            className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Logout
          </button>
        </div>
      </div>

      <Card className="max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-white/55">
              <tr>
                <th className="p-2 border-b border-white/10 font-medium">Name</th>
                <th className="p-2 border-b border-white/10 font-medium">Attending</th>
                <th className="p-2 border-b border-white/10 font-medium">Email</th>
                <th className="p-2 border-b border-white/10 font-medium">Message</th>
                <th className="p-2 border-b border-white/10 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {filtered.map((g) => (
                <tr key={g._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-2 align-top whitespace-nowrap">{g.name}</td>
                  <td className="p-2 align-top">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      g.attending ? 'bg-emerald-500/15 text-emerald-50 border border-emerald-300/15' : 'bg-rose-500/15 text-rose-50 border border-rose-300/15'
                    }`}>
                      {g.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-2 align-top">{g.email || <span className="text-white/35">—</span>}</td>
                  <td className="p-2 align-top whitespace-pre-wrap max-w-md">{g.message || <span className="text-white/35">—</span>}</td>
                  <td className="p-2 align-top whitespace-nowrap">{new Date(g.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
