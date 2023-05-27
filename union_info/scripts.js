
function getUnionData(server, name){
    path = "./unions/s" + server.split("S")[1] + "/" + name + ".csv"
    return path
}

function searchUnion(server, name, season_list, season_id){
    var union_info = {}
    
    for (var i=0; i<season_list.length; i++){
        for (var ele of season_list[i]){
            if (ele['ser'] == server && ele['na'] == name){
                union_info = ele;
                if (i==0){
                    union_info["cls_" + season_id] = "ashura";
                }else if(i==1){
                    union_info["cls_" + season_id] = "tenkabito";
                }else if(i==2){
                    union_info["cls_" + season_id] = "soudaisho";
                }else if(i==3){
                    union_info["cls_" + season_id] = "onimusha";
                }else if(i==4){
                    union_info["cls_" + season_id] = "aramusha";
                }
            }
        } 
    }
    return union_info
}
function onclickTd(server, name, event){
    var params = "?server=" + server + "&name=" + name;
    location.href = "../doumei_info/index.html" + params;
}

function setResult(res_data, tableId){
    const table = document.createElement('table');

    // 表のヘッダを作成
    const headerRow = document.createElement('tr');
    const headers = ["回戦", "勝敗", "合戦PT", "相手同盟"];
    for (const header of headers) {
      const th = document.createElement('th');
      th.textContent = header;
      if (header == "サーバー"){
        th.onclick = event => onclickServer(event);  // => はアロー関数
      }
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    
    var buttle_num = 1;
    for (const res of res_data["res"]){
        const dataRow = document.createElement('tr');

        var td = document.createElement('td');
        td.textContent = buttle_num;
        dataRow.appendChild(td);
        buttle_num += 1;

        td = document.createElement('td');
        if (res["res"] == "o"){
            td.textContent = "勝";
        }else if (res["res"] == "x"){
            td.textContent = "負";
        }else {
            td.textContent = "ー";
        }
        dataRow.appendChild(td);

        td = document.createElement('td');
        td.textContent = res["po"];
        dataRow.appendChild(td);
        
        td = document.createElement('td');
        if (res["op_ser"] == '*'){
            td.textContent = "不戦勝";
        }else {
            td.textContent = "[" + res["op_ser"]+ "]" + res["op_na"] + "(" + res["op_po"] + ")";
            td.onclick = event => onclickTd(res["op_ser"], res["op_na"], event);
            td.style.cursor = "pointer"
            td.style.color = "blue"
            td.style.textDecoration = "underline"
        }
        dataRow.appendChild(td);

        table.appendChild(dataRow);
    }
    
    var resultContainer = document.getElementById(tableId);
    resultContainer.appendChild(table);
}

function generateTable(unionInfo, seasonId) {
    
    if (seasonId == "s2"){
        if (unionInfo["cls_" + seasonId] == "ashura"){
            csvData = ashura_s2_result_table[ashura_s2_result_table.length - 1];
        }else if (unionInfo["cls_" + seasonId] == "tenkabito"){
            csvData = tenkabito_s2_result_table[tenkabito_s2_result_table.length - 1];;
        }else {
            return null;
        }
    }else if(seasonId == "s3"){
        if (unionInfo["cls_" + seasonId] == "ashura"){
            csvData = ashura_s3_result_table[ashura_s3_result_table.length - 1];
        }else if (unionInfo["cls_" + seasonId] == "tenkabito"){
            csvData = tenkabito_s3_result_table[tenkabito_s3_result_table.length - 1];;
        }else if (unionInfo["cls_" + seasonId] == "soudaisho"){
            csvData = soudaisho_s3_result_table[soudaisho_s3_result_table.length - 1];;
        }else if (unionInfo["cls_" + seasonId] == "onimusha"){
            csvData = onimusha_s3_result_table[onimusha_s3_result_table.length - 1];;
        }else if (unionInfo["cls_" + seasonId] == "aramusha"){
            csvData = aramusha_s3_result_table[aramusha_s3_result_table.length - 1];;
        }else {
            return null;
        }
    }else {
        return null;
    }
    server = unionInfo["ser"];
    union_name = server_id = unionInfo["na"];
    const lines = csvData.split('\n');
    const table = document.createElement('table');
  
    // 表のヘッダを作成
    const headerRow = document.createElement('tr');
    const headers = ["階級", "順位", "サーバー", "同盟", "合戦PT"];
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
        const td = document.createElement('td');
        if (unionInfo["cls_" + seasonId] == "ashura"){
            td.textContent = "阿修羅";
        }else if (unionInfo["cls_" + seasonId] == "tenkabito"){
            td.textContent = "天下人";
        }else if (unionInfo["cls_" + seasonId] == "soudaisho"){
            td.textContent = "総大将";
        }else if (unionInfo["cls_" + seasonId] == "onimusha"){
            td.textContent = "鬼武者";
        }else if (unionInfo["cls_" + seasonId] == "aramusha"){
            td.textContent = "荒武者";
        }
        dataRow.appendChild(td);

      const data = lines[i].split(',');
      const doumei_server_id = data[1];
      if (!((doumei_server_id == server)&&(union_name == data[2]))){continue};
      column_num = 0
      for (const value of data) {
        const td = document.createElement('td');
        td.textContent = value;
        // if (column_num == 2){
        //   td.onclick = event => onclickTd(data, event);  // => はアロー関数
        //   td.style.cursor = "pointer"
        //   td.style.color = "blue"
        //   td.style.textDecoration = "underline"
        // }
        dataRow.appendChild(td);
        column_num += 1
      }
      
      table.appendChild(dataRow);
    }

    if (table.children.length == 1){
        const dataRow = document.createElement('tr');
        let td = document.createElement('td')
        if (unionInfo["cls_" + seasonId] == "ashura"){
            td.textContent = "阿修羅";
        }else if (unionInfo["cls_" + seasonId] == "tenkabito"){
            td.textContent = "天下人";
        }else if (unionInfo["cls_" + seasonId] == "soudaisho"){
            td.textContent = "総大将";
        }else if (unionInfo["cls_" + seasonId] == "onimusha"){
            td.textContent = "鬼武者";
        }else if (unionInfo["cls_" + seasonId] == "aramusha"){
            td.textContent = "荒武者";
        }

        dataRow.appendChild(td);
        td = document.createElement('td')
        td.textContent = "無し"
        dataRow.appendChild(td);
        td = document.createElement('td')
        td.textContent = unionInfo["ser"]
        dataRow.appendChild(td);
        td = document.createElement('td')
        td.textContent = unionInfo["na"]
        dataRow.appendChild(td);
        td = document.createElement('td')
        td.textContent = "無し"
        dataRow.appendChild(td);
        table.appendChild(dataRow);
    }

    var resultContainer = document.getElementById(seasonId + "-final-container");
    resultContainer.appendChild(table);
  
    return table;
  }

