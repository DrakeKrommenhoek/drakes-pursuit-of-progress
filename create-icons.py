"""
Quick App Icon Generator for Drake's Pursuit of Progress
Creates simple app icons with an emoji or gradient background
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    has_pil = True
except ImportError:
    has_pil = False
    print("PIL not installed. Installing...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'Pillow'])
    from PIL import Image, ImageDraw, ImageFont

def create_gradient_icon(size, filename):
    """Create a simple gradient icon with emoji"""
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)

    # Create gradient effect
    for i in range(size):
        ratio = i / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        color = (r, g, b)
        draw.rectangle([(0, i), (size, i + 1)], fill=color)

    # Add emoji/text in center
    font_size = int(size * 0.5)
    text = "🎯"

    # Try to draw the emoji
    try:
        # Try different font options
        for font_name in ['seguiemj.ttf', 'AppleColorEmoji.ttc', 'NotoColorEmoji.ttf', 'arial.ttf']:
            try:
                font = ImageFont.truetype(font_name, font_size)
                break
            except:
                continue
        else:
            # Fallback to default font with text
            font = ImageFont.load_default()
            text = "P"  # Fallback to letter
    except:
        font = ImageFont.load_default()
        text = "P"

    # Center the text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2

    # Draw text with shadow for better visibility
    draw.text((x + 2, y + 2), text, fill=(0, 0, 0), font=font)
    draw.text((x, y), text, fill='white', font=font)

    img.save(filename)
    print(f"Created {filename} ({size}x{size})")

def create_simple_icon(size, filename):
    """Create a super simple solid color icon"""
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)

    # Draw a simple target/circle design
    center = size // 2
    max_radius = int(size * 0.4)

    # Draw concentric circles
    for i in range(3):
        radius = max_radius - (i * max_radius // 4)
        color = '#ffffff' if i % 2 == 0 else '#764ba2'
        draw.ellipse(
            [(center - radius, center - radius),
             (center + radius, center + radius)],
            fill=color,
            outline=None
        )

    img.save(filename)
    print(f"Created {filename} ({size}x{size})")

if __name__ == '__main__':
    print("Creating app icons for Drake's Pursuit of Progress...\n")

    print("Option 1: Gradient with emoji")
    print("Option 2: Simple target design")
    choice = input("Choose option (1 or 2, or press Enter for option 1): ").strip()

    if choice == '2':
        create_simple_icon(192, 'icon-192.png')
        create_simple_icon(512, 'icon-512.png')
    else:
        create_gradient_icon(192, 'icon-192.png')
        create_gradient_icon(512, 'icon-512.png')

    print("\nIcons created successfully!")
    print("\nNext steps:")
    print("1. Check the icons (icon-192.png and icon-512.png)")
    print("2. Deploy your app to Netlify, GitHub Pages, or Vercel")
    print("3. Open the URL on your phone")
    print("4. Add to home screen")
    print("\nSee PWA-INSTALL-GUIDE.md for detailed instructions!")
