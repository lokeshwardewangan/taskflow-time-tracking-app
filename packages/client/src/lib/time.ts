export const formatTime = (seconds: number = 0) => {
   if (!seconds || isNaN(seconds)) seconds = 0;
   // Converts seconds to HH:MM:SS format perfectly padded
   return new Date(seconds * 1000).toISOString().substring(11, 19);
};
