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
                        flipImage.src = "/images/card-flip.gif"
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