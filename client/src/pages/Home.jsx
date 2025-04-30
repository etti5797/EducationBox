import { FaLinkedin } from 'react-icons/fa';
const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the EducationBox</h1>
            <p className='intro-text'>
            This website was created to support kindergarten teachers, especially my sister, who is one herself. It aims to simplify tasks like tracking events, managing materials, planning activities, and collaborating with colleagues.
            </p>
            <p className='platform-features-text'> 
                The platform includes:
            </p>
            <ul>
                <li>A personal space for each kindergarten teacher to upload and manage materials, including a personalized calendar to track important events, planned activities, birthdays, holidays, and more, as well as a to-do list for task management.</li>
                <li>A public area for sharing materials with other kindergarten teachers.</li>
                <li>A forum for asking questions and exchanging ideas.</li>
                <li>A chatbot that suggests activity ideas to assist in daily tasks.</li>
            </ul>
            <p className="about-project"> 
                This website is also a personal project that helps me develop my programming skills. 
                I hope it will make the work of kindergarten teachers easier and provide them with new tools to enhance their educational practices.
            </p>
            <p className='linkedin'> 
                Connect with me on LinkedIn: 
                <br/>
                <a className='linkedin-icon' href="https://www.linkedin.com/in/etti-revach/" target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#0077b5' }}>
                    <FaLinkedin style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Etti Revach
                </a>
            </p>
        </div>
    );
}

export default Home;
