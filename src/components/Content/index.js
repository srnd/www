import React from 'react'

import "./index.sass"

import HtmlBlock from '../Blocks/Html'
import MarkdownBlock from '../Blocks/Markdown'
import QuoteBlock from '../Blocks/Quote'
import PhotoGalleryBlock from '../Blocks/PhotoGallery'
import HeadingBlock from '../Blocks/Heading'
import SponsorshipsBlock from '../Blocks/Sponsorships'
import FormBlock from '../Blocks/Form'
import DonationFormBlock from '../Blocks/DonationForm'
import CtaBlock from '../Blocks/Cta'

export const ContentTagTypes = {
    ContentfulLayoutBlockHtml: HtmlBlock,
    ContentfulLayoutBlockPhotoGallery: PhotoGalleryBlock,
    ContentfulLayoutBlockQuote: QuoteBlock,
    ContentfulLayoutBlockMarkdown: MarkdownBlock,
    ContentfulLayoutBlockHeading: HeadingBlock,
    ContentfulLayoutBlockSponsorships: SponsorshipsBlock,
    ContentfulLayoutBlockForm: FormBlock,
    ContentfulLayoutBlockDonationForm: DonationFormBlock,
    ContentfulLayoutBlockCta: CtaBlock,
};

export const mapItems = (items, props) => (
    items.map((block) => ContentTagTypes[block.__typename]
        ? React.createElement(ContentTagTypes[block.__typename], Object.assign({translate: props.translate}, block))
        : '')
);


export default ({ content, rightContent, rightColumns, ...props}) => (
    <div className={`wrapper ${rightContent ? 'multicol' : ''}`}>
        <div className="content" data-grid-column={(12-(rightColumns || 0))}>
            { content ? mapItems(content, props) : ''}
        </div>
        {rightContent ? (
            <div className="right-content" data-grid-column={rightColumns}>
                { rightContent ? mapItems(rightContent, props) : ''}
            </div>
        ) : ''}
    </div>
)

export const query = graphql`
    fragment ContentItems on ContentfulLayout {
        rightColumns
        content {
            __typename
            ... on ContentfulLayoutBlockHtml {
                key: id
                ...HtmlBlockItems
            }
            ... on ContentfulLayoutBlockMarkdown {
                key: id
                ...MarkdownBlockItems
            }
            ... on ContentfulLayoutBlockPhotoGallery {
                key: id
                ...PhotoGalleryBlockItems
            }
            ... on ContentfulLayoutBlockQuote {
                key: id
                ...QuoteBlockItems
            }
            ... on ContentfulLayoutBlockHeading {
                key: id
                ...HeadingBlockItems
            }
            ... on ContentfulLayoutBlockSponsorships {
                key: id
                ...SponsorshipsBlockItems
            }
            ... on ContentfulLayoutBlockForm {
                key: id
                ...FormBlockItems
            }
            ... on ContentfulLayoutBlockDonationForm {
                key: id
                ...DonationFormBlockItems
            }
            ... on ContentfulLayoutBlockCta {
                key: id
                ...CtaBlockItems
            }
        }

        rightContent {
            __typename
            ... on ContentfulLayoutBlockHtml {
                key: id
                ...HtmlBlockItems
            }
            ... on ContentfulLayoutBlockMarkdown {
                key: id
                ...MarkdownBlockItems
            }
            ... on ContentfulLayoutBlockPhotoGallery {
                key: id
                ...PhotoGalleryBlockItems
            }
            ... on ContentfulLayoutBlockQuote {
                key: id
                ...QuoteBlockItems
            }
            ... on ContentfulLayoutBlockHeading {
                key: id
                ...HeadingBlockItems
            }
            ... on ContentfulLayoutBlockSponsorships {
                key: id
                ...SponsorshipsBlockItems
            }
            ... on ContentfulLayoutBlockForm {
                key: id
                ...FormBlockItems
            }
            ... on ContentfulLayoutBlockDonationForm {
                key: id
                ...DonationFormBlockItems
            }
            ... on ContentfulLayoutBlockCta {
                key: id
                ...CtaBlockItems
            }
        }
    }
    fragment Translations on RootQueryType {
        ...DonationFormTranslations
    }
`;
