import React from 'react'
import appContext from '../../Context'
import SmartLink from '../SmartLink'
import lock from './lock.svg'
import pii from './pii.svg'
import ok from './ok.svg'
import './index.sass'

export const Customizable = ({ children, icon }) => (
    <div className="secure privacy">
        <img src={icon} alt="" />
        <p>{children}</p>
    </div>
);
export default Customizable;


export const Pii = appContext(({ context, ...props }) => (
    <Customizable icon={pii}>{context.translate('privacy.pii')} <SmartLink to="/privacy">({context.translate('privacy.more-info')})</SmartLink></Customizable>
));

export const Card = appContext(({ context, ...props }) => (
    <Customizable icon={lock}>{context.translate('privacy.card')} <SmartLink to="/privacy">({context.translate('privacy.more-info')})</SmartLink></Customizable>
));

export const CookieNagbar = appContext(class _cookieNagbar extends React.Component {
    constructor() {
        super();
        this.state = {
            acceptCookies: typeof(window) === 'undefined' ? true : (window.localStorage['acceptCookies'] === "1"  || false)
        }
    }

    render() {
        const context = this.props.context;
        return <div>
            {this.state.acceptCookies ? null : (
                <div className="cookies privacy">
                    <div class="wrap">
                        <div class="info">
                            <p>{context.translate('privacy.overview')} <SmartLink to="/privacy">({context.translate('privacy.more-info')})</SmartLink></p>
                        </div>
                        <div className="options">
                            <SmartLink to="/privacy" className="opt-out">{context.translate('privacy.opt-out')}</SmartLink>
                            <img onClick={() => this.acceptCookies()} src={ok} alt="Ok" />
                        </div>
                    </div>
            </div>)}
        </div>;
    }

    acceptCookies() {
        window.localStorage['acceptCookies'] = "1";
        this.setState({acceptCookies: true});
    }
});
