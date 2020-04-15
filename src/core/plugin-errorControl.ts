
export default function errorCtr (ctx: any) {
	window.addEventListener('load', (e) => {
		function updateOnlineStatus() {
			const condition = navigator.onLine ? "online" : "offline"
			const { effectiveType, rtt, downlink, saveData} = navigator.connection

			ctx.connection = {
				status: condition,
				effectiveType, 
				rtt, 
				downlink, 
				saveData
			}

			// todo: show status bar
		}

		window.addEventListener('online', updateOnlineStatus)
		window.addEventListener('offline', updateOnlineStatus)
		navigator.connection &&
		navigator.connection.addEventListener('change', updateOnlineStatus)

		return () => {
			window.removeEventListener('online', updateOnlineStatus)
			window.removeEventListener('offline', updateOnlineStatus)
			navigator.connection &&
			navigator.connection.removeEventListener('change', updateOnlineStatus)
		}
	})
}