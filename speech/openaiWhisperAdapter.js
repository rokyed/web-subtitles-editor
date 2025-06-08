class OpenAIWhisperAdapter extends SpeechAdapter {
  constructor(config = {}) {
    super();
    this.cfg = config;
  }

  setApiKey(key) {
    this.cfg.apiKey = key;
  }

  async transcribe(audioBlob) {
    if (!this.cfg.apiKey) {
      throw new Error('API key not set');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.cfg.apiKey
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }
    const data = await response.json();
    return data.text;
  }
}