const paramStr = decodeURIComponent(location.search);
const params = [...new URLSearchParams(paramStr).entries()].reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});

var unionName = document.getElementById("union-name");

const concatServers = ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36"]
var converted_server = ""
const _server_id = params['server'].split("S")[1]
if (concatServers.indexOf(_server_id) !== -1) {
    var _num_server_id = Number(_server_id) - 1
    converted_server = "S" + String(_num_server_id);
}else {
    converted_server = params['server'];
}
unionName.textContent = converted_server + " " + params['name'];

csvFilePath = getUnionData(params['server'], params['name'])
var season_list = [ashura_s2, tenkabito_s2]
unionInfo = searchUnion(params['server'], params['name'], season_list, "s2")
if (Object.keys(unionInfo).length > 0){
    const resultData = document.getElementById("s2-final-container");
    resultData.textContent = "";
    generateTable(unionInfo, "s2");
    setResult(unionInfo, "s2-result-container");
}

season_list = [ashura_s3, tenkabito_s3, soudaisho_s3, onimusha_s3, aramusha_s3]
unionInfo = searchUnion(converted_server, params['name'], season_list, "s3")
if (Object.keys(unionInfo).length > 0){
    const resultData = document.getElementById("s3-final-container");
    resultData.textContent = "";
    generateTable(unionInfo, "s3");
    setResult(unionInfo, "s3-result-container");
}

const csvFiles = [csvFilePath]; // Add your CSV file paths here

const levelMargin = { top: 30, right: 30, bottom: 70, left: 60 };
const powerMargin = { top: 30, right: 30, bottom: 70, left: 60 };

// Function to create histogram
function createHistogram(data, accessor, binSize, element, margin) {
    const width = parseInt(d3.select(element).style("width")) - margin.left - margin.right;
    const height = parseInt(d3.select(element).style("height")) - margin.top - margin.bottom;

    const x_max = Math.floor( d3.max(data, accessor) / 100 ) * 100 + 100;
    const x_min = Math.floor( d3.min(data, accessor) / 100 ) * 100 - 100;
    const x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, width]);

    const bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(Math.ceil((d3.max(data, accessor) - d3.min(data, accessor)) / binSize)))
        (data.map(accessor));

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height, 0]);

    const svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => y(0) - y(d.length));
}

