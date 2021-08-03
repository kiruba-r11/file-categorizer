#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const process = require("process");
const fileTypes = require("../filesTypes");

// Get input from command line parameter
let command = process.argv.slice(2);
let commandType = command[0];

// Function to insert the given file into the categorized directory
let insertFilesBasedOnCategory = (dirPath , categoryDirPath , content) => {

    let fileExtension = path.extname(content).slice(1);
    for(fileCategoryType in fileTypes) {
        for(fileExtensionType of fileTypes[fileCategoryType]) {
            if(fileExtensionType === fileExtension) {

                // Create a File Category Directory if it doesn't exist
                let fileCategoryDirPath = path.join(categoryDirPath , fileCategoryType);
                let doesFileCategoryDirPathExists = fs.existsSync(fileCategoryDirPath);
                if(doesFileCategoryDirPathExists === false) {
                    fs.mkdirSync(fileCategoryDirPath);
                }
                
                // If file doesn't exist in the categories directory, copy it
                let fileCategoryPath = path.join(fileCategoryDirPath , path.basename(dirPath));
                let doesFileExistsInCategory = fs.existsSync(fileCategoryPath);
                if(doesFileExistsInCategory === false) 
                    fs.copyFileSync(dirPath , fileCategoryPath);
            }
        }
    }
}

// Read directory function to insert categorized files
let categorizedFiles = (dirPath , categoryDirPath) => {
    let dirContent = fs.readdirSync(dirPath);

    
    // Iterate through all the Directory Content
    for(content of dirContent) {
        let contentPath = path.join(dirPath , content);
        let isContentAFile = fs.statSync(contentPath).isFile();
        
        if(isContentAFile) {

            // Insert the file into the proper directory
            insertFilesBasedOnCategory(contentPath , categoryDirPath , content);

            // Delete the old copy of the file
            fs.unlinkSync(contentPath);
        } else {
            let newDirPath = path.join(dirPath , content);
            if(newDirPath != categoryDirPath) {
                categorizedFiles(newDirPath , categoryDirPath);
                
                // Remove the old copy of the directory 
                fs.rmdirSync(newDirPath);
            }
        }
    }
}

// Categorize Function
let categorize = (command) => {
    let dirPath = command[1];

    // Check if the dirPath exists
    let doesDirPathExists = fs.existsSync(dirPath);
    if(doesDirPathExists === false) {
        console.log("Wrong❕ Please enter a valid Directory Path");
    } else {

        // Create a directory named "Categorized Files" inside the dirpath if it doesn't exist
        let categoryDirPath = path.join(dirPath , "/Categorized Files");
        let doesCategoryDirPathExists = fs.existsSync(categoryDirPath);
        if(doesCategoryDirPathExists === false) {
            fs.mkdirSync(categoryDirPath)
        }

        // Read the directory and insert the files.
        categorizedFiles(dirPath , categoryDirPath);
    }
}

// Help Function
let help = () => {
    console.log("Welcome to FCAT's Help 🔥\n");
    console.log("Command 1️⃣ : fcat --categorize [dirpath]");
    console.log("Command 2️⃣ : fcat --help");
    console.log("\nNote 📒 that the commands are case sensitive");
}

switch(commandType) {
    case "--categorize" :
        if(command.length > 2) {
            console.log("Wrong❕ Please enter a proper command");
        } else {
            categorize(command);
        }
        break;
    case "--help" :
        if(command.length > 1) {
            console.log("Wrong❕ Please enter a proper command");
        } else {
            help();
        }
        break;
    default: 
        console.log("Wrong❕ Please enter a proper command");
}
