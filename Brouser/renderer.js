let tabs = [];
let bookmarks = [];

function createTab(url = 'https://www.example.com') {
  const tabId = `tab-${Date.now()}`;
  tabs.push({ id: tabId, url });

  const tabElement = document.createElement('button');
  tabElement.textContent = `Tab ${tabs.length}`;
  tabElement.onclick = () => switchTab(tabId);
  document.getElementById('tabs').appendChild(tabElement);

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.id = tabId;
  iframe.style.display = 'none';
  document.getElementById('content').appendChild(iframe);

  switchTab(tabId);
}

function switchTab(tabId) {
  document.querySelectorAll('iframe').forEach((iframe) => {
    iframe.style.display = iframe.id === tabId ? 'block' : 'none';
  });
}

function goBack() {
  const activeTab = getActiveTab();
  if (activeTab) document.getElementById(activeTab.id).contentWindow.history.back();
}

function goForward() {
  const activeTab = getActiveTab();
  if (activeTab) document.getElementById(activeTab.id).contentWindow.history.forward();
}

function navigate() {
  const url = document.getElementById('url').value;
  const activeTab = getActiveTab();
  if (activeTab) {
    document.getElementById(activeTab.id).src = url.startsWith('http') ? url : `https://${url}`;
  }
}

function addBookmark() {
  const activeTab = getActiveTab();
  if (activeTab) {
    bookmarks.push(activeTab.url);
    alert(`Bookmarked: ${activeTab.url}`);
  }
}

function getActiveTab() {
  return tabs.find((tab) => document.getElementById(tab.id).style.display === 'block');
}

// Подключаем IPC для новых вкладок
window.electronAPI.onNewTab((url) => createTab(url));
