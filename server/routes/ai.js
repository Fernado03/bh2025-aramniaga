const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SABAHAN_SYSTEM_INSTRUCTION } = require('../config/sabahan-prompt');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-pro-preview';
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash-image';
const GEMINI_FAST_MODEL = process.env.GEMINI_FAST_MODEL || 'gemini-2.5-flash';

// Helper function for retrying API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`Retrying... attempts left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

// ... (previous routes remain unchanged) ...

// @route   POST /api/ai/chat-customer
// @desc    Roleplay as a customer
// @access  Private
router.post('/chat-customer', protect, async (req, res) => {
  try {
    const { scenario, history, userMessage } = req.body;

    if (!scenario || !userMessage) {
      return res.status(400).json({ message: 'Please provide scenario and user message' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_FAST_MODEL });

    // Construct conversation history for context
    let conversationContext = "";
    if (history && history.length > 0) {
      conversationContext = history.map(msg =>
        `${msg.isCustomer ? 'Customer' : 'Seller'}: "${msg.text}"`
      ).join('\n');
    }

    const prompt = `Anda adalah pelanggan dalam situasi ini: "${scenario.description}".
    Situasi: ${scenario.title}
    Emosi Awal: ${scenario.difficulty === 'Sukar' ? 'Marah/Kecewa' : 'Ingin Tahu/Neutral'}
    
    Sejarah Perbualan:
    ${conversationContext}
    Seller: "${userMessage}"
    
    ARAHAN:
    1. Balas sebagai pelanggan.
    2. JANGAN jadi robot. Guna bahasa manusia biasa (Bahasa Malaysia).
    3. Pendek saja (1-2 ayat).
    4. Kalau seller minta bukti gambar (atau anda rasa perlu tunjuk bukti kerosakan), tambah "action": "send_proof" DAN "image_prompt": "English description of the damage".
       Contoh: "image_prompt": "crushed cardboard box with broken ceramic mug inside, poor lighting, realistic phone photo"
    5. Kalau seller sopan & membantu, anda boleh jadi lebih tenang.
    
    Output JSON: { "reply": "...", "action": "send_proof" (optional), "image_prompt": "..." (optional) }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    let reply, action, image_prompt, action_image;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const json = JSON.parse(text);
      reply = json.reply;
      action = json.action;
      image_prompt = json.image_prompt;

      // Dynamic Image Generation using Pollinations.ai
      if (action === 'send_proof' && image_prompt) {
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(image_prompt);
        // Add random seed to ensure uniqueness if generated multiple times
        const randomSeed = Math.floor(Math.random() * 1000);
        action_image = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=400&height=400&nologo=true`;
      }

    } catch (e) {
      reply = text; // Fallback if not JSON
    }

    res.json({ reply, action, action_image });

  } catch (error) {
    console.error('Error in chat customer:', error);
    // Fallback to standard model if fast model fails (e.g. if 2.5 not available)
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(`Act as a customer. Reply to: ${req.body.userMessage}`);
      res.json({ reply: result.response.text() });
    } catch (fallbackError) {
      res.status(500).json({ message: 'Failed to generate reply' });
    }
  }
});

