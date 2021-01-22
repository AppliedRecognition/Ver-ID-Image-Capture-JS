/**
 * Client-side library for capturing images from the device's camera
 */
(function(){
    var html = '[[ui]]'
    var css = "[[style]]"
    window.VerIDImageCapture = {
        "UnsupportedDeviceError": function() {
            this.name = "UnsupportedDeviceError"
            this.message = "Unsupported device"
        },
        "UnsupportedBrowserError": function() {
            this.name = "UnsupportedBrowserError"
            this.message = "Unsupported browser"
        },
        "Cancellation": function() {
            this.name = "Cancellation"
            this.message = "Capture cancelled by user"
        },
        "PermissionDenied": function() {
            this.name = "PermissionDenied"
            this.message = "Camera permission denied by user"
        },
        /**
         * @member {function}
         * Generate a QR code using given text
         * @param {string} text 
         */
        "generateQRCode": function(text) {
            return new Promise(function(resolve, reject) {
                var src = QRCode.generatePNG(text, {
                    ecclevel: "M",
                    format: "html",
                    fillcolor: "#FFFFFF",
                    textcolor: "#000000",
                    margin: 4,
                    modulesize: 8
                });
                resolve(src)
            })
        },
        /**
         * @member {function}
         * Capture image using the device's camera
         * @param {object} settings Settings
         * @param settings.useFrontCamera {boolean} `true` to use the back camera, `false` to use the front (selfie) camera (default is `true`)
         * @param settings.images {array} Array of the names of the images to scan. The array can contain one or more of the following strings: "front" (for the front of an ID card), "back" (for the back of an ID card), "passport" (to scan a passport page)
         * @param settings.prompts {object} Object whose keys correspond to the image names defined in `settings.images`.
         * @param settings.displayCardOutline {boolean} `true` to display an outline (template) of a ISO/IEC 7810 ID-1 card.
         * @param settings.startDelay {number} Delay the capture by the given number of seconds. The preview will display a countdown.
         * @param settings.minImageWidth {number} Minimum required width of the captured image (in pixels).
         * @example // Scan the front and back of an ID card:
         * captureImages({
         *      "images": ["front","back"],
         *      "prompts": {
         *          "front": "Please photograph the front of your ID card",
         *          "back": "Please photograph the back of your ID card"
         *      },
         *      "displayCardOutline": true
         * }).then(images => {
         *      // The images object contains keys corresponding to the image names in the settings.images array, e.g. {"front":"data:image/jpeg;base64,xyz="}
         *      // The values are data URLs containing the images.
         * }).catch(error => {
         *      // Handle the error
         * })
         */
        "captureImages": function(settings) {
            return new Promise(function(resolve, reject) {
                if (!navigator.mediaDevices) {
                    return reject(new VerIDImageCapture.UnsupportedBrowserError())
                }
                var cameraSettings = {
                    "video": true,
                    "audio": false
                }
                var constraints = navigator.mediaDevices.getSupportedConstraints()
                if (constraints.width === true) {
                    if (settings && settings.minImageWidth) {
                        cameraSettings.video = {"width":{"min":settings.minImageWidth}}
                    }
                } else {
                    return reject(new VerIDImageCapture.UnsupportedBrowserError())
                }
                if (constraints.facingMode === true) {
                    if (cameraSettings.video === true) {
                        cameraSettings.video = {}
                    }
                    cameraSettings.video.facingMode = {
                        "exact": (settings.useFrontCamera ? "user" : "environment")
                    }
                }
                var resizeCallbacks = []
                if (window.onresize) {
                    resizeCallbacks.push(window.onresize)
                }
                window.onresize = function(event) {
                    for (var i=0; i<resizeCallbacks.length; i++) {
                        resizeCallbacks[i](event)
                    }
                }
                navigator.mediaDevices.getUserMedia(cameraSettings).then(function(stream) {

                    var originalNodes = []
                    for (var i=0; i<document.body.childNodes.length; i++) {
                        var node = document.body.childNodes.item(i)
                        if (node.style) {
                            originalNodes.push({"node":node,"display":node.style.display})
                            node.style.display = "none"
                        }
                    }

                    var style = document.createElement("style")
                    style.innerHTML = css
                    document.head.appendChild(style)

                    var container = document.createElement("div")
                    container.setAttribute("id","veridCameraPreview")
                    container.innerHTML = html
                    document.body.appendChild(container)

                    var player = document.querySelector("#veridCameraPreview .videoPlayerContainer video")
                    var prompt = document.querySelector("#veridCameraPreview .prompt")
                    var outline = document.querySelector("#veridCameraPreview .cardOutline")
                    var shutterButton = document.querySelector("#veridCameraPreview .shutterButton")
                    var cancelButton = document.querySelector("#veridCameraPreview .cancelButton")
                    var countdownDiv
                    shutterButton.style.display = "flex"

                    var images = {}

                    if (settings && settings.images && Array.isArray(settings.images) && settings.images.length > 0) {
                        images = {}
                        settings.images.forEach(function(name) {
                            images[name] = null
                        })
                    } else {
                        if (!settings) {
                            settings = {}
                        }
                        settings.images = ["front","back"]
                        images = {
                            "front": null,
                            "back": null
                        }
                    }

                    var currentImage = 0
                    var countdownInterval

                    function imageName() {
                        if (currentImage < settings.images.length) {
                            return settings.images[currentImage]
                        } else {
                            return null
                        }
                    }

                    function getPrompt() {
                        var image = imageName()
                        if (image == null) {
                            return null
                        }
                        if (settings && settings.prompts && typeof(settings.prompts) == "object" && settings.prompts.hasOwnProperty(image)) {
                            return settings.prompts[image]
                        }
                        return null
                    }

                    if (getPrompt()) {
                        prompt.innerText = getPrompt()
                        prompt.style.display = "block"
                    } else {
                        prompt.style.display = "none"
                    }

                    if (settings && settings.displayCardOutline) {
                        outline.style.display = "block"
                    } else {
                        outline.style.display = "none"
                    }
                    if ('srcObject' in player) {
                        player.srcObject = stream
                    } else {
                        player.src = URL.createObjectURL(stream)
                    }

                    function closeCameraPreview() {
                        stream.getVideoTracks().forEach(function(track) {
                            track.stop()
                        })
                        shutterButton.onclick = null;
                        for (var i=0; i<originalNodes.length; i++) {
                            originalNodes[i].node.style.display = originalNodes[i].display
                        }
                        style.parentNode.removeChild(style)
                        container.parentNode.removeChild(container)
                    }

                    function removeCountdownView() {
                        if (countdownDiv && countdownDiv.parentNode) {
                            countdownDiv.parentNode.removeChild(countdownDiv)
                        }
                        countdownDiv = null
                    }

                    shutterButton.onclick = function() {
                        shutterButton.style.display = "none"
                        function captureImage() {
                            removeCountdownView()
                            clearInterval(countdownInterval)
                            var canvas = document.createElement("canvas")
                            canvas.width = player.videoWidth
                            canvas.height = player.videoHeight
                            var context = canvas.getContext("2d")
                            context.drawImage(player, 0, 0, player.videoWidth, player.videoHeight)
                            var dataUrl = canvas.toDataURL("image/jpeg")
                            var image = imageName()
                            if (image && !images[image]) {
                                images[image] = dataUrl
                            }
                            currentImage ++
                            if (prompt && getPrompt()) {
                                prompt.innerText = getPrompt()
                            }
                            if (!Object.values(images).includes(null)) {
                                closeCameraPreview()
                                setTimeout(function() {
                                    resolve(images)
                                }, 1)
                            } else {
                                shutterButton.style.display = "flex"
                                var flipAnimationContainer = document.createElement("div")
                                flipAnimationContainer.className = "flipAnimation"

                                var flipAnimation = document.createElement("div")
                                flipAnimation.className = "card"

                                flipAnimationContainer.appendChild(flipAnimation)
                                container.insertBefore(flipAnimationContainer, shutterButton)
                                setTimeout(function() {
                                    flipAnimation.classList.add("flipped")
                                }, 10)
                                setTimeout(function() {
                                    container.removeChild(flipAnimationContainer)
                                }, 2500)
                            }
                        }
                        if (settings.startDelay && typeof(settings.startDelay) === "number") {
                            var elapsed = 0
                            var total = Math.round(settings.startDelay)
                            function count() {
                                if (elapsed >= total) {
                                    captureImage()
                                } else {
                                    countdownDiv = document.createElement("div")
                                    countdownDiv.className = "countdown"
                                    countdownDiv.innerText = (total - elapsed)+""
                                    countdownDiv.addEventListener("animationend", removeCountdownView, false)
                                    container.appendChild(countdownDiv)
                                }
                                elapsed ++
                            }
                            count()
                            countdownInterval = setInterval(count, 1000)
                        } else {
                            captureImage()
                        }
                    }
                    cancelButton.onclick = function() {
                        removeCountdownView()
                        clearInterval(countdownInterval)
                        closeCameraPreview()
                        setTimeout(function() {
                            reject(new VerIDImageCapture.Cancellation())
                        }, 1)
                    }                
                }).catch(function(error) {
                    if (error instanceof OverconstrainedError) {
                        if (error.constraint == "width" && settings.minImageWidth) {
                            delete settings.minImageWidth
                            VerIDImageCapture.captureImages(settings).then(resolve).catch(reject)
                            return
                        }
                        error = new VerIDImageCapture.UnsupportedDeviceError()
                    } else if (error && error.name == "NotAllowedError") {
                        error = new VerIDImageCapture.PermissionDenied()
                    }
                    return reject(error)
                })
            })
        }
    }
})()