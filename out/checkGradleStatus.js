"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const utilities_1 = require("./utilities");
function getPluginRegex() {
    return /(id\s*?[\"|\'])(.+?)(\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
function getGradleRioVMXRegex() {
    return /(id\s*?[\"|\']com\.kauailabs\.wsr\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
function getGradleRioRegex() {
    return /(id\s*?[\"|\']edu\.wpi\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
//Each line check reports a 0, 1, or 2. 0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let disposable = vscode.commands.registerCommand('vmxpi-wsr.checkGradleStatus', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const buildGradlePath = (vscode.workspace.rootPath + '/build.gradle');
                const buildGradleFile = yield utilities_1.readFileAsync(buildGradlePath, 'utf8');
                var pluginLine = checkPluginLine(buildGradleFile);
                var targetsLine = checkTargetsLine(buildGradleFile);
                if (buildGradleFile.includes('id \"cpp\"')) {
                    var platformsLine = checkPlatformsLine(buildGradleFile, true);
                    var artifactsLine = checkArtifactsLine(buildGradleFile);
                    if ((pluginLine + targetsLine + platformsLine) === 3) {
                        if (artifactsLine === "cpp") {
                            vscode.window.showInformationMessage("Project configured for VMX-Pi C++ usage");
                        }
                    }
                    else if ((pluginLine + targetsLine + platformsLine) === 6) {
                        if (artifactsLine === "cpp") {
                            vscode.window.showInformationMessage("Project configured for RoboRIO C++ usage");
                        }
                    }
                    else {
                        vscode.window.showErrorMessage("Project is not properly configured for either RoboRIO or VMX-Pi usage");
                    }
                    if (artifactsLine !== "cpp") {
                        vscode.window.showErrorMessage("Project language is not properly configured");
                    }
                }
                else if (buildGradleFile.includes('id \"java\"')) {
                    var platformsLine = checkPlatformsLine(buildGradleFile, false);
                    var artifactsLine = checkArtifactsLine(buildGradleFile);
                    if ((pluginLine + targetsLine + platformsLine) === 3) {
                        if (artifactsLine === "java") {
                            vscode.window.showInformationMessage("Project configured for VMX-Pi Java usage");
                        }
                    }
                    else if ((pluginLine + targetsLine + platformsLine) === 6) {
                        if (artifactsLine === "java") {
                            vscode.window.showInformationMessage("Project configured for RoboRIO Java usage");
                        }
                    }
                    else {
                        vscode.window.showErrorMessage("Project is not properly configured for either RoboRIO or VMX-Pi usage");
                    }
                    if (artifactsLine !== "java") {
                        vscode.window.showErrorMessage("Project language is not properly configured");
                    }
                }
                else {
                    vscode.window.showErrorMessage("Project language is not properly configured");
                }
            }
            catch (err) {
                vscode.window.showErrorMessage('No build.gradle file found, is this a WPILib project?');
                return;
            }
        }));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkPluginLine(buildGradle) {
    if (buildGradle.includes('id \"com.kauailabs.wsr.GradleRIO\" version ')) {
        return 1;
    }
    else if (buildGradle.includes('id \"edu.wpi.first.GradleRIO\" version ')) {
        return 2;
    }
    return 0;
}
//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkTargetsLine(buildGradle) {
    if (buildGradle.includes('vmxpi(\"roborio\")')) {
        return 1;
    }
    else if (buildGradle.includes('roboRIO(\"roborio\")')) {
        return 2;
    }
    return 0;
}
//Checks the artifacts to determine what language is being used. Currently used as a second language reference point
function checkArtifactsLine(buildGradle) {
    if (buildGradle.includes('frcNativeArtifact(\'frcCpp\')')) {
        return 'cpp';
    }
    else if (buildGradle.includes('frcJavaArtifact(\'frcJava\')')) {
        return 'java';
    }
    return null;
}
//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkPlatformsLine(buildGradle, cpp) {
    if (cpp) {
        if (buildGradle.includes('targetPlatform wpi.platforms.raspbian')) {
            return 1;
        }
        else if (buildGradle.includes('targetPlatform wpi.platforms.roborio')) {
            return 2;
        }
    }
    else {
        if (buildGradle.includes('nativeZip wpi.deps.wpilibJni(wpi.platforms.raspbian)') && buildGradle.includes('nativeZip wpi.deps.vendor.jni(wpi.platforms.raspbian)')) {
            return 1;
        }
        else if (buildGradle.includes('nativeZip wpi.deps.wpilibJni(wpi.platforms.roborio)') && buildGradle.includes('nativeZip wpi.deps.vendor.jni(wpi.platforms.roborio)')) {
            return 2;
        }
    }
    return 0;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=checkGradleStatus.js.map