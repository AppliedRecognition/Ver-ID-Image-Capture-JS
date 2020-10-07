/**
 * Client-side library for capturing images from the device's camera
 */
VerIDCameraCapture = {
    /**
     * @member {function}
     * Generate a QR code using given text
     * @param {string} text 
     */
    "generateQRCode": function(text) {
        return new Promise((resolve, reject) => {
            function onScriptLoad() {
                if (scriptLoaded) {
                    return
                }
                scriptLoaded = true
                var src = QRCode.generatePNG(text, {
                    ecclevel: "M",
                    format: "html",
                    fillcolor: "#FFFFFF",
                    textcolor: "#000000",
                    margin: 4,
                    modulesize: 8
                });
                resolve(src)
            }
            var scriptLoaded = false
            var scriptSrc = "https://cdn.jsdelivr.net/gh/englishextra/qrjs2@0.1.7/js/qrjs2.min.js"
            var scripts = document.getElementsByTagName("script")
            for (var i=0; i<scripts.length; i++) {
                if (scripts[i].getAttribute("src") == scriptSrc) {
                    onScriptLoad()
                    return
                }
            }            
            var script = document.createElement("script")
            script.type = "text/javascript"
            script.src = scriptSrc
            script.onreadystatechange = onScriptLoad
            script.onload = onScriptLoad
            document.head.appendChild(script);
        })
    },
    /**
     * @member {function}
     * @returns `true` if image capture is supported on the current device and browser
     */
    "isCaptureSupported": function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return ("mediaDevices" in navigator) && check
    },
    /**
     * @member {function}
     * Capture image using the device's camera
     * @param {object} settings Settings
     * @param settings.useFrontCamera {boolean} `true` to use the back camera, `false` to use the front (selfie) camera (default is `true`)
     * @param settings.images {array} Array of the names of the images to scan. The array can contain one or more of the following strings: "front" (for the front of an ID card), "back" (for the back of an ID card), "passport" (to scan a passport page)
     * @param settings.prompts {object} Object whose keys correspond to the image names defined in `settings.images`.
     * @param settings.displayCardOutline {boolean} `true` to display an outline (template) of a ISO/IEC 7810 ID-1 card.
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
        return new Promise((resolve, reject) => {
            if (!this.isCaptureSupported()) {
                return reject(new Error("Incompatible device or browser"))
            }
            var cameraSettings = {
                "video": {
                    "width": { "ideal": 4096 },
                    "height": { "ideal": 4096 }
                },
                "audio": false
            }
            var constraints = navigator.mediaDevices.getSupportedConstraints()
            if (constraints.facingMode === true && settings && settings.hasOwnProperty("useFrontCamera")) {
                cameraSettings.video.facingMode = {
                    "exact": (settings.useFrontCamera ? "user" : "environment")
                }
            }
            navigator.mediaDevices.getUserMedia(cameraSettings).then(stream => {
                var elem = document.documentElement
                if (elem.requestFullscreen) {
                    elem.requestFullscreen()
                } else if (elem.mozRequestFullScreen) { /* Firefox */
                    elem.mozRequestFullScreen()
                } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    elem.webkitRequestFullscreen()
                } else if (elem.msRequestFullscreen) { /* IE/Edge */
                    elem.msRequestFullscreen()
                }
                var buttonColor = "#fff"

                var container = document.createElement("div")
                container.style.position = "fixed"
                container.style.left = "0px"
                container.style.top = "0px"
                container.style.width = "100%"
                container.style.height = "100%"
                container.style.zIndex = 255
                document.body.appendChild(container)

                var player = document.createElement("video")
                player.style.position = "absolute"
                player.style.left = "0px"
                player.style.top = "0px"
                player.style.width = "100%"
                player.style.height = "100%"
                player.style.backgroundColor = "#000"
                player.setAttribute("autoplay", "");
                player.setAttribute("muted", "");
                player.setAttribute("playsinline", "");
                container.appendChild(player)

                var images = {}
                var prompt

                if (settings && settings.images && Array.isArray(settings.images) && settings.images.length > 0) {
                    images = {}
                    settings.images.forEach(name => {
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
                    prompt = document.createElement("div")
                    prompt.style.position = "absolute"
                    prompt.style.top = "20px"
                    prompt.style.left = "20px"
                    prompt.style.right = "20px"
                    prompt.style.color = buttonColor
                    prompt.style.textAlign = "center"
                    prompt.style.fontFamily = "Helvetica,Arial,sans-serif"
                    prompt.innerText = getPrompt()
                    container.appendChild(prompt)
                }

                if (settings && settings.displayCardOutline) {
                    var outline = document.createElement("canvas")
                    var outlineContext = outline.getContext("2d")
                    outline.style.position = "absolute"
                    outline.style.left = "0px"
                    outline.style.top = "0px"
                    outline.style.right = "0px"
                    outline.style.bottom = "0px"
                    outline.style.margin = "auto"
                    // outline.style.border = "3px solid white"
                    // outline.style.borderRadius = "16px"
                    container.appendChild(outline)

                    function resizeCardOutline() {
                        document.body.onresize = resizeCardOutline
                        var videoAspectRatio = player.videoWidth/player.videoHeight
                        var viewAspectRatio = container.clientWidth/container.clientHeight
                        var videoDisplayWidth, videoDisplayHeight
                        var cardAspectRatio = 85.6/53.98
                        if (videoAspectRatio > viewAspectRatio) {
                            videoDisplayWidth = container.clientWidth
                            videoDisplayHeight = videoDisplayWidth / videoAspectRatio
                        } else {
                            videoDisplayHeight = container.clientHeight
                            videoDisplayWidth = videoDisplayHeight * videoAspectRatio
                        }
                        var cardWidth, cardHeight
                        if (cardAspectRatio > videoAspectRatio) {
                            cardWidth = videoDisplayWidth * 0.9
                            cardHeight = cardWidth / cardAspectRatio
                        } else {
                            cardHeight = videoDisplayHeight * 0.9
                            cardWidth = cardHeight * cardAspectRatio
                        }
                        outline.style.width = cardWidth+"px"
                        outline.style.height = cardHeight+"px"
                        outline.width = cardWidth
                        outline.height = cardHeight
                        var lineWidth = cardHeight / 50
                        var cornerDiameter = cardHeight / 12
                        var cornerSize = cardHeight / 4
                        outlineContext.shadowColor = "rgba(0,0,0,0.2)"
                        outlineContext.shadowBlur = lineWidth
                        outlineContext.strokeStyle = "#fff"
                        outlineContext.lineWidth = lineWidth
                        outlineContext.clearRect(0,0,cardWidth,cardHeight)
                        outlineContext.beginPath();
                        outlineContext.lineWidth = lineWidth
                        outlineContext.moveTo(lineWidth, cornerSize)
                        outlineContext.lineTo(lineWidth, cornerDiameter+lineWidth)
                        outlineContext.arcTo(lineWidth, lineWidth, cornerDiameter+lineWidth, lineWidth, cornerDiameter)
                        outlineContext.lineTo(cornerSize, lineWidth)
                        outlineContext.moveTo(cardWidth-cornerSize, lineWidth)
                        outlineContext.lineTo(cardWidth-cornerDiameter-lineWidth, lineWidth)
                        outlineContext.arcTo(cardWidth-lineWidth, lineWidth, cardWidth-lineWidth, cornerDiameter+lineWidth, cornerDiameter)
                        outlineContext.lineTo(cardWidth-lineWidth, cornerSize)
                        outlineContext.moveTo(cardWidth-lineWidth, cardHeight-cornerSize)
                        outlineContext.lineTo(cardWidth-lineWidth, cardHeight-cornerDiameter-lineWidth)
                        outlineContext.arcTo(cardWidth-lineWidth, cardHeight-lineWidth, cardWidth-cornerDiameter-lineWidth, cardHeight-lineWidth, cornerDiameter)
                        outlineContext.lineTo(cardWidth-cornerSize, cardHeight-lineWidth)
                        outlineContext.moveTo(cornerSize, cardHeight-lineWidth)
                        outlineContext.lineTo(cornerDiameter+lineWidth, cardHeight-lineWidth)
                        outlineContext.arcTo(lineWidth, cardHeight-lineWidth, lineWidth, cardHeight-cornerDiameter-lineWidth, cornerDiameter)
                        outlineContext.lineTo(lineWidth, cardHeight-cornerSize)
                        outlineContext.stroke()
                    }
                    player.onloadedmetadata = resizeCardOutline
                }

                player.srcObject = stream
                var buttonSize = 64;
                var shutterButton = document.createElement("canvas")
                shutterButton.width = buttonSize
                shutterButton.height = buttonSize
                shutterButton.style.position = "absolute"
                shutterButton.style.bottom = "20px"
                shutterButton.style.left = "20px"
                shutterButton.style.right = "20px"
                shutterButton.style.width = buttonSize+"px"
                shutterButton.style.height = buttonSize+"px"
                shutterButton.style.margin = "auto"
                shutterButton.style.cursor = "pointer"
                var buttonContext = shutterButton.getContext("2d")
                buttonContext.beginPath()
                buttonContext.arc(buttonSize/2, buttonSize/2, buttonSize/2 - 8, 0, 2*Math.PI)
                buttonContext.fillStyle = buttonColor
                buttonContext.fill()
                buttonContext.beginPath()
                buttonContext.arc(buttonSize/2, buttonSize/2, buttonSize/2 - 3, 0, 2*Math.PI)
                buttonContext.strokeStyle = buttonColor
                buttonContext.lineWidth = 3
                buttonContext.stroke()
                container.appendChild(shutterButton)

                function closeCameraPreview() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.mozCancelFullScreen) { /* Firefox */
                        document.mozCancelFullScreen()
                    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                        document.webkitExitFullscreen()
                    } else if (document.msExitFullscreen) { /* IE/Edge */
                        document.msExitFullscreen()
                    }
                    stream.getVideoTracks().forEach(track => {
                        track.stop()
                    })
                    shutterButton.onclick = null;
                    container.parentNode.removeChild(container)
                }

                shutterButton.onclick = () => {
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
                        setTimeout(() => {
                            resolve(images)
                        })
                    } else {
                        var flipImage = new Image()
                        flipImage.onload = () => {
                            var flipCardImage = document.createElement("img")
                            flipCardImage.src = flipImage.src
                            flipCardImage.style.position = "absolute"
                            flipCardImage.style.top = "0px"
                            flipCardImage.style.right = "0px"
                            flipCardImage.style.bottom = "0px"
                            flipCardImage.style.left = "0px"
                            flipCardImage.style.margin = "auto"
                            container.appendChild(flipCardImage)
                            setTimeout(() => {
                                flipCardImage.parentNode.removeChild(flipCardImage)
                            }, 700)
                        }
                        flipImage.src = "data:image/gif;base64,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"
                    }
                }
                var cancelButton = document.createElement("a")
                cancelButton.innerText = "Cancel"
                cancelButton.style.fontFamily = "Helvetica,Arial,sans-serif"
                cancelButton.style.color = buttonColor
                cancelButton.style.textDecoration = "none"
                cancelButton.style.cursor = "pointer"
                cancelButton.style.position = "absolute"
                cancelButton.style.bottom = "30px"
                cancelButton.style.left = "20px"
                container.appendChild(cancelButton)
                cancelButton.onclick = () => {
                    closeCameraPreview()
                    setTimeout(() => {
                        reject(new Error("Capture cancelled by user"))
                    })
                }                
            }).catch(error => {
                return reject(error)
            })
        })
    }
}