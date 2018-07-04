import React from 'react'
import { graphql } from 'gatsby'
import axios from 'axios'
import { Pii } from '../../Ui/Secure'
import Loading from '../../Ui/Loading'
import Form from 'react-jsonschema-form'
import WithIpInfo from '../../Track/ipInfo'

import "./index.sass"

class SchemaForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submitted: false, submitting: false};
    }
    render() {
        return (
            <div className="schema-form">
                {this.state.submitted
                        ? <p className="submitted">{this.props.submitMessage}</p>
                        : (this.state.submitting ? <Loading /> : 
                            <Form
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
                        )
                }
            </div>
        );
    }

    onSubmit(formData) {
        this.setState({submitting: true});
        axios
            .get(this.props.submitUrl, {params: Object.assign(formData, {visitor: this.props.ipInfo})})
            .then((response) => this.setState({submitted: true}))
            .catch((error) => {alert(error); this.setState({submitting: false});});
    }
}
export default WithIpInfo(SchemaForm);

export const query = graphql`
    fragment SchemaFormItems on ContentfulLayoutBlockSchemaForm {
        cta
        schema { internal { content }}
        uiSchema { internal { content }}
        submitUrl
        submitMessage
    }
`;
