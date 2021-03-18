export default function(options) {
    return new Promise(function(resolve, reject) {
        function cleanup() {
            if (fileInput && fileInput.parentNode) {
                fileInput.parentNode.removeChild(fileInput)
            }
            fileInput = null
        }
        var fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.setAttribute("accept", "image/*")
        if (typeof options === "boolean") {
            var useFrontCamera = options
            fileInput.setAttribute("capture", useFrontCamera ? "user" : "environment")
        } else if (typeof options === "object" && typeof options.useFrontCamera === "boolean") {
            fileInput.setAttribute("capture", options.useFrontCamera ? "user" : "environment")
        } else {
            fileInput.setAttribute("capture", "environment")
        }
        fileInput.style.opacity = 0;
        fileInput.style.position = "absolute";
        fileInput.style.bottom = "-30px";
        fileInput.style.left = "0px";
        document.body.appendChild(fileInput)
        fileInput.onchange = function() {
            var fileReader = new FileReader()
            fileReader.onload = function(e) {
                var dataURL = e.target.result
                cleanup()
                if (typeof options === "object" && options.size && (options.size.width || options.size.height)) {
                    var canvas = document.createElement("canvas")
                    var context = canvas.getContext("2d", {"alpha": false, "desynchronized": true})
                    var image = new Image()
                    image.onerror = function() {
                        reject("Failed to load image")
                    }
                    image.onload = function() {
                        var x = 0, y = 0
                        var scaleX = 1, scaleY = 1
                        var width, height
                        if (options.size.width && options.size.height) {
                            if (options.scaling == "stretch") {
                                scaleX = options.size.width / image.width
                                scaleY = options.size.height / image.height
                            } else if (options.scaling == "fill") {
                                if (image.width / image.height > options.size.width / options.size.height) {
                                    scaleX = scaleY = options.size.height / image.height
                                } else {
                                    scaleX = scaleY = options.size.width / image.width
                                }
                            } else {
                                if (image.width / image.height > options.size.width / options.size.height) {
                                    scaleX = scaleY = options.size.width / image.width
                                } else {
                                    scaleX = scaleY = options.size.height / image.height
                                }
                            }
                        } else if (options.size.width) {
                            scaleX = scaleY = options.size.width / image.width
                        } else if (options.size.height) {
                            scaleX = scaleY = options.size.height / image.height
                        }
                        if (scaleX > 1) {
                            scaleY = 1 / scaleX * scaleY
                            scaleX = 1
                        }
                        if (scaleY > 1) {
                            scaleX = 1 / scaleY * scaleX
                            scaleY = 1
                        }
                        width = image.width * scaleX
                        height = image.height * scaleY
                        if (options.scaling == "fill" && options.size.width && options.size.height) {
                            x = options.size.width / 2 - width / 2
                            y = options.size.height / 2 - height / 2
                            canvas.width = width + x * 2
                            canvas.height = height + y * 2
                        } else {
                            canvas.width = width;
                            canvas.height = height;
                        }
                        context.drawImage(image, x, y, width, height)
                        dataURL = canvas.toDataURL("image/jpeg")
                        resolve(dataURL)
                    }
                    image.src = dataURL
                } else {
                    setTimeout(function() {
                        resolve(dataURL)
                    })
                }
            }
            fileReader.onerror = function(e) {
                cleanup()
                setTimeout(function() {
                    reject("Failed to read image")
                })
            }
            fileReader.readAsDataURL(this.files[0])
        }
        fileInput.click()
    })
}