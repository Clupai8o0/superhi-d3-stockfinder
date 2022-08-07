const svg = d3.select("svg");
svg.attr("viewBox", "0 0 960 320");

d3.json("assets/1y.json").then((data) => {
	const dateParse = d3.timeParse("%Y-%m-%d");

	data = data.map((d) => {
		return { close: d.close, date: dateParse(d.date) };
	});

	const minDate = d3.min(data, (d) => d.date);
	const maxDate = d3.max(data, (d) => d.date);

	const minClose = d3.min(data, (d) => d.close);
	const maxClose = d3.max(data, (d) => d.close);

	const dateScale = d3.scaleTime().domain([minDate, maxDate]).range([60, 900]);
	const closeScale = d3
		.scaleLinear()
		.domain([minClose, maxClose])
		.range([280, 60]);

	const line = d3
		.line()
		.x((d) => dateScale(d.date))
		.y((d) => closeScale(d.close));

	const area = d3
		.area()
		.x0((d) => dateScale(d.date))
		.x1((d) => dateScale(d.date))
		.y0(() => closeScale(minClose - 10))
		.y1((d) => closeScale(d.close));

	svg.append("path").datum(data).attr("class", "area").attr("d", area);
	svg.append("path").datum(data).attr("class", "line").attr("d", line);
});
