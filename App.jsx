
import React, { useState, useEffect } from 'react'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '', surname: '', title: '' })
  const [rooms, setRooms] = useState([])
  const [reservations, setReservations] = useState([])
  const [reservationForm, setReservationForm] = useState({ room_id: '', date: '', time_from: '', time_to: '' })

  useEffect(() => {
    fetch('/api/rooms').then(res => res.json()).then(setRooms)
    fetch('/api/reservations').then(res => res.json()).then(setReservations)
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      alert('Zarejestrowano, możesz się zalogować')
      setView('login')
    } else {
      alert('Błąd rejestracji')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data)
      setView('app')
    } else {
      alert('Błąd logowania')
    }
  }

  const handleReservation = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...reservationForm, user_id: user.id })
    })
    if (res.ok) {
      alert('Dodano rezerwację')
      const data = await res.json()
      setReservations([...reservations, { id: data.id, ...reservationForm, user_id: user.id }])
    } else {
      alert('Błąd rezerwacji')
    }
  }

  if (view === 'register') {
    return (
      <div>
        <h2>Rejestracja</h2>
        <form onSubmit={handleRegister}>
          <input placeholder="Imię" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Nazwisko" onChange={e => setForm({ ...form, surname: e.target.value })} />
          <input placeholder="Tytuł" onChange={e => setForm({ ...form, title: e.target.value })} />
          <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Hasło" onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit">Zarejestruj</button>
        </form>
        <button onClick={() => setView('login')}>Masz konto? Zaloguj się</button>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div>
        <h2>Logowanie</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Hasło" onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit">Zaloguj</button>
        </form>
        <button onClick={() => setView('register')}>Nie masz konta? Zarejestruj się</button>
      </div>
    )
  }

  return (
    <div>
      <h2>System Rezerwacji Sal</h2>
      <form onSubmit={handleReservation}>
        <select onChange={e => setReservationForm({ ...reservationForm, room_id: e.target.value })}>
          <option value="">Wybierz salę</option>
          {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
        </select>
        <input type="date" onChange={e => setReservationForm({ ...reservationForm, date: e.target.value })} />
        <input type="time" onChange={e => setReservationForm({ ...reservationForm, time_from: e.target.value })} />
        <input type="time" onChange={e => setReservationForm({ ...reservationForm, time_to: e.target.value })} />
        <button type="submit">Rezerwuj</button>
      </form>
      <h3>Twoje rezerwacje</h3>
      <ul>
        {reservations.filter(r => r.user_id === user?.id).map(r => (
          <li key={r.id}>{r.date} | {r.time_from}–{r.time_to} | sala {r.room_id}</li>
        ))}
      </ul>
    </div>
  )
}
