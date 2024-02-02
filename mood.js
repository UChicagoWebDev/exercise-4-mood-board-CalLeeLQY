const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function displaySearchResults(images, relatedSearchTerms) {
  const resultsImageContainer = document.getElementById('resultsImageContainer');
  
  // 清空容器
  resultsImageContainer.innerHTML = '';

  // 遍历并显示每张图片
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.thumbnailUrl;
    imgElement.alt = image.name;
    imgElement.className = 'resultImage';
    
    // 为每张图片添加点击事件，点击后添加到心情板
    imgElement.addEventListener('click', () => addImageToBoard(image.contentUrl));
    
    resultsImageContainer.appendChild(imgElement);
  });
  displayRelatedSearchTerms(relatedSearchTerms);
}

function addImageToBoard(imageUrl) {
  // 向心情板添加图片
  const board = document.getElementById('board');
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  const imageDiv = document.createElement('div');
  imageDiv.className = 'savedImage';
  imageDiv.appendChild(imgElement);
  board.appendChild(imageDiv);
}

function displayRelatedSearchTerms(terms) {
  const relatedSearchTermsContainer = document.getElementById('relatedSearchTerms');
  relatedSearchTermsContainer.innerHTML = ''; // 清除之前的词条

  // 只取前5个搜索推荐
  const topTerms = terms.slice(0, 5);

  topTerms.forEach(term => {
    // 创建一个按钮元素
    const termElement = document.createElement('button');
    termElement.textContent = term.text; // 设置按钮的文本为相关搜索词
    
    // 为每个词条添加点击事件监听器
    termElement.addEventListener('click', () => {
      document.querySelector('.search input').value = term.text; // 将搜索框的值设置为该词条
      runSearch(); // 使用新词条执行搜索
    });

    // 创建一个列表项并将按钮添加到其中
    const listItem = document.createElement('li');
    listItem.appendChild(termElement); // 将按钮添加到列表项
    relatedSearchTermsContainer.appendChild(listItem); // 将列表项添加到容器中
  });
}


function runSearch() {

  // TODO: Clear the results pane before you run a new search
  const resultsImageContainer = document.getElementById('resultsImageContainer');
  resultsImageContainer.innerHTML = '';

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const searchInput = document.querySelector('.search input');
  const query = searchInput.value.trim();
  const searchUrl = `${bing_api_endpoint}?q=${encodeURIComponent(query)}&count=10`; // You can adjust count as needed

  let request = new XMLHttpRequest();
  request.open('GET', searchUrl);
  request.responseType = 'json';
  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.onload = function () {
    if (request.status === 200) {
      const responseData = request.response;
      const images = responseData.value;
      const relatedSearchTerms = responseData.relatedSearches; // Assuming this is how the API returns related searches
      displaySearchResults(images, relatedSearchTerms);
    } else {
      // 错误的响应状态，处理错误
      console.error('Search request failed: ', request.status, request.statusText);
    }
  };

  request.onerror = function () {
    console.error('Network error occurred');
  };

// TODO: Send the request
  request.send();


  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});

document.addEventListener('DOMContentLoaded', () => {
  // 其他代码...

  // 为建议搜索词条添加点击事件监听器
  const suggestedSearchTerms = document.querySelectorAll('#relatedSearchTerms li');
  suggestedSearchTerms.forEach(termElement => {
    termElement.addEventListener('click', () => {
      const term = termElement.textContent;
      document.querySelector('.search input').value = term; // 设置搜索框的值
      runSearch(); // 执行搜索
    });
  });

  // 其他代码...
});
