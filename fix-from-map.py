#!/usr/bin/env python3
import os
import re

domain = "https://nbs-lns-ai.pages.dev"
base_dir = r"c:\Users\youni\OneDrive\Documents\GitHub\NBS"

# Read emoji map from file
emoji_map = {}
with open(os.path.join(base_dir, 'full-emoji-map.txt'), 'r', encoding='utf-8') as f:
    for line in f:
        if ':' in line:
            corrupted, correct = line.strip().split(':', 1)
            emoji_map[corrupted] = correct

print(f"Loaded {len(emoji_map)} emoji mappings")

count = 0
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)

            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                original = content

                # Apply all replacements
                for corrupted, correct in emoji_map.items():
                    content = content.replace(corrupted, correct)

                # Update canonical tag
                rel_path = os.path.relpath(filepath, base_dir).replace('\\', '/')
                encoded_path = rel_path.replace(' ', '%20').replace('+', '%2B')
                canonical_url = f"{domain}/{encoded_path}"

                content = re.sub(
                    r'<link rel="canonical" href="[^"]*">',
                    f'<link rel="canonical" href="{canonical_url}">',
                    content
                )

                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed: {file}")
                    count += 1

            except Exception as e:
                print(f"Error on {file}: {e}")

print(f"\nTotal files fixed: {count}")
