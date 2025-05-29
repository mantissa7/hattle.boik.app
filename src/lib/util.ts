export const formatTime = (d: number | undefined) => {
	if (!d || d === 0) {
		return "0:00";
	}
	const mins = Math.floor(d / 60);
	const secs = Math.floor(d % 60).toString().padStart(2, "0");
	return `${mins}:${secs}`;
};
