import React from 'react'
import axios from 'axios'
import { Pii } from '../../Ui/Secure'
import Form from "react-jsonschema-form"

import "./index.sass"

export default class SchemaForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submitted: false};
    }
    render() {
        return (
            <div className="schema-form">
                {this.state.submitted
                        ? <p className="submitted">{this.props.submitMessage}</p>
                        : <Form
                            schema={JSON.parse(this.props.schema.internal.content)}
                            uiSchema={JSON.parse(this.props.uiSchema.internal.content)}
                            onSubmit={(e) => this.onSubmit(e.formData)}>
                                <div className="bottom">
                                    <div className="submit">
                                        <button type="submit">{this.props.cta}</button>
                                    </div>
                                    <Pii />
                                </div>
                            </Form>
                }
            </div>
        );
    }

    onSubmit(formData) {
        axios
            .get(this.props.submitUrl, {params: formData})
            .then((response) => this.setState({submitted: true}))
            .catch((error) => alert(error));
    }
}

export const query = graphql`
    fragment SchemaFormItems on ContentfulLayoutBlockSchemaForm {
        cta
        schema { internal { content }}
        uiSchema { internal { content }}
        submitUrl
        submitMessage
    }
`;
