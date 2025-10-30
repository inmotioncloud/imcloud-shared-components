import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const { mkdir, readdir, stat, copyFile, rm, readlink, symlink } = fs;

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

const srcDir = join(dir, "..", "src", "assets");
const destDir = join(dir, "..", "dist", "assets");

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyDirectory(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const link = await readlink(srcPath);
      await symlink(link, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  if (!(await pathExists(srcDir))) {
    return;
  }

  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });
  await copyDirectory(srcDir, destDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
