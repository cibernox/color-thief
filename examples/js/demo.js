import ColorThief from '../../src/color-thief.js';

var colorThief = new ColorThief();

var images = [
    'image-1.jpg',
    'image-1.jpg',
    'image-2.jpg',
    'image-2.jpg',
    'image-3.jpg',
    'image-3.jpg',
];

// Render example images
var examplesHTML = Mustache.to_html(document.getElementById('image-tpl').innerHTML, images.map((image, index) => ({ image, type: index % 2 === 1 ? 'Only edges' : 'All image' })));
document.getElementById('example-images').innerHTML = examplesHTML;

// Once images are loaded, process them
document.querySelectorAll('.image').forEach((image, index) => {
    const section = image.closest('.image-section');
    if (image.complete) {
        showColorsForImage(image, section, index % 2 === 1);
    } else {
        image.addEventListener('load', function() {
            showColorsForImage(image, section, index % 2 === 1);
        });
    }
})

// Run Color Thief functions and display results below image.
// We also log execution time of functions for display.
const showColorsForImage = function(image, section, excludeCenter) {
    let start = Date.now();

    let {width, height} = image;
    let areaToExclude = excludeCenter ? [
        [width * 0.05, height * 0.05], // top left
        [width * 0.95, height * 0.95]  // bottom right
    ] : undefined;
    // 🎨🔓
    let result = colorThief.getColor(image, { areaToExclude });

    let elapsedTime = Date.now() - start;
    const colorHTML = Mustache.to_html(document.getElementById('color-tpl').innerHTML, {
        color: result,
        colorStr: result.toString(),
        elapsedTime
    })

    // getPalette(img)
    let paletteHTML = '';
    let colorCounts = [3, 9];
    colorCounts.forEach((count) => {
        let start = Date.now();

        // 🎨🔓
        let result = colorThief.getPalette(image, count);

        let elapsedTime = Date.now() - start;
        paletteHTML += Mustache.to_html(document.getElementById('palette-tpl').innerHTML, {
            count,
            palette: result,
            paletteStr: result.toString(),
            elapsedTime
        })
    });

    const outputEl = section.querySelector('.output');
    outputEl.innerHTML += colorHTML + paletteHTML;
};
