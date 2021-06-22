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
        "block_number, fund_id, para_id, who, contributed, contributing, extrinsic_index, status, block_timestamp" 
    ]; 
    
    const rows = obj.data.list
        .map(entry => `${entry.block_num}, ${entry.fund_id}, ${entry.para_id}, ${entry.who}, ${entry.contributed}, ${entry.contributing}, ${entry.extrinsic_index}, ${entry.status}, ${entry.block_timestamp}`);
      return header.concat(rows).join("\n");
  }