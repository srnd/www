import React from 'react'
import axios from 'axios'

import { Broadcast, Subscriber } from "react-broadcast"

export default (Component) => (props) => (
    <Subscriber channel="preferences">
        { context => <Component prefs={context} {...props} /> }
    </Subscriber>
)

export const ProvidesPrefContext = (Component) => (props) => (
    <InnerProvidesPrefContext>
        <Component {...props} />
    </InnerProvidesPrefContext>
);

class InnerProvidesPrefContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allowTracking: null,
        };
    }

    render() {
        return (
            <Broadcast channel="preferences" value={this.getContext()}><div>{this.props.children}</div></Broadcast>
        );
    }

    componentDidMount() {
        this.updateTrackingState();
    }

    getContext() {
        const propContext = {
            set: (n) => this.setState(n)
        };
        return Object.assign(this.state, propContext);
    }

    updateTrackingState() {
        if (typeof(window) !== 'undefined') {
            axios.get('https://micro.srnd.org/dnt', {withCredentials: true})
                .then((response) => this.setState({allowTracking: response.data.track}));
        }
    }
}
