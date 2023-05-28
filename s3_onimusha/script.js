const tableContainer = document.getElementById('table-container');

const text = onimusha_s3_result_table;

const table = generateTable(text[text.length-1], 0);
tableContainer.innerHTML = '';
tableContainer.appendChild(table);

function generateTable(csvData, server_id) {
  const lines = csvData.split('\n');
  const table = document.createElement('table');

  // 表のヘッダを作成
  const headerRow = document.createElement('tr');
  const headers = ["順位", "サーバー", "同盟", "合戦PT"];
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    if (header == "サーバー"){
      th.onclick = event => onclickServer(event);  // => はアロー関数
    }
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // 表のデータを作成
  for (let i = 1; i < lines.length-1; i++) {
    const dataRow = document.createElement('tr');
    const data = lines[i].split(',');
    const doumei_server_id = data[1]
    if (!(server_id == 0 || doumei_server_id == ("S" + server_id))){continue};
    column_num = 0
    for (const value of data) {
      const td = document.createElement('td');
      td.textContent = value;
      if (column_num == 2){
        td.onclick = event => onclickTd(data, event);  // => はアロー関数
        td.style.cursor = "pointer"
        td.style.color = "blue"
        td.style.textDecoration = "underline"
      }
      dataRow.appendChild(td);
      column_num += 1
    }
    table.appendChild(dataRow);
  }

  return table;
}

function getSelectedItem() {
  // 選択されたアイテムを取得
  var selectBox = document.getElementById("time-list");
  var selectedItem = selectBox.options[selectBox.selectedIndex].value;
  var index = Number(selectedItem)
  selectBox = document.getElementById("server-list");
  selectedItem = selectBox.options[selectBox.selectedIndex].value;
  var server_id = Number(selectedItem)

  // 選択されたアイテムを表示
  const table = generateTable(text[index], server_id);
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);

}

function onclickTd(data, event){
  var params = "?server=" + data[1] + "&name=" + data[2];
  location.href = "../union_info/index.html" + params;
}

function _onclickTd(data, event){
  var display_text = "順位：" + data[0] + "\n同盟：[" + data[1] + "]" + data[2] + "\n合戦ポイント：" + data[3] + "\n対戦結果："
  var i=1;
  for (const res_data of result_data){
    if ((res_data["na"] == data[2]) && (res_data["ser"] == data[1])){
      for (const res of res_data["res"]){
        var score = "ー"
        if (res["res"] == "o"){
          score = "勝"
        }else if (res["res"] == "x"){
          score = "負"
        }
        display_text += "\n" + score + " (" + res["po"] + ")" + " vs [" + res["op_ser"]+ "]" + res["op_na"] + "(" + res["op_po"] + ")"
        i += 1;
      }
    }
  }
  alert(display_text)
}
