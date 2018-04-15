import React from 'react'
import appContext from '../../Context'
import lock from './lock.svg'
import './index.sass'

export const Customizable = ({ children }) => (
    <div className="secure">
        <img src={lock} alt="" />
        <p>{children}</p>
    </div>
);
export default Customizable;


export const Pii = appContext(({ context, ...props }) => (
    <Customizable>{context.translate('ui.secure.pii')}</Customizable>
));
export const Card = appContext(({ context, ...props }) => (
    <Customizable>{context.translate('ui.secure.card')}</Customizable>
));
