# Install the cli
curl -sL https://sentry.io/get-cli/ | SENTRY_CLI_VERSION="2.2.0" bash
# Setup configuration values
SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"
SENTRY_ORG=dropshipping-fs
SENTRY_PROJECT=javascript-remix
VERSION=`sentry-cli releases propose-version`
# Workflow to create releases
sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto
sentry-cli releases finalize "$VERSION"