#!/usr/bin/env python3
import os
import re

domain = "https://nbs-lns-ai.pages.dev"
base_dir = r"c:\Users\youni\OneDrive\Documents\GitHub\NBS"

# Emoji mappings using Unicode escapes to avoid corruption
emoji_map = [
    (b'\xc3\xb0\xc2\x9f\xc2\x9a\xc2\x80', '🚀'),  # ðŸš€ → 🚀
    (b'\xc3\xb0\xc2\x9f\xc2\x93\xc2\x9a', '📚'),  # ðŸ"š → 📚
    (b'\xc3\xb0\xc2\x9f\xc2\x93\xc2\x8a', '📊'),  # ðŸ"Š → 📊
    (b'\xc3\xb0\xc2\x9f\xc2\xa7\xc2\xa0', '🧠'),  # ðŸ§  → 🧠
]

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)

            try:
                # Read as bytes to handle bad encoding
                with open(filepath, 'rb') as f:
                    content = f.read()

                original = content

                # Fix byte sequences
                for corrupted_bytes, correct_emoji in emoji_map:
                    content = content.replace(corrupted_bytes, correct_emoji.encode('utf-8'))

                # Convert to string for more replacements
                content_str = content.decode('utf-8', errors='replace')

                # Update canonical tag
                rel_path = os.path.relpath(filepath, base_dir).replace('\\', '/')
                encoded_path = rel_path.replace(' ', '%20').replace('+', '%2B')
                canonical_url = f"{domain}/{encoded_path}"

                content_str = re.sub(
                    r'<link rel="canonical" href="[^"]*">',
                    f'<link rel="canonical" href="{canonical_url}">',
                    content_str
                )

                content = content_str.encode('utf-8')

                if content != original:
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    print(f"Fixed: {file}")

            except Exception as e:
                print(f"Error on {file}: {e}")

print("\nDone!")
