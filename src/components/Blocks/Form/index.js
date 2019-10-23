import React from 'react'
import { graphql } from 'gatsby'
import { Pii } from '../../Ui/Secure'
import Loading from '../../Ui/Loading'

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
                {this.state.cognitoDidLoad ? (
                    <div>
                        <iframe src={`https://services.cognitoforms.com/f/${process.env.GATSBY_COGNITO_PUBLIC}?id=${this.props.formId}`}
                            frameBorder="0"
                            scrolling="yes"
                            seamless="seamless"
                            height="797"
                            width="100%"
                            title={this.props.formId} />
                        <Pii />
                    </div>
                ) : <Loading />}
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
        } else if (window && window.Cognito) {
            this.cognitoDidLoad(window.Cognito);
        }
    }

    cognitoDidLoad(cognito) {
        this.setState({cognitoDidLoad: true});
        cognito.setCss(`
            @import url('https://srnd-cdn.net/fonts/avenir-next/minimal.css');
            .c-forms-heading { display:none; }
            .c-forms-form-main { padding-top: 1rem; }
            .c-helptext { color: #bdbdbd !important; font-weight: 500; font-style: normal !important; }
            .cognito .c-forms-form, .cognito .c-span-1 { max-width: none; }
            .cognito .c-forms-form-main > .c-field:first-child { padding-top: 0; }
            .cognito .c-forms-form-main > .c-field:first-child .c-label { margin-top: 0; }
            .cognito .c-forms-form-main { margin-top: 0; }
            .c-section:not(:first-child) { margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #f9f9f9; }
            .c-section .c-title h3 { margin-bottom: 1rem; color: #484848; font-size: 20.45px; }
            .cognito .c-forms-form .c-fileupload-dropzone .c-upload-button, .cognito .c-forms-form .c-fileupload-dropzone {
                background-color: transparent !important;
                border-color: transparent !important;
                padding: 0 !important;
                margin-left: 0 !important;
            }

            .cognito .c-forms-form button:not(.c-icon-button), .cognito .c-forms-form .c-add-item,
            .cognito .c-forms-form input[type="button"],
            .cognito .remove-icon circle,
            .cognito .c-forms-form .c-fileupload-dropzone .c-upload-button button {
                background-color: #484848;
                border-color: #484848;
                fill: #484848;
                stroke: #484848;
            }
            *, .c-fileupload-dropzone-message, .c-upload-button  {
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
            .cognito .c-forms-form .c-background-highlight {
                background-color: transparent;
            }

            #c-submit-button, .cognito .c-forms-form .c-fileupload-dropzone .c-upload-button {
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
            .cognito .c-forms-form .c-fileupload-dropzone .c-upload-button,
            .cognito .c-forms-form .c-fileupload-dropzone .c-upload-button:hover,
            .cognito .c-forms-form button:not(.c-icon-button):hover, .cognito .c-forms-form .c-add-item:hover {
                background-color: #8a8a8a;
                border-color: #8a8a8a;
                color: #fff;
            }


            .cognito .c-repeating-section-item-title {
              margin-bottom: -3em;
              margin-top: 0.5em;
            }

            .cognito .c-repeating-section-item-title h4 {
              display: none;
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
