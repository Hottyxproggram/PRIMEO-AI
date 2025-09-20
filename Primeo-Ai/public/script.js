// script.js
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const scrollBottomBtn = document.getElementById('scroll-bottom-btn');
const apiSelector = document.getElementById('api-selector');

toggleBtn.addEventListener('click',()=> sidebar.classList.toggle('expanded'));

navButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    sections.forEach(s=>s.classList.remove('active'));
    document.getElementById(`${btn.dataset.section}-section`).classList.add('active');
  });
});

// Chat
sendBtn.addEventListener('click', async ()=>{
  const message = chatInput.value.trim();
  if(!message) return;
  appendMessage(message,'user');
  chatInput.value = '';
  appendMessage('Typing...','ai','typing');
  
  const res = await fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt:message,api:apiSelector.value})
  });
  const data = await res.json();
  const typingMsg = document.querySelector('.message.ai.typing');
  if(typingMsg) typingMsg.remove();
  appendMessage(data.response,'ai');
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

function appendMessage(text,cls,extra=''){
  const msg = document.createElement('div');
  msg.className = `message ${cls} ${extra}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
}

// Scroll Buttons
scrollTopBtn.addEventListener('click',()=> chatWindow.scrollTop = 0);
scrollBottomBtn.addEventListener('click',()=> chatWindow.scrollTop = chatWindow.scrollHeight);

// Image
document.getElementById('generate-image-btn').addEventListener('click', async ()=>{
  const prompt = document.getElementById('image-prompt').value.trim();
  const style = document.getElementById('image-style').value;
  if(!prompt) return;
  const res = await fetch('/api/generate-image',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt,style,api:apiSelector.value})
  });
  const data = await res.json();
  const container = document.getElementById('image-results');
  const img = document.createElement('img');
  img.src = data.image_url;
  container.prepend(img);
});

// Video
document.getElementById('generate-video-btn').addEventListener('click', async ()=>{
  const prompt = document.getElementById('video-prompt').value.trim();
  const style = document.getElementById('video-style').value;
  if(!prompt) return;
  const res = await fetch('/api/generate-video',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt,style,api:apiSelector.value})
  });
  const data = await res.json();
  const container = document.getElementById('video-results');
  const video = document.createElement('video');
  video.src = data.video_url;
  video.controls = true;
  container.prepend(video);
});

// Code
document.getElementById('generate-code-btn').addEventListener('click', async ()=>{
  const prompt = document.getElementById('code-prompt').value.trim();
  const language = document.getElementById('code-language').value;
  if(!prompt) return;
  const res = await fetch('/api/generate-code',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt,language,api:apiSelector.value})
  });
  const data = await res.json();
  const container = document.getElementById('code-results');
  const codeDiv = document.createElement('div');
  codeDiv.className = 'code-snippet';
  codeDiv.textContent = data.code;
  container.prepend(codeDiv);
});
