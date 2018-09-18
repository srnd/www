import React from 'react'
import appContext from '../../Context'
import prefContext from '../../Context/prefs'
import axios from 'axios'

class TrackingControl extends React.Component {
    render() {
        return <div className="tracking-control">{this.props.prefs.allowTracking === null ? null : (<div>
            <input type="checkbox" id="tracking-control-toggle" checked={!this.props.prefs.allowTracking} onChange={() => this.toggleTracking()} />
            <label htmlFor="tracking-control-toggle">{this.props.context.translate('tracking-control.opt-out')}</label>
        </div>)}</div>
    }

    toggleTracking() {
        const newIsTracked = !this.props.prefs.allowTracking;
        axios.get(`https://micro.srnd.org/dnt?t=${newIsTracked ? '0' : '1'}`, {withCredentials: true})
            .then((response) => response.data.success && this.props.prefs.set({allowTracking: newIsTracked}));
    }
}
export default appContext(prefContext(TrackingControl));
