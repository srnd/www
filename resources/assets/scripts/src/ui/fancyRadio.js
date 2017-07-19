import React from 'react'

export class FancyRadio extends React.Component {
    ///////////////////////// 
    // React Lifecycle
    /////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            selectedChildId: this.getUniqueFieldId(this.propSelectedChild),
            children: []
        };
    }

    componentWillMount() {
        this.refreshChildrenState();
    }

    componentDidUpdate() {
        // Make sure the currently-selected choice is still valid
        if (this.selectedChild.props.disabled) {
            this.selectChild(this.abledChildren.slice(-1)[0] || null);
        }

        // Fire an update if the value changed.
        if (this.lastValue !== this.value) {
            this.lastValue = this.value;
            this.props.onUpdate && this.props.onUpdate(this.value);
        }
    }

    componentWillReceiveProps(props) {
        this.refreshChildrenState(null, props);
    }

    render() {
        // Consume props, and pass the other props onto self
        var { name, onUpdate, ...otherProps } = this.props;

        return <div>
            <div className="radio-field" {...otherProps} onClick={this.changeChild}>{this.state.children}</div>
            <input type="hidden" name={this.props.name} value={this.value ? this.value : ''} />
        </div>;
    }

    ///////////////////////// 
    // Attributes
    /////////////////////////

    /**
     * Gets the selected child (according to the state).
     */
    get selectedChild() {
        return React.Children.toArray(this.state.children).filter(c => c.props.selected)[0] || null;
    }

    /**
     * Gets the selected child's value.
     */
    get value() {
        return this.selectedChild ? this.selectedChild.props.value : null;
    }

    /**
     * Gets the selected child (according to the props-passed child, and not the current state child).
     */
    get propSelectedChild() {
        return React.Children.toArray(this.props.children).filter(c => c.props.selected)[0] || null;
    }

    /**
     * Gets a list of children which aren't disabled.
     */
    get abledChildren() {
        return React.Children.toArray(this.props.children).filter(c => !c.props.disabled);
    }

    /**
     * Gets a unique ID for the child.
     */
    getUniqueFieldId(child) {
        if (!child) return null;
        return child.props.id || child.props.value;
    }

    ///////////////////////// 
    // Helpers
    /////////////////////////

    /**
     * Checks if the element is disabled and, if not, passes the selection of the child to selectChild.
     */
    onChildClicked(child, evt) {
        if (child.props.disabled) return; // Don't allow clicks on disabled elements.
        this.selectChild(child);
    }

    /**
     * Updates the state to select the child.
     */
    selectChild(child) {
        this.setState({selectedChildId: this.getUniqueFieldId(child)});
        this.refreshChildrenState(this.getUniqueFieldId(child));
    }

    /**
     * Updates the state of the selection for the children (and attaches the onClick handler).
     * You can pass in a new selection (for pre-state change updates) and/or props (for pre-child change).
     */
    refreshChildrenState(selectedChildId = null, props = null) {
        this.setState({children:
            React.Children.map((props ? props.children : this.props.children),
                (child) => React.cloneElement(child, {
                    onClick: this.generateOnClick(child),
                    selected: this.isChildSelected(child, selectedChildId)
                })
            )
        });
    }

    /**
     * Returns a reference to the onChildClicked handler with the react child scoped properly. (Otherwise we can only
     * access the actual DOM object through evt.target, not the React element.)
     */
    generateOnClick(child) {
        return evt => this.onChildClicked(child, evt);
    }

    /**
     * Checks if the child is the currently selected element.
     */
    isChildSelected(child, selectedChildId = null) {
        var currentSelectionId = selectedChildId ? selectedChildId : this.state.selectedChildId;
        return currentSelectionId ? currentSelectionId == this.getUniqueFieldId(child) : false;
    }
}

export class FancyRadioOption extends React.Component
{
    render() {
        return <div className="radio" onClick={this.props.onClick}
                    {...this.props.selected ? {"data-selected": true} : {}}
                    {...this.props.disabled ? {"data-disabled": true} : {}}>
            {this.props.children}
        </div>;
    }
}
