import XReact from 'react'
import Cheerio from 'cheerio'
import { transform } from 'babel-standalone'

import SponsorsBlock from '../../Fragments/Sponsors'
import ProgramsBlock from '../../Fragments/Programs'
import DonationMatchBlock from '../../Fragments/DonationMatch'
import TrackingControlBlock from '../../Fragments/TrackingControl'

export default class HtmlBlock extends XReact.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const React = XReact;
        return (
            <div>
                {this.props.allowReact ? (
                    <div className="html">{this.renderHtml()}</div>
                ) : (
                    <div className="html" dangerouslySetInnerHTML={{__html: this.props.html.html}} />
                )}
            </div>
        );
    }

    renderHtml() {
        const React = XReact;
        const Sponsors = SponsorsBlock;
        const Programs = ProgramsBlock;
        const DonationMatch = DonationMatchBlock;
        const TrackingControl = TrackingControlBlock;
        return eval(transform('<div>'+this.props.html.html+'</div>', { presets: ['react'] }).code);
    }
}

export const query = graphql`
    fragment HtmlBlockItems on ContentfulLayoutBlockHtml {
        allowReact
        html {
            html
        }
    }
`;
