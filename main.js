#!/usr/bin/env node
let fs = require('fs');
let path = require('path')
//getting input from cmd line
let inputArr = process.argv.slice(2);
console.log(inputArr);
//node main.js tree "directoryPath"
//node main.js organize "directoryPat"
//node main.js help 
let command = inputArr[0];
let types = {
    media:["mp4","mkv"],
    archive:["zip","7z","rar","tar","gz","ar","iso","xz"],
    document:["docx","doc","pdf","xlsx","odt","ods","odp","odg","odf","txt","ps","tex"],
    app:["exe","dmg","pkg","deb"],
    images:['png',"jpg","msi","jfif","jpeg"],
}



switch(command)
{
    case 'tree':
        treefn(inputArr[1])
        break;
    case 'organize':
        organizefn(inputArr[1])
        break;
    case 'help':
        helpfn()
        break;
    default:
        console.log("please enter Right command");
        break;
    
}






function organizefn(dirPath){
    // console.log("Organize command implemented for",dirPath)
    // 1 input -> diractory path given
    let destPath;
    if(dirPath == undefined)
    {
        // console.log("Kindly Enter Correct Path")
        destPath = process.cwd();
        return;
    }else
    {
        //check path exist or not
        let doesExist= fs.existsSync(dirPath)
        if(doesExist)
        {
            // 2 craete -> directory name with organized_file
            destPath = path.join(dirPath,'organized_files')
            if(fs.existsSync(destPath) == false)
            {
                fs.mkdirSync(destPath)
            }


        }else
        {
            console.log("Kindly Enter Correct Path")
            return;
        }
    }

    organizeHelper(dirPath,destPath);
    
    
}

//3 identify the file in which category present the input directory
function organizeHelper(src,dest){
    let childName = fs.readdirSync(src);
    // console.log(childName);
    //check file or folder if files then organize
    for(let i =0; i<childName.length; i++)
    {
       let childAddress =  path.join(src,childName[i]);
       let isFile = fs.lstatSync(childAddress).isFile();
       if(isFile){
        // console.log(childName[i]);
        let category = getCategory(childName[i]);
        console.log(childName[i] ,"belongs to = ", category)
        //4 copy all file and arrange into new origanized name directory
        sendFile(childAddress,dest,category);


       }
    }
}

function sendFile(srcFile, dest, category){
    //craeting path
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let filename = path.basename(srcFile);
    let destFilePath = path.join(categoryPath,filename);
    fs.copyFileSync(srcFile,destFilePath);
    console.log(filename,"copied into : ", category);
    //when you are copied all the file then cut throgh this
    // fs.unlinkSync(srcFile);
}

function getCategory(name){
    let ext = path.extname(name)
    // console.log(ext);
    ext = ext.slice(1);
    for(let type in types){
        let cTypeArray = types[type];
        for(let i=0; i<cTypeArray.length; i++)
        {
            if(ext == cTypeArray[i]){
                return type
            }
        }

    }
    return "other"
}



//''''''''''''''''''''''''''''''''''''''''''TREE Function work from here'''''''''''''''''''''''''''
function treefn(dirPath){
    // console.log("Tree command implemented for",dirPath)
   
    if(dirPath == undefined)
    {
        // console.log("Kindly Enter Correct Path")
        treeHelper(process.cwd(),"");
        return;
    }else
    {
        //check path exist or not
        let doesExist= fs.existsSync(dirPath)
        if(doesExist)
        {
           treeHelper(dirPath,"");
        }else
        {
            console.log("Kindly Enter Correct Path")
            return;
        }
    }


}
function treeHelper(dirPath, indent){
    //is file or folder
   let isFile = fs.lstatSync(dirPath).isFile();
   if(isFile == true){
       let fileName =  path.basename(dirPath);
       console.log(indent +"|-----"+ fileName)

   }else
   {
    let dirName = path.basename(dirPath);
    console.log(indent+"'-----"+dirName);
    let children = fs.readdirSync(dirPath);
    for(let i=0; i<children.length; i++){
        let childPath = path.join(dirPath,children[i]);
        treeHelper(childPath,indent + "\t");
    }
   }

}



//'''''''''''''''''''''''''''''''''''''''''help functiion work from here ''''''''''''''''''''''''''''
function helpfn(dirPath){
    console.log(`
     list of all commands :
            node main.js tree "directoryPath"
            node main.js organize "directoryPath"
            node main.js help 
    `)
}