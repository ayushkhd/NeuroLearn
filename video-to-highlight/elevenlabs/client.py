from elevenlabs import set_api_key, Voice, VoiceSettings, generate, play, save, stream
import time



api_key = '925011858db6abb00c9dacdbb13ef2c3' # Akhil Dhavala's API key
voice_id = 'RE41IpVvESKH1SkTq04p' # Steve Jobs

set_api_key(api_key)

def stream_text_to_speech(text_to_speech: str) -> bytes:
    audio_stream = generate(
        text=text_to_speech,
        voice=Voice(
            voice_id=voice_id,
            settings=VoiceSettings(stability=0.71, similarity_boost=0.5, style=0.0, use_speaker_boost=True)
        )
    )
    return stream(audio_stream)

def play_text_to_speech(text_to_speech: str) -> bytes:
    audio = generate(
        text=text_to_speech,
        voice=Voice(
            voice_id=voice_id,
            settings=VoiceSettings(stability=0.71, similarity_boost=0.5, style=0.0, use_speaker_boost=True)
        )
    )
    return play(audio)

def save_text_to_speech(text_to_speech: str) -> None:
    audio = generate(
        text=text_to_speech,
        voice=Voice(
            voice_id=voice_id,
            settings=VoiceSettings(stability=0.71, similarity_boost=0.5, style=0.0, use_speaker_boost=True)
        )
    )
    timestamp = time.strftime("%Y%m%d%H%M%S")
    filename = f"eleven_labs_steve_jobs_voice_{timestamp}.mp3"
    save(audio, filename)

