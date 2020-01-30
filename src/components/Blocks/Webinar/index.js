import React from 'react'
import { graphql } from 'gatsby'
import axios from 'axios'
import moment from 'moment-timezone'
import appContext from '../../Context'
import { Pii } from '../../Ui/Secure'
import Loading from '../../Ui/Loading'
import WithIpInfo from '../../Track/ipInfo'

import "./index.sass"

class Webinar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submitted: false, submitting: false, email: null};
    }
    render() {
        return (
            <div className="webinar">
                <h3>{this.props.name}</h3>
                <h4>
                    {moment.utc(this.props.startsAt).tz(moment.tz.guess()).format('dddd, MMMM Do YYYY, h:mm a z')}
                    &nbsp;&mdash;&nbsp;
                    {moment.utc(this.props.endsAt).tz(moment.tz.guess()).format('h:mm a z')}
                </h4>
                {this.state.submitted
                        ? <p className="submitted">{this.props.context.translate('layout.blocks.webinar.submitted')}</p>
                        : (this.state.submitting ? <Loading /> : (<fieldset>
                            <input
                                type="email"
                                value={this.state.email}
                                placeholder={this.props.context.translate('field.email')}
                                onChange={(e) => this.setState({email: e.target.value})}
                            />
                            <input
                                type="submit"
                                value={this.props.context.translate('layout.blocks.webinar.submit')}
                                disabled={!this.isEmail(this.state.email)}
                                onClick={(e) => this.isEmail(this.state.email) && this.onSubmit()}
                            />
                        </fieldset>))
                }
                <Pii />
            </div>
        );
    }

    isEmail(email) {
        // eslint-disable-next-line
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSubmit() {
        this.setState({submitting: true});
        axios
            .get('https://hooks.zapier.com/hooks/catch/2757438/odooepb/', {
              params: {
                email: this.state.email,
                visitor: this.props.ipInfo,
                name: this.props.name,
                location: this.props.location,
                startsAt: moment.utc(this.props.startsAt).format('dddd, MMMM Do YYYY, h:mm a ')+'UTC',
                endsAt: moment.utc(this.props.endsAt).format('dddd, MMMM Do YYYY, h:mm a ')+'UTC',
              }
            })
            .then((response) => this.setState({submitted: true}))
            .catch((error) => {alert(error); this.setState({submitting: false});});
    }
}
export default appContext(WithIpInfo(Webinar));

export const query = graphql`
    fragment WebinarBlockItems on ContentfulLayoutBlockWebinar {
      name
      location
      startsAt
      endsAt
    }
`;
