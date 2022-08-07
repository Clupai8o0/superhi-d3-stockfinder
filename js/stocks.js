const svg = d3.select("svg");
svg.attr("viewBox", "0 0 960 320");

// const url = "https://api.superhi.com/api/stocks/fb";
const url = "assets/1y.json";

d3.json(url).then((data) => {
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

	const hoverGroup = svg.append("g").attr("transform", "translate(100, 100)");
	hoverGroup
		.append("rect")
		.attr("x", -50)
		.attr("y", -60)
		.attr("width", 100)
		.attr("height", 50);
	hoverGroup.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 7);

	const closeText = hoverGroup
		.append("text")
		.attr("class", "close")
		.attr("x", 0)
		.attr("y", -37)
		.text("hi");

	const dateText = hoverGroup
		.append("text")
		.attr("class", "date")
		.attr("x", 0)
		.attr("y", -18)
		.text("date");

	svg.on("mousemove", function () {
		const mouse = d3.mouse(this);
		const mouseX = mouse[0];
		const mouseDate = dateScale.invert(mouseX);
		const bisector = d3.bisector((d) => d.date).right;
		const i = bisector(data, mouseDate);
		const dataPoint = data[i];

		closeText.text(dataPoint.close);
		hoverGroup.attr("transform", `translate(${mouseX},100)`);
	});

	svg.on("mouseout", function () {
		hoverGroup.attr("transform", "translate(-9999, -99999)");
	});
});
