import { useState } from "react";
import ClickablePlot from "./ClickablePlot.jsx";
import "./styles.css";

function DecisionBoundary() {
	const [xMin, setXMin] = useState("-1");
	const [xMax, setXMax] = useState("1");
	const [yMin, setYMin] = useState("-1");
	const [yMax, setYMax] = useState("1");

	const [dataSource, setDataSource] = useState("manual");

	return (
		<div>
			<h1>Decision Boundary Visualizer</h1>
			<div className="visualizer-container">
		    <ClickablePlot 
					xMin={xMin}
					xMax={xMax}
					yMin={yMin}
					yMax={yMax}
				/>
		    <p>Side bar</p>
			</div>
		</div>
	);
}

export default DecisionBoundary;
