from elevenlabs import set_api_key, Voice, VoiceSettings, generate, play, save, stream
import time


api_key = '925011858db6abb00c9dacdbb13ef2c3' # Akhil Dhavala's API key
voice_id = 'RE41IpVvESKH1SkTq04p' # Steve Jobs

set_api_key(api_key)

class SteveJobsVoiceGenerator:
    def __init__(self, voice_id):
        self.voice_id = voice_id

    def generate_audio(self, text_to_speech: str):
        voice_settings = VoiceSettings(stability=0.71, similarity_boost=0.5, style=0.0, use_speaker_boost=True)
        voice = Voice(voice_id=self.voice_id, settings=voice_settings)
        audio = generate(text=text_to_speech, voice=voice)
        return audio

    def stream_text_to_speech(self, text_to_speech: str):
        audio = self.generate_audio(text_to_speech)
        return stream(audio)

    def play_text_to_speech(self, text_to_speech: str):
        audio = self.generate_audio(text_to_speech)
        return play(audio)

    def save_text_to_speech(self, text_to_speech: str):
        audio = self.generate_audio(text_to_speech)
        timestamp = time.strftime("%Y%m%d%H%M%S")
        filename = f"eleven_labs_steve_jobs_voice_{timestamp}.mp3"
        save(audio, filename)
