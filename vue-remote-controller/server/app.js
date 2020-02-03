var serverPort = 3000;
var philipshueIp = '192.168.0.10';
var philipshueId = 'HCTjuLgnPvKruerzX3BahuLQxsZXKcO8gwu-13F-';
var philipshueLightnum = 7;
var request = require('request')
var express = require('express');
var app = express();
var server = app.listen(serverPort, function () {
    console.log("Express server has started on port " + serverPort)
})
var io = require('socket.io')(server, {});

app.get('/', function (req, res) {
    res.send('hello world');
});

var remote = io.on('connection', function (socket) {
    socket.on('getInfo', (data) => {
        console.log("socket on getInfo");
        getPhilipshueInfo();
        getSensiboInfo();
        getWeatherInfo();
    });
});


function getPhilipshueInfo() {
    console.log(">>getPhilipshueInfo");
    //정보 가져오기
    request({
        url: 'http://' + philipshueIp + '/api/' + philipshueId + '/lights/' + philipshueLightnum, // 7번 전등 상태 가져옴
        method: 'GET',
    }, function (err, response, body) {
        var lightsate = JSON.parse(body)
        // console.log('philipshue light info');
        // console.log(lightsate.state.on);
        // return lightsate.state.on;
        io.emit('CurrentPhilipshueInfo', {
            philipshueInfo: lightsate.state
        })
        console.log("<<getPhilipshueInfo");
    })
}

function getSensiboInfo() {
    console.log(">>getSensiboInfo");
    request({
        url: "https://home.sensibo.com/api/v2/pods" + "/8aFYypRW" + '/measurements?fields' + "&apiKey=vCkjnDctdoiZYsOBMhmKEYhHLZpA6B",
        method: 'GET',
    }, function (err, response, body) {
        var status = JSON.parse(body)
        // console.log(status.result)
        io.emit('CurrentSensiboInfo', {
            sensiboInfo: status.result
        })
        console.log("<<getSensiboInfo");
    })

    request({
        url: "https://home.sensibo.com/api/v2/pods" + "/8aFYypRW" + '/acStates' + '?' + "apiKey=vCkjnDctdoiZYsOBMhmKEYhHLZpA6B",
        method: 'POST',
        body: JSON.stringify({
            "acState" : {
                "on":true,
                "mode":'auto'
                // "mode":"heat"
            }
            // "acState" : {
            //     "on":false,
            //     "mode":"heat",
            // }
        })  
        //on : ture 켜기, on : false 끄기
        //mode : cool, heat, 
        //fanlevel : low, middle, high
    })

    // request({ 
    //     // url : "https://home.sensibo.com/api/v2/pods/"+'8aFYypRW'+"&apiKey=vCkjnDctdoiZYsOBMhmKEYhHLZpA6B",
    //     url: "https://home.sensibo.com/api/v2/pods" + "/8aFYypRW" + '/acStates' + '?' + "apiKey=vCkjnDctdoiZYsOBMhmKEYhHLZpA6B",
    //     method: 'GET',
    //     }, function(err, response, body) {
    //         var status = JSON.parse(body)
    //         console.log(status)
    //         io.emit('CurrentSensiboInfo', {
    //             sensiboInfo: status.result
    //         })
    //         console.log("<<getSensiboInfo");
    //     }
    // )
}

function getWeatherInfo() {
    console.log(">>getWeatherInfo");

    // var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
    // var queryParams = '?' + encodeURIComponent('ServiceKey') + '=jbrQgO6OwiSkKmLDW4O4vR6kd3m1Xm5Gh110dLtQBnYG0CfHAT5e944osgDzDf%2FeCxWe6zKRKh92%2F8bT%2F5vFNQ%3D%3D'; /* Service Key*/
    // queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* 공공데이터포털에서 받은 인증키 */
    // queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지번호 */
    // queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
    // queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* 요청자료형식(XML/JSON)Default: XML */
    // queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(base_date); /* 15년 12월 1일발표 */
    // queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0200'); /* 05시 발표 */
    // queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('61'); /* 예보지점 X 좌표값 */
    // queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('120'); /* 예보지점의 Y 좌표값 */
    // // console.log(url + queryParams);

    var url = getWeatherUrl();
    request({
        url: url,
        method: 'GET'
    }, function (error, response, body) {
        //console.log('Status', response.statusCode);
        //console.log('Headers', JSON.stringify(response.headers));
        let data = JSON.parse(body)
        // console.log(data.response.body.items)
        io.emit('CurrentWeatherInfo', {
            weatherInfo: data.response.body.items
        })
        console.log("<<getWeatherInfo");
    });

}

function getWeatherUrl(){

    // var date = new Date();
    // var base_date = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    var base_date=getDateTime();
    // console.log(base_date);

    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=jbrQgO6OwiSkKmLDW4O4vR6kd3m1Xm5Gh110dLtQBnYG0CfHAT5e944osgDzDf%2FeCxWe6zKRKh92%2F8bT%2F5vFNQ%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* 공공데이터포털에서 받은 인증키 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지번호 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* 요청자료형식(XML/JSON)Default: XML */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(base_date); /* 15년 12월 1일발표 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0200'); /* 05시 발표 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('61'); /* 예보지점 X 좌표값 */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('120'); /* 예보지점의 Y 좌표값 */
    // console.log(url + queryParams);
    return url + queryParams;

}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    // var sec  = date.getSeconds();
    // sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var ans = '' + year + month + day;
    // console.log('today is' + ans);

    // var basetime=['' + year + month + day,''+hour+min]
    return '' + year + month + day;

}


// request({
//     url: "https://home.sensibo.com/api/v2/pods" + "/8aFYypRW" + '/acStates' + '?' + "apiKey=vCkjnDctdoiZYsOBMhmKEYhHLZpA6B",
//     method: 'POST',
//     body: JSON.stringify({
//         "acState" : {
//             "on":true,
//             "mode":"Dry"
//             // "mode":"heat"
//         }
//         // "acState" : {
//         //     "on":false,
//         //     "mode":"heat",
//         // }
//     })  
//     //on : ture 켜기, on : false 끄기
//     //mode : cool, heat, 
//     //fanlevel : low, middle, high
// })

//dry :제소
//cool: 냉방
//나머지 안됨