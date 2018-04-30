import React from 'react'
import { Pii } from '../../Ui/Secure'

import "./index.sass"

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cognitoDidLoad: false,
        };
    }

    render() {
        return (
            <div className="cognito" style={{marginTop: '11.5pt'}}>
                {this.state.cognitoDidLoad ? [
                    <iframe src={`https://services.cognitoforms.com/f/${process.env.GATSBY_COGNITO_PUBLIC}?id=${this.props.formId}`}
                        frameBorder="0"
                        scrolling="yes"
                        seamless="seamless"
                        height="797"
                        width="100%" />,
                    <Pii />
                ] : ''}
            </div>
        );
    }

    componentDidMount() {
        if (!document.getElementById("cognito_script")) {
            var cognitoScript = document.createElement("script");
            cognitoScript.id = "cognito_script"
            cognitoScript.type = "text/javascript"
            cognitoScript.src = `https://services.cognitoforms.com/scripts/embed.js`
            cognitoScript.async = true
            cognitoScript.addEventListener('load', () => this.cognitoDidLoad(window.Cognito));
            document.body.appendChild(cognitoScript);
        }
    }

    cognitoDidLoad(cognito) {
        this.setState({cognitoDidLoad: true});
        cognito.setCss(`
            @import url('https://srnd-cdn.net/fonts/avenir-next/minimal.css');
            .c-forms-heading { display:none; }
            .cognito .c-forms-form, .cognito .c-span-1 { max-width: none; }
            .cognito .c-field:first-child { padding-top: 0; }
            .cognito .c-forms-form .c-field:first-child .c-label { margin-top: 0; }
            .cognito .c-forms-form-main { margin-top: 0; }
            * {
                font-family: "Avenir Next", "Helvetica", "Arial", sans-serif !important;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important
                box-shadow: none !important;
            }
            .cognito .c-forms-form .c-forms-form-title h2 {
                color: #484848;
                font-size: 14.663pt;
                margin-bottom: 11.5pt;
                padding: 0;
            }
            .cognito .c-forms-heading .c-forms-form-title {
                margin-bottom: calc(11.5pt - 1rem);
                padding: 0;
            }
            .cognito .c-forms-form .c-label, .cognito .c-forms-form .c-choice-option {
                font-weight: 500;
                font-size: 11.5pt;
                color: #484848;
                margin-top: 1rem;
            }
            .cognito .c-forms-form input[type="text"], .cognito .c-forms-form input[type="password"], .cognito .c-forms-form textarea, .cognito .c-forms-form select {
                font-family: "Avenir Next", "Helvetica", "Arial", sans-serif;
                color: #484848;
                font-size: 11.5pt;
                border: 1px solid #e6e6e6;
            }
            .cognito .c-forms-form input::-moz-placeholder,
            .cognito .c-forms-form textarea::-moz-placeholder {
                color: #bdbdbd;
                opacity: 1;
            }
            .cognito .c-forms-form input[type="radio"] + ::before {
                background-color: #fff;
                border: 1px solid #e6e6e6;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important
                box-shadow: none !important;
            }
            .cognito .c-forms-form input[type="radio"]:checked + ::before {
                background-color: #bdbdbd;
                border-color: #bdbdbd;
            }
            .cognito .c-field.c-required .c-label::after, .cognito .c-rating-scale.c-required .c-choice-question::after {
                color: #ff686b;
            }
            .cognito .c-button-section {
                margin-top: 1rem;
            }
            #c-submit-button {
                text-decoration: none;
                background-color: #ff686b;
                color: #fff;
                border-color: #ff686b;
                padding: 0.5rem 1rem;
                display: inline-block;
                cursor: pointer;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
                transition: all .2s ease-in-out;
                border: 1px solid transparent;
            }
        `);
        cognito.prefill(this.props.prefills ? this.props.prefills.prefills : {}); 
    }
}
export default Form;
export const query = graphql`
    fragment FormBlockItems on ContentfulLayoutBlockForm {
        formId
        prefills { internal { content } }
        successHtml { successHtml }
    }
`;
