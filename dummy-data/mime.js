var signatures = {
    R0lGODdh: "image/gif",
    iVBORw0KGgo: "image/png",
    "/9j/": "image/jpg",
    "data": ""
};

export default function Mime(b64) {
    if(typeof b64 === "undefined" || !b64 || b64==="null") return;
    let mime;
    for (var s in signatures) {
        if (b64.indexOf(s) == 0) {
            mime= signatures[s];
        }
    }
    const imgSrc = `data:${mime};base64,${b64}`
    return imgSrc
}