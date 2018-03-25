import React from 'react'

export class FancyRadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.propagateChangeEvent = this.propagateChangeEvent.bind(this);
    }

    render() {
        var children = this.props.children.map(function(item, i) {
            return React.cloneElement(item, {
                onChange: this.propagateChangeEvent,
                selected: this.props.selectedValue === item.props.value,
            });
        }, this);
        return (
            <div className="fancy-radio">
                {children}
            </div>
        );
    }

    propagateChangeEvent(value) {
        this.props.onChange && this.props.onChange(value);
    }
}

export const FancyRadioOption = ({ value, onChange, disabled, selected, children, ...props}) => (
    <div
        className={`fancy-radio-option ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => disabled ? null : onChange(value)}
        {...props}>{children}</div>
);
