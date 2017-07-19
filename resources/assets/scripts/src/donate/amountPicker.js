import React from 'react'
import { FancyRadio, FancyRadioOption } from '../ui/fancyRadio'

export default class DonationAmountPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'selected': props.defaultAmount, 'customAmount': null}

        this.updateCustom = this.updateCustom.bind(this);
    }

    updateCustom(e, amount) {
        this.setState({'customAmount': amount});
    }

    render() {
        return <FancyRadio name={this.props.name} onUpdate={this.props.onUpdate}>
            {this.props.amounts.map((function(i) {
                return <FancyRadioOption value={i} key={i} id={"option"+i} selected={(i == this.state.selected)}>
                    <DonationAmount amount={i} frequency={this.props.donationFrequency} />
                </FancyRadioOption>
            }).bind(this))}

            <FancyRadioOption value={this.state.customAmount} key="optionCustom" id="optionCustom">
                <DonationAmount onChange={this.updateCustom} />
            </FancyRadioOption>
        </FancyRadio>;
    }
}

class DonationAmount extends React.Component {
    static makeImpactTextString(amount, frequency) {
        const impactText = window.i18n.DonationImpactText;

        if (amount == null) return window.i18n.DonationCustom;

        if (frequency == 'monthly') amount *= 12;

        var maxImpact = 0;
        for (let minDonation in impactText) {
            if (minDonation <= amount) maxImpact = minDonation;
        }

        var num = Math.floor(amount/maxImpact);
        var plural = (num != 1 ? 's' : '');

        return impactText[maxImpact]
            .replace(':num', num)
            .replace(':plural', plural)
            .replace(':annual', ' '+window.i18n.DonationImpactAnnually);
    }

    constructor(props) {
        super(props);
        this.state = {
            'amount': this.props.amount
        };
        this.previousAmount = "";

        this.updateAmount = this.updateAmount.bind(this);
    }

    updateAmount(e) {
        var amount = Math.floor(Number(e.target.value));
        amount = amount > 0 ? amount : null;

        if (e.target.value !== String(amount) && e.target.value !== "") {
            amount = this.previousAmount;
            e.target.value = this.previousAmount;
        }

        this.setState({'amount': amount});
        this.props.onChange(e, amount);
        this.previousAmount = amount;
    }

    render() {
        return <div className="donate-amount">
            {this.props.amount != null ? (
                <span className="amount-default">${this.props.amount}</span>
            ) : (
                <span className="amount-custom">$<input
                    type="amount"
                    onChange={this.updateAmount} onBlur={this.props.onCustomBlur}
                    /></span>
            )}

            <p>{DonationAmount.makeImpactTextString(this.state.amount, this.props.frequency)}</p>
        </div>;
    }
}
