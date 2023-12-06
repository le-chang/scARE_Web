/**
 * @author [Wankun Deng]
 * @email [dengwankun@gmail.com]
 * @create date 2023-06-13 10:16:42
 * @modify date 2023-06-28 16:08:41
 * @desc [description]
 */
Highcharts.setOptions({
    colors: ["#386cb0","#fdb462","#7fc97f","#ef3b2c","#662506","#a6cee3","#fb9a99"]
  });

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 180000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
  }
var rtem,genem,datasetm,diseasem,cellm;
async function get_coexpm_data(from) {
    if(from=='te_info'){
        rtem=document.getElementById('current_te').value
        genem=document.getElementById('geneInput').value     
    }else{
        rtem=document.getElementById('geneMInput1').value
        genem=document.getElementById('multi_kw').value.split('\n').join(',')
        
    }
    datasetm=document.getElementById('co_exp_mdt').value
    diseasem=document.getElementById('co_exp_mdi').value
    cellm=document.getElementById('co_exp_mc').value 
    
    var url='cgi/te_info/get_te_coexp_multi.py?RTE='+rtem+'&Gene='+genem+'&Dataset='+datasetm+'&Condition='+diseasem+'&Cell='+cellm
    if(rtem==genem){
        return['No data','Cannot compare the same gene/RTE']
    }
    try{
        const response = await fetchWithTimeout(url, {timeout: 180000});
        return response.json();
    }catch(error){
        return['No data','Time out, try limit the number of genes']
    }
}
function get_coexpm(args){
    get_coexpm_data(args).then(data => {
        if(data[0]=='No data'){
            document.getElementById("coexp_scatterm").innerHTML=data[1]
            document.getElementById("coexp_boxm").innerHTML=data[1]
        }else{
            /**create scatter plot */
            var dots=JSON.parse(data['dots'])
            var regression=JSON.parse(data['regression_line'])
            
            Highcharts.chart('coexp_scatterm', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Correlation between '+genem+' and '+rtem+' expression',
                align: 'left'
            },
            subtitle: {
                text: 'R<sup>2</sup>: '+regression[0]+', p-value: '+regression[1],
                align: 'left'
            },
            xAxis: {
                title: {
                text: rtem
                },
                labels: {
                    format: '{value}'},
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                text: genem
                },
                labels: {
                format: '{value}'
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    color:"#386cb0",
                    dashStyle: 'LongDash'
                }
            },
                series:[{name:'Expression',data:dots,marker:{radius:3,opacity:0.5,fillColor:'rgba(237,86,27,0.5)'},type:'scatter'},
                        {name:'Regression line',data:[regression[2],regression[3]],marker:{enabled:false},type:'line'}]
            });
            /**create boxplot */
            box_data=data['boxplot']
            labels=data['labels']
            Highcharts.chart('coexp_boxm', {
                chart: {
                    type: 'boxplot',
                },
                title: {
                    text: '',
                    align: 'left'
                },
                subtitle: {
                    text:"",
                    align: 'left'
                },
                xAxis: {
                    categories: labels,
                    crosshair: true
                },
                yAxis: {
                    title: {
                    text: 'Normalized read counts'
                    },
                    labels: {
                        format: '{value}'
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                    series:box_data
                });
            $("div[aria-live='assertive']").attr("aria-atomic", true);
        }
      });  
      
}