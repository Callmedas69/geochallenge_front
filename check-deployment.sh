#!/bin/bash

# GeoChallenge Deployment Verification Script
# Run this after each deployment to verify security fixes are live

echo "========================================"
echo "GeoChallenge Security Deployment Check"
echo "========================================"
echo ""

SITE="https://challenge.geoart.studio"
PASSED=0
FAILED=0

# Check 1: Security Headers
echo "🔍 Checking security headers..."
HEADERS=$(curl -sI "$SITE" | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection")

if [ -z "$HEADERS" ]; then
  echo "❌ FAILED: Security headers missing"
  ((FAILED++))
else
  echo "✅ PASSED: Security headers present"
  echo "$HEADERS"
  ((PASSED++))
fi
echo ""

# Check 2: security.txt
echo "🔍 Checking security.txt..."
SECURITY_TXT=$(curl -s "$SITE/.well-known/security.txt" | grep "Contact")

if [ -z "$SECURITY_TXT" ]; then
  echo "❌ FAILED: security.txt not accessible"
  ((FAILED++))
else
  echo "✅ PASSED: security.txt accessible"
  echo "$SECURITY_TXT"
  ((PASSED++))
fi
echo ""

# Check 3: HTTPS (SSL)
echo "🔍 Checking HTTPS/SSL..."
SSL_STATUS=$(curl -sI "$SITE" | grep "HTTP/")

if echo "$SSL_STATUS" | grep -q "200"; then
  echo "✅ PASSED: Site is accessible via HTTPS"
  ((PASSED++))
else
  echo "❌ FAILED: Site not accessible"
  ((FAILED++))
fi
echo ""

# Check 4: No source code exposure
echo "🔍 Checking source code exposure..."
CONFIG_CHECK=$(curl -s "$SITE/next.config.ts" | grep "404")

if [ -n "$CONFIG_CHECK" ] || [ "$(curl -s -o /dev/null -w "%{http_code}" "$SITE/next.config.ts")" = "404" ]; then
  echo "✅ PASSED: Source code not exposed"
  ((PASSED++))
else
  echo "⚠️  WARNING: Source code may be exposed"
  ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All checks passed! Your deployment is secure."
  echo "You're ready to submit whitelist appeals."
  exit 0
else
  echo "⚠️  Some checks failed. Please review and fix before submitting appeals."
  exit 1
fi
