function createPixelArray(imgData, width, height, quality, areaToExclude) {
    const pixelCount = width * height;
    const pixels = imgData;
    const pixelArray = [];
    let xMin = 0;
    let xMax = 0;
    let yMin = 0;
    let yMax = 0;

    if (areaToExclude) {
        const [topLeft, bottomRight] = areaToExclude;
        [xMin, yMin] = topLeft;
        [xMax, yMax] = bottomRight;
    }

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        const x = i % width;
        const y = Math.floor(i / width);

        if (!(x >= xMin && x <= xMax && y >= yMin && y <= yMax)) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];

            // If pixel is mostly opaque and not white
            if (typeof a === 'undefined' || a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }
    }
    console.log('pixelArray.length',pixelArray.length);
    return pixelArray;
}

function validateOptions(options) {
    let { colorCount, quality, areaToExclude } = options;

    if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
        colorCount = 10;
    } else if (colorCount === 1 ) {
        throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
        colorCount = Math.max(colorCount, 2);
        colorCount = Math.min(colorCount, 20);
    }

    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
        quality = 10;
    }

    if (areaToExclude) {
        if (!Array.isArray(areaToExclude) || areaToExclude.length !== 2) {
            throw new Error('areaToExclude should be an array of 2 coordinates');
        }
        if (areaToExclude.some(coords => !Array.isArray(coords) || coords.length !== 2)) {
            throw new Error('areaToExclude must contain an array top-left and bottom-right coordinates');
        }
    }

    return {
        colorCount,
        quality,
        areaToExclude
    }
}

export default {
    createPixelArray,
    validateOptions
};
