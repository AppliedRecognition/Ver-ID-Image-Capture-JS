# Ver-ID Image Capture JS

The library captures images from mobile device cameras. On desktop browsers it displays a QR code with a link to use on mobiles.

## Installation

In your HTML file include:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/AppliedRecognition/Ver-ID-Image-Capture-JS@1.0.2/dist/verIDImageCapture.min.js" />
```

## Usage example

```javascript
function scanIDCard() {
    // Check that the device is capable of capturing adequate images
    if (VerIDImageCapture.isCaptureSupported()) {
        // To scan the front and back of an ID card
        var settings = {
            "images": ["front","back"],
            "prompts": {
                "front": "Scan the front of your ID card",
                "back": "Scan the back of your ID card"
            },
            "displayCardOutline": true
        }
        // Capture the images
        VerIDImageCapture.captureImages(settings).then(function(images) {
            var img = document.createElement("img")
            img.src = images.front
            // Display image of the front of the ID card
            document.body.appendChild(img)
        }).catch(function(error) {
            // TODO: Handle the error
        })
    } else {
        // Generate a QR code with the URL of the current page
        VerIDImageCapture.generateQRCode(location.href).then(function(qrCodeURL) {
            var img = document.createElement("img")
            img.src = qrCodeURL
            // Display the QR code
            document.body.appendChild(img)
            var text = document.createElement("p")
            text.innerText = "Please scan the QR code with your mobile device"
            // Ask the user to use a mobile device
            document.body.appendChild(text)
        }).catch(function(error) {
            // TODO: Handle the error
        })
    }
}
```