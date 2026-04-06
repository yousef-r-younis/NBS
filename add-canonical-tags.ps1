# PowerShell script to add canonical tags to all HTML files
$domain = "https://nbs-lns-ai.pages.dev"
$baseDir = "c:\Users\youni\OneDrive\Documents\GitHub\NBS"

# Find all HTML files
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw

    # Skip if canonical tag already exists
    if ($content -match '<link rel="canonical"') {
        Write-Host "Skipping $($file.Name) - already has canonical tag"
        continue
    }

    # Convert file path to URL
    $relativePath = $file.FullName.Substring($baseDir.Length).Replace('\', '/').TrimStart('/')
    $url = "$domain/$relativePath"

    # Create canonical tag
    $canonicalTag = "    <link rel=""canonical"" href=""$url"">`r`n"

    # Insert after <meta name="viewport"...> tag
    $newContent = $content -replace '(<meta name="viewport"[^>]*>)', "`$1`r`n$canonicalTag"

    # Write back to file
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    Write-Host "Added canonical tag to: $($file.Name)"
}

Write-Host "Done! Canonical tags added to all HTML files."
