import React from 'react'
import Link from 'gatsby-link'
import MuxPlayer from '../MuxPlayer'
import url from 'url'

class SmartLink extends React.Component {
    render() {
        const parsed = url.parse(this.props.to);
        const protocol = parsed.protocol;

        const { to, ...other } = this.props;

        if (!protocol) {
            return <Link {...this.props}>{this.props.children}</Link>
        } else if (protocol == 'mux:') {
            return <MuxPlayer autoPlay={true} muxId={to.substr(6)} {...other}>{this.props.children}</MuxPlayer>
        } else {
            return <a href={to} {...other} target="_blank">{this.props.children}</a>
        }
    }
}

export default SmartLink;
