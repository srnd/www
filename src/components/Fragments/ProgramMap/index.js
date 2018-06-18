import React from 'react'
import appContext from '../../Context'
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import { withPrefix } from 'gatsby-link'
import axios from 'axios'

import './index.sass'

class ProgramMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            height: null,
            topo: null
        }

        if (typeof(window) !== 'undefined') {
            axios.get(withPrefix('/us-ca.json')).then(
                (r) => this.setState({topo: feature(r.data, r.data.objects.collection).features})
            );
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.renderTarget = null;
    }

    render() {
        if (!this.state.topo) return null;

        return (
            <div className="program-map" ref={(el) => {
                this.renderTarget = el;
                if (!(this.state.width && this.state.height)) { this.updateDimensions() } 
            }}>
                {!(this.state.width && this.state.height) ? null : (
                    <svg width={this.state.width} height={this.state.height} viewBox={`0 0 ${this.state.width} ${this.state.height}`}>
                            <g className="outlines">
                            {
                                this.state.topo.map((d,i) => (
                                <path
                                    key={ `path-${ i }` }
                                    d={ geoPath().projection(this.projection())(d) }
                                    className="political-boundry"
                                />
                                ))
                            }
                        </g>
                        <g className="markers">
                                {
                                    this.props.context.regions.map((region, i) => {
                                        if (!region.location) return null;
                                        const latLon = [region.location.lon, region.location.lat];
                                        const mapLatLon = this.projection()(latLon);
                                        return <circle
                                            key={ `marker-${i}` }
                                            cx={ mapLatLon[0] }
                                            cy={ mapLatLon[1] }
                                            r={ this.state.width/85 }
                                            className="region"
                                            onClick={ () => null }
                                        />
                                    })
                                }
                        </g>
                    </svg>
                )}
            </div>
        );
    }

    projection() {
        return geoMercator()
            .scale(440 * (this.state.width/630))
            .center([-93, 40])
            .translate([this.state.width/2, this.state.height/2]);
    }

    componentDidMount() {
        if (typeof(window) === 'undefined') return;
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        if (typeof(window) === 'undefined') return;
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        if (this.renderTarget !== null) {
            const width = this.renderTarget.clientWidth;
            const height = width * 0.5;
            this.setState({width: width, height: height});
        }
    }
}
export default appContext(ProgramMap);

export const query = graphql`
    fragment ProgramMapFragmentItems on ContentfulRegion {
        name
        id
        webname
        location {
            lat
            lon
        }
    }
`;
