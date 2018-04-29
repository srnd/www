import React from 'react'
import Hls from 'hls.js/dist/hls.light.js'
import 'react-responsive-modal/lib/react-responsive-modal.css'
import Modal from 'react-responsive-modal/lib/css'
import WithTracking from '../../Track'

import './index.sass'

class MuxPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modalOpen: false};
    }

    render() {
        const { muxId, children, ...rest } = this.props;
        return <div>
            <Modal open={this.state.modalOpen} onClose={() => this.setState({modalOpen: false})} >
                <video
                    ref={(el) => this.player = el}
                    poster={`https://image.mux.com/${muxId}/thumbnail.jpg?time=0&width=800&height=450`}
                    controls={true}
                    preload="auto"
                    autoPlay={this.props.autoPlay || false}
                    width="100%"
                    height="100%">
                </video>
            </Modal>
            <a href="#" {...rest} onClick={() => {
                this.setState({modalOpen: true});
                this.props.track.event('video', 'play', this.props.muxId);
                return false;
            }}>{this.props.children}</a>
        </div>;
    }

    componentDidUpdate() {
        const playlist = `https://stream.mux.com/${this.props.muxId}.m3u8`;
        if(Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(playlist);
            hls.attachMedia(this.player);
            window.x = this.player;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = playlist;
        }
    }
}
export default WithTracking(MuxPlayer);
