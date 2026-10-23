const fsp = require("node:fs/promises");
const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");

function toPath(p) {
  if (p instanceof URL || (typeof p === "string" && p.startsWith("file:"))) {
    return fileURLToPath(p);
  }
  return typeof p === "string" ? p : String(p);
}

if (process.platform === "win32") {
  const originalFspSymlink = fsp.symlink;
  const originalFsSymlink = fs.symlink;
  const originalFsSymlinkSync = fs.symlinkSync;

  fsp.symlink = async function (target, dest, type) {
    try {
      return await originalFspSymlink.call(this, target, dest, type);
    } catch (err) {
      if (err.code === "EPERM") {
        const destPath = toPath(dest);
        const targetStr = typeof target === "string" ? target : toPath(target);
        const absTarget = path.isAbsolute(targetStr) ? targetStr : path.resolve(path.dirname(destPath), targetStr);

        const isDir = type === "dir" || type === "junction" || fs.statSync(absTarget, { throwIfNoEntry: false })?.isDirectory();
        if (isDir) {
          try {
            return await originalFspSymlink.call(this, absTarget, destPath, "junction");
          } catch {
            return await fsp.cp(absTarget, destPath, { recursive: true });
          }
        }
        return await fsp.copyFile(absTarget, destPath);
      }
      throw err;
    }
  };

  fs.symlinkSync = function (target, dest, type) {
    try {
      return originalFsSymlinkSync.call(this, target, dest, type);
    } catch (err) {
      if (err.code === "EPERM") {
        const destPath = toPath(dest);
        const targetStr = typeof target === "string" ? target : toPath(target);
        const absTarget = path.isAbsolute(targetStr) ? targetStr : path.resolve(path.dirname(destPath), targetStr);

        const isDir = type === "dir" || type === "junction" || fs.statSync(absTarget, { throwIfNoEntry: false })?.isDirectory();
        if (isDir) {
          try {
            return originalFsSymlinkSync.call(this, absTarget, destPath, "junction");
          } catch {
            return fs.cpSync(absTarget, destPath, { recursive: true });
          }
        }
        return fs.copyFileSync(absTarget, destPath);
      }
      throw err;
    }
  };

  fs.symlink = function (target, dest, type, cb) {
    if (typeof type === "function") {
      cb = type;
      type = undefined;
    }
    fsp.symlink(target, dest, type)
      .then(() => cb && cb(null))
      .catch((err) => cb && cb(err));
  };
}

