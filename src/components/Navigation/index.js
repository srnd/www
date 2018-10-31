import React from 'react'
import { graphql } from 'gatsby'
import SmartLink from '../Ui/SmartLink'
import { Featured } from '../Ui/Announcements'
import DropdownMenu from 'react-dd-menu';

import "./header.sass";
import "./footer.sass";

const linksToList = (links, active) => {
    return links.map((item, i) => (
        <li key={item.url}>
            <SmartLink to={item.url} className={active && item.url === active ? 'active' : ''}>{item.title}</SmartLink>
        </li>
    ));
};

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isMenuOpen: false }
    }
    render() {
        const { nav, active } = this.props;
        // eslint-disable-next-line
        const btn = <a href="#" onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}>&#9776;</a>;
        return (<div>
            <Featured />
            <header className="navigation">
                <h1><SmartLink to="/">srnd.org</SmartLink></h1>
                <nav>
                    <div className="mobile-nav">
                        <DropdownMenu
                            close={() => this.setState({ isMenuOpen: false })}
                            toggle={btn}
                            align="right"
                            isOpen={this.state.isMenuOpen}
                        >
                            {linksToList(nav.links, active)}
                        </DropdownMenu>
                    </div>
                    <div className="desktop-nav">
                        <ul>
                            {linksToList(nav.links, active)}
                        </ul>
                    </div>
                </nav>
            </header>
        </div>)
    }
}

export const Footer = (props) => (
    <footer className="navigation">
        <div className="info">
            <span>&copy; 2007-{(new Date().getFullYear())} SRND, a non-profit. </span>
            <label htmlFor="ein">EIN: </label>
            <input readOnly={true} className="ein" id="ein" value="26-4742589" onClick={(e) => {e.target.setSelectionRange(0, e.target.value.length)}} />
        </div>
        <div className="legal">
            <ul>
                {props.legal ? linksToList(props.legal.links) : ''}
            </ul>
        </div>
        <div className="links">
            <ul>
                {props.nav ? linksToList(props.nav.links) : ''}
            </ul>
        </div>
    </footer>
);

export const query = graphql`
    fragment NavigationItems on ContentfulNavigation {
        links {
            ... on ContentfulLayout {
                title
                url: slug
            }
            ... on ContentfulExternalLink {
                title
                url
            }
        }
    }
`;
