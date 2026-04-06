import glob

BASE_URL = "https://nbs-lns-ai.pages.dev"

files = glob.glob("**/*.html", recursive=True)

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'rel="canonical"' in content:
        print(f"Skipped: {path}")
        continue
    
    url_path = path.replace("\\", "/")
    canonical_tag = f'<link rel="canonical" href="{BASE_URL}/{url_path}">'
    
    # Try all variations
    if "<head>\r\n" in content:
        content = content.replace("<head>\r\n", f"<head>\r\n    {canonical_tag}\r\n", 1)
    elif "<head>\n" in content:
        content = content.replace("<head>\n", f"<head>\n    {canonical_tag}\n", 1)
    elif "<head>" in content:
        content = content.replace("<head>", f"<head>{canonical_tag}", 1)
    else:
        print(f"No <head> found: {path}")
        continue
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed: {path}")

print("Done!")