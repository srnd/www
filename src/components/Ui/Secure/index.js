import React from 'react'
import appContext from '../../Context'
import SmartLink from '../SmartLink'
import ok from './ok.svg'
import Icon from '@srnd/topocons'
import './index.sass'

export const Customizable = ({ children, icon }) => (
    <div className="secure privacy">
        <img src={icon} alt="" />
        <p>{children}</p>
    </div>
);
export default Customizable;


export const Pii = appContext(({ context, ...props }) => (
    <div className="secure privacy">
        <Icon.Promise />
        <p>{context.translate('privacy.pii')} <SmartLink to="/privacy">({context.translate('privacy.more-info')})</SmartLink></p>
    </div>
));

export const Card = appContext(({ context, ...props }) => (
    <div className="secure privacy">
        <Icon.ShieldOk />
        <p>{context.translate('privacy.card')} <SmartLink to="/privacy">({context.translate('privacy.more-info')})</SmartLink></p>
    </div>
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
