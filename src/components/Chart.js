import React, { useRef, useEffect } from "react";
import styles from "../style/Chart.module.css";

const Chart = ({ data, zoomState, setZoomState }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Calculate the minimum and maximum values for the x and y axes
    const xMin = zoomState?.xMin || Math.min(...data.map((d) => d.x));
    const xMax = zoomState?.xMax || Math.max(...data.map((d) => d.x));
    const yMin = zoomState?.yMin !== undefined ? zoomState.yMin : Math.min(-20, ...data.map((d) => d.y));
    const yMax = zoomState?.yMax !== undefined ? zoomState.yMax : Math.max(20, ...data.map((d) => d.y));

    // Scale functions to map data values to pixel values
    const xScale = (value) => ((value - xMin) / (xMax - xMin)) * (width - margin.left - margin.right) + margin.left;
    const yScale = (value) =>
      height - margin.bottom - ((value - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);

    // Clear the SVG element
    svg.innerHTML = "";

    // Function to create grid lines
    const createGridLines = (orientation) => {
      const gridLines = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gridLines.setAttribute("class", `${orientation}-grid`);

      if (orientation === "x") {
        for (let i = 0; i <= 10; i++) {
          const value = xMin + (i / 10) * (xMax - xMin);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", xScale(value));
          line.setAttribute("x2", xScale(value));
          line.setAttribute("y1", margin.top);
          line.setAttribute("y2", height - margin.bottom);
          line.setAttribute("stroke", "#333");
          line.setAttribute("stroke-dasharray", "2,2");
          gridLines.appendChild(line);
        }
      } else if (orientation === "y") {
        for (let i = 0; i <= 10; i++) {
          const value = yMin + (i / 10) * (yMax - yMin);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", margin.left);
          line.setAttribute("x2", width - margin.right);
          line.setAttribute("y1", yScale(value));
          line.setAttribute("y2", yScale(value));
          line.setAttribute("stroke", "#333");
          line.setAttribute("stroke-dasharray", "2,2");
          gridLines.appendChild(line);
        }
      }

      return gridLines;
    };

    // Append grid lines to the SVG element
    svg.appendChild(createGridLines("x"));
    svg.appendChild(createGridLines("y"));

    // Function to create axes
    const createAxis = (orientation) => {
      const axis = document.createElementNS("http://www.w3.org/2000/svg", "g");
      axis.setAttribute("class", `${orientation}-axis`);

      if (orientation === "x") {
        axis.setAttribute("transform", `translate(0, ${height - margin.bottom})`);
        for (let i = 0; i <= 10; i++) {
          const value = xMin + (i / 10) * (xMax - xMin);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", xScale(value));
          line.setAttribute("x2", xScale(value));
          line.setAttribute("y1", 0);
          line.setAttribute("y2", 5);
          axis.appendChild(line);
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", xScale(value));
          text.setAttribute("y", 20);
          text.textContent = value.toFixed(2);
          text.setAttribute("style", "font-size: 13px; text-anchor: middle;  font-weight: bold;");
          axis.appendChild(text);
        }
      } else if (orientation === "y") {
        axis.setAttribute("transform", `translate(${margin.left}, 0)`);
        for (let i = 0; i <= 10; i++) {
          const value = yMin + (i / 10) * (yMax - yMin);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", 0);
          line.setAttribute("x2", -5);
          line.setAttribute("y1", yScale(value));
          line.setAttribute("y2", yScale(value));
          axis.appendChild(line);
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", -10);
          text.setAttribute("y", yScale(value) + 3);
          text.textContent = value.toFixed(2);
          text.setAttribute("style", "font-size: 11px; text-anchor: end; font-weight: bold;");
          axis.appendChild(text);
        }
      }

      return axis;
    };

    // Append axes to the SVG element
    svg.appendChild(createAxis("x"));
    svg.appendChild(createAxis("y"));

    // Function to create a curve path connecting the data points
    const createCurvePath = (data) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = data
        .map((point, i) => {
          const x = xScale(point.x);
          const y = yScale(point.y);
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(" ");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "blue");
      path.setAttribute("stroke-width", 3);
      return path;
    };

    // Append the curve path to the SVG element
    svg.appendChild(createCurvePath(data));

    // Create data points with hover functionality to show point number
    data.forEach((d, index) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", xScale(d.x));
      circle.setAttribute("cy", yScale(d.y));
      circle.setAttribute("r", 5);
      circle.setAttribute("fill", "red");

      // Add hover functionality to show point number
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `Point ${index + 1}: (${d.x}, ${d.y})`;
      circle.appendChild(title);

      svg.appendChild(circle);
    });

    let startX, startY, rect;

    // Handle mouse down event for zooming
    const handleMouseDown = (e) => {
      startX = e.clientX - svg.getBoundingClientRect().left;
      startY = e.clientY - svg.getBoundingClientRect().top;
      rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", startX);
      rect.setAttribute("y", startY);
      rect.setAttribute("width", 0);
      rect.setAttribute("height", 0);
      rect.setAttribute("fill", "rgba(0, 0, 0, 0.1)");
      rect.setAttribute("stroke", "black");
      svg.appendChild(rect);

      svg.addEventListener("mousemove", handleMouseMove);
      svg.addEventListener("mouseup", handleMouseUp);
    };

    // Handle mouse move event to update the selection rectangle
    const handleMouseMove = (e) => {
      const width = e.clientX - svg.getBoundingClientRect().left - startX;
      const height = e.clientY - svg.getBoundingClientRect().top - startY;
      rect.setAttribute("width", Math.abs(width));
      rect.setAttribute("height", Math.abs(height));
      if (width < 0) rect.setAttribute("x", e.clientX - svg.getBoundingClientRect().left);
      if (height < 0) rect.setAttribute("y", e.clientY - svg.getBoundingClientRect().top);
    };

    // Handle mouse up event to set the new zoom state
    const handleMouseUp = (e) => {
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseup", handleMouseUp);

      const rectX = parseFloat(rect.getAttribute("x"));
      const rectY = parseFloat(rect.getAttribute("y"));
      const rectWidth = parseFloat(rect.getAttribute("width"));
      const rectHeight = parseFloat(rect.getAttribute("height"));

      const newZoomState = {
        xMin: xMin + ((rectX - margin.left) * (xMax - xMin)) / (width - margin.left - margin.right),
        xMax: xMin + ((rectX + rectWidth - margin.left) * (xMax - xMin)) / (width - margin.left - margin.right),
        yMin:
          yMin +
          ((height - rectY - rectHeight - margin.bottom) * (yMax - yMin)) / (height - margin.top - margin.bottom),
        yMax: yMin + ((height - rectY - margin.bottom) * (yMax - yMin)) / (height - margin.top - margin.bottom),
      };

      setZoomState(newZoomState);
      if (rect.parentNode === svg) {
        svg.removeChild(rect);
      }
    };

    // Add event listener for mouse down event
    svg.addEventListener("mousedown", handleMouseDown);

    return () => {
      // Clean up event listener
      svg.removeEventListener("mousedown", handleMouseDown);
    };
  }, [data, zoomState, setZoomState]);

  // Render the SVG element with a fade-in animation
  return (
    <div className={styles.container}>
      <svg ref={svgRef} className={styles.fadeIn}></svg>
    </div>
  );
};

export { Chart };
