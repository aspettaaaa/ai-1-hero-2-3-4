from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math
import random

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

resume_png = Path(r"C:\Users\zhang\Desktop\简历\简历2026\张子薇-视觉设计.png")


def load_font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for item in candidates:
        path = Path(item)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def make_portrait():
    src = Image.open(resume_png).convert("RGBA")
    # Crop the portrait area from the resume and remove the white resume background.
    crop = src.crop((1860, 34, 2260, 390))
    pixels = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = pixels[x, y]
            if r > 236 and g > 236 and b > 236:
                pixels[x, y] = (255, 255, 255, 0)
    canvas = Image.new("RGBA", (760, 900), (0, 0, 0, 0))
    portrait = crop.resize((640, 570), Image.Resampling.LANCZOS)
    canvas.alpha_composite(portrait, (62, 146))
    canvas.save(ASSETS / "portrait.png")


def make_hero_poster():
    width, height = 1920, 1080
    img = Image.new("RGB", (width, height), (5, 7, 10))
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(height):
        t = y / height
        draw.line(
            (0, y, width, y),
            fill=(
                int(5 * (1 - t) + 2 * t),
                int(7 * (1 - t) + 4 * t),
                int(10 * (1 - t) + 8 * t),
                255,
            ),
        )
    img = Image.alpha_composite(
        img.convert("RGBA"),
        glow_layer(
            (width, height),
            [(1460, 380, 520, 92), (1020, 760, 360, 68), (450, 220, 300, 45)],
            (242, 223, 68),
        ),
    )
    draw = ImageDraw.Draw(img, "RGBA")
    for x in range(-width, int(width * 1.5), 74):
        draw.line((x, 0, x + 520, height), fill=(242, 223, 68, 34), width=1)
    for y in range(80, height, 86):
        draw.line((0, y, width, y), fill=(255, 255, 255, 16), width=1)
    for i in range(7):
        y = 270 + i * 72
        x = 640 + math.cos(i) * 180
        draw.arc((x - 360, y - 180, x + 540, y + 220), 188, 350, fill=(242, 223, 68, 92), width=4)
    img.convert("RGB").save(ASSETS / "hero-poster.png", quality=94)


def glow_layer(size, points, color):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for point in points:
        x, y, radius, alpha = point
        draw.ellipse(
            (x - radius, y - radius, x + radius, y + radius),
            fill=(*color, alpha),
        )
    return layer.filter(ImageFilter.GaussianBlur(38))


def project_image(filename, title, subtitle, palette, motif):
    width, height = 1500, 1000
    img = Image.new("RGB", (width, height), palette["bg"])
    draw = ImageDraw.Draw(img, "RGBA")

    for y in range(height):
        t = y / height
        r = int(palette["bg"][0] * (1 - t) + palette["deep"][0] * t)
        g = int(palette["bg"][1] * (1 - t) + palette["deep"][1] * t)
        b = int(palette["bg"][2] * (1 - t) + palette["deep"][2] * t)
        draw.line((0, y, width, y), fill=(r, g, b, 255))

    random.seed(filename)
    glows = [
        (random.randint(120, width - 120), random.randint(100, height - 100), random.randint(120, 260), 90)
        for _ in range(5)
    ]
    img = Image.alpha_composite(
        img.convert("RGBA"),
        glow_layer((width, height), glows, palette["accent"]),
    )
    draw = ImageDraw.Draw(img, "RGBA")

    for x in range(-200, width + 200, 70):
      draw.line((x, 0, x + 520, height), fill=(255, 255, 255, 16), width=1)
    for y in range(80, height, 82):
      draw.line((0, y, width, y), fill=(255, 255, 255, 13), width=1)

    if motif == "robot":
        for i in range(9):
            cx = 760 + math.cos(i * 0.7) * (210 + i * 8)
            cy = 480 + math.sin(i * 0.7) * (130 + i * 4)
            draw.rounded_rectangle((cx - 92, cy - 48, cx + 92, cy + 48), radius=18, outline=(*palette["accent"], 120), width=3)
            draw.line((760, 480, cx, cy), fill=(*palette["accent"], 70), width=2)
        draw.rounded_rectangle((560, 320, 960, 650), radius=48, fill=(255, 255, 255, 18), outline=(*palette["accent"], 150), width=3)
        draw.ellipse((640, 420, 700, 480), fill=(*palette["accent"], 180))
        draw.ellipse((820, 420, 880, 480), fill=(*palette["accent2"], 180))
    elif motif == "culture":
        for i in range(16):
            y = 200 + i * 38
            draw.arc((220 - i * 8, y - 160, 1270 + i * 10, y + 360), 190, 350, fill=(*palette["accent"], 70), width=3)
        draw.polygon([(940, 180), (1290, 720), (690, 720)], fill=(*palette["accent2"], 46))
        draw.rectangle((180, 700, 1320, 750), fill=(*palette["accent"], 80))
    else:
        for i in range(12):
            x = 210 + i * 92
            h = 160 + (i % 4) * 70
            draw.rounded_rectangle((x, 690 - h, x + 54, 690), radius=14, fill=(*palette["accent"], 52), outline=(255, 255, 255, 38), width=1)
        draw.rounded_rectangle((225, 185, 1180, 460), radius=34, fill=(255, 255, 255, 24), outline=(*palette["accent"], 110), width=2)
        draw.line((300, 350, 1100, 350), fill=(*palette["accent2"], 130), width=8)

    title_font = load_font(64, True)
    sub_font = load_font(28)
    draw.text((78, 724), title, font=title_font, fill=(245, 250, 252, 238))
    draw.text((82, 815), subtitle, font=sub_font, fill=(214, 230, 236, 176))
    draw.line((82, 890, 620, 890), fill=(*palette["accent"], 150), width=3)
    img.convert("RGB").save(ASSETS / filename, quality=94)


def make_project_images():
    project_image(
        "project-robot-brand.png",
        "零次方机器人品牌视觉体系",
        "VI / IP / DIGITAL ASSET",
        {
            "bg": (7, 12, 17),
            "deep": (2, 4, 8),
            "accent": (242, 223, 68),
            "accent2": (219, 214, 188),
        },
        "robot",
    )
    project_image(
        "project-cultural-ip.png",
        "安口窑文创设计项目",
        "CERAMIC / CULTURE / PRODUCT",
        {
            "bg": (9, 11, 15),
            "deep": (3, 4, 7),
            "accent": (242, 223, 68),
            "accent2": (214, 214, 214),
        },
        "culture",
    )
    project_image(
        "project-recruitment-campaign.png",
        "雇主品牌传播视觉",
        "CAMPAIGN / H5 / OPERATION",
        {
            "bg": (7, 10, 16),
            "deep": (3, 6, 10),
            "accent": (242, 223, 68),
            "accent2": (205, 205, 205),
        },
        "campaign",
    )
    project_image(
        "project-illustration.png",
        "系列插画创作",
        "ILLUSTRATION / STORYTELLING",
        {
            "bg": (8, 9, 15),
            "deep": (3, 4, 8),
            "accent": (242, 223, 68),
            "accent2": (196, 175, 84),
        },
        "campaign",
    )
    project_image(
        "project-studio.png",
        "个人工作室设计项目",
        "STUDIO / AI / VISUAL LAB",
        {
            "bg": (6, 10, 12),
            "deep": (2, 4, 6),
            "accent": (242, 223, 68),
            "accent2": (207, 194, 120),
        },
        "robot",
    )


if __name__ == "__main__":
    make_portrait()
    make_hero_poster()
    make_project_images()
