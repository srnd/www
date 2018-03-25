import React from 'react'

import "./index.sass"

import HtmlBlock from '../Blocks/Html';
import MarkdownBlock from '../Blocks/Markdown';
import QuoteBlock from '../Blocks/Quote';
import PhotoGalleryBlock from '../Blocks/PhotoGallery';
import HeadingBlock from '../Blocks/Heading';
import SponsorshipsBlock from '../Blocks/Sponsorships';
import DonationFormBlock from '../Blocks/DonationForm';

const tagTypes = {
    ContentfulLayoutBlockHtml: HtmlBlock,
    ContentfulLayoutBlockPhotoGallery: PhotoGalleryBlock,
    ContentfulLayoutBlockQuote: QuoteBlock,
    ContentfulLayoutBlockMarkdown: MarkdownBlock,
    ContentfulLayoutBlockHeading: HeadingBlock,
    ContentfulLayoutBlockSponsorships: SponsorshipsBlock,
    ContentfulLayoutBlockDonationForm: DonationFormBlock,
};


export default (props) => (
    <div className="content">
        {
            props.items
                ? props.items.map((block) => tagTypes[block.__typename]
                    ? React.createElement(tagTypes[block.__typename], Object.assign({translate: props.translate}, block))
                    : '')
                : ''
        }
    </div>
)

export const query = graphql`
    fragment ContentItems on ContentfulLayout {
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
            ... on ContentfulLayoutBlockDonationForm {
                key: id
                ...DonationFormBlockItems
            }
        }
    }
    fragment Translations on RootQueryType {
        ...DonationFormTranslations
    }
`;
