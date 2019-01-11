
const fs = require('fs-extra');
const path = require('path');
const ignore = require('ignore');

function getRelativePath(targetPath, startPath) {
    return targetPath.substring(startPath.length + 1).replace(/\\/g, '/');
}
function testIgnore(ig, targetPath) {
    if (!targetPath.length) {
        return false;
    }
    return ig.ignores(targetPath);
}

async function getTargetFiles(ig, currentPath, startPath, isDirectory = true, outDirectory) {
    const relativePath = getRelativePath(currentPath, startPath)
    if (testIgnore(ig, relativePath)) {
        return [];
    }
    if (!isDirectory) {
        return relativePath;
    }
    const dir = await fs.readdir(currentPath);

    const files = await Promise.all(dir.map(async (node) => {
        const nodePath = path.join(currentPath, node);
        const stat = await fs.stat(nodePath);
        const isNodeDirectory = stat.isDirectory();
        return getTargetFiles(ig, nodePath, startPath, isNodeDirectory, outDirectory);
    }));
    return files.reduce((acc, val) => acc.concat(val),
        outDirectory && relativePath.length ? [`${relativePath}/`] : []);
}

async function lsWithIgnore(startPath, blackList = [], whiteList = [], outDirectory = false) {
    // const ignoreList = blackList.filter((blackWord) => whiteList.every(whiteWord => blackWord !== whiteWord));
    const ignoreList = [
        ...blackList,
        ...whiteList.map(white => `!${white}`),
    ];

    const ig = ignore().add(ignoreList);

    return await getTargetFiles(ig, startPath, startPath, true, outDirectory);
}

module.exports = lsWithIgnore;
