var serverPort = 3000;
var philipshueIp = '192.168.0.10';
var philipshueId = 'HCTjuLgnPvKruerzX3BahuLQxsZXKcO8gwu-13F-';
var philipshueLightnum = 7;
var request = require('request')
var express = require('express');
const rxjs = require('rxjs');
const {
    Subject
} = rxjs;
var app = express();
var server = app.listen(serverPort, function () {
    console.log("Express server has started on port " + serverPort)
})
var io = require('socket.io')(server, {});



var philipshueInfo$ = new Subject();
philipshueInfo$.subscribe({
    next: (v) => {
        // console.log(v);
        io.emit('CurrentPhilipshueInfo', {
            philipshueInfo: v
        })
    }

})
var sensiboInfo$ = new Subject();
sensiboInfo$.subscribe({
    next: (v) => {
        // console.log(v);
        io.emit('CurrentSensiboInfo', {
            sensiboInfo: v
        })
    }

})
var weatherInfo$ = new Subject();
weatherInfo$.subscribe({
    next: (v) => {
        // console.log(v);
        io.emit('CurrentWeatherInfo', {
            weatherInfo: v
        })
    }

})

philipshueInfo$.subscribe(v => console.log(v));

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
        philipshueInfo$.next(lightsate.state);
        // philipshueInfo = lightsate.state;
        // // io.emit('CurrentPhilipshueInfo', {
        // //     philipshueInfo: lightsate.state
        // // })
        // console.log(philipshueInfo);

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
        sensiboInfo$.next(status.result);
        // io.emit('CurrentSensiboInfo', {
        //     sensiboInfo: status.result
        // })
        console.log("<<getSensiboInfo");
    })
}

function getWeatherInfo() {
    console.log(">>getWeatherInfo");

    var url = getWeatherUrl();
    request({
        url: url,
        method: 'GET'
    }, function (error, response, body) {
        let data = JSON.parse(body)
        weatherInfo$.next(data.response.body.items);
        // io.emit('CurrentWeatherInfo', {
        //     weatherInfo: data.response.body.items
        // })
        console.log("<<getWeatherInfo");
    });

}

function getWeatherUrl() {

    var base_date = getDateTime();

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
    return url + queryParams;

}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
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