import { addData } from './curl.js';
import { readJSON, writeCSV } from './fileWorker.js';



async function main () {
    let obj = {};
    
    let userInput = readJSON('config/userInput.json');

    let startBlock = userInput.startBlock;
    let endBlock = userInput.endBlock;
    let network = userInput.network;
    let API_key = userInput.API_key;

    obj = initializeObject(startBlock, endBlock, network);

    //console.log(JSON.stringify(obj));
  
   
    obj = await addData(obj, API_key);
 
    writeCSV(obj, 'output.csv');
}
  main().catch(console.error).finally(() => process.exit());

  function initializeObject(startBlock, endBlock, network){
    let blockCount = endBlock - startBlock;
    let obj = {
        'message': 'empty',
        'network': network,
        'startBlock': startBlock,
        'endBlock': endBlock,
        'data':{
            'numBlocks': blockCount,
            'contributionsFound': 0,
            'list':[]
        }
    }
    return obj;
}
  