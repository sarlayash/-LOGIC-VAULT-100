# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

icons_dir = r"C:\Users\LC\.gemini\antigravity\scratch\kapil-logic-vault-100\icons"
os.makedirs(icons_dir, exist_ok=True)

def create_gold_icon(size, filename):
    img = Image.new("RGBA", (size, size), (10, 10, 14, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer gold border
    border_w = max(4, int(size * 0.04))
    draw.rectangle([border_w, border_w, size - border_w, size - border_w], outline=(212, 175, 55, 255), width=border_w)
    
    # Inner gold border
    inner_w = int(border_w * 0.5)
    margin = border_w * 2
    draw.rectangle([margin, margin, size - margin, size - margin], outline=(255, 215, 0, 180), width=inner_w)
    
    # Diamond / Vault geometric motif in center
    cx, cy = size // 2, size // 2
    rad = int(size * 0.28)
    points = [
        (cx, cy - rad),
        (cx + rad, cy),
        (cx, cy + rad),
        (cx - rad, cy)
    ]
    draw.polygon(points, outline=(255, 215, 0, 255), fill=(25, 22, 12, 220), width=max(2, int(size * 0.025)))
    
    # Inner K symbol representation
    kw = max(3, int(size * 0.035))
    # Vertical line of K
    draw.line([cx - rad//2, cy - rad//2, cx - rad//2, cy + rad//2], fill=(255, 223, 100, 255), width=kw)
    # Upper diagonal of K
    draw.line([cx - rad//2, cy, cx + rad//3, cy - rad//2], fill=(255, 223, 100, 255), width=kw)
    # Lower diagonal of K
    draw.line([cx - rad//2, cy, cx + rad//3, cy + rad//2], fill=(255, 223, 100, 255), width=kw)
    
    img.save(os.path.join(icons_dir, filename), "PNG")
    print(f"Created {filename} ({size}x{size})")

create_gold_icon(192, "icon-192.png")
create_gold_icon(512, "icon-512.png")
create_gold_icon(64, "favicon.png")
