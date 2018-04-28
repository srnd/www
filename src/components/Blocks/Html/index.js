import React from 'react'
import reactReplace from 'react-string-replace'

import Sponsors from '../../Fragments/Sponsors'
import Programs from '../../Fragments/Programs'
import DonationMatch from '../../Fragments/DonationMatch'
import TrackingControl from '../../Fragments/TrackingControl'

export default class HtmlBlock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="html">{this.renderHtml()}</div>
            </div>
        );
    }

    renderHtml() {
        const replace = {
            '<Sponsors type="small" />': <Sponsors type="small" />,
            '<Programs />': <Programs />,
            '<TrackingControl />': <TrackingControl />,
            '<DonationMatch />': <DonationMatch />,
        };

        var result = this.props.html.html;
        Object.keys(replace).map((k) => { result = reactReplace(result, k, () => replace[k]); });
        return result.map((x) => typeof(x) === 'string' ? <span dangerouslySetInnerHTML={{__html: x}} /> : x);
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
