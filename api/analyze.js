module.exports = async (req, res) => {
    // Дозволяємо CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }
        
        const apiKey = '16749e13b0msh437c9c685ba695bp10d553jsn871fbf3b2535';
        
        const response = await fetch('https://caloai.p.rapidapi.com/v1/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'caloai.p.rapidapi.com'
            },
            body: JSON.stringify({ image })
        });
        
        const data = await response.json();
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};
