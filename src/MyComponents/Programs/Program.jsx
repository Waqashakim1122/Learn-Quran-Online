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

const programs = [
  { img: Program1, icon: Icon1, title: 'Quran Memorization' },
  { img: Program2, icon: Icon2, title: 'Quran Recitation' },
  { img: Program3, icon: Icon3, title: 'Quran Translation' },
  { img: Program4, icon: Icon4, title: 'Noorani Qaida' },
];

const Program = () => {
  return (
    <div className='programs'>
      <div className="container text-center">
        <div className="row g-4">
          {programs.map((p, i) => (
            <div className='col-12 col-sm-6 col-md-3' key={i}>
              <div className='program'>
                <img src={p.img} alt={p.title} />
                <div className='capstion'>
                  <img src={p.icon} alt="" />
                  <p>{p.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Program
