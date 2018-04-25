import React from 'react'
import axios from 'axios'
import Autocomplete from 'react-autocomplete'
import WithAppContext from '../../Context'
import DonationMatchInfo from './info.js'

export default WithAppContext(class DonationMatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeahead: '',
            company: null
        };
    }

    render() {
        return (
            <div class="donation-match">
                <p>{this.props.context.translate('fragment.donation-match.input')}</p>
                <DonationMatchPicker
                    onChange={(val) => this.setState({typeahead: val})}
                    onSelect={(val) => this.setState({company: val})}
                    value={this.state.typeahead}
                />
                {this.state.company ? (
                    <DonationMatchInfo typeahead={this.state.typeahead} company={this.state.company} />
                ) : null}
            </div>
        );
    }
})

class DonationMatchPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: []};
    }

    render() {
        return (
            <Autocomplete
            getItemValue={(item) => String(item.id)}
            items={this.state.items}
            renderItem={(item, isHighlighted) =>
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                    {item.name}
                </div>
            }
            value={this.props.value}
            onChange={(e) => {this.update(e.target.value); this.props.onChange(e.target.value)}}
            onSelect={this.props.onSelect}
            />
        );
    }

    update(text) {
        if (this.pastFetch) this.pastFetch.cancel();
        if (text.length < 2) {
            this.setState({items: []});
            return;
        }

        this.pastFetch = axios.CancelToken.source();

        axios.get(`${process.env.GATSBY_API_MATCH_INFO}?p=${text}`, {cancelToken: this.pastFetch.token})
            .then((response) => this.setState({items: response.data}));
    }
}
