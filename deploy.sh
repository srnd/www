#!/usr/bin/env bash
rm -rf .cache public
gatsby build
node deploy.js

# Purges
# TODO: Figure out a way to use surrogate keys with GCP
curl -X PURGE https://www.srnd.org/
curl -X PURGE https://www.srnd.org/contact
curl -X PURGE https://www.srnd.org/press
curl -X PURGE https://www.srnd.org/press/photos
curl -X PURGE https://www.srnd.org/donate
curl -X PURGE https://www.srnd.org/sponsor
curl -X PURGE https://www.srnd.org/sponsor/pay
curl -X PURGE https://www.srnd.org/sponsor/guide
curl -X PURGE https://www.srnd.org/sponsor/guide/promotion
curl -X PURGE https://www.srnd.org/sponsor/guide/employees
curl -X PURGE https://www.srnd.org/sponsor/guide/workshops
curl -X PURGE https://www.srnd.org/sponsor/guide/award
curl -X PURGE https://www.srnd.org/sponsor/guide/swag
curl -X PURGE https://www.srnd.org/sponsor/guide/venue
curl -X PURGE https://www.srnd.org/sponsor/guide/setup
curl -X PURGE https://www.srnd.org/privacy
curl -X PURGE https://www.srnd.org/trademarks
curl -X PURGE https://www.srnd.org/returns
curl -X PURGE https://www.srnd.org/volunteer/codelabs
curl -X PURGE https://www.srnd.org/volunteer/paragon
curl -X PURGE https://www.srnd.org/volunteer/background-check/us-general
curl -X PURGE https://www.srnd.org/schools
curl -X PURGE https://www.srnd.org/schools/csfair
curl -X PURGE https://www.srnd.org/conduct
curl -X PURGE https://www.srnd.org/conduct/friendly
curl -X PURGE https://www.srnd.org/conduct/safety
curl -X PURGE https://www.srnd.org/conduct/legal
curl -X PURGE https://www.srnd.org/conduct/harassment
curl -X PURGE https://www.srnd.org/conduct/report
curl -X PURGE https://www.srnd.org/conduct/enforcement
curl -X PURGE https://www.srnd.org/publish
