// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

app.post('/api/chat', async (req,res)=>{
  const { prompt, api } = req.body;
  try {
    let responseText = "";
    if(api==="DeepSeek"){
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions',{
        model:"deepseek-model",
        messages:[{role:"user",content:prompt}]
      },{headers:{Authorization:`Bearer ${process.env.DEEPSEEK_API_KEY}`}});
      responseText = response.data.choices[0].message.content;
    } else if(api==="Gemini"){
      const response = await axios.post('https://api.google.com/gemini/v1/models/gemini-2.5-flash/generateContent',{
        contents: prompt
      },{headers:{Authorization:`Bearer ${process.env.GEMINI_API_KEY}`}});
      responseText = response.data.text;
    } else if(api==="Blackbox"){
      const response = await axios.post('https://api.blackbox.ai/chat/completions',{
        model:"blackboxai/black-forest-labs/flux-pro",
        messages:[{role:"user",content:prompt}]
      },{headers:{Authorization:`Bearer ${process.env.BLACKBOX_API_KEY}`}});
      responseText = response.data.choices[0].message.content;
    } else return res.status(400).json({error:"Invalid API"});
    res.json({response: responseText});
  } catch(e){
    console.error(e);
    res.status(500).json({error:"Chat API Error"});
  }
});

app.post('/api/generate-image', async (req,res)=>{
  const { prompt, style, api } = req.body;
  try {
    let imageUrl = "";
    if(api==="DeepSeek"){
      const response = await axios.post('https://api.deepseek.com/v1/images/generate',{
        prompt, style, resolution:"4K"
      },{headers:{Authorization:`Bearer ${process.env.DEEPSEEK_API_KEY}`}});
      imageUrl = response.data.image_url;
    } else if(api==="Gemini"){
      const response = await axios.post('https://api.google.com/gemini/v1/models/gemini-2.5-flash-image/generate',{
        prompt
      },{headers:{Authorization:`Bearer ${process.env.GEMINI_API_KEY}`}});
      imageUrl = response.data.image_url;
    } else if(api==="Blackbox"){
      const response = await axios.post('https://api.blackbox.ai/chat/completions',{
        model:"blackboxai/black-forest-labs/flux-pro",
        messages:[{role:"user",content:prompt}]
      },{headers:{Authorization:`Bearer ${process.env.BLACKBOX_API_KEY}`}});
      imageUrl = response.data.choices[0].message.content;
    } else return res.status(400).json({error:"Invalid API"});
    res.json({image_url:imageUrl});
  } catch(e){
    console.error(e);
    res.status(500).json({error:"Image API Error"});
  }
});

app.post('/api/generate-video', async (req,res)=>{
  const { prompt, style, api } = req.body;
  try {
    let videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // placeholder
    res.json({video_url:videoUrl});
  } catch(e){
    console.error(e);
    res.status(500).json({error:"Video API Error"});
  }
});

app.post('/api/generate-code', async (req,res)=>{
  const { prompt, language, api } = req.body;
  try {
    let codeText = `// ${api} generated ${language} code\nconsole.log('Hello World');`;
    res.json({code:codeText});
  } catch(e){
    console.error(e);
    res.status(500).json({error:"Code API Error"});
  }
});

app.listen(PORT,()=>console.log(`Primeo AI running on port ${PORT}`));
