![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/AppliedRecognition/Ver-ID-Image-Capture-JS?label=Latest%20release&sort=semver)

# Ver-ID Image Capture JS

The library captures images from mobile device cameras. On desktop browsers it displays a QR code with a link to use on mobiles.

## Installation

In your HTML file include:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/englishextra/qrjs2@0.1.7/js/qrjs2.min.js"></script>
```

## Usage example

```javascript
// Import capture function
import captureImage from "https://cdn.jsdelivr.net/gh/AppliedRecognition/Ver-ID-Image-Capture-JS@3.0.0/dist/imageCapture.min.js"

// Create a button
var button = document.createElement("a")
button.href = "javascript:void(0)"
// Attach a click listener
button.onclick = function() {
    // Capture the image
    captureImage().then(function(imageDataURL) {
        // Display the captured image
        var img = document.createElement("img")
        img.src = imageDataURL
        document.body.appendChild(img)
    }).catch(function(error) {
        alert("Capture failed")
    })
}
button.innerText = "Capture image"
document.body.appendChild(button)

// Import QR code generator function
import generateQRCode from "https://cdn.jsdelivr.net/gh/AppliedRecognition/Ver-ID-Image-Capture-JS@3.0.0/dist/qtCodeGenerator.min.js"

// Generate a QR code with the page URL to direct the user to an alternative device
generateQRCode(location.href).then(function(qrCode) {
    // Display the QR code in an image
    var img = document.createElement("img")
    img.src = qrCode
    document.body.appendChild(img)
}).catch()
```

## Demo
[Browser demo](https://appliedrecognition.github.io/Ver-ID-Image-Capture-JS/sample.html)

## Building from source (optional)

Steps to build the library from source:

1. [Install NPM and Node JS](https://www.npmjs.com/get-npm)
2. Open the [build](./build) folder in a shell
3. Enter `npm install`
4. Enter `npm run-script build`
5. The minified version of the scripts will be available in the [dist/](./dist/) directory