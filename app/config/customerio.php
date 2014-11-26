<?php

$config = json_decode(file_get_contents(__DIR__.DIRECTORY_SEPARATOR.'local.json'), true);

return [
    'site_id' => $config['customerio']['site_id'],
    'api_key' => $config['customerio']['api_key']
];
