export const formatTime = (seconds: number) => {
   // Converts seconds to HH:MM:SS format perfectly padded
   return new Date(seconds * 1000).toISOString().substring(11, 19);
};
