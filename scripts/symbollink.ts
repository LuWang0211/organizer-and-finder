import { exec, spawn } from "node:child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const target = path.resolve(__dirname, "..", "public", "assets");

function createLinkWindows() {
  const source = path.resolve(__dirname, "..", "phaser", "assets");

  spawn("cmd", ["/c", `mklink /J ${target} ${source}`], {
    stdio: "inherit",
  });
}

function createLinkLinux() {
  const source = path.resolve(__dirname, "..", "phaser", "assets");

  exec(`ln -s ${source} ${target}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function detectOS() {
  switch (process.platform) {
    case "win32":
      return "windows";
    case "linux":
      return "linux";
    default:
      return "unsupported";
  }
}

function main() {
  // Check if file target exists
  try {
    const stats = fs.statSync(target);
    if (stats.isDirectory()) {
      console.log("Symbolic link already exists. Skipping");
      return;
    }
  } catch (error) {
    // Do nothing
  }

  const os = detectOS();
  if (os === "windows") {
    createLinkWindows();
  } else if (os === "linux") {
    createLinkLinux();
  } else {
    console.error("Unsupported OS");
  }
}

main();
