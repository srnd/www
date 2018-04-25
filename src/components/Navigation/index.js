import React from 'react'
import SmartLink from '../Ui/SmartLink'

import "./header.sass";
import "./footer.sass";

const linksToList = (links) => {
    return links.map((item, i) => (
        <li key={item.url}>
            <SmartLink to={item.url}>{item.title}</SmartLink>
        </li>
    ));
};

export const Header = (props) => (
    <header className="navigation">
        <h1><SmartLink to="/">srnd.org</SmartLink></h1>
        <nav>
            <ul>
                {props.nav ? linksToList(props.nav.links) : ''}
            </ul>
        </nav>
    </header>
);

export const Footer = (props) => (
    <footer className="navigation">
        <div className="info">
            <span>&copy; 2007-{(new Date().getFullYear())} srnd.org, 501(c)(3). EIN: </span>
            <input readOnly={true} className="ein" value="26-4742589" onClick={(e) => {e.target.setSelectionRange(0, e.target.value.length)}} />
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
