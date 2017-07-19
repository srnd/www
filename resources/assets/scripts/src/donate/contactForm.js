import React from 'react'
import { FancyRadio, FancyRadioOption } from '../ui/fancyRadio'

export default class ContactForm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.basicFields = ['first_name', 'last_name', 'email'];
        this.addressFields = ['address_1', 'city', 'state', 'zip'];

        this.state = Object.assign({}, this.invert(this.basicFields), this.invert(this.addressFields));
    }

    render() {
        return <div>
            <section className="basic">
                {this.basicFields.map(x => this.generateField(x))}
            </section>
            {this.props.collectAddress ? (
                <section className="address">
                    {this.addressFields.map(x => this.generateField(x))}
                </section>
            ):null}
        </div>;
    }

    invert(arr) {
        var newArr = {};
        for (var i of arr) newArr[i] = '';
        return newArr;
    }

    generateField(key) {
        return <input type="text" name={key} key={key}
                placeholder={window.i18n.Contact[key]}
                value={this.state[key]}
                onChange={this.generateOnUpdate(key)} />;
    }

    onUpdate(key, val) {
        this.setState({[key]: val});
        this.state[key] = val;
        this.props.onUpdate && this.props.onUpdate(this.state);
    }

    generateOnUpdate(key) {
        return evt => this.onUpdate(key, evt.target.value);
    }
}
