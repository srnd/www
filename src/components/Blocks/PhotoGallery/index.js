import React from 'react'
import "./index.sass"

export default (props) => (
    <ul className={`photo-gallery layout-${props.style}`}>
        {props.photos.map((image) => (
            <li key={image.id}>
                {props.linkToFullSize ? (
                    <a href={image.file.url} target="_blank">
                        <img src={image.responsiveResolution.src} srcSet={image.responsiveResolution.srcSet} alt={image.title} title={image.description} />
                    </a>
                ) : (
                    <img src={image.responsiveResolution.src} srcSet={image.responsiveResolution.srcSet} alt={image.title} title={image.description} />
                )}
                {['comic', 'staff-bios', 'staff-titles'].includes(props.style) ? (
                    <div className="details">
                        {['staff-bios', 'staff-titles'].includes(props.style) ? ([
                            <div className="name">{image.title.split(', ')[0]}</div>,
                            <div className="title">{image.title.split(', ')[1] || null}</div>
                        ]) : ''}
                        <p className="description">{image.description} </p>
                    </div>
                ) : ''}
            </li>
        ))}
    </ul>
)

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
            responsiveResolution(width: 455) {
                src
                srcSet
            }
        }
    }
`;
