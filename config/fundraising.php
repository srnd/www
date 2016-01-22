<?php

$config = json_decode(file_get_contents(__DIR__.DIRECTORY_SEPARATOR.'local.json'), true);

return [
    'active' => $config['fundraising']['active'],
    'amount' => $config['fundraising']['amount'],
    'by' => $config['fundraising']['by'],
    'starting' => $config['fundraising']['starting'],
    'expected_quantity' => $config['fundraising']['expected_quantity']
];
