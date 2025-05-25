
// Format duration helper
const leadingZeroFormatter = new Intl.NumberFormat(undefined, { 
    minimumIntegerDigits: 2 
  });
  
  export const formatDuration = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
  
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${minutes}:${leadingZeroFormatter.format(seconds)}`;
    }
  };
  
  // Playback control functions
  export const togglePlayPause = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
  
    if (videoRef.current.paused) {
      videoRef.current.play();
      return true; // is playing
    } else {
      videoRef.current.pause();
      return false; // is paused
    }
  };
  
  export const toggleMute = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return 'muted';
    
    videoRef.current.muted = !videoRef.current.muted;
    
    if (videoRef.current.muted || videoRef.current.volume === 0) {
      return 'muted';
    } else if (videoRef.current.volume >= 0.5) {
      return 'high';
    } else {
      return 'low';
    }
  };
  
  export const setVolume = (
    videoRef: React.RefObject<HTMLVideoElement>, 
    volume: number
  ) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      
      if (volume === 0) {
        return 'muted';
      } else if (volume >= 0.5) {
        return 'high';
      } else {
        return 'low';
      }
    }
    return 'high';
  };
  
  export const changePlaybackSpeed = (
    videoRef: React.RefObject<HTMLVideoElement>, 
    direction: 'increase' | 'decrease' | 'reset'
  ) => {
    if (!videoRef.current) return 1;
  
    let newPlaybackRate = videoRef.current.playbackRate;
    
    if (direction === 'increase') {
      newPlaybackRate += 0.25;
    } else if (direction === 'decrease') {
      newPlaybackRate -= 0.25;
    } else {
      newPlaybackRate = 1;
    }
    
    videoRef.current.playbackRate = newPlaybackRate;
    return newPlaybackRate;
  };
  
  export const skipTime = (
    videoRef: React.RefObject<HTMLVideoElement>,
    seconds: number
  ) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };
  
  // Timeline functions
  export const updateTimeline = (
    videoRef: React.RefObject<HTMLVideoElement>,
    timelineContainerRef: React.RefObject<HTMLDivElement>,
    setCurrentTime: (time: string) => void,
    setTotalTime: (time: string) => void
  ) => {
    if (videoRef.current && !videoRef.current.paused) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      setCurrentTime(formatDuration(currentTime));
      setTotalTime(formatDuration(duration));
      
      const percent = currentTime / duration;
      if (timelineContainerRef.current) {
        timelineContainerRef.current.style.setProperty(
          "--progress-position", 
          percent.toString()
        );
      }
      
      return requestAnimationFrame(() => 
        updateTimeline(videoRef, timelineContainerRef, setCurrentTime, setTotalTime)
      );
    }
    return null;
  };
  
  // File handling functions
  export const createMediaFile = (
    file: File, 
    folderPath: string,
    videoExtensions: string[]
  ) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: videoExtensions.includes(`.${ext}`) ? 'video' : 'audio',
      relativePath: file.webkitRelativePath.substring(folderPath.length + 1)
    };
  };
  
  export const playFile = async (
    file: {
      url: string;
      type: 'video' | 'audio';
      name: string;
    },
    videoRef: React.RefObject<HTMLVideoElement>,
    setCurrentlyPlayingFile: (url: string) => void,
    setCurrentFileTitle: (title: string) => void,
    setIsPlaying: (playing: boolean) => void,
    setIsPaused: (paused: boolean) => void
  ) => {
    if (!file.url || !file.type) return;
  
    setCurrentlyPlayingFile(file.url);
  
    const videoPlayer = videoRef.current;
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement | null;
  
    // Reset states
    setIsPlaying(false);
    setIsPaused(true);
  
    try {
      if (file.type === 'video' && videoPlayer) {
        if (videoPlayer.src === file.url && !videoPlayer.paused) {
          return { success: false, message: "This file is currently playing" };
        }
  
        videoPlayer.src = file.url;
        setCurrentFileTitle(file.name || "Unknown File");
        videoPlayer.style.display = 'block';
        if (audioPlayer) audioPlayer.style.display = 'none';
        
        await videoPlayer.play();
        setIsPlaying(true);
        setIsPaused(false);
        return { success: true };
        
      } else if (file.type === 'audio' && audioPlayer) {
        audioPlayer.src = file.url;
        setCurrentFileTitle(file.name || "Unknown File");
        audioPlayer.style.display = 'block';
        if (videoPlayer) videoPlayer.style.display = 'none';
  
        await audioPlayer.play();
        setIsPlaying(true);
        setIsPaused(false);
        return { success: true };
      }
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
      setIsPaused(true);
      return { success: false, message: "Playback failed" };
    }
    
    return { success: false, message: "No suitable player found" };
  };