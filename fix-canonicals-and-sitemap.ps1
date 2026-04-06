# Fix canonical tags with proper URL encoding and create sitemap

$domain = "https://nbs-lns-ai.pages.dev"
$baseDir = "c:\Users\youni\OneDrive\Documents\GitHub\NBS"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -ErrorAction SilentlyContinue

# Create sitemap URLs
$sitemapUrls = @()

foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Substring($baseDir.Length).Replace('\', '/').TrimStart('/')

    # URL encode the path (replace spaces with %20, + with %2B)
    $encodedPath = $relativePath `
        -replace ' ', '%20' `
        -replace '\+', '%2B'

    $canonicalUrl = "$domain/$encodedPath"
    $sitemapUrls += $canonicalUrl

    # Read current file
    $content = Get-Content $file.FullName -Raw

    # Replace existing canonical tag with properly URL-encoded version
    $newContent = $content -replace `
        '<link rel="canonical" href="[^"]*">', `
        "<link rel=""canonical"" href=""$canonicalUrl"">"

    # Write back
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    Write-Host "Updated canonical: $encodedPath"
}

# Generate sitemap.xml
$sitemapPath = Join-Path $baseDir "sitemap.xml"
$sitemapContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"@

foreach ($url in ($sitemapUrls | Sort-Object -Unique)) {
    $sitemapContent += "`n    <url>`n        <loc>$url</loc>`n    </url>"
}

$sitemapContent += "`n</urlset>"
Set-Content -Path $sitemapPath -Value $sitemapContent -Encoding UTF8
Write-Host "`nSitemap created at: $sitemapPath"
Write-Host "Total unique URLs in sitemap: $($sitemapUrls.Count)"
