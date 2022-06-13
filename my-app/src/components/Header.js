import './Header.css'
import { useHistory } from 'react-router-dom'

export default function Header() {
  let history = useHistory();

  return (
    <div className='header'>
      <div className='innerheader'>
        <div className='logosegment'>
          <h1 className='logo'>COVID-19 Pandemic Tracker</h1>
        </div>
        <button className='login'>Login</button>
        <ul className='navigation'>
          <a><li><button onClick={() => { history.push("/") }}>Home</button></li></a>
          <a><li><button onClick={() => { history.push("/tracking") }}>Tracking</button></li></a>
          <a><li><button onClick={() => { history.push("/about") }}>About</button></li></a>
        </ul>
      </div>
    </div>
  )
}