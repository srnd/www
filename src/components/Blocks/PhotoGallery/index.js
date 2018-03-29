import React from 'react'
import Img from "gatsby-image"
import "./index.sass"

export default class PhotoGalleryBlock extends React.Component {
    render() {
        return (
            <div className="photo-gallery">
                <ul className={`layout-${this.props.style}`}>
                    {this.props.photos.map((image) => (
                        <li key={image.id}>
                            {this.props.linkToFullSize ? (
                                <a href={image.file.url} target="_blank">{this.renderImg(image)}</a>
                            ) : this.renderImg(image)}

                            {['comic', 'staff-bios', 'staff-titles'].includes(this.props.style) ? this.renderBio(image) : null}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    renderImg(image) {
        let src = image.med;
        if (this.props.style === 'staff-titles') src = image.sml;
        if (this.props.style === 'gallery-small') src = image.smc;

        return (
            src.src ? (
                <Img sizes={src} alt={image.title} title={image.description} />
            ) : (
                <img src={image.file.url} alt={image.title} title={image.description} />
            )
        );
    }

    renderBio(image) {
        return (
            <div className="details">
                {['staff-bios', 'staff-titles'].includes(this.props.style) ? ([
                    <div className="name">{image.title.split(', ')[0]}</div>,
                    <div className="title">{image.title.split(', ')[1] || null}</div>
                ]) : ''}
                <p className="description">{image.description} </p>
            </div>
        );
    }
}

export const query = graphql`
    fragment PhotoGalleryBlockItems on ContentfulLayoutBlockPhotoGallery {
        style
        linkToFullSize
        photos {
            id
            title
            description
            file {
                url
            }
            smc: sizes(maxWidth: 300, maxHeight: 200, quality: 90) {
                ...GatsbyContentfulSizes_withWebp
            }
            sml: sizes(maxWidth: 300, quality: 90) {
                ...GatsbyContentfulSizes_withWebp
            }
            med: sizes(maxWidth: 910, quality: 90) {
                ...GatsbyContentfulSizes_withWebp
            }
        }
    }
`;
