# VMXVSCodeExtension
Source code for VSCodeExtension to manage access to WPILib-based VMX capabilities for use with WorldSkills Mobile Robotics


# Installation
Download directly from the VSCode Extension Marketplace
-- OR --
Download the latest .vsix file from the root folder of this repo
Open VSCode, in the Extensions window, find "Install from VSIX..."
Select the downloaded .vsix file to install

# Usage
The extension's commands can be accessed through the VMX WSR icon in the Quick Access Toolbar (top right) or the Command Pallete (opened with Ctrl+Shift+P)
All commands are located under the VMX WSR category

`Update WPILib Version` updates the VMX-specific WPILib library and GradleRIO to the latest version

`Change the deploy target to VMX (from RoboRIO)` adapts the project's build.gradle file to set a VMX target

`Verify the Project's build.gradle file` checks the project's build.gradle file for correct VMX setup
