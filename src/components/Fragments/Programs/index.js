import React from 'react'
import { graphql } from 'gatsby'
import Img from "gatsby-image"
import appContext from '../../Context'
import SmartLink from '../../Ui/SmartLink'

import './index.sass'

export default appContext(({ context, ...props }) => (
    <div className="programs">
        <ul>
            {context.programs.map((program) => (
                <li key={program.id}>
                    <SmartLink
                        to={program.url.substring(0, 17) === 'https://srnd.org/' ? program.url.substring(16) : program.url}
                        target={program.url.substring(0, 17) === 'https://srnd.org/' ? null : '_blank'}>
                        {program.logo.fluid && program.logo.fluid.src
                            ? <Img fluid={program.logo.fluid} />
                            : <img src={ program.logo.file.url } alt="" />}
                        <span className="description">{program.shortDescription}</span>
                    </SmartLink>
                </li>
            ))}
        </ul>
    </div>
));

export const query = graphql`
    fragment ProgramsFragmentItems on ContentfulProgram {
        name
        id
        url
        shortDescription
        description { description }
        logo {
            file { url }
            fluid(maxWidth: 455) {
                ...GatsbyContentfulFluid_withWebp
            }
        }
    }
`;
