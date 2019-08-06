const glob = require('glob-promise');
const fs = require('fs');
const path = require('path');
const storage = require('@google-cloud/storage')({
    projectId: 'srnd-www',
    keyFilename: '.google.json'
});
const bucketName = 'www.srnd.org';

console.log("Uploading files.");
(async () => {
    const files = await glob.promise('public/**/*');
    files.map((file) => {
        const fileName = file.substr('public/'.length);
        const ext = path.extname(file);

        if (fs.lstatSync(file).isDirectory()) return;
        if (ext === '.map') return;

        const isImage = ext === '.jpg' || ext === '.png' || ext === '.gif' || ext === '.bmp' || ext === '.webp' || ext === '.jpx' || ext === '.jp2';
        const isHtml = ext === '.html';

        try {
            storage
                .bucket(bucketName)
                .upload(file, {
                    destination: fileName,
                    gzip: !isImage,
                    acl: [{entity: 'allUsers', role: 'READER'}],
                    metadata: {
                        cacheControl: `public, max-age=${isHtml || fileName === 'chatra.js' ? (60*5) : (60*60*24*365)}, no-transform`
                    }
                });
        } catch (err) { console.error(err); }
    })
})();
