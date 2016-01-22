<?php

$config = json_decode(file_get_contents(__DIR__.DIRECTORY_SEPARATOR.'local.json'), true);

return [
    'account_id' => $config['dwolla']['account_id'],
    'client_id' => $config['dwolla']['client_id'],
    'client_secret' => $config['dwolla']['client_secret'],
    'sandbox' => $config['dwolla']['sandbox']
];
