import React from 'react'
import './Title.css'

const Title = ({subtitle,tittle}) => {
  return (
    <div className='Title'>
        <p >{subtitle}</p>
        <h2>{tittle}</h2>
    </div>
  )
}

export default Title