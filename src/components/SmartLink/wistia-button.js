import React from 'react';

class WistiaButton extends React.Component {
    render() {
        const { wistiaId, ...other } = this.props;
        return (
            <span className={`wistia_embed wistia_async_${wistiaId} popover=true popoverContent=link popoverPreventScroll=true`}>
                <a href="#" {...other}>{this.props.children}</a>
            </span>
        )
    }

    componentDidMount() {
        if (!document.getElementById("wistia_script")) {
            var wistiaScript = document.createElement("script");
            wistiaScript.id = "wistia_script"
            wistiaScript.type = "text/javascript"
            wistiaScript.src = "https://fast.wistia.com/assets/external/E-v1.js"
            wistiaScript.async = true
            document.body.appendChild(wistiaScript);
        }
    }
}
export default WistiaButton
