#!/bin/sh
set -eu

cat > /var/www/dist/env.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-${VITE_API_BASE_URL:-http://localhost:8000/api}}"
};
EOF

exec nginx -g 'daemon off;'
