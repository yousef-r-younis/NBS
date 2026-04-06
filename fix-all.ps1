# Fix corrupted emojis and add proper canonical tags

$domain = "https://nbs-lns-ai.pages.dev"
$baseDir = "c:\Users\youni\OneDrive\Documents\GitHub\NBS"

$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
$utf8BOM = New-Object System.Text.UTF8Encoding($true)

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $originalContent = $content

    # Replace common corrupted UTF-8 sequences
    $content = $content -replace 'ðŸŒŸ', '🌟'
    $content = $content -replace 'ðŸ–¨', '🖨'
    $content = $content -replace 'ðŸ"š', '📚'
    $content = $content -replace 'ðŸ"', '📋'
    $content = $content -replace 'ðŸ¤', '🤖'
    $content = $content -replace 'ðŸ¥', '🎥'
    $content = $content -replace 'ðŸŽ¨', '🎨'

    # Update canonical tag with proper URL encoding
    $relativePath = $file.FullName.Substring($baseDir.Length).Replace('\', '/').TrimStart('/')
    $encodedPath = $relativePath -replace ' ', '%20' -replace '\+', '%2B'
    $canonicalUrl = "$domain/$encodedPath"

    $content = $content -replace '<link rel="canonical" href="[^"]*">', "<link rel=`"canonical`" href=`"$canonicalUrl`">"

    # Write with UTF-8 BOM if changed
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8BOM)
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "Done!"
