# The site is a static Docusaurus build served from GitHub Pages; merges to
# main deploy it (.github/workflows/deploy-pages.yml). The contact form and
# installer downloads live on the Smartloop API (slp-api), and smartloop.ai's
# redirects (www, docs., /install, /:platform/release, ...) are Cloudflare
# rules in slp-infra-project/cloudflare/website.tf.

OUT_DIR=build

# Build the static site into ./build
build:
	npm run build

# Serve ./build locally, the way Pages will
serve: build
	npm run serve

# Generate social card PNG from social-card-generator.html
social-card:
	@echo "🎨 Generating social card..."
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
		--headless=new --disable-gpu --no-sandbox \
		--force-device-scale-factor=1 \
		--screenshot="static/img/smartloop-social-card.png" \
		--window-size=1200,700 --hide-scrollbars \
		"file://$(PWD)/social-card-generator.html"
	sips --cropToHeightWidth 630 1200 static/img/smartloop-social-card.png
	@echo "✅ Social card saved to static/img/smartloop-social-card.png"

.PHONY: build serve social-card
