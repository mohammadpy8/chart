# Overview
**This project demonstrates the creation of a dynamic chart using React, SVG, and Canvas with the ability to zoom into specific areas of the chart. The chart plots a series of (x, y) data points, which are generated dynamically. The project highlights proficiency in React, SVG/Canvas, and handling user interactions.**

## Features
**Dynamic Chart:** *The chart plots a series of (x, y) data points provided in an array.*
**Zoom Tool:** *Users can click and drag to create a rectangular selection area to zoom into.*
**Tooltips:** *Display tooltips on hover over each data point showing the point number and coordinates.*
**Fade-in Animation:** *The chart has a fade-in animation on initial load.*

## App.js
*Generates ordered data points.
Manages the state for data and zoom.
Resets the zoom state when the "Reset Zoom" button is clicked.*

## Chart.js
*Renders the chart using SVG.
Displays grid lines and axes.
Connects data points with a smooth curve.
Adds tooltips for each data point.
Implements zoom functionality.*

## chart.css
*Contains styles for the fade-in animation.*