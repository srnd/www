import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import he from 'he'
import Img from "gatsby-image"

import BaseTemplate from './base.js'
import PageHeader from '../components/Header';

import './news.sass'

class NewsTemplate extends React.Component {
    render() {
        const data = this.props.data;
        const post = data.wordpressPost;
        const slug = this.props.pageContext.slug;

        return (
            <BaseTemplate slug={slug} audience='press' pageClass='release' data={data} locale={this.props.pageContext.lang}>
                <Helmet title={post.title}>
                    <meta property="og:title" content={ post.title } />
                    <meta name="twitter:title" content={ post.title } />
                    <meta name="description" content={ post.excerpt } />
                    <meta property="og:description" content={ post.excerpt } />
                    <meta name="twitter:description" content={ post.excerpt } />
                    {post.featured_media ? [
                        <meta property="og:image" content={ post.featured_media.localFile.childImageSharp.fluid.src } />,
                        <meta name="twitter:image" content={ post.featured_media.localFile.childImageSharp.fluid.src } />
                    ]:null}
                    <meta name="twitter:type" content="summary" />
                    <meta name="twitter:site" content="@studentrnd" />
                    <meta name="twitter:creator" content="@studentrnd" />
                </Helmet>
                <PageHeader title={he.decode(post.title)} subtext={post.excerpt.replace(/<(?:.|\n)*?>/gm, '')} />
                <div class="content">
                    <div class="inner">
                        <section class="primary">
                            <div class="location">Seattle, Wash. &mdash; {post.date}</div>
                            <div class="story" dangerouslySetInnerHTML={{__html: post.content}} />
                            <div class="about">
                                <h3>About SRND</h3>
                                <p>
                                    Since 2009, SRND has developed and grown worldwide initiatives to motivate students to
                                    pursue Computer Science. Its largest program, CodeDay, has reached more than 35,000
                                    students. SRND, a non-profit, is headquartered in Seattle, Wash. and runs programs in 50
                                    cities across the US and Canada.
                                </p>
                            </div>
                        </section>
                        <section class="details">
                            <h3>Contact</h3>
                            <div class="name">Tyler Menezes</div>
                            <div class="phone">(888) 607-7763 x 2</div>
                            <div class="email"><a href="mailto:tylermenezes@srnd.org">tylermenezes@srnd.org</a></div>

                            {post.featured_media ? [
                                <h3>Assets</h3>,
                                <div class="image">
                                    <a href={post.featured_media.localFile.publicURL} target="_blank" rel="noopener noreferrer">
                                        <Img fluid={post.featured_media.localFile.childImageSharp.fluid} />
                                    </a>
                                    <div dangerouslySetInnerHTML={{__html:post.featured_media.caption}} />
                                </div>
                            ] : null}
                        </section>
                    </div>
                </div>
            </BaseTemplate>
        );
    }
}

export default NewsTemplate;

/*eslint graphql/template-strings:0*/
export const pageQuery = graphql`
    query NewsroomPage($lang: String!, $id: String!) {
        wordpressPost (id: {eq: $id}) {
            slug
            title
            content
            excerpt
            date(formatString: "MMMM DD, YYYY")
            featured_media {
                caption
                localFile {
                    publicURL
                    childImageSharp {
                        fluid(maxWidth: 500) {
                            src
                            ...GatsbyImageSharpFluid_withWebp_noBase64
                            ...GatsbyImageSharpFluid_tracedSVG
                        }
                    }
                }
            }
        }
        ...BaseTemplateItems
    }
`;
