import React from 'react'
import appContext from '../../Context'
import SmartLink from '../../Ui/SmartLink'

import './index.sass'

export default appContext(({ context, ...props }) => (
    <div className="programs">
        <ul>
            {context.programs.map((program) => (
                <li key={program.id}>
                    <SmartLink
                        to={program.url.substring(0, 17) == 'https://srnd.org/' ? program.url.substring(16) : program.url}
                        target={program.url.substring(0, 17) == 'https://srnd.org/' ? null : '_blank'}>
                        <img src={program.logo.responsiveResolution ? program.logo.responsiveResolution : program.logo.file.url } alt="" />
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
            responsiveResolution(width: 512) {
                src
                srcSet
            }
        }
    }
`;
