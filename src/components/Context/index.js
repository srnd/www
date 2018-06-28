import React from 'react'

import { Broadcast, Subscriber } from "react-broadcast"

export default (Component) => (props) => (
    <Subscriber channel="app">
        { context => <Component context={context} {...props} /> }
    </Subscriber>
)

export class ProvidesAppContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: null,
            changeRegion: (newRegion) => this.setState({ region: newRegion }),
        };
    }

    render() {
        return (
            <Broadcast channel="app" value={this.getContext()}><div>{this.props.children}</div></Broadcast>
        );
    }

    componentDidMount() {
        // TODO(@tylermenezes): Lazy-load program regions
        // TODO(@tylermenezes): Set default region by nearbyness.
    }

    getContext() {
        const propContext = {
            majorSponsors: this.remapEdges(this.props.majorSponsors.edges),
            minorSponsors: this.remapEdges(this.props.minorSponsors.edges),
            programs: this.remapEdges(this.props.programs.edges),
            regions: this.remapEdges(this.props.regions.edges),
            featuredAnnouncement: this.props.featuredAnnouncement,
            translate: this.props.translate,
            slug: this.props.slug,
        };
        return Object.assign(this.state, propContext);
    }

    remapEdges(edges) {
        return edges.map((edge) => edge.node);
    }
}

export const query = graphql`
    fragment AppContextItems on RootQueryType {
        majorSponsors: allContentfulGlobalSponsor(filter: {type: {eq: "major"}}, sort: {fields: [createdAt], order:ASC}) {
            edges { node { ...SponsorsFragmentItems } }
        }

        minorSponsors: allContentfulGlobalSponsor(filter: {type: {eq: "minor"}}, sort: { fields: [createdAt], order:ASC}) {
            edges { node { ...SponsorsFragmentItems } }
        }

        programs: allContentfulProgram(sort: {fields: [createdAt], order:ASC}) {
            edges { node { ...ProgramsFragmentItems } }
        }

        regions: allContentfulRegion {
            edges { node { ...ProgramMapFragmentItems }}
        }

        featuredAnnouncement: contentfulAnnouncement(featured: {eq:true}) {
            ...AnnouncementUiItems
        }
    }
`;
