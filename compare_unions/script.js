function getUnionPath(server, name){
    path = "../union_info/unions/s" + server.split("S")[1] + "/" + name + ".csv";
    return path
}

function average(list){
    var sum = 0;
    for (var i of list){
        sum += i;
    }
    return sum / list.length;
}

function round(num){
    num = num * 10;
    num = Math.round(num);
    return (num / 10);
}

function createChart(ctx, list, maxLength, y_label){
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: maxLength}, (_, i) => i + 1),
            datasets: list
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '同盟内順位'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: y_label
                    }
                }
            }
        }
    });
}

function readUnionData(union_list){

    // Read and process CSV data
    (async () => {

        var power_list = [[],[]];
        var level_list = [[],[]];
        for (var i=0; i<union_list.length; i++){
            level_list.push([]);
            power_list.push([]);
            path = getUnionPath(union_list[i]['server'], union_list[i]['name']);
            csvData = await d3.csv(path);
        
        
            for (var data of csvData){
                level_list[i].push(Number(data['level']));
                power_list[i].push(Number(data['power']));
            }
            level_list[i].sort(function(a,b){
                if( Number(a) > Number(b) ) return -1;
                if( Number(a) < Number(b) ) return 1;
                return 0;
            });
            power_list[i].sort(function(a,b){
                if( Number(a) > Number(b) ) return -1;
                if( Number(a) < Number(b) ) return 1;
                return 0;
            });

        }

        var table = document.getElementById("compare-table");
        table.innerHTML = "";
        var header = document.createElement("tr");

        var td = document.createElement("td");
        td.textContent = "";
        header.appendChild(td);
        
        for (var i=0; i<union_list.length; i++){
            var td = document.createElement("td");
            td.textContent = union_list[i]['server'] + " " + union_list[i]['name'];
            header.appendChild(td);
        }
        table.appendChild(header);

        for (var num of [5, 10, 20, 30, 40, 50]){
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.textContent = "上位" + num + "名平均";
            tr.appendChild(td);

            for (var i=0; i<union_list.length; i++){
                var td = document.createElement("td");
                td.textContent = round(average(power_list[i].slice(0,num)));
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        var maxLength = 0;
        for (var i=0; i<union_list.length-1; i++){
            maxLength = Math.max(power_list[i].length, power_list[i+1].length)
        }
        for (var i=0; i<union_list.length-1; i++){
            while(power_list[i].length < maxLength) power_list[i].push(null);
        }
        
        const colors = ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)'];
        var datasetList = [];
        for (var i=0; i<union_list.length; i++){
            datasetList.push({
                label: "[" + union_list[i]['server'] + "] " + union_list[i]['name'],
                borderColor: colors[i%5],
                data: power_list[i]
            })
        }
        var datasetListLevel = [];
        for (var i=0; i<union_list.length; i++){
            datasetListLevel.push({
                label: "[" + union_list[i]['server'] + "] " + union_list[i]['name'],
                borderColor: colors[i%5],
                data: level_list[i]
            })
        }

        var ctxLevel = document.getElementById('canvas-level').getContext('2d');
        if (chartLevel){
            chartLevel.destroy();
        }
        
        chartLevel = createChart(ctxLevel, datasetListLevel, maxLength, '天守レベル')

        var ctx = document.getElementById('canvas').getContext('2d');
        if (chart){
            chart.destroy();
        }
        chart = createChart(ctx, datasetList, maxLength, '領主総合力')

    })();
}

function populateB(data) {
    let selectA = document.getElementById('selectA');
    let selectB = document.getElementById('selectB');
    let selectedA = selectA.options[selectA.selectedIndex].text;

    // Clear previous options in 'b' dropdown
    selectB.innerHTML = '';
    // Find the corresponding 'b' array for selected 'a' value
    let selectedB = data.find(d => d.server === selectedA).unions;

    // Populate 'b' dropdown
    for(let i = 0; i < selectedB.length; i++) {
        let option = document.createElement('option');
        option.text = selectedB[i];
        selectB.add(option);
    }
   
}

function populateD(data) {
    let selectC = document.getElementById('selectC');
    let selectD = document.getElementById('selectD');
    let selectedC = selectC.options[selectC.selectedIndex].text;

    // Clear previous options in 'b' dropdown
    selectD.innerHTML = '';
    // Find the corresponding 'b' array for selected 'a' value
    let selectedD = data.find(d => d.server === selectedC).unions;

    // Populate 'b' dropdown
    for(let i = 0; i < selectedD.length; i++) {
        let option = document.createElement('option');
        option.text = selectedD[i];
        selectD.add(option);
    }

}

function addRow() {
    var container = document.getElementById("container");
    var row = document.createElement("div");
    row.className = "select-box-set";
    
    var selectBox1 = document.createElement("select");
    selectBox1.className = "select-box";
    // selectBox1 のオプションを設定
    
    var selectBox2 = document.createElement("select");
    selectBox2.className = "select-box";
    // selectBox2 のオプションを設定
    
    row.appendChild(selectBox1);
    row.appendChild(selectBox2);
    container.appendChild(row);

    // Populate 'a' dropdown
    for(let i = 0; i < unions_in_list.length; i++) {
        let option = document.createElement('option');
        option.text = unions_in_list[i].server;
        if ( i == 0 ){
            option.selected = true;
        }
        selectBox1.add(option);
    }

    populateB(unions_in_list);
}

function removeRow() {
    var container = document.getElementById("container");
    var rows = container.getElementsByClassName("container");

    if (rows.length > 1) {
        container.removeChild(rows[rows.length - 1]);
    }
}

let selectA = document.getElementById('selectA');

// Populate 'a' dropdown
for(let i = 0; i < unions_in_list.length; i++) {
    let option = document.createElement('option');
    option.text = unions_in_list[i].server;
    if ( i == 0 ){
        option.selected = true;
    }
    selectA.add(option);
}

populateB(unions_in_list);

// let selectAQuery = document.querySelector('[id="selectA"]');
selectA.onchange = event => { 
    // Populate 'b' dropdown for the initial 'a' value
    populateB(unions_in_list);  
}

let selectC = document.getElementById('selectC');

// Populate 'a' dropdown
for(let i = 0; i < unions_in_list.length; i++) {
    let option = document.createElement('option');
    option.text = unions_in_list[i].server;
    if ( i == 1 ){
        option.selected = true;
    }
    selectC.add(option);
}

populateD(unions_in_list);

// select = document.querySelector('[id="selectC"]');
selectC.onchange = event => { 
    // Populate 'b' dropdown for the initial 'a' value
    populateD(unions_in_list);  
}

var union1 = {'server': "S" + selectA.options[selectA.selectedIndex].textContent.split('s')[1], 'name': selectB.options[selectB.selectedIndex].textContent};
var union2 = {'server': "S" + selectC.options[selectC.selectedIndex].textContent.split('s')[1], 'name': selectD.options[selectD.selectedIndex].textContent};
var unionList = [union1, union2]

var chart = ""
var chartLevel = ""
readUnionData(unionList);

function compareClick(){
    var union1 = {'server': "S" + selectA.options[selectA.selectedIndex].textContent.split('s')[1], 'name': selectB.options[selectB.selectedIndex].textContent};
    var union2 = {'server': "S" + selectC.options[selectC.selectedIndex].textContent.split('s')[1], 'name': selectD.options[selectD.selectedIndex].textContent};

    var unionList = [union1, union2]
    readUnionData(unionList);
}