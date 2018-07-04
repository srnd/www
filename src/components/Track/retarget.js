import React from 'react'

class Retarget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackingIds: {
                sponsors: {
                    fb: process.env.GATSBY_RETARGET_SPONSOR_FB,
                    twitter: process.env.GATSBY_RETARGET_SPONSOR_TWITTER,
                    google: process.env.GATSBY_RETARGET_SPONSOR_GOOGLE,
                },
                schools: {
                    fb: process.env.GATSBY_RETARGET_SCHOOL_FB,
                    twitter: process.env.GATSBY_RETARGET_SCHOOL_TWITTER,
                    google: process.env.GATSBY_RETARGET_SCHOOL_GOOGLE,
                },
                parents: {
                    fb: process.env.GATSBY_RETARGET_PARENT_FB,
                    twitter: process.env.GATSBY_RETARGET_PARENT_TWITTER,
                    google: process.env.GATSBY_RETARGET_PARENT_GOOGLE,
                },
                donors: {
                    fb: process.env.GATSBY_RETARGET_DONOR_FB,
                    twitter: process.env.GATSBY_RETARGET_DONOR_TWITTER,
                    google: process.env.GATSBY_RETARGET_DONOR_GOOGLE,
                },
            }
        }
    }

    render() {
        if (!this.props.type || !(this.props.type in this.state.trackingIds)) return null;
        const trackingIds = this.state.trackingIds[this.props.type];
        const links = [
            `https://www.facebook.com/tr?id=${trackingIds.fb}&ev=PageView&noscript=1`,
            `https://analytics.twitter.com/i/adsct?txn_id=${trackingIds.twitter}&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0"`,
            `https://t.co/i/adsct?txn_id=${trackingIds.twitter}&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0`,
            `https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1016033876/?label=${trackingIds.google}&guid=ON&script=0`
        ];

        return (
            <div className="retarget">
                {links.map((link) => <img src={link} key={link} width="1" height="1" style={{display: 'none'}} alt="" />)}
            </div>
        );
    }
}
export default Retarget;
