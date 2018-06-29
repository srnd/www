#!/usr/bin/env bash
rm -rf .cache public
gatsby build
node deploy.js

# Purges
# TODO: Figure out a way to use surrogate keys with GCP
curl -X PURGE https://www.srnd.org/
curl -X PURGE https://www.srnd.org/contact
curl -X PURGE https://www.srnd.org/press
curl -X PURGE https://www.srnd.org/donate
curl -X PURGE https://www.srnd.org/sponsor
curl -X PURGE https://www.srnd.org/sponsor/pay
curl -X PURGE https://www.srnd.org/privacy
curl -X PURGE https://www.srnd.org/trademarks
curl -X PURGE https://www.srnd.org/returns
curl -X PURGE https://www.srnd.org/volunteer/codelabs
curl -X PURGE https://www.srnd.org/volunteer/paragon
curl -X PURGE https://www.srnd.org/volunteer/background-check/us-general
curl -X PURGE https://www.srnd.org/schools
curl -X PURGE https://www.srnd.org/schools/csfair
curl -X PURGE https://www.srnd.org/conduct
