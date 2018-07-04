import React from 'react'
import axios from 'axios'
import WithAppContext from '../../Context'
import './index.sass'

export default WithAppContext(class DonationMatchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matching: null
        };
    }

    render() {
        if (!this.state.matching) return null;

        const m = this.state.matching;
        const tr = this.props.context.translate;

        return (
            <div className="donation-match-info">
                <h1>{m.name}</h1>
                <p>
                    {m.url ? <a href={m.url} rel="noopener noreferrer" target="_blank">{tr('fragment.donation-match.url')}</a> : (
                        m.contact ? <a href={`mailto:${m.contact.email}`}>{tr('fragment.donation-match.email')} {m.contact.name}</a> : null
                    )}
                </p>
                <div className="match">
                    <h2>{tr('fragment.donation-match.match')}</h2>
                    {m.match ? (
                        <div>
                            {m.match.process ? null :
                                <p>
                                    {m.name} {tr('fragment.donation-match.match-yes')} {m.match.ratio}
                                    {m.match.min && m.match.max ? `$${m.match.min.toLocaleString()}-$${m.match.max.toLocaleString()}` :
                                        (m.match.max ? ` ${tr('fragment.donation-match.up-to')} $${m.match.max.toLocaleString()}` : '.')}
                                </p>
                            }
                            <div className="more-info" dangerouslySetInnerHTML={{__html: m.match.process}} />
                        </div>
                    ) : (
                        <p>{m.name} {tr('fragment.donation-match.match-no')}</p>
                    )}
                </div>
                <div className="volunteer">
                    <h2>{tr('fragment.donation-match.volunteer')}</h2>
                    {m.volunteer ? (
                        <div>
                            {m.volunteer.process ? null : 
                                <p>{m.name} {tr('fragment.donation-match.volunteer-yes')} {m.volunteer.amount}</p>
                            }
                            <div className="more-info" dangerouslySetInnerHTML={{__html: m.volunteer.process}} />
                        </div>
                    ) : (
                        <p>{m.name} {tr('fragment.donation-match.volunteer-no')}</p>
                    )}
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (!prevProps || !prevProps.company || this.props.company !== prevProps.company) this.componentDidMount();
    }

    componentDidMount() {
        axios.get(`${process.env.GATSBY_API_MATCH_INFO}?p=${this.props.typeahead}&c=${this.props.company}`)
            .then((response) => this.setState({matching: response.data}));
    }
})
