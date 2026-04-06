#!/usr/bin/env python3
import os
import re

domain = "https://nbs-lns-ai.pages.dev"
base_dir = r"c:\Users\youni\OneDrive\Documents\GitHub\NBS"

# Emoji mappings - corrupted to correct
emoji_map = {
    'ðŸŒŸ': '🌟',
    'ðŸ–¨': '🖨',
    'ðŸ"š': '📚',
    'ðŸ"': '📋',
    'ðŸ¤': '🤖',
    'ðŸ¥': '🎥',
    'ðŸŽ¨': '🎨',
    "ðŸ'¡": '💡',
    'ðŸ§ ': '🧠',
    "ðŸ'„": '💻',
    'ðŸ"': '📖',
}

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content

            # Fix emojis
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
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    f.write(content)
                print(f"Fixed: {file}")

print("\nDone!")
