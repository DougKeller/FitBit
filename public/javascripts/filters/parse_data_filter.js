angular.module('fitbit.filters').filter('parseData', [function() {
	return function(data) {
		var parsed = []
		var nextPos = 0

		function formatTime(hour, minute) {
			var e = hour < 12 ? 'am' : 'pm'
			var mod = hour % 12
			hour = hour || 12
			hour = (mod > 0) ? mod : hour

			if(minute < 10) {
				minute = '0' + minute
			}

			return '' + hour + ':' + minute + e
		}

		function addEntry(value) {
			var hour = Math.floor(nextPos / 60)
			var minute = nextPos - hour * 60
			var label = formatTime(hour, minute)
			var chartLabel = minute === 0 ? label : ''

			parsed.push({ chartLabel: chartLabel, label: label, value: value })
			nextPos += 1
		}

		data.forEach(function(entry) {
			var split = entry.time.split(':')
			var pos = parseInt(split[0]) * 60 + parseInt(split[1])

			while(nextPos !== pos) {
				addEntry(0)
			}

			addEntry(entry.value)
		})

		while(nextPos < 1440) {
			addEntry(0)
		}

		var chartLabels = parsed.map(function(v) {
			return v.chartLabel
		})
		var labels = parsed.map(function(v) {
			return v.label
		})
		var values = parsed.map(function(v) {
			return v.value
		})

		return { chartLabels: chartLabels, labels: labels, values: values, length: labels.length }
	}
}])