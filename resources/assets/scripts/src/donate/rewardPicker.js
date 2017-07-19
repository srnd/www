import React from 'react'
import { FancyRadio, FancyRadioOption } from '../ui/fancyRadio'

export default class DonationRewardPicker extends React.Component {
    render() {
        return <FancyRadio name={this.props.name} onUpdate={this.props.onUpdate}>
            <FancyRadioOption value="none" selected>
                <div className="no-gift">{window.i18n.DonationNoGift}</div>
            </FancyRadioOption>
            {Object.entries(this.props.rewards).map((info) => ((id, reward) =>
                <FancyRadioOption value={id} key={id}
                    disabled={
                        (this.props.donationFrequency == "monthly" && this.props.donationAmount < reward.recur) ||
                        (this.props.donationFrequency != "monthly" && this.props.donationAmount < reward.today)
                    }>
                    <div className="gift">
                        <a href={reward.limage} target="_blank" className="image">
                            <div style={{backgroundImage: 'url("'+reward.image+'")'}}></div>
                        </a>
                        <div className="info">
                            <span className="title">{reward.name}</span>
                            <span className="description">
                                {reward.description} (min ${this.props.donationFrequency == "monthly" ? reward.recur : reward.today})
                            </span>
                            {reward.options ? (
                                <select name={this.props.name+'-'+id+'-option'}>
                                    {reward.options.map(x => <option key={x}>{x}</option>)}
                                </select>
                            ) : null}
                        </div>
                    </div>
                </FancyRadioOption>
            )(info[0], info[1]))}
        </FancyRadio>;
    }
}

