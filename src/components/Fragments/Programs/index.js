import React from 'react'
import appContext from '../../Context'

import './index.sass'

export default appContext(({ context, ...props }) => (
    <div class="programs">
        <ul>
            {context.programs.map((program) => (
                <li>
                    <a
                        href={program.url.substring(0, 17) == 'https://srnd.org/' ? program.url.substring(16) : program.url}
                        target={program.url.substring(0, 17) == 'https://srnd.org/' ? null : '_blank'}>
                        <img src={program.logo.responsiveResolution ? program.logo.responsiveResolution : program.logo.file.url } alt="" />
                        <span class="description">{program.shortDescription}</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
));

export const query = graphql`
    fragment ProgramsFragmentItems on ContentfulProgram {
        name
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
