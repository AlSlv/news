let news = [];

let page = 1;
let total_pages = 0;

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => menu.addEventListener("click", (event)=> getNewsByTopic(event))); // 익명의 함수라 에러 ㄴㄴ
let searchButton = document.getElementById("search-button");
// searchButton.addEventListener("click",()=> getNewsByKeyword()); // 호이스팅 문제로 함수 본인 호출하는 경우는 이벤트가 const와 let의 경우 정의 후에 써야함

let url; // 전역으로 선언


// 각 함수에서 필요한 url 만든다
// api 호출 함수를 부른다.

const getNews = async ()=> {
    try {
        let header = new Headers({
            'x-api-key' : 'AIdG5E5AlqqUKpiG7vRM4-quYIiDQvEmYH0PdJN4KBk'
        });
        // console.log(url);

        url.searchParams.set('page', page); //&page=
        console.log("url",url);
        // await 와 async는 세트
        let response = await fetch(url, {headers:header}); // ajax, http, fetch
        console.log("response",response); // <pending> 아직 데이터 안옴
        let data = await response.json(); //body 에서데이터뽑아오기
        
        if(response.status == 200){
            console.log("data",data);
            if(data.total_hits ==0){
                throw new Error("검색된 결과값이 없습니다.");
            }
            news = data.articles;

            total_pages = data.total_pages;
            page = data.page;

            render();
            pagenation();
        } else {
            throw new Error(data.message);
        }
    } catch(error){
        console.log(error.message);
        errorRender(error.message);
    }
}








const getLatestNews = async() =>{
    url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=2');

    /* 중복
    let header = new Headers({
        'x-api-key' : 'AIdG5E5AlqqUKpiG7vRM4-quYIiDQvEmYH0PdJN4KBk'
    });
    // console.log(url);
    // await 와 async는 세트
    let response = await fetch(url, {headers:header}); // ajax, http, fetch
    console.log(response); // <pending> 아직 데이터 안옴
    let data = await response.json(); //body 에서데이터뽑아오기
    // console.log(data);
    news = data.articles;
    console.log(news);

    render();
    */
    getNews();
};

const getNewsByTopic = async (event) => {
    console.log("클릭됨", event.target.textContent);
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=2&topic=${topic}`);
    // console.log("url",url);
    /* 중복
    let header = new Headers({
        'x-api-key' : 'AIdG5E5AlqqUKpiG7vRM4-quYIiDQvEmYH0PdJN4KBk'
    });
    let response = await fetch(url, {headers:header}); 
    let data = await response.json(); 
 
    news = data.articles;

    render();
    */
    getNews();
};

const getNewsByKeyword = async () => {
    //1. 검색 키워드 읽어오기
    let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=1`);
    /* 중복
    let header = new Headers({
        'x-api-key' : 'AIdG5E5AlqqUKpiG7vRM4-quYIiDQvEmYH0PdJN4KBk'
    });
    let response = await fetch(url, {headers:header});
    let data = await response.json();

    news = data.articles;

    render();
    */
    getNews();
};

const render = () =>{
    let newsHTML = '';
    newsHTML = news.map((item)=>{
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}" alt="">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
            ${item.summary}
            </p>
            <div>
            ${item.rights} ${item.published_date}
            </div>
        </div>
    </div>`;
    }).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message)=> {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
    </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () =>{

    // total_page 총 페이지 
    // page 현재 페이지
    // page group
    let pageGroup = Math.ceil(page/5);
    // last page
    let last = pageGroup * 5;
    if(last > totalPage){
        last = totalPage; //마지막 그룹이 5개 이하면
    }

    // first page 뭔지
    let first = last - 4 <= 0? 1 : last - 4; //첫 그룹이 5이하면
    // first - last 페이지 프린트

    // total page 3일 경우 3개의 페이지만 프린트하는법 last, first
    // << >> 버튼만들어주기
    // 내가 그룹 1일때 << 버튼 x, 마지막 그룹일때 >> 버튼 x
    // if(total_pages < 5){
    //     last = pageGroup * total_pages;
    //     first = last - (total_pages-1);
    // }

    if (first >= 6) {
        let pagenationHTML = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1);">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1});">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`;
        }

    for(let i=first;i<=last;i++){
        pagenationHTML += `<li class="page-item ${page==i? "active":""}"><a class="page-link" href="#" onclick="moveToPage(${i});">${i}</a></li>`;
    }

    if (last < totalPage) {
    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages});">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;
    }

    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum)=> {
    //1. 이동하고싶은 페이지 알기
    page = pageNum;
    //2. 이동하고싶은 페이지를 가지고 api 다시 호출
    getNews();
    //3. 
}

searchButton.addEventListener("click",()=> getNewsByKeyword());
getLatestNews();