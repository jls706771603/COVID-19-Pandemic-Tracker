import './Footer.css'
import { useHistory } from 'react-router-dom'

export default function Footer() {
    let history = useHistory();

    return (
        <footer>
            <div className='footercontent'>
                <h1 className='topNavigation'>Navigation</h1>
                <ul className='botNavigation'>
                    <a><li><button onClick={() => { history.push("/") }}>Home</button></li></a>
                    <a><li><button onClick={() => { history.push("/tracking") }}>Tracking</button></li></a>
                    <a><li><button onClick={() => { history.push("/about") }}>About</button></li></a>
                </ul>
            </div>
            <div className='footerbottom'>
                <p>Copyright &copy; 2022.</p>
            </div>
        </footer>
    )
}