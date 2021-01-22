![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/AppliedRecognition/Ver-ID-Image-Capture-JS?label=Latest%20release&sort=semver)

# Ver-ID Image Capture JS

The library captures images from mobile device cameras. On desktop browsers it displays a QR code with a link to use on mobiles.

## Installation

In your HTML file include:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/englishextra/qrjs2@0.1.7/js/qrjs2.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/AppliedRecognition/Ver-ID-Image-Capture-JS@2.3.1/dist/verIDImageCapture.min.js"></script>
```

## Usage example

```javascript
function scanIDCard() {
    VerIDImageCapture.captureImages(settings).then(function(images) {
        // The captured image data URLs are now in images.front and images.back
    }).catch(function(error) {
        if (error instanceof VerIDImageCapture.Cancellation) {
            // User cancelled the capture
            return
        }
        var message
        if (error instanceof VerIDImageCapture.UnsupportedDeviceError) {
            message = "Your device does not support adequate camera capture. Please scan the QR code with a mobile device."
        } else if (error instanceof VerIDImageCapture.UnsupportedBrowserError) {
            message = "Your browser does not support camera capture. Please use a different browser or scan the QR code with a mobile device."
        } else {
            alert("Capture failed: "+error.message)
            return
        }
        // The device or browser is not capable to take adequate images
        // Generate a QR code with the URL of the current page
        VerIDImageCapture.generateQRCode(location.href).then(function(qrCodeURL) {
            var img = document.createElement("img")
            img.src = qrCodeURL
            // Display the QR code
            document.body.appendChild(img)
            var text = document.createElement("p")
            text.innerText = message
            // Ask the user to use a mobile device
            document.body.appendChild(text)
        }).catch(function(error) {
            // TODO: Handle the error
        })
    })
}
```

## Building from source (optional)

Steps to build the library from source:

1. [Install NPM and Node JS](https://www.npmjs.com/get-npm)
2. Open the [build](./build) folder in a shell
3. Enter `npm install`
4. Enter `npm run-script build`
5. The minified version of the script will be available in [dist/verIDImageCapture.min.js](./dist/verIDImageCapture.min.js)