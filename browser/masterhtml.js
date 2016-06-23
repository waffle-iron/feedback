var queue = {
    question: [],
    slow: [],
    code: []
}; // dataPoints

var dataQueue = {
    question: [],
    slow: [],
    code: [],
    yes: [],
    unsure: [],
    no: []
};

var chartQuestion = new CanvasJS.Chart("chartQuestion",{
    creditText: "",
    title :{
        text: "Question Data",
        fontColor: "white"
    },  
    backgroundColor: null,        
    axisX: {
        tickLength: 0,
        valueFormatString: " ",
        lineThickness: 0
    },
    axisY: {
        minimum: -5,
        maximum: 10,
        tickLength: 0,
        gridThickness: 0,
        labelFontColor: 'white',
        lineColor: 'white'
    },
    data: [{
        markerType: 'none',
        color: 'white',
        type: "line",
        dataPoints: queue['question']
    }]
});

var chartSlow = new CanvasJS.Chart("chartSlow",{
    creditText: "",
    title :{
        text: "Slow Data",
        fontColor: "white"
    },  
    backgroundColor: null,        
    axisX: {
        tickLength: 0,
        valueFormatString: " ",
        lineThickness: 0
    },
    axisY: {
        minimum: -5,
        maximum: 10,
        tickLength: 0,
        gridThickness: 0,
        labelFontColor: 'white',
        lineColor: 'white'
    },
    data: [{
        markerType: 'none',
        color: 'white',
        type: "line",
        dataPoints: queue['slow']
    }]
});

var chartCode = new CanvasJS.Chart("chartCode",{
    creditText: "",
    title :{
        text: "Code Data",
        fontColor: "white"
    },  
    backgroundColor: null,        
    axisX: {
        tickLength: 0,
        valueFormatString: " ",
        lineThickness: 0
    },
    axisY: {
        minimum: -5,
        maximum: 10,
        tickLength: 0,
        gridThickness: 0,
        labelFontColor: 'white',
        lineColor: 'white'
    },
    data: [{
        markerType: 'none',
        color: 'white',
        type: "line",
        dataPoints: queue['code']
    }]
});

var updateInterval = 100;
var dataLength = 30; // number of dataPoints visible at any point
var xVal = dataLength+1;

function seedData(obj){
    for (var category in obj){
        var tempIndex=0;
        while (obj[category].length<dataLength){
            obj[category].push({x:tempIndex, y:0});
            tempIndex++;
        }
    }
}

seedData(queue);

var updateChart = function () {    
    xVal++;
    
    queue['question'].push({x: xVal, y:0+dataQueue['question'].length});
    queue['slow'].push({x: xVal, y:0+dataQueue['slow'].length});
    queue['code'].push({x: xVal, y:0+dataQueue['code'].length});

    if (queue['question'].length > dataLength) queue['question'].shift();                
    if (queue['slow'].length > dataLength) queue['slow'].shift();                
    if (queue['code'].length > dataLength) queue['code'].shift();                

    chartQuestion.render();     
    chartSlow.render();     
    chartCode.render();  

    dataQueue['question']=[];
    dataQueue['slow']=[];
    dataQueue['code']=[];

};

var numberQueue = {
    question: [],
    slow: [],
    code: [],
};

var updateNumberQueue = {
    question: [0,0,0,0,0],
    slow: [0,0,0,0,0],
    code: [0,0,0,0,0],
};

var warningQueue = {
    question: [],
    slow: [],
    code: [],
};

var updateWarningQueue = {
    question: [0,0,0,0,0],
    slow: [0,0,0,0,0],
    code: [0,0,0,0,0],
};

function updateNumber(){

    var toProcess = ['question','slow','code'];

    toProcess.forEach(function(category){
        updateWarningQueue[category].push(warningQueue[category].length);
        if (updateWarningQueue[category].length > 5) updateWarningQueue[category].shift();
        warningQueue[category]=[];
        var total = updateWarningQueue[category].reduce(function(a, b) { return a + b; }, 0);
        $('.'+category+' .updateNumber').html(total);
    });
}

function updateColor(){

    var toProcess = ['question','slow','code'];

    toProcess.forEach(function(category){
        updateNumberQueue[category].push(numberQueue[category].length);
        if (updateNumberQueue[category].length > 5) updateNumberQueue[category].shift();
        numberQueue[category]=[];
        
        var total = updateNumberQueue[category].reduce(function(a, b) { return a + b; }, 0);
        if (total > 9) {
            $('.category.'+category).css('background-color', 'red');
        }
        else if (total > 5) {
            $('.category.'+category).css('background-color', 'gold');
        }
        else {
            $('.category.'+category).css('background-color', 'transparent');
        }
    });
}

function updateVote(){
    var toProcess = ['yes','unsure','no'];
    toProcess.forEach(function(category){
        var temp = dataQueue[category].length ;
        $('.askerAnswer.'+category).html(temp);
    });
}

function updateInstructorView(){
    setInterval(function(){
        updateChart();
        updateNumber();
        updateColor();
    }, 1000); 
};

updateInstructorView();

$(document).ready(function() {
    
    function submitToServer(){
        var buttonVal = $('#questionInput').val();
        var toSend = {message: buttonVal, time: new Date()};
        socket.emit("newQuestion", toSend);
        $.post('/addFeedback',toSend);
        $('.questionMirror').html(buttonVal);
        dataQueue['yes']= [];
        dataQueue['unsure']= [];
        dataQueue['no']= [];
        updateVote();
        $('#questionInput').val("");
    };

    $('.submitQuestion').click(function(){
        submitToServer();
    });

    $('.start').click(function(){
        if ($(this).html()=='Start') {
            console.log("trigger start");
            $.post('/addFeedback',{message:"start", time: Math.floor(Date.now()/1000)});
            $(this).html('Stop');
            $(this).css('background-color', 'red');
        }
        else {
            console.log("trigger stop");
            $.post('/addFeedback',{message:"stop", time: Math.floor(Date.now()/1000)});
            $(this).html('Start');
            $(this).css('background-color', 'green');
        }
    })

    $('input').keypress(function(e){
        if (e.which==13) {
            submitToServer();
        }
    });
});

socket.on('otherEmoji', function (data) {
  console.log("App received back: ",data);
  dataQueue[data.message].push("foo");
  if (data.message==='yes' || data.message==='unsure' || data.message==='no') {
    updateVote();
  }
  else {
      numberQueue[data.message].push("foo");
      warningQueue[data.message].push("foo");
  }
});
