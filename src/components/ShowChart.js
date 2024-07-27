import React, { useState, useEffect } from "react";
import { Chart } from "./Chart";
import styles from "../style/ShowChart.module.css";

const ShowChart = () => {
  const [data, setData] = useState([]);
  const [zoomState, setZoomState] = useState(null);

  useEffect(() => {
    const generateOrderedPoints = (numPoints, step) => {
      const orderedPoints = [];
      for (let i = 0; i < numPoints; i++) {
        const x = i * step + 1; // Generate x values in order (1, 4, 7, 10, ...)
        const y = Math.floor(Math.random() * 41) - 50;
        orderedPoints.push({ x, y });
      }
      return orderedPoints;
    };

    const orderedData = generateOrderedPoints(20, 3); // 25 points with step 3
    setData(orderedData);
  }, []);

  const resetZoom = () => {
    setZoomState(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chart</h1>
      <button className={styles.resetButton} onClick={resetZoom}>
        Reset Zoom
      </button>
      <Chart data={data} zoomState={zoomState} setZoomState={setZoomState} />
      <span className={styles.create}>create by mohammadpy8</span>
    </div>
  );
};

export { ShowChart };
