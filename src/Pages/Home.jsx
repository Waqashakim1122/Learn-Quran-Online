

import Header from '../MyComponents/Navbar/Header'
import Hero from '../MyComponents/Heros/Hero'
import Program from '../MyComponents/Programs/Program';
import Title from '../MyComponents/Title/Title';
import About from '../MyComponents/About/About';

import Footer from '../MyComponents/Footer/Footer';
import VideoPlayer from '../MyComponents/VideoPlayer/VideoPlayer';
import { useState } from 'react';


function App() {
  const[ playstate, setPlaystate] = useState(false);
  return (
   <>
   <Header/>
  <Hero/>
   <div className='container'>
    <Title subtitle='OUR COURCES' tittle='What We Offer'/>
   <Program/>
   <Title  subtitle='About Us' tittle='Who We Are'/>
   <About setPlaystate={setPlaystate}/>
   <VideoPlayer playstate={playstate} setPlaystate={setPlaystate}/>
   
   </div>
   <Footer/>
   </>
  );
}

export default App;