function generateHistogram(data){
    var ctxLevel = document.getElementById('histogram-level').getContext('2d');
    var ctx = document.getElementById('histogram-power').getContext('2d');
    // ctx.canvas.height = 200;

    // Let's assume that you receive the following JSON object
    // var jsonData = [
    //     {"power": 50},
    //     {"power": 120},
    //     {"power": 200},
    //     {"power": 80},
    //     {"power": 300},
    //     {"power": 400},
    //     {"power": 120},
    //     {"power": 60},
    //     {"power": 700},
    //     {"power": 90},
    //     // add more data here
    // ];
    var jsonData = data;

    // Create an array to store the frequency of the data
    var dataFrequency = [];
    var dataFrequencyLevel = [];
    var powerList = jsonData.map(function (p) {
        return p.power;
    });
    var levelList = jsonData.map(function (p) {
        return p.level;
    });
    var maxPower = Math.max.apply(null, powerList); // set the max power as you need
    var maxLevel= Math.max.apply(null, levelList); // set the max level as you need
    for(var i = 0; i <= maxPower; i += 50) {
        dataFrequency[i/50] = 0;
    }
    for(var i = 0; i <= maxLevel; i += 1) {
        dataFrequencyLevel[i] = 0;
    }

    // Count the frequency of the data
    jsonData.forEach(function(obj) {
        var power = obj.power;
        var level = obj.level;
        if(power >= 0 && power <= maxPower) {
            dataFrequency[Math.floor(power / 50)]++;
        }
        if(level >= 0 && level <= maxLevel) {
            dataFrequencyLevel[level]++;
        }
    });

    var minX = 0
    for (var i=0; i < dataFrequency.length; i++){
        if (dataFrequency[i] > 0){
            minX = i;
            break
        }
    }
    var minXLevel = 0
    for (var i=0; i < dataFrequencyLevel.length; i++){
        if (dataFrequencyLevel[i] > 0){
            minXLevel = i;
            break
        }
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: ((maxPower / 50) + 1) - minX}, (_, i) => (i * 50) + minX * 50),
            datasets: [{
                label: '人数',
                data: dataFrequency.slice(minX, dataFrequency.length),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: false,
                    title: {
                        display: false,
                        text: '総合力'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: '人数'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            // maintainAspectRatio: false
        }
    });

    new Chart(ctxLevel, {
        type: 'bar',
        data: {
            labels: Array.from({length: ((maxLevel) + 1) - minXLevel}, (_, i) => (i + minXLevel)),
            datasets: [{
                label: '人数',
                data: dataFrequencyLevel.slice(minXLevel, dataFrequencyLevel.length),
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderColor: 'rgba(192, 75, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: false,
                    title: {
                        display: false,
                        text: '天守レベル'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: '人数'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            // maintainAspectRatio: false
        }
    });
}

function displayTopPowers(data) {
    const table = document.createElement('table');

    const headerRow = document.createElement('tr');
    const headers = ["同盟内順位", "レベル", "総合力(万)"];
    for (const header of headers) {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    const sortedData = data.sort((a, b) => b.power - a.power).slice(0, 70);
    // const tableBody = document.querySelector('#topPowers tbody');

    // tableBody.innerHTML = '';

    rank = 1
    for (const row of sortedData) {
        const tr = document.createElement('tr');
        const rankTd = document.createElement('td');
        const levelTd = document.createElement('td');
        const powerTd = document.createElement('td');

        rankTd.textContent = rank
        levelTd.textContent = Math.floor(row.level);
        powerTd.textContent = row.power;

        rankTd.classList.add("rank-td");
        levelTd.classList.add("level-td");
        powerTd.classList.add("power-td");

        tr.appendChild(rankTd);
        tr.appendChild(levelTd);
        tr.appendChild(powerTd);

        table.appendChild(tr);
        rank += 1;
    }

    var tableContainer = document.getElementById("top-powers-container");
    tableContainer.appendChild(table);

}

// Read and process CSV data
(async () => {
    const data = [];
    for (const file of csvFiles) {
        const csvData = await d3.csv(file);
        data.push(...csvData);
    }
    if (! data.length == 0){
        var unionMemberPower = document.getElementById("union-member-power-date");
        unionMemberPower.textContent = "(" + data[0]["date"] + '時点)';
        var unionMemberLevel = document.getElementById("union-member-level-date");
        unionMemberLevel.textContent = "(" + data[0]["date"] + '時点)';
        const powerData = document.getElementById("power-histogram-label");
        powerData.textContent = "";
        const levelData = document.getElementById("level-histogram-label");
        levelData.textContent = "";
        // createHistogram(data, d => +d.level, 1, "#level-histogram", levelMargin);
        // createHistogram(data, d => +d.power, 50, "#power-histogram", powerMargin);
        generateHistogram(data);
        displayTopPowers(data);
    }
})();