// @route   POST /api/ai/chat-coach
// @desc    Grade customer service session
// @access  Private
router.post('/chat-coach', protect, async (req, res) => {
  try {
    const { scenario, history } = req.body;

    if (!scenario || !history) {
      return res.status(400).json({ message: 'Please provide scenario and history' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const conversationLog = history.map(msg =>
      `${msg.isCustomer ? 'Customer' : 'Seller'}: "${msg.text}"`
    ).join('\n');

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

    Situasi: ${scenario.title} (${scenario.description})
    
    Log Perbualan:
    ${conversationLog}

    Tugas Coach:
    1. Baca perbualan di atas.
    2. Nilai prestasi Seller (User).
    3. Adakah dia tenang? Adakah dia selesaikan masalah? Adakah dia sopan?
    
    Output JSON:
    {
      "grade": "A/B/C/D/F",
      "feedback": "Komen membina dalam Bahasa Malaysia (loghat Sabah sikit). Puji apa yang bagus, tegur apa yang salah.",
      "tips": "1 tip ringkas untuk next time."
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    let coachingResult;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      coachingResult = JSON.parse(text);
    } catch (parseError) {
      coachingResult = {
        grade: 'B',
        feedback: text,
        tips: 'Cuba lagi ya!'
      };
    }

    // Save progress if grade is good
    if (['A', 'B', 'C'].includes(coachingResult.grade)) {
      const user = await User.findById(req.user._id);

      // Save the result
      user.day4Result = coachingResult;

      if (user.progress < 5) {
        user.progress = 5;
      }
      await user.save();
    }

    res.json(coachingResult);
  } catch (error) {
    console.error('Error coaching chat:', error);
    res.status(500).json({
      message: 'Failed to grade reply',
      error: error.message
    });
  }
});

// @route   POST /api/ai/generate-bio
// @desc    Generate Instagram bios
// @access  Private
router.post('/generate-bio', protect, async (req, res) => {
  try {
    const { businessName, niche, description, currentBio } = req.body;

    if (!businessName || !niche) {
      return res.status(400).json({ message: 'Please provide business name and niche' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

    Tugas: Cipta 3 bio Instagram yang menarik untuk bisnes ini.
    Nama Bisnes: ${businessName}
    Niche: ${niche}
    Deskripsi: ${description || 'Tiada deskripsi'}
    
    INPUT PENTING DARI USER (Bio Sekarang): "${currentBio || 'Tiada'}"

    Arahan:
    1. Bio mesti pendek, padat, dan menarik (max 150 characters).
    2. Guna emoji yang sesuai.
    3. Masukkan Call to Action (CTA) yang jelas.
    4. Guna bahasa santai tapi profesional.
    5. Variasikan gaya (WAJIB: Satu MESTI gaya Profesional/Korporat, satu Fun/Santai, satu Minimalis).
    6. STRUKTUR: Gunakan line break untuk nampak kemas. Jangan satu perenggan panjang.
       Contoh Format:
       [Headline/Hook]
       [Value Proposition]
       [CTA & Contact]

    SYARAT WAJIB (JANGAN ABAIKAN):
    - Jika 'INPUT PENTING DARI USER' di atas mengandungi NOMBOR TELEFON (contoh: 01xxxxxx), ANDA WAJIB MASUKKAN nombor tersebut dalam SETIAP pilihan bio.
    - Jika ada LINK (contoh: website.com), WAJIB masukkan.
    - JANGAN ganti nombor telefon dengan "Click link" semata-mata. Tulis nombor itu (contoh: "WS [Nombor]").
    - Jika tiada info contact, baru guna "Click link in bio".
    - JANGAN LETAK HASHTAG (#) dalam bio. Hashtag letak di caption, bukan bio.

    Output JSON SAHAJA:
    {
      "bios": ["Bio 1...", "Bio 2...", "Bio 3..."]
    }`;

    console.log('Bio Gen Input:', { businessName, niche, currentBio }); // Debug log

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log('Bio Gen Raw Output:', text); // Debug log

    let bios;
    try {
      // Clean JSON more aggressively
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanText = jsonMatch ? jsonMatch[0] : text;

      const json = JSON.parse(cleanText);
      bios = json.bios;
    } catch (parseError) {
      console.error('Bio Gen JSON Parse Error:', parseError);

      // Smart Fallback: Include contact info if available
      const contactInfo = currentBio || 'Link in bio';
      bios = [
        `Welcome to ${businessName}! 🌟 The best ${niche} in town. Contact: ${contactInfo} 👇`,
        `${businessName} - ${niche} 💯. Quality guaranteed. WS: ${contactInfo} 📲`,
        `Your trusted ${niche} partner. ${businessName} ✨. ${contactInfo}`
      ];
    }

    res.json({ bios });
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({
      message: 'Failed to generate bio',
      error: error.message
    });
  }
});

// @route   POST /api/ai/generate-hashtags
// @desc    Generate relevant hashtags for Instagram/Facebook posts
// @access  Private
router.post('/generate-hashtags', protect, async (req, res) => {
  try {
    const { keyword, niche } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Please provide a keyword' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

10 hashtags untuk "${keyword}" (Topik/Niche: ${niche || 'General'}). Campur popular, sederhana, niche. Masukkan yang berkaitan Sabah/Malaysia.
Hashtag boleh ada English sikit, tapi kalau ada perkataan Malay lagi bagus.
JSON: ["#tag1", "#tag2", ...]`;

    const result = await retry(() => model.generateContent(prompt));
    const response = await result.response;
    let text = response.text();

    // Parse the response
    let hashtags;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      hashtags = JSON.parse(text);
    } catch (parseError) {
      // Extract hashtags manually
      const hashtagMatches = text.match(/#\w+/g);
      if (hashtagMatches) {
        hashtags = hashtagMatches.slice(0, 10);
      } else {
        hashtags = [
          '#' + keyword,
          '#Malaysia',
          '#MalaysiaBusiness',
          '#SupportLocal',
          '#MadeinMalaysia',
        ];
      }
    }

    // Save hashtags to user profile
    await User.findByIdAndUpdate(req.user._id, {
      $set: { generatedHashtags: hashtags }
    });

    res.json({
      hashtags: hashtags,
      message: 'Hashtags generated successfully',
    });
  } catch (error) {
    console.error('Error generating hashtags:', error);
    res.status(500).json({
      message: 'Failed to generate hashtags',
      error: error.message
    });
  }
});

// @route   POST /api/ai/chat
// @desc    General chat with Coach Digital Sabah
// @access  Private
// NOTE: Uses FULL Sabahan dialect - casual conversation with coach
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

Soalan: "${message}"

Jawab 2-3 ayat jak. Guna full Bahasa Malaysia/Sabahan, jangan campur English.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      message: 'Chat response received',
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({
      message: 'Failed to get response',
      error: error.message
    });
  }
});

// @route   POST /api/ai/generate-scenario
// @desc    Generate a random surprise scenario
// @access  Private
router.post('/generate-scenario', protect, async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_FAST_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

    Tugas: Cipta SATU situasi pelanggan online (e-commerce) yang unik dan mencabar untuk latihan customer service.
    
    Kriteria:
    1. Situasi mesti realistik di Malaysia/Sabah (contoh: barang hilang, scammer, nak COD tapi jauh, barang rosak, tanya soalan pelik).
    2. Mesti berbeza dari yang biasa (kreatif sikit).
    3. Difficulty: Random (Mudah/Sederhana/Sukar).
    
    Output JSON SAHAJA:
    {
      "id": "random_timestamp",
      "title": "Tajuk Pendek (e.g. 'Nak COD Jauh')",
      "icon": "Emoji yang sesuai (e.g. 🛵)",
      "description": "Penerangan ringkas situasi.",
      "initialMessage": "Mesej pertama pelanggan (loghat Sabah/Malay natural).",
      "difficulty": "Mudah/Sederhana/Sukar"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    let scenario;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      scenario = JSON.parse(text);
      scenario.id = `random_${Date.now()}`; // Ensure unique ID
    } catch (parseError) {
      // Fallback scenario if JSON fails
      scenario = {
        id: `random_${Date.now()}`,
        title: 'Pelanggan Misteri',
        icon: '❓',
        description: 'Pelanggan dengan soalan yang tidak dijangka.',
        initialMessage: 'Hello bos, ada jual barang ni tak? Saya cari lama dah.',
        difficulty: 'Sederhana'
      };
    }

    res.json(scenario);
  } catch (error) {
    console.error('Error generating scenario:', error);
    res.status(500).json({
      message: 'Failed to generate scenario',
      error: error.message
    });
  }
});



// @route   POST /api/ai/evaluate-story
// @desc    Evaluate Instagram Story design
// @access  Private
router.post('/evaluate-story', protect, async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'Please provide an image' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

    Tugas: Nilai design Instagram Story ini.
    
    Kriteria Penilaian:
    1. Susun atur (Layout) - Adakah kemas?
    2. Pemilihan Warna & Font - Adakah mudah dibaca?
    3. Kreativiti - Adakah menarik perhatian?
    
    Output JSON SAHAJA:
    {
      "grade": "A/B/C/D/F",
      "feedback": "Komen membina dalam Bahasa Malaysia (loghat Sabah sikit). Puji apa yang cantik, tegur apa yang boleh improve.",
      "tips": "1 tip ringkas untuk design yang lebih gempak."
    }`;

    // Remove header from base64 string if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    let evaluation;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      evaluation = JSON.parse(text);
    } catch (parseError) {
      evaluation = {
        grade: 'B',
        feedback: 'Design okay bah, tapi boleh kasi kemas lagi sikit. Teruskan usaha!',
        tips: 'Cuba guna font yang lebih jelas.'
      };
    }

    // Save result to user profile
    await User.findByIdAndUpdate(req.user._id, {
      $set: { day6Result: evaluation }
    });

    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating story:', error);
    res.status(500).json({
      message: 'Failed to evaluate story',
      error: error.message
    });
  }
});

// @route   POST /api/ai/analyze-image
// @desc    Analyze image and generate captions
// @access  Private
router.post('/analyze-image', protect, async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'Please provide an image' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL });

    const prompt = `${SABAHAN_SYSTEM_INSTRUCTION}

    Tugas: Analisis gambar ini untuk tujuan marketing media sosial.
    
    Arahan:
    1. Berikan GRED (A/B/C/D/F) untuk kualiti gambar.
    2. Berikan komen ringkas tentang kualiti gambar (pencahayaan, angle, dll).
    3. Cadangkan 3 caption yang menarik untuk posting media sosial (Instagram/Facebook) IKUT SUSUNAN INI:
       - Caption 1: Gaya Santai (Casual/Rileks)
       - Caption 2: Soft Sell (Bercerita/Mendidik)
       - Caption 3: Hard Sell (Direct offer/Promo)
    5. PENTING: JANGAN letak hashtag (#) dalam caption. Hashtag akan diletakkan di bahagian lain.
    
    Output JSON SAHAJA:
    {
      "grade": "A/B/C/D/F",
      "feedback": "Komen tentang gambar...",
      "captions": ["Caption 1...", "Caption 2...", "Caption 3..."]
    }`;

    // Remove header from base64 string if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ];

    const result = await retry(() => model.generateContent([prompt, ...imageParts]));
    const response = await result.response;
    let text = response.text();
    console.log('Analyze Image Raw Output:', text); // Debug log

    let analysis;
    try {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(text);
      console.log('Parsed Analysis:', analysis); // Debug log
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError); // Debug log
      analysis = {
        grade: 'B',
        feedback: 'Gambar yang menarik! Pencahayaan nampak okay.',
        captions: [
          'Check out this amazing product! ✨',
          'Barang baik punya! Dapatkan sekarang. 🔥',
          'Quality terbaik untuk anda. Hubungi kami segera! 📞'
        ]
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({
      message: 'Failed to analyze image',
      error: error.message
    });
  }
});

module.exports = router;
