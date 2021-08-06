import fs from 'fs';

export function exportVariable(data, name){
    try {
        fs.writeFileSync(name, data);
        } catch (err) {
        console.error(err);
        }
}

export function readJSON(filePath) {
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent);
  }

export function writeCSV(obj, name){
    const filename = name;

     try {
         fs.writeFileSync(filename, extractAsCSV(obj));
        } catch (err){
        console.error(err);
        }
    }

  function extractAsCSV(obj){
    const header = [
        "block_number,para_id,account_id,value,event_index,finalized,block_timestamp" 
    ]; 
    
    const rows = obj.data.list
        .map(entry => `${entry.block_num},${entry.para_id},${entry.account_id},${entry.value},${entry.event_index},${entry.finalized},${entry.block_timestamp}`);
      return header.concat(rows).join("\n");
  }
