<?php

foreach (glob(implode(DIRECTORY_SEPARATOR, [__DIR__, "filters", "*.php"])) as $filename) {
    include($filename); // We use include instead of include_once anywhere that doesn't define a class because if we
                        // don't, Laravel breaks when we try to run tests.
}

foreach (glob(implode(DIRECTORY_SEPARATOR, [__DIR__, 'routes', "*.php"])) as $filename) {
    include($filename);
}
