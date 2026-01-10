#!/bin/bash
# Test production deployment with Vercel CLI

set -e

echo "🚀 Testing Production Route with Vercel CLI"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TOKEN="3a7579ecdd2074d46745374eab092089"
TEST_URL="/interview/${TOKEN}"

echo "📋 Test Configuration:"
echo "  Token: ${TOKEN}"
echo "  Route: ${TEST_URL}"
echo ""

# Step 1: Build
echo "📦 Step 1: Building..."
pnpm run build > /tmp/vercel-build.log 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  cat /tmp/vercel-build.log
  exit 1
fi
echo ""

# Step 2: Check if route exists in build
echo "🔍 Step 2: Checking route in build output..."
if grep -q "/interview/\[token\]" /tmp/vercel-build.log; then
  echo -e "${GREEN}✅ Route found in build${NC}"
else
  echo -e "${YELLOW}⚠️  Route not found in build log (might be normal)${NC}"
fi
echo ""

# Step 3: Deploy with Vercel (preview)
echo "🚀 Step 3: Deploying to Vercel (preview)..."
DEPLOY_OUTPUT=$(npx vercel --prebuilt --yes 2>&1)
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[^\s]+\.vercel\.app' | head -1)

if [ -z "$DEPLOY_URL" ]; then
  echo -e "${RED}❌ Failed to get deployment URL${NC}"
  echo "$DEPLOY_OUTPUT"
  exit 1
fi

echo -e "${GREEN}✅ Deployed to: ${DEPLOY_URL}${NC}"
echo ""

# Step 4: Test the route
echo "🧪 Step 4: Testing route..."
sleep 3  # Wait for deployment to be ready

FULL_URL="${DEPLOY_URL}${TEST_URL}"
echo "  Testing: ${FULL_URL}"

HTTP_CODE=$(curl -s -o /tmp/vercel-response.html -w "%{http_code}" "${FULL_URL}")
echo "  HTTP Status: ${HTTP_CODE}"

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Route works!${NC}"
  echo ""
  echo "Response preview:"
  head -20 /tmp/vercel-response.html
elif [ "$HTTP_CODE" = "404" ]; then
  echo -e "${RED}❌ Still getting 404${NC}"
  echo ""
  echo "Response body:"
  cat /tmp/vercel-response.html
  echo ""
  echo "Let's check logs..."
  npx vercel logs "${DEPLOY_URL}" --since 2m | tail -30
else
  echo -e "${YELLOW}⚠️  Unexpected status: ${HTTP_CODE}${NC}"
  cat /tmp/vercel-response.html
fi

echo ""
echo "============================================"
echo "📊 Summary:"
echo "  Deployment URL: ${DEPLOY_URL}"
echo "  Test URL: ${FULL_URL}"
echo "  HTTP Status: ${HTTP_CODE}"
echo "============================================"

