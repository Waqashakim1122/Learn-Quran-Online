import Header from '../MyComponents/Navbar/Header'
import Hero from '../MyComponents/Heros/Hero'
import Program from '../MyComponents/Programs/Program';
import About from '../MyComponents/About/About';
import Footer from '../MyComponents/Footer/Footer';
import VideoPlayer from '../MyComponents/VideoPlayer/VideoPlayer';
import { useState } from 'react';

function App() {
  const [playstate, setPlaystate] = useState(false);
  return (
    <>
      <Header />
      <Hero />
      <div className='container'>
        <Program />
      
        <About setPlaystate={setPlaystate} />
        <VideoPlayer playstate={playstate} setPlaystate={setPlaystate} />
      </div>
      <Footer />
    </>
  );
}
export default App;
