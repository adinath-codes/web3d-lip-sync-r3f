import { useEffect, useRef, useState } from "react";
import { lipsyncManager } from "../App";

const audioFiles = [
  {
    name: "audios",
    files: [
      {
        name: "Audio 1",
        path: "audios/audio1.mp3",
      },
      {
        name: "Audio 2",
        path: "audios/audio2.mp3",
      },
      {
        name: "Audio 3",
        path: "audios/audio3.mp3",
      },
    ],
  },
];

export const Visualizer = () => {
  const visemeRef = useRef(null);
  const volumeRef = useRef(null);
  const centroidRef = useRef(null);

  const audioRef = useRef(null);
  const [audioFile, setAudioFile] = useState("");

  useEffect(() => {
    const handleAudioEnded = () => {
      setAudioFile("");
    };
    audioRef.current?.addEventListener("ended", handleAudioEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleAudioEnded);
    };
  }, []);

  useEffect(() => {
    if (!audioFile) {
      return;
    }

    // Create or update audio element
    audioRef.current.src = audioFile; // Update source
    lipsyncManager.connectAudio(audioRef.current);

    // Connect audio to lipsync
    audioRef.current.play();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // Do not clear src to allow reuse
      }
    };
  }, [audioFile]);
  const prevViseme = useRef(null);

  useEffect(() => {
    const analyzeAudio = () => {
      requestAnimationFrame(analyzeAudio);
      lipsyncManager.processAudio();
      const viseme = lipsyncManager.viseme;
      const features = lipsyncManager.features;
      if (visemeRef.current) {
        visemeRef.current.innerText = viseme;
      }
      if (volumeRef.current) {
        volumeRef.current.innerText = features.volume.toFixed(2);
      }
      if (centroidRef.current) {
        centroidRef.current.innerText = `${features.centroid.toFixed(2)} Hz`;
      }

      if (viseme !== prevViseme.current) {
        prevViseme.current = viseme;
      }
    };

    analyzeAudio();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4">
        <audio ref={audioRef} controls className="w-full" />
      </section>
      <div className="pointer-events-auto flex flex-col gap-4">
        {audioFiles.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-left">{section.name}</h2>
            <div className="flex flex-row items-center justify-start gap-2 flex-wrap">
              {section.files.map((audio, index) => (
                <button
                  key={index}
                  className="p-2 text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer rounded min-w-12"
                  onClick={() => setAudioFile(audio.path)}
                >
                  {audio.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
