#!/bin/bash
set -

npm run migrate-pg up
npm run migrate-elastic

exec "$@"