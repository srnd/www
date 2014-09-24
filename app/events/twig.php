<?php

\App::before(function(){
    $md = new \TwigMarkdown\Extension();
    app('twig')->addExtension($md);
});