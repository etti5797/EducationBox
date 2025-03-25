import { FaLinkedin } from 'react-icons/fa';
const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the EducationBox</h1>
            <p>
                This website was created out of a desire to help kindergarten teachers, especially my sister, who is a kindergarten teacher herself.
                The goal of the site is to make it easier for kindergarten teachers to upload, organize, and share educational materials.
            </p>
            <p>
                The platform includes:
            </p>
            <ul>
                <li>A personal space for each kindergarten teacher to upload and manage their materials.</li>
                <li>A public area for sharing materials with other professionals.</li>
                <li>A forum to ask questions and share ideas.</li>
                <li>A chatbot that suggests activity ideas to assist you in daily tasks.</li>
            </ul>
            <p>
                This website is also a personal project that helps me develop my programming skills. 
                I hope it will make the work of kindergarten teachers easier and provide them with new tools to enhance their educational practices.
            </p>
            <p>
                Connect with me on LinkedIn: 
                <a href="https://www.linkedin.com/in/etti-revach/" target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#0077b5' }}>
                    <FaLinkedin style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Etti Revach
                </a>
            </p>
        </div>
    );
}

export default Home;
