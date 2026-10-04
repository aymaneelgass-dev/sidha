<?php

namespace App\Enums;

enum StudioServiceType: string
{
    case MusicRecording = 'music-recording';
    case VoiceOver = 'voice-over';
    case Podcast = 'podcast';
    case AudioAdvertising = 'audio-advertising';
}
