import React from 'react'
import ReactDom from 'react-dom'
import DonationAmountPicker from './donate/amountPicker.js'
import DonationRewardPicker from './donate/rewardPicker.js'
import ContactForm from './donate/contactForm.js'
import { DonatePageDispatcher, DonatePageStore } from './donate/state.js'
import { FancyRadio, FancyRadioOption } from './ui/fancyRadio'
import { RadioGroup, Radio } from './ui/radio'
import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';



class DonatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = DonatePageStore.state;
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.stateSubscription = DonatePageStore.onChange.addListener('change', () => {
            this.state = DonatePageStore.state;
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.stateSubscription.remove();
    }

    render() {
        var stripeStyle = {style: {
                base: {
                    color: '#484848',
                    lineHeight: '24px',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '14.667px',
                    ':placeholder': {
                        color: '#bdbdbd'
                    }
                },
                invalid: {
                    color: '#ff686b',
                    iconColor: '#ff686b'
                }
        }};

        return <form className="donation" method="post" onSubmit={this.onSubmit}>
                <section className="amount">
                    <h3>{window.i18n.DonationAmountTitle}</h3>
                    <RadioGroup
                        className="frequency"
                        name="frequency" default={this.state.frequency}
                        onUpdate={f => DonatePageDispatcher.dispatch({action: "frequency-changed", frequency: f})}>
                        <Radio value="onetime">{window.i18n.DonationFrequencyOnetime}</Radio>
                        <Radio value="monthly">{window.i18n.DonationFrequencyMonthly}</Radio>
                    </RadioGroup>
                    <DonationAmountPicker
                        name="amount"
                        amounts={this.state.prefilledAmounts}
                        defaultAmount={this.state.amount}
                        donationFrequency={this.state.frequency}
                        onUpdate={a => DonatePageDispatcher.dispatch({action: "amount-changed", amount: a})} />
                    <p className="member-info">
                        <strong>{window.i18n['DonationFrequencyMember'+(this.state.frequency == 'onetime' ? 'No' : 'Yes')]} </strong>
                        {window.i18n.DonationFrequencyMember}
                    </p>
                </section>

                <section className="reward">
                    <h3>{window.i18n.DonationGiftTitle}</h3>
                    <DonationRewardPicker
                        name="reward"
                        rewards={window.gifts}
                        onUpdate={r => DonatePageDispatcher.dispatch({action: "reward-changed", reward: r})}
                        donationFrequency={this.state.frequency}
                        donationAmount={this.state.amount} />
                </section>

                <section className="contact">
                    <h3>{window.i18n.DonationPaymentTitle}</h3>
                        <CardElement style={stripeStyle} />
                    <ContactForm
                        collectAddress={this.state.reward !== "none" || this.state.frequency !== "onetime"}
                        onUpdate={c => DonatePageDispatcher.dispatch({action: "contact-changed", contact: c})} />
                </section>

                <input type="hidden" name="stripe_token" />
                <section className="submit">
                    { this.isValid ? (
                        <input  type="submit"
                                value={window.i18n.DonationSubmit[this.state.frequency]
                                            .replace(':amount', this.state.amount)}
                        />
                    ) : (
                        <input type="submit" disabled value={window.i18n.DonationSubmitDisabled} />
                    )}
                </section>
            </form>;
    }

    onSubmit(evt) {
        evt.preventDefault();
        console.log(evt.target);
        if (this.isValid) {
            this.props.stripe.createToken({name: this.state.contact.first_name+' '+this.state.contact.last_name})
            .then((result) => {
                // Hack, but React's state management is async and won't get the data added in time to submit
                // (in the future this should be moved to AJAX I guess
                if (result.token) {
                    document.querySelector('[name="stripe_token"]').value = result.token.id;
                    document.querySelector('form.donation').submit(); // evt.target is sometimes null?
                } else {
                    alert(result.error.message);
                }
            });
        }
    }

    get isValid() {
        return true
            && this.state.amount > 0
            && this.state.frequency
            && this.state.reward
            && (this.state.contact.first_name && this.state.contact.last_name)
            && this.state.contact.email && this.validateEmail(this.state.contact.email)
            && ((this.state.reward == "none" && this.state.frequency == "onetime")
                    || (true
                        && this.state.contact.address_1
                        && this.state.contact.city
                        && this.state.contact.state && this.state.contact.state.length >= 2
                        && this.state.contact.zip && this.state.contact.zip.length >= 5
                    )
                );
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}


export default function render() {
    ReactDom.render(
        <StripeProvider apiKey={window.stripePublic}>
            <Elements>
                {React.createElement(injectStripe(DonatePage))}
            </Elements>
        </StripeProvider>,
        document.querySelector('#donateWidget')
    )
}
