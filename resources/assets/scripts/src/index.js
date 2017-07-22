import DonationPage from './donate'

if (document.body.classList.contains('section-donate')) {
    DonationPage();
}

window.addEventListener('load', () => {
    document.querySelector('footer input.ein')
        .addEventListener('click', (evt) => {
            evt.target.select();
            document.execCommand('copy');
        });

    var iframes = [
        "https://platform.twitter.com/widgets/follow_button.html?screen_name=studentrnd&show_screen_name=false&lang=#{lang}&dnt=true&show_count=true",
        "https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Fsrnd.org&width=76&layout=button_count&action=like&size=small&show_faces=true&share=false&height=21&appId=134222673401073"
    ];
    for(let src of iframes) {
        let iframe = document.createElement('iframe');
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.scrolling = "no";
        iframe.frameborder = "0";
        iframe.allowTransparency = "true";
        iframe.src = src;
        document.querySelector('footer .info .social').appendChild(iframe);
    }

    (function(t,a,l,k,u,s,e){if(!t[u]){t[u]=function(){(t[u].q=t[u].q||[]).push(arguments)},t[u].l=1*new Date();s=a.createElement(l),e=a.getElementsByTagName(l)[0];s.async=1;s.src=k;e.parentNode.insertBefore(s,e)}})(window,document,'script','//www.talkus.io/plugin.beta.js','talkus');
    talkus('init', 'DptgxkJDNvbkLB2mX');

    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
    analytics.load("QSk1uEWVmQ6NbKHIvmiDZaQfqR2laysV");
    analytics.page();
    }}();
});
