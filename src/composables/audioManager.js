import { ref } from 'vue'

let instance = null;

export default function useAudioPlayer() {
  if (instance) return instance;

  const audio = ref(null);
  const isPlaying = ref(false);
  const currentSrc = ref('');

  const play = (src, fallbackSrc = null) => {
    if (audio.value) {
      stop();
    }
    return new Promise((resolve, reject) => {
      currentSrc.value = src;
      audio.value = new Audio(src);
      audio.value.play()
        .then(() => {
          isPlaying.value = true;
          audio.value.addEventListener('ended', () => {
            isPlaying.value = false;
          });
          resolve();
        })
        .catch(error => {
          console.error("Erro ao reproduzir o áudio:", error);
          if (error.name === "NotSupportedError" && fallbackSrc) {
            console.warn("Tentando fonte fallback...");
            currentSrc.value = fallbackSrc;
            audio.value = new Audio(fallbackSrc);
            audio.value.play()
              .then(() => {
                isPlaying.value = true;
                audio.value.addEventListener('ended', () => {
                  isPlaying.value = false;
                });
                resolve();
              })
              .catch(err => {
                console.error("Fallback também falhou:", err);
                reject(err);
              });
          } else {
            reject(error);
          }
        });
    });
  };

  const stop = () => {
    if (audio.value) {
      audio.value.stop();
      audio.value.currentTime = 0;
      isPlaying.value = false;
      audio.value = null;
    }
  };

  instance = {
    audio,
    isPlaying,
    currentSrc,
    play,
    stop,
  };

  return instance;
}
