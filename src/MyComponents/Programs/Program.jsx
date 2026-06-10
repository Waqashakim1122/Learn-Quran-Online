import React from 'react'
import './Program.css'
import Program1 from '../../assetes/Quran--Memorization.jpg'
import Program2 from '../../assetes/Quran-Reactation.jpg'
import Program3 from '../../assetes/Quran-Tranlation-Course.jpg'
import Program4 from '../../assetes/Norani-quida.jpg'
import Icon1 from '../../assetes/icon.1.png'
import Icon2 from '../../assetes/icon.2.png'
import Icon3 from '../../assetes/icon.3.png'
import Icon4 from '../../assetes/icon.4.png'

const Program = () => {
  return (
    <>
      <div className='programs'>
        <div class="container text-center ">
          <div class="row">
            <div className='col-12 col-md-3 '>
              <div className='program'>
                <img src={Program1} alt="" />
                <div className='capstion'>
                  <img src={Icon1} alt="" />
                  <p>Quran Memorization</p>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-3 ">
              <div className='program'>
                <img src={Program2} alt="" />
                <div className='capstion'>
                  <img src={Icon2} alt="" />
                  <p>Quran Recitation</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3 ">
              <div className='program'>
                <img src={Program3} alt="" />
                <div className='capstion'>
                  <img src={Icon3} alt="" />
                  <p>Quran Translation</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3 ">
              <div className='program'>
                <img src={Program4} alt="" />
                <div className='capstion'>
                  <img src={Icon4} alt="" />
                  <p>Noorani Qaida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Program