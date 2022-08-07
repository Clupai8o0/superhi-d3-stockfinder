d3.json("assets/1y.json").then((data) => {
	const dateParse = d3.timeParse("%Y-%m-%d");

	data = data.map((d) => {
		return { close: d.close, data: dateParse(d.date) };
	});

	const minDate = d3.min(data, (d) => d.date);
	const maxDate = d3.max(data, (d) => d.date);

	const minClose = d3.min(data, (d) => d.close);
	const maxClose = d3.max(data, (d) => d.close);
});
