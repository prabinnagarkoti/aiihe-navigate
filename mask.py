from PIL import Image
import sys

def make_transparent(img_path):
    # Open the image and convert to RGBA
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Loop through all pixels.
    # If the pixel is very bright (close to white), make it fully transparent.
    for item in datas:
        # item is (R, G, B, A)
        # Threshold: if R, G, B are all > 235, it's basically the white paper background
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            # Optionally darken the lines slightly if they are faded
            newData.append(item)

    img.putdata(newData)
    img.save(img_path, "PNG")
    print("Masking complete. Background is pure transparent.")

if __name__ == "__main__":
    make_transparent("public/campus_floorplan.png")
