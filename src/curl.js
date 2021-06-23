import curl from 'curlrequest';
import { exportVariable } from './fileWorker.js'

export async function addData(obj, API_key){
    let network = obj.network;
    let startBlock = obj.startBlock;
    let endBlock = obj.endBlock;

    let dataObject = {};
    let page = -1;
    let round = 0;
    var counter_index;
    let entries = 0;

    do {
        page += 1;
        round += 1;
        dataObject = await getDataObject(page, network, API_key);

        counter_index = dataObject.data.contributes.length;

        for(let i=0; i < counter_index; i++){
            if(dataObject.data.contributes[i].block_num >= startBlock & dataObject.data.contributes[i].block_num <= endBlock){
                obj.data.list[entries] = {
                    'block_num': dataObject.data.contributes[i].block_num,
                    'fund_id': dataObject.data.contributes[i].fund_id,
                    'para_id': dataObject.data.contributes[i].para_id,
                    'who': dataObject.data.contributes[i].who,
                    'contributed': dataObject.data.contributes[i].contributed,
                    'contributing': dataObject.data.contributes[i].contributing,
                    'extrinsic_index': dataObject.data.contributes[i].extrinsic_index,
                    'status': dataObject.data.contributes[i].status,
                    'block_timestamp':dataObject.data.contributes[i].block_timestamp,
                }
                obj.data.contributionsFound += 1;
                entries += 1;
            }
        }
        console.log(dataObject.data.contributes[counter_index - 1].block_num - startBlock + ' blocks left.');
    } while (dataObject.data.contributes[counter_index - 1].block_num >= startBlock && counter_index == 100);

    return obj;  
}

async function getDataObject(page, network, API_key){
    let breakPoint = 0;
    let continueLoop = true;

    let dataObject = {};
    var url;
    
    if(network == 'polkadot'){
        url = 'https://polkadot.api.subscan.io/api/scan/parachain/contributes'
    } else {
        url = 'https://kusama.api.subscan.io/api/scan/parachain/contributes'
    }

    var options = {
        url: url,
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-API-Key': API_key},
        data: JSON.stringify({
        'row': 100,
        'page': page,
        }),
    };
    
    // Sometimes the staking object is not properly transmitted. We try it again 10 times.
    while( continueLoop & breakPoint < 10 ) {
        dataObject = await curlRequest(options);
            try {
                dataObject = JSON.parse(dataObject);
                continueLoop = false;
            } catch(e) {
                breakPoint += 1;
            }
    }
    return dataObject;
}

async function curlRequest(options){
    return new Promise(function (resolve, reject){
      curl.request(options, (err,data) => {
        if (!err){
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
}