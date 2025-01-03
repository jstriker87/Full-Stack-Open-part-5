import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'

import noteService from './services/notes'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState ('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
   const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  useEffect(() => {
  noteService
  .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
}, [])

  console.log('render',notes.length,'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
        content: newNote,
        important: Math.random() < 0.5,
        id: String(notes.length + 1),
   }
    noteService
    .create(noteObject)
    .then(returnedNote=> {
        setNotes(notes.concat(returnedNote));
        setNewNote('')
    })
  }

const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
}

  const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
}


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
        <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange}/>
      <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App
