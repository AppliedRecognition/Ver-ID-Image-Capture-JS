export default function(text) {
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
}