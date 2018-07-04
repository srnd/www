import React from 'react'
import { FancyRadioGroup, FancyRadioOption } from '../../FancyRadio'

class Amounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customAmount: null
        };
    }
    render() {
        const {amounts, ...props} = this.props;
        return (
            <FancyRadioGroup {...props}>
                {amounts.map((amount) => (
                    <FancyRadioOption value={amount} key={`donation-amount-${amount}`}>
                        <DonateAmount value={amount} frequency={this.props.frequency} translate={this.props.translate} />
                    </FancyRadioOption>
                )).concat([(
                    <FancyRadioOption value={this.state.customAmount} key="donation-amount-custom">
                        <DonateAmount
                            custom={true} onChange={(val) => this.customAmountChanged(parseInt(val))}
                            value={this.state.customAmount} frequency={this.props.frequency} translate={this.props.translate} />
                    </FancyRadioOption>
                )])}
            </FancyRadioGroup>
        );
    }

    customAmountChanged(val) {
        this.setState({customAmount: val});
        this.props.onChange(val);
    }
}
export default Amounts;

class DonateAmount extends React.Component {
    render() {
        const {value, frequency, custom, onChange } = this.props;
        return (
            <div className="donate-amount">
                { custom ? (
                    <span className="amount-custom">$<input value={value || ''} onChange={(e) => onChange(e.target.value)} /></span>
                ) : (
                    <span className="amount-default">${value}</span>
                )}
                <p>{this.makeImpactTextString(value, frequency)}</p>
            </div>
        );
    }


    makeImpactTextString(amount, frequency) {
        const translate = this.props.translate;
        const impactText = JSON.parse(translate('layout.blocks.donation-form.amounts'));
        const annually = translate('layout.blocks.donation-form.amounts.annual');
        const plural = translate('layout.blocks.donation-form.amounts.plural');

        if (amount === null) return translate('layout.block.donation-form.amounts.custom');

        if (frequency === 'monthly') amount *= 12;

        var maxImpact = 0;
        for (let minDonation in impactText) {
            if (parseInt(minDonation) <= amount) maxImpact = parseInt(minDonation);
        }

        var num = Math.floor(amount/maxImpact);

        return impactText[maxImpact]
            .replace(':num', num)
            .replace(':plural', (num !== 1 ? plural : ''))
            .replace(':annual', (frequency === 'monthly' ? ' '+annually : ''));
    }
}
