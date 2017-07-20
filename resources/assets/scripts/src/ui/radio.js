import React from 'react'

export class RadioGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var children = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                onChange: e => this.props.onUpdate(child.props.value),
                name: this.props.name,
                checked: (this.props.default == child.props.value ? true : null)
            })
        );

        var { onUpdate, ...props } = this.props;
        return <span {...props}>{children}</span>;
    }
}

export class Radio extends React.Component
{
    render() {
        var { name, value, onChange, ...props } = this.props;
        return <span {...props} onClick={onChange} >
                    <input type="radio" name={name} id={name+'-'+value} value={value} onChange={onChange}
                            {...this.props.checked ? {"checked": true} : {}}/>
                    <label htmlFor={name+'-'+value}>{this.props.children}</label>
                </span>;
    }
}
