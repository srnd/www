import React from 'react'
import loadGif from './load.gif'
import loadSvg from './load.svg'

const smilSupport = () => {
    return !window ? true : window.document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      ).toString().indexOf('SVG') >-1;
}

export default () => (
    <div style={{width: '100%', textAlign: 'center'}}>
        <img src={smilSupport() ? loadSvg : loadGif} alt="" />
    </div>
)
