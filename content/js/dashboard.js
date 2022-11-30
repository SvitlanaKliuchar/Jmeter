/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9305555555555556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5833333333333334, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-80"], "isController": false}, {"data": [1.0, 500, 1500, "-91"], "isController": false}, {"data": [1.0, 500, 1500, "-81"], "isController": false}, {"data": [1.0, 500, 1500, "-92"], "isController": false}, {"data": [1.0, 500, 1500, "-82"], "isController": false}, {"data": [1.0, 500, 1500, "-85"], "isController": false}, {"data": [1.0, 500, 1500, "-75"], "isController": false}, {"data": [1.0, 500, 1500, "-86"], "isController": false}, {"data": [1.0, 500, 1500, "-76"], "isController": false}, {"data": [1.0, 500, 1500, "-87"], "isController": false}, {"data": [1.0, 500, 1500, "-77"], "isController": false}, {"data": [1.0, 500, 1500, "-88"], "isController": false}, {"data": [1.0, 500, 1500, "-78"], "isController": false}, {"data": [1.0, 500, 1500, "-89"], "isController": false}, {"data": [1.0, 500, 1500, "-79"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 0, 0.0, 184.53999999999994, 16, 451, 122.0, 375.3000000000005, 404.24999999999994, 449.98, 39.46329913180742, 10.855233408971323, 19.04566643646409], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 30, 0, 0.0, 922.6999999999999, 237, 1860, 907.5, 1794.4, 1830.85, 1860.0, 7.690335811330428, 10.576965441553448, 18.55744120097411], "isController": true}, {"data": ["-80", 10, 0, 0.0, 245.4, 16, 451, 288.0, 450.8, 451.0, 451.0, 8.576329331046313, 2.2286730810463125, 4.112282911663808], "isController": false}, {"data": ["-91", 10, 0, 0.0, 123.0, 118, 154, 119.5, 150.8, 154.0, 154.0, 7.662835249042145, 1.7286278735632186, 3.7865181992337167], "isController": false}, {"data": ["-81", 10, 0, 0.0, 251.4, 249, 253, 251.0, 253.0, 253.0, 253.0, 7.278020378457059, 2.6723981077147014, 3.3973571688500726], "isController": false}, {"data": ["-92", 10, 0, 0.0, 123.39999999999999, 119, 139, 119.5, 138.7, 139.0, 139.0, 7.6452599388379205, 1.7246631307339448, 3.777833524464832], "isController": false}, {"data": ["-82", 10, 0, 0.0, 251.5, 250, 256, 251.0, 255.7, 256.0, 256.0, 7.278020378457059, 2.6723981077147014, 3.376034843522562], "isController": false}, {"data": ["-85", 10, 0, 0.0, 119.8, 119, 122, 119.0, 122.0, 122.0, 122.0, 8.025682182985554, 1.8104810393258428, 3.965815609951846], "isController": false}, {"data": ["-75", 10, 0, 0.0, 395.8, 384, 421, 391.5, 419.6, 421.0, 421.0, 8.920606601248885, 3.275535236396075, 4.137976694915254], "isController": false}, {"data": ["-86", 10, 0, 0.0, 119.50000000000001, 118, 121, 119.0, 121.0, 121.0, 121.0, 8.025682182985554, 1.8104810393258428, 3.965815609951846], "isController": false}, {"data": ["-76", 10, 0, 0.0, 251.4, 250, 253, 251.5, 252.9, 253.0, 253.0, 10.309278350515465, 3.785438144329897, 4.782135953608248], "isController": false}, {"data": ["-87", 10, 0, 0.0, 121.20000000000002, 118, 135, 119.5, 133.8, 135.0, 135.0, 8.00640512409928, 1.8061324059247397, 3.909377502001601], "isController": false}, {"data": ["-77", 10, 0, 0.0, 147.0, 128, 187, 138.0, 187.0, 187.0, 187.0, 10.845986984815617, 2.4467021420824295, 5.338259219088937], "isController": false}, {"data": ["-88", 10, 0, 0.0, 122.2, 118, 154, 119.0, 150.60000000000002, 154.0, 154.0, 7.800312012480499, 1.7596406981279251, 3.8544510530421214], "isController": false}, {"data": ["-78", 10, 0, 0.0, 119.6, 118, 122, 119.5, 121.9, 122.0, 122.0, 11.918951132300357, 2.6887477651966627, 5.866358760429082], "isController": false}, {"data": ["-89", 10, 0, 0.0, 121.2, 118, 139, 119.0, 137.20000000000002, 139.0, 139.0, 7.680491551459293, 1.732610887096774, 3.795242895545315], "isController": false}, {"data": ["-79", 10, 0, 0.0, 255.7, 250, 297, 251.0, 292.6, 297.0, 297.0, 7.2727272727272725, 2.6704545454545454, 3.3735795454545454], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
