# GeoChallenge Deployment Verification Script (PowerShell)
# Run this after each deployment to verify security fixes are live

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GeoChallenge Security Deployment Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$SITE = "https://challenge.geoart.studio"
$PASSED = 0
$FAILED = 0

# Check 1: Security Headers
Write-Host "[*] Checking security headers..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $SITE -Method Head -UseBasicParsing -ErrorAction Stop
    $headers = $response.Headers

    $hasSecurityHeaders = $false
    $foundHeaders = @()

    # Check each header safely
    if ($headers.ContainsKey('X-Frame-Options')) {
        $foundHeaders += "X-Frame-Options: $($headers['X-Frame-Options'] -join ', ')"
        $hasSecurityHeaders = $true
    }
    if ($headers.ContainsKey('X-Content-Type-Options')) {
        $foundHeaders += "X-Content-Type-Options: $($headers['X-Content-Type-Options'] -join ', ')"
        $hasSecurityHeaders = $true
    }
    if ($headers.ContainsKey('X-XSS-Protection')) {
        $foundHeaders += "X-XSS-Protection: $($headers['X-XSS-Protection'] -join ', ')"
        $hasSecurityHeaders = $true
    }

    if ($hasSecurityHeaders) {
        Write-Host "[PASS] Security headers present" -ForegroundColor Green
        foreach ($header in $foundHeaders) {
            Write-Host "   $header" -ForegroundColor Gray
        }
        $PASSED++
    } else {
        Write-Host "[FAIL] Security headers missing" -ForegroundColor Red
        $FAILED++
    }
} catch {
    Write-Host "[FAIL] Could not connect to site: $($_.Exception.Message)" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

# Check 2: security.txt
Write-Host "[*] Checking security.txt..." -ForegroundColor Yellow

try {
    $securityTxtUrl = "$SITE/.well-known/security.txt"
    $securityTxt = Invoke-WebRequest -Uri $securityTxtUrl -UseBasicParsing -ErrorAction Stop

    if ($securityTxt.Content -match "Contact") {
        Write-Host "[PASS] security.txt accessible" -ForegroundColor Green
        $contactLines = $securityTxt.Content -split "`n" | Where-Object { $_ -match "Contact" }
        foreach ($line in $contactLines) {
            Write-Host "   $($line.Trim())" -ForegroundColor Gray
        }
        $PASSED++
    } else {
        Write-Host "[FAIL] security.txt missing Contact field" -ForegroundColor Red
        $FAILED++
    }
} catch {
    Write-Host "[FAIL] security.txt not accessible: $($_.Exception.Message)" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

# Check 3: HTTPS (SSL)
Write-Host "[*] Checking HTTPS/SSL..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $SITE -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "[PASS] Site is accessible via HTTPS - Status: 200" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "[WARN] Unexpected status code: $($response.StatusCode)" -ForegroundColor Yellow
        $FAILED++
    }
} catch {
    Write-Host "[FAIL] Site not accessible: $($_.Exception.Message)" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

# Check 4: No source code exposure
Write-Host "[*] Checking source code exposure..." -ForegroundColor Yellow

try {
    $configUrl = "$SITE/next.config.ts"
    $response = Invoke-WebRequest -Uri $configUrl -UseBasicParsing -ErrorAction Stop

    # If we get here without error, the file is exposed
    Write-Host "[WARN] Source code may be exposed - Status: $($response.StatusCode)" -ForegroundColor Yellow
    $FAILED++
} catch {
    # 404 error is what we want (file not exposed)
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "[PASS] Source code not exposed - 404 as expected" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "[WARN] Unexpected error checking source code" -ForegroundColor Yellow
        $FAILED++
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $PASSED" -ForegroundColor Green
Write-Host "Failed: $FAILED" -ForegroundColor Red
Write-Host ""

if ($FAILED -eq 0) {
    Write-Host "SUCCESS: All checks passed! Your deployment is secure." -ForegroundColor Green
    Write-Host "You are ready to submit whitelist appeals." -ForegroundColor Green
    exit 0
} else {
    Write-Host "WARNING: Some checks failed. Please review and fix before submitting appeals." -ForegroundColor Yellow
    exit 1
}
