import React from 'react'
import { graphql } from 'gatsby'
import { FancyRadioGroup, FancyRadioOption } from '../../FancyRadio'
import { DonationFrequencies } from './index.js'

class Gifts extends React.Component {
    render() {
        const { gifts, ...props } = this.props;
        return (
            <FancyRadioGroup {...props}>
                {[(
                    <FancyRadioOption key="reward-none" value={null}>
                        <div className="no-gift">No thanks, I don't want a gift.</div>
                    </FancyRadioOption>
                )].concat(gifts.map((gift) => this.renderGift(gift)))}
            </FancyRadioGroup>
        );
    }

    renderGift(gift) {
        return (
            <FancyRadioOption key={gift.id} value={gift.title} disabled={this.props.amount < this.getMinAmount(gift)}>
                <div className="gift">
                    <a href={gift.photo.file.url} target="_blank" rel="noopener noreferrer" className="image">
                        <div style={{backgroundImage: `url('${gift.photo.resize.src}'`}}></div>
                    </a>
                    <div className="info">
                        <span className="title">{gift.title}</span>
                        <span className="description">{gift.description} (min ${this.getMinAmount(gift)})</span>
                    </div>
                </div>
            </FancyRadioOption>
        );
    }

    componentDidUpdate() {
        const selectedGift = this.getSelectedGift(this.props.selectedValue);
        if (selectedGift && this.props.amount < this.getMinAmount(selectedGift)) {
            this.props.onChange(null);
        }
    }

    getSelectedGift(val) {
        return this.props.gifts.filter((gift) => gift.title === val)[0];
    }

    getMinAmount(gift) {
        return this.props.frequency === DonationFrequencies.OneTime ? gift.minimumOneTime : gift.minimumRecurring;
    }
}
export default Gifts;

export const query = graphql`
    fragment GiftItems on ContentfulDonationReward {
            id
            title
            description
            minimumOneTime
            minimumRecurring
            options
            photo {
                file {
                    url
                }
                resize(width: 256) {
                    src
                }
            }
    }
`;
