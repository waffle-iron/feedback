
$(document).ready(function() {
    
    function submitVideo(){
        var buttonVal = $('#linkInput').val();
        $('#linkInput').val("");
        $('.ytvideo').remove();
        $('.askerHeader').after('<iframe class="ytvideo" src="'+buttonVal+'" frameborder="0" allowfullscreen></iframe>');
    };

    $('.submitQuestion').click(function(){
        submitVideo();
    });

    $('input').keypress(function(e){
        if (e.which==13) {
            submitVideo();
        }
    });

    var start;
    var stop;
    var dataSet={
        question: {},
        slow: {},
        code: {},
        great: {},
        challenging: {},
        time: {}
    };
    var mapSet={
        question: [],
        slow: [],
        code: [],
        great: [],
        challenging: [],
        time: []
    };

    var surveyAnswer = {};

    jQuery.ajax({
        type: "GET",
        url: '/getStart',
        success: function(data) {
            start=Number(data[0]['time']);
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getStop',
        success: function(data) {
            stop=Number(data[0]['time']);
        },
        async:false
    });

    for (var i=start; i<=stop; i++) {
        for (var category in dataSet) {
            dataSet[category][i]=0;
        }
    }

    jQuery.ajax({
        type: "GET",
        url: '/getQuestion',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                dataSet['question'][data[j]['time']]++;
            }
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getSlow',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                console.log("What I'm adding: ",data[j]['time']);
                dataSet['slow'][data[j]['time']]++;
            };
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getCode',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                dataSet['code'][data[j]['time']]++;
            }
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getGreat',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                dataSet['great'][data[j]['time']]++;
            }
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getChallenging',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                dataSet['challenging'][data[j]['time']]++;
            }
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getTime',
        success: function(data) {
            for (var j=0; j<data.length; j++) {
                dataSet['time'][data[j]['time']]++;
            }
        },
        async:false
    });

    jQuery.ajax({
        type: "GET",
        url: '/getSurvey',
        success: function(data) {
            console.log("Survey Result: ",data);
            for (var j=0; j<data.length; j++) {
                if (!surveyAnswer[data[j]['question']]){
                    surveyAnswer[data[j]['question']]={
                        yes: 0,
                        unsure: 0,
                        no: 0,
                    }
                }
            }
            for (var k=0; k<data.length; k++) {
                var temp = data[k];
                console.log("Survey subset: ",temp);
                surveyAnswer[temp['question']][temp['message']]++;
            }
            console.log("Survey Dataset: ",surveyAnswer);
            for (var surveyParam in surveyAnswer) {
                var htmlToAdd = '<div class="surveyAnswer"><div class="surveyCategory surveyQuestion">'+surveyParam+'</div><div class="surveyCategory surveyOption">'+surveyAnswer[surveyParam]['yes']+'</div><div class="surveyCategory surveyOption">'+surveyAnswer[surveyParam]['unsure']+'</div><div class="surveyCategory surveyOption">'+surveyAnswer[surveyParam]['no']+'</div></div>';
                console.log("Survey HTML: ",htmlToAdd);
                $('.surveyResult').after(htmlToAdd);
            }
        },
        async:false
    });

    for (var topic in dataSet){
        for (var k in dataSet[topic]) {
            mapSet[topic].push({x: Number(k), y: dataSet[topic][k]});
        }
    }

    console.log("Final set: ", mapSet);

var chartQuestion = new CanvasJS.Chart("chartQuestion",{
    creditText: "",
    animationEnabled: true,
    title :{
        text: "Lecture Data",
        fontColor: "white"
    },  
    backgroundColor: null,        
    axisX: {
        tickLength: 0,
        valueFormatString: " ",
        lineThickness: 0
    },
    axisY: {
        minimum: -1,
        maximum: 10,
        tickLength: 0,
        gridThickness: 0,
        labelFontColor: 'white',
        lineColor: 'white'
    },
    legend:{
        verticalAlign: "bottom",
        horizontalAlign: "center",
        fontSize: 18,
        cursor:"pointer",
        itemclick : function(e) {
          if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;
          }
          chartQuestion.render();
        }
    },
    data: [
      {
        markerType: "none",        
        color: "red",
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "Question",
        dataPoints: mapSet['question']
      },
      {
        markerType: "none",
        color: "blue",        
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "Slow Down",
        dataPoints: mapSet['slow']
      },
      {
        markerType: "none",
        color: "green",        
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "Code",
        dataPoints: mapSet['code']
      },
      {
        markerType: "none",
        color: "yellow",        
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "Great",
        dataPoints: mapSet['great']
      },
      {
        markerType: "none",
        color: "orange",        
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "Challenging",
        dataPoints: mapSet['challenging']
      },
      {
        markerType: "none",
        color: "purple",        
        type: "line",
        lineThickness: 3,        
        showInLegend: true,
        name: "More Time",
        dataPoints: mapSet['time']
      }
    ]
});

chartQuestion.render();       


});