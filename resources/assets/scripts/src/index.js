import DonationPage from './donate'

if (document.body.classList.contains('section-donate')) {
    DonationPage();
}

document.querySelector('footer input.ein')
    .addEventListener('click', (evt) => {
        evt.target.select();
        document.execCommand('copy');
    });

(function(t,a,l,k,u,s,e){if(!t[u]){t[u]=function(){(t[u].q=t[u].q||[]).push(arguments)},t[u].l=1*new Date();s=a.createElement(l),e=a.getElementsByTagName(l)[0];s.async=1;s.src=k;e.parentNode.insertBefore(s,e)}})(window,document,'script','//www.talkus.io/plugin.beta.js','talkus');
talkus('init', 'DptgxkJDNvbkLB2mX');
