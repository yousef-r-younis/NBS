# Fix UTF-8 encoding for all HTML files to restore emojis

$baseDir = "c:\Users\youni\OneDrive\Documents\GitHub\NBS"
$utf8BOM = New-Object System.Text.UTF8Encoding($true)

$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $htmlFiles) {
    try {
        # Read file as UTF-8 (without BOM first to detect encoding)
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Write back with UTF-8 BOM
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8BOM)

        Write-Host "Fixed encoding: $($file.Name)"
    } catch {
        Write-Host "Error fixing $($file.Name): $_"
    }
}

Write-Host "`nAll HTML files re-encoded with UTF-8 BOM"
