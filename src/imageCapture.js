export default function(useFrontCamera) {
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
        fileInput.setAttribute("capture", useFrontCamera ? "user" : "environment")
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
                setTimeout(function() {
                    resolve(dataURL)
                })
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