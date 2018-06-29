import React from 'react'
import appContext from '../../Context'
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import { withPrefix } from 'gatsby-link'
import axios from 'axios'
import ReactTooltip from 'react-tooltip'
import withIpInfo from '../../Track/ipInfo'

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
            axios.get(withPrefix('/ca-us-mx.json')).then(
                (r) => this.setState({topo: feature(r.data, r.data.objects.collection).features})
            );
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.renderTarget = null;
    }

    render() {
        if (!this.state.topo) return null;

        const sizeDivisor = 100;

        return (
            <div className="program-map" ref={(el) => {
                this.renderTarget = el;
                if (!(this.state.width && this.state.height)) { this.updateDimensions() } 
            }}>
                {!(this.state.width && this.state.height) ? null : (
                    <svg width={this.state.width} height={this.state.height} viewBox={`0 0 ${this.state.width} ${this.state.height}`}>
                        <defs>
                            <clipPath id="clip-land">
                                <path
                                    d={
                                        this.state.topo.map((d,i) => (
                                            geoPath().projection(this.projection())(d)
                                        )).join('')} />
                            </clipPath>
                        </defs>
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
                        <g className="footprint-extended">
                                {
                                    this.props.context.regions.map((region, i) => {
                                        if (!region.location) return null;
                                        const latLon = [region.location.lon, region.location.lat];
                                        const mapLatLon = this.projection()(latLon);
                                        return <circle
                                            key={ `footprint-extended-${i}` }
                                            cx={ mapLatLon[0] }
                                            cy={ mapLatLon[1] }
                                            r={ (this.state.width/sizeDivisor)*6 }
                                            clipPath="url(#clip-land)"
                                            className="footprint-extended"
                                            onClick={ () => null }
                                        />
                                    })
                                }
                        </g>
                        <g className="footprint">
                                {
                                    this.props.context.regions.map((region, i) => {
                                        if (!region.location) return null;
                                        const latLon = [region.location.lon, region.location.lat];
                                        const mapLatLon = this.projection()(latLon);
                                        return <circle
                                            key={ `footprint-${i}` }
                                            cx={ mapLatLon[0] }
                                            cy={ mapLatLon[1] }
                                            r={ (this.state.width/sizeDivisor)*4 }
                                            clipPath="url(#clip-land)"
                                            className="footprint"
                                            onClick={ () => null }
                                        />
                                    })
                                }
                        </g>
                        <g className="region">
                                {
                                    this.props.context.regions.map((region, i) => {
                                        if (!region.location) return null;
                                        const latLon = [region.location.lon, region.location.lat];
                                        const mapLatLon = this.projection()(latLon);
                                        return <circle
                                            key={ `region-${i}` }
                                            cx={ mapLatLon[0] }
                                            cy={ mapLatLon[1] }
                                            r={ (this.state.width/sizeDivisor)*2 }
                                            clipPath="url(#clip-land)"
                                            className="region"
                                            onClick={ () => null }
                                        />
                                    })
                                }
                        </g>
                        <g className="marker">
                                {
                                    this.props.context.regions.map((region, i) => {
                                        if (!region.location) return null;
                                        const latLon = [region.location.lon, region.location.lat];
                                        const mapLatLon = this.projection()(latLon);
                                        return <circle
                                            data-tip={region.name}
                                            key={ `marker-${i}` }
                                            cx={ mapLatLon[0] }
                                            cy={ mapLatLon[1] }
                                            r={ this.state.width/sizeDivisor }
                                            className="marker"
                                            onClick={ () => null }
                                        />
                                    })
                                }
                        </g>
                        <g className="user">
                            <circle
                                className="user"
                                cx={this.projection()([this.props.ipInfo.lon, this.props.ipInfo.lat])[0]}
                                cy={this.projection()([this.props.ipInfo.lon, this.props.ipInfo.lat])[1]}
                                r={ this.state.width/sizeDivisor }
                                onClick={ () => null }
                            />
                        </g>
                    </svg>
                )}
            </div>
        );
    }

    projection() {
        return geoMercator()
            .scale(0.65 * this.state.width)
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

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    updateDimensions() {
        if (this.renderTarget !== null) {
            const width = this.renderTarget.clientWidth;
            const height = width * 0.5;
            this.setState({width: width, height: height});
        }
    }
}
export default appContext(withIpInfo(ProgramMap));

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
