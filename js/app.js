
function init() {
    gapi.client.setApiKey("AIzaSyAzA01SmHUR6PLf6C9Ea0uwi0mCuxShxo0");  //задаем ключ который создали  в comsoleprogect в проекте
    gapi.client.load("youtube", "v3", function() {  //загружаем нужную  биюлиотеку 
       // window.alert("Library is downloaded!"); //в общем то нет перегрузки метода load с двумя нужными параметрами / поэтому приходится описывать просто пустую фу-цию в ка-ве параметра
    });
}


/*$(window).scroll(function() {    //проверяем где находится скрол / если в конце
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
       next();
   }
});*/


let videoArchieve=[];

 
var nextPageTok;
var prevPageTok;//когда загружаем новые 20 страниц всегда запоминаем пред и след страницы
var numberOfVideos;
var secondWas="next";//запоминает вперед или назад был переход (чтобы знать первые или вторые 10 страниц показывать)

   //функция обработчик event click
    function searchButtonClickFunction() {
	init();
	   numberOfVideos=10;
    let inputString = document.getElementById('inputUserString').value; // со строки поиска что ввел клиент берем значение
    // Use the JavaScript client library to create a search.list() API call.
     let request = gapi.client.youtube.search.list({ //задаем параметры поиска
            part: "snippet",
			//pageToken:2;
            type: "video",  //no channels and no playlists. only videos needed
            q:inputString, //исходя из введенной строки будем делать поиск 
            maxResults: 20,                                                  //val просто возвращает значение атрибута
            order: "viewCount",  // в порядке количества просмотров
       }); 
    // делаем запрос на сервер, в конце запроса вызовется метод handlingResults
    request.execute(handlingResults);
    }

	
    function handlingResults(response) {
 
	
    let stringWithResults="";
	//
	
    for (let indexOfResultVideos=0;indexOfResultVideos<response.result.items.length;indexOfResultVideos++){
    videoArchieve[indexOfResultVideos]=response.result.items[indexOfResultVideos];}
	//заносим в массив
	
	if (secondWas=="next")
	{
    for(let indexOfResultVideos=0;indexOfResultVideos<numberOfVideos;indexOfResultVideos++){
    stringWithResults+=`<div id="item" >
    <h2>${response.result.items[indexOfResultVideos].snippet.title}</h2>
    <a href="https://www.youtube.com/watch?v=$;{response.result.items[indexOfResultVideos].id.videoId}">
    <img  src="https://img.youtube.com/vi/$;{response.result.items[indexOfResultVideos].id.videoId}/0.jpg">
    </a>
    <p>${response.result.items[indexOfResultVideos].snippet.channelTitle}</p>
    <p>${response.result.items[indexOfResultVideos].snippet.description}</p>
    </div>`;

	
	nextPageTok=response.result.nextPageToken;	
    prevPageTok=response.result.prevPageToken;

    }
	}
	else 
	{
 for(let indexOfResultVideos=10;indexOfResultVideos<20;indexOfResultVideos++){
    stringWithResults+=`<div id="item" >
    <h2>${response.result.items[indexOfResultVideos].snippet.title}</h2>
    <a href="https://www.youtube.com/watch?v=$;{response.result.items[indexOfResultVideos].id.videoId}">
    <img  src="https://img.youtube.com/vi/$;{response.result.items[indexOfResultVideos].id.videoId}/0.jpg">
    </a>
    <p >${response.result.items[indexOfResultVideos].snippet.channelTitle}</p>
    <p >${response.result.items[indexOfResultVideos].snippet.description}</p>
    </div>`;

	
	nextPageTok=response.result.nextPageToken;	
    prevPageTok=response.result.prevPageToken;

    }
	}
	

    document.getElementById('resultVideos').innerHTML = stringWithResults;
    }
	
	

    function nextPage(){
    if (numberOfVideos!=20)
    {
    numberOfVideos+=10;
    let stringWithResults="";
    for(let i=numberOfVideos-10;i<numberOfVideos;i++){
    stringWithResults+=`<div id="item">
    <h2 >${videoArchieve[i].snippet.title}</h2>
    <a href="https://www.youtube.com/watch?v=$;{videoArchieve[i].id.videoId}">
    <img  src="https://img.youtube.com/vi/$;{videoArchieve[i].id.videoId}/0.jpg">
    </a>
    <p >${videoArchieve[i].snippet.channelTitle}</p>
    <p >${videoArchieve[i].snippet.description}</p>
    </div>`;
    document.getElementById('resultVideos').innerHTML = stringWithResults;
    }
    }
	else 
	if (numberOfVideos==20)
	{
		secondWas="next";
		сhangePage(nextPageTok,10);////когда перешли на след стр новое кол-во видео равно 10 (1 часть из массив с видео)
	}

    }
	
    function prevPage(){
    if (numberOfVideos!=0) //проверяем 
    {
    numberOfVideos-=10;
    let stringWithResults="";
    for(let i=numberOfVideos+10;i<numberOfVideos;i++){
    stringWithResults+=`<div >
    <h2 >${videoArchieve[i].snippet.title}</h2>
    <a href="https://www.youtube.com/watch?v=$;{videoArchieve[i].id.videoId}">
    <img  src="https://img.youtube.com/vi/$;{videoArchieve[i].id.videoId}/0.jpg">
    </a>
    <p >${videoArchieve[i].snippet.channelTitle}</p>
    <p >${videoArchieve[i].snippet.description}</p>
    </div>`;
    document.getElementById('resultVideos').innerHTML = stringWithResults;
    }
    }
	else 
		if (numberOfVideos==0)
		{
			secondWas="prev";
		сhangePage(prevPageTok,20);//когда перешли на предыд стр новое кол-во видео равно 20 (2 часть из массив с видео)
		}
    }

	
	 function сhangePage(newPage,newNumOfVideos) { //вызывается при нажатии на кнопках / сюда передаем новую страницу на которую переходим 
	init();
    let inputString = document.getElementById('inputUserString').value; // со строки поиска что ввел клиент берем значение
    // Use the JavaScript client library to create a search.list() API call.
     let request = gapi.client.youtube.search.list({ //задаем параметры поиска
            part: "snippet",
			//pageToken:2;
			pageToken:newPage,
            type: "video",  //no channels and no playlists. only videos needed
            q:inputString, //исходя из введенной строки будем делать поиск 
            maxResults: 20,                                                  //val просто возвращает значение атрибута
            order: "viewCount",  // в порядке количества просмотров
       }); 
    // делаем запрос на сервер, в конце запроса вызовется метод handlingResults
		   numberOfVideos=newNumOfVideos;
    request.execute(handlingResults);
	
    }

    