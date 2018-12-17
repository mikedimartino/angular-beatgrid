// Type definitions for Web Audio API
// Project: http://www.w3.org/TR/webaudio/
// Definitions by: Baruch Berger <https://github.com/bbss>, Kon <http://phyzkit.net/>, kubosho <https://github.com/kubosho>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//

// DEPRECATED: use TypeScript 1.5.3

declare var webkitAudioContext: {
    new (): AudioContext;
}

declare var webkitOfflineAudioContext: {
    new (numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
}

interface AudioContextConstructor {
    new(): AudioContext;
}

interface Window {
    AudioContext: AudioContextConstructor;
}

interface AudioContext {
    createMediaStreamSource(stream: MediaStream): MediaStreamAudioSourceNode;
}

interface MediaStreamAudioDestinationNode extends AudioNode {
    stream: MediaStream;
}

interface AudioBuffer {
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;

    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
}

interface AudioNode {
    disconnect(destination: AudioNode): void;
}

interface AudioContext {
    suspend(): Promise<void>;
    resume(): Promise<void>;
    close(): Promise<void>;
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
}
