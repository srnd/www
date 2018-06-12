export const getSupportedImages = function(callback) {
    const WebP = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    const Jpx = 'data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAgAAAMC8BAABAAAAWgAAAMG8BAABAAAARgAAAAAAAAAkw91vA07+S7GFPXd2jckQV01QSE9UTwAZAMFxAAAAATAAoAAKAACgAAAQgCAIAAAEb/8AAQAAAQDCPwCAAAAAAAAAAAAAAAAAjkI/AIAAAAAAAAABIAA=';
    const Jp2 = 'data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAEBwEBBwEBBwEBBwEB/1IADAAAAAEAAAQEAAH/XAAEQED/ZAAlAAFDcmVhdGVkIGJ5IE9wZW5KUEVHIHZlcnNpb24gMi4wLjD/kAAKAAAAAABYAAH/UwAJAQAABAQAAf9dAAUBQED/UwAJAgAABAQAAf9dAAUCQED/UwAJAwAABAQAAf9dAAUDQED/k8+kEAGvz6QQAa/PpBABr994EAk//9k=';

    var supportsWebp = false;
    var supportsJpx = false;
    checkImage(WebP)
        .then((support) => {supportsWebp = support; return checkImage(Jpx);})
        .then((support) => {supportsJpx = support; return checkImage(Jp2);})
        .then((supportsJp2) => {
            const supports = [];
            if (supportsWebp) supports.push('webp');
            if (supportsJpx) supports.push('jpx');
            if (supportsJp2) supports.push('jp2');
            callback(supports);
        });
}

const checkImage = function(src) {
    return new Promise((resolve, reject) => {
        if (typeof(Image) === 'undefined') resolve(false);
        const test = new Image();
        test.onload = test.onerror = () => resolve(test.height ? true : false);
        test.src = src;
    });
}
