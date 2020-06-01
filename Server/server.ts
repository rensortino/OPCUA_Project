let opcua = require("node-opcua");
let file_transfer = require("node-opcua-file-transfer");
const { exec } = require("child_process");


let date_ob = new Date();
let server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/Prova",
    buildInfo: {
        productName: "RaspUAServer1",
        buildNumber: "1",
        buildDate: new Date()
    }
});

server.initialize(() =>{
    console.log("OPC UA Server initialized.");

    function build_my_address_space(server) {
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        //declare a new object
        let device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        });

        let folder = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "ScriptsFolder"
        });

        file_transfer.installFileType(myFile, { 
            filename: "prova.sh"
        });

            browseName: "AddFile",

            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "Name of the file to add" },
                    dataType: opcua.DataType.String        
                }
             ],
        
            outputArguments: [{
                 name:"Operation Outcome",
                 description:{ text: "Success or Failure of the add operation" },
                 dataType: opcua.DataType.String ,
                 valueRank: 1
            }]
        });
        
        // optionally, we can adjust userAccessLevel attribute 
        addFile.outputArguments.userAccessLevel = opcua.makeAccessLevelFlag("CurrentRead");

        addFile.bindMethod((inputArguments, context, callback) => {

        method.bindMethod((inputarguments,context,callback) => {
            let script_name = context.object.$fileData.filename

            exec(`sh ${script_name}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`${stdout}`);
            });

            file_transfer.installFileType(scriptFile, { 
                filename: inputArguments[0].value
            });

            const method = namespace.addMethod(scriptFile,{

                browseName: "Execute Script",
            
                outputArguments: [{
                     name:"out",
                     description:{ text: "the generated barks" },
                     dataType: opcua.DataType.String ,
                     valueRank: 1
                }]
            });
            
            // optionally, we can adjust userAccessLevel attribute 
            method.outputArguments.userAccessLevel = opcua.makeAccessLevelFlag("CurrentRead");
    
            method.bindMethod((inputarguments,context,callback) => {


                let script_name = context.object.$fileData.filename
    
                exec(`sh ${script_name}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`${stdout}`);
                });
            
                const callMethodResult = {
                    statusCode: opcua.StatusCodes.Good,
                    outputArguments: [{
                        dataType: opcua.DataType.String,
                        arrayType: opcua.VariantArrayType.Array,
                        value : "ok"
                    }]
                };
                callback(null,callMethodResult);
            });

            const callMethodResult = {
                statusCode: opcua.StatusCodes.Good,
                outputArguments: [{
                    dataType: opcua.DataType.String,
                    value : "ok"
                }]
            };
            callback(null,callMethodResult);
        });

        const removeFile = namespace.addMethod(folder,{

            browseName: "RemoveFile",

            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "Name of the file to remove" },
                    dataType: opcua.DataType.String        
                }
             ],
        
            outputArguments: [{
                 name:"Operation Outcome",
                 description:{ text: "Success or Failure of the remove operation" },
                 dataType: opcua.DataType.String ,
                 valueRank: 1
            }]
        });
        
        // optionally, we can adjust userAccessLevel attribute 
        removeFile.outputArguments.userAccessLevel = opcua.makeAccessLevelFlag("CurrentRead");

        removeFile.bindMethod((inputArguments, context, callback) => {
            
            // implement delete method

            const callMethodResult = {
                statusCode: opcua.StatusCodes.Good,
                outputArguments: [{
                    dataType: opcua.DataType.String,
                    value : "ok"
                }]
            };
            callback(null,callMethodResult);
        });

        //add some variables
        namespace.addVariable({
            propertyOf: device,
            browseName: "prova1",
            dataType: "String",
            value: {
                get: function() { 
                    return new opcua.Variant({ 
                        dataType: opcua.DataType.String, 
                        value: "prova"
                    });
                }
            }
        });

        namespace.addVariable({
            propertyOf: device,
            browseName: "seconds",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.Int32,
                        value: date_ob.getSeconds()
                    });
                }
            }
        });
    }

    build_my_address_space(server);

    console.log("Address space initialized.");

    server.start(() => {
        console.log(`Server is now listening port ${server.endpoints[0].port}... (press CTRL+C to stop)`);
        let endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log("The primary server endpoint url is ", endpointUrl);
    });

});

process.on('SIGINT', function () {
    process.exit(0);
});

