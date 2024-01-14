const paramStr = decodeURIComponent(location.search);
const params = [...new URLSearchParams(paramStr).entries()].reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});
const server_id = params['server'].split("S")[1]

var serverName = document.getElementById("server-name");
serverName.textContent = "S" + server_id;

var tableContainer = document.getElementById('table-container');
var table = generateTable(server_id);
if (table.length != 0){
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function generateTable(server_id) {

    const ashuraTable = ashura_s5_result_table;
    const tenkabitoTable = tenkabito_s5_result_table;
    const soudaishoTable = soudaisho_s5_result_table;
    const onimushaTable = onimusha_s5_result_table;
    // const aramushaTable = aramusha_s5_result_table;
    
    var _table = document.createElement('table');
  
    // 表のヘッダを作成
    const headerRow = document.createElement('tr');
    const headers = ["階級", "順位", "同盟", "合戦PT"];
    for (const header of headers) {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    }
    _table.appendChild(headerRow);
    
    _table = appendRows(_table, ashuraTable[ashuraTable.length-1], server_id, '阿修羅');
    _table = appendRows(_table, tenkabitoTable[tenkabitoTable.length-1], server_id, '天下人');
    _table = appendRows(_table, soudaishoTable[soudaishoTable.length-1], server_id, '総大将');
    _table = appendRows(_table, onimushaTable[onimushaTable.length-1], server_id, '鬼武者');
    // _table = appendRows(_table, aramushaTable[aramushaTable.length-1], server_id, '荒武者');
    
    return _table;
  }

  function appendRows(table, classTable, server_id, classStr){
    const lines = classTable.split('\n');
    // 表のデータを作成
    for (let i = 1; i < lines.length-1; i++) {
        const dataRow = document.createElement('tr');

        if (classStr == '阿修羅'){
            dataRow.classList.add("row-ashura");
        }else if (classStr == '天下人'){
            dataRow.classList.add("row-tenkabito");
        }else if (classStr == '総大将'){
            dataRow.classList.add("row-soudaisho");
        }else if (classStr == '鬼武者'){
            dataRow.classList.add("row-onimusha");
        }else if (classStr == '荒武者'){
            dataRow.classList.add("row-aramusha");
        }

        const data = lines[i].split(',');
        const doumei_server_id = data[1]
        if (!(server_id == 0 || doumei_server_id == ("S" + server_id))){continue};
        

        const td_first = document.createElement('td');
        td_first.textContent = classStr;
        dataRow.appendChild(td_first);

        var column_num = 0
        for (const value of data) {
            if (column_num == 1){
                column_num += 1;
                continue;
            }
            const td = document.createElement('td');
            td.textContent = value;
            if (column_num == 2){
                td.onclick = event => onclickTd(data, event);
                td.style.cursor = "pointer"
                td.style.color = "blue"
                td.style.textDecoration = "underline"
            }
            dataRow.appendChild(td);
            column_num += 1
        }
        table.appendChild(dataRow);
    }
    return table

  }

  function onclickTd(data, event){
    var params = "?server=" + data[1] + "&name=" + data[2];
    location.href = "../union_info/index.html" + params;
  }