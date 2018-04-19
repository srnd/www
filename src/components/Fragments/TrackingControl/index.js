import React from 'react'
import jsonp from 'jsonp'
import appContext from '../../Context'

class TrackingControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTracked: null
        };
    }

    componentDidMount() {
        jsonp(`${process.env.GATSBY_MATOMO_URL}/index.php?module=API&method=AjaxOptOut.isTracked&format=JSON&jsonp=callback`, null, (err, data) => {
            if (err) return;
            this.setState({isTracked: data.value});
        });
    }

    render() {
        return <div className="tracking-control">{this.state.isTracked === null ? null : (<div>
            <input type="checkbox" id="tracking-control-toggle" checked={!this.state.isTracked} onChange={() => this.toggleTracking()} />
            <label htmlFor="tracking-control-toggle">{this.props.context.translate('tracking-control.opt-out')}</label>
        </div>)}</div>
    }

    toggleTracking() {
        const isTracked = !this.state.isTracked;
        this.setState({isTracked});
        jsonp(`${process.env.GATSBY_MATOMO_URL}/index.php?module=API&method=AjaxOptOut.${isTracked ? 'doTrack' : 'doIgnore'}&format=JSON&jsonp=callback`, null, (err, data) => {
            if (err) this.setState({isTracked: !isTracked});
        });
    }
}
export default appContext(TrackingControl);
