/* D3 Data Visualization Prototypes
  This is a collection of various D3 data visualizations using different statistical
  data. A FreeCodeCamp directed project.

  References:
      - http://bl.ocks.org/kiranml1/6872226
      - http://bl.ocks.org/d3noob/8952219
      - http://codepen.io/FreeCodeCamp/pen/adBBWd
      - https://bl.ocks.org/mbostock/4062045
      - http://codepen.io/FreeCodeCamp/full/GoNNEy
      - http://codepen.io/FreeCodeCamp/full/rxWWGa

  www.softwareontheshore.com
  Michael Sharp 2016 */

  /*jshint esnext: true */


(function() {
  "use strict";

  /****************** React Bootstrap Components *******************/
  const Button = ReactBootstrap.Button;
  const ButtonToolbar = ReactBootstrap.ButtonToolbar;

  /* Graph Data API Calls */
  const BAR_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  const SCATTER_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  const HEAT_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  const FORCE_URL = "http://www.freecodecamp.com/news/hot";
  const GLOBAL_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

  const Collection = React.createClass({ displayName: "Collection",
    propTypes: {
      barURL: React.PropTypes.string.isRequired,
      scatterURL: React.PropTypes.string.isRequired,
      heatURL: React.PropTypes.string.isRequired,
      forceURL: React.PropTypes.string.isRequired,
      globalURL: React.PropTypes.string.isRequired,
    },
    getInitialState: function getInitialState() {
      return null;
    },
    componentDidMount: function comonentDidMount() {
    },
    /* Function that uses the document DOM object to query for all graphs and then
      manipulate the classes of each graph and show the selection while hiding the rest */
    showGraph: function showGraph(graph) {
      let buttons = [].slice.call(document.getElementsByClassName("graph"));
      let shownGraph = document.getElementById(graph + "-graph");

      buttons.forEach(function(button) {
        if(!button.classList.contains("hidden")) {
          button.classList.add("hidden");
        }
        if(button.classList.contains("active")) {
          button.classList.remove("active");
        }
      });

      shownGraph.classList.remove("hidden");
      shownGraph.classList.add("active");
    },
    render: function render() {
      return (
        React.createElement("div", { id: "content", className: "container" },
          React.createElement("div", { id: "toolbar" },
            React.createElement(ButtonToolbar, { id: "buttons" },

              React.createElement(Button, { id: "bar-btn",
                onClick: this.showGraph.bind(null, "bar"), bsStyle: "warning" }, "Bar Graph"),

              React.createElement(Button, { id: "scatter-btn",
                onClick: this.showGraph.bind(null, "scatter"), bsStyle: "warning" }, "Scatterplot Graph"),

              React.createElement(Button, { id: "heat-btn",
                onClick: this.showGraph.bind(null, "heat"), bsStyle: "warning" }, "Heat Map"),

              React.createElement(Button, { id: "force-btn",
                onClick: this.showGraph.bind(null, "force"), bsStyle: "warning" }, "Force Directed Graph"),

              React.createElement(Button, { id: "global-btn",
                onClick: this.showGraph.bind(null, "global"), bsStyle: "warning" }, "Global Data Map")
            )
          ),
          React.createElement("div", { id: "graphs" },
            React.createElement(Bar, { barURL: this.props.barURL }),
            React.createElement(Scatterplot, { scatterURL: this.props.scatterURL }),
            React.createElement(HeatMap, { heatURL: this.props.heatURL }),
            React.createElement(ForceDirected, { forceURL: this.props.forceURL }),
            React.createElement(GlobalMap, { globalURL: this.props.globalURL })
          )
        )
      );
    }
  });

  const Bar = React.createClass({ displayName: "Bar",
    propTypes: {
      barURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return {
        rawData: null,
        barData: null
      };
    },
    componentDidMount: function componentDidMount() {
      /* D3 ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = d3.json(this.props.barURL, function(error, result) {
        if(error) console.error("Error fetching bar data!", error);

        this.setState({ rawData: result, barData: result.data });
        this.drawBarGraph();
      }.bind(this));
    },
    drawBarGraph: function drawBarGraph() {
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      /* Dynamically add title text and description */
      d3.select("#bar-graph").append("h3").text("US Gross Domestic Product");
      d3.select("#bar-graph").append("p").text(this.state.rawData.source_name);

      /* Set graph margins */
      let margin = { top: 10, right: 20, bottom: 20, left: 50 };
      let width = 1100 - margin.left - margin.right;
      let height = 600 - margin.top - margin.bottom;
      let barWidth = Math.ceil(width / this.state.barData.length);

      /* Get the first and last date of the GDP date, which is in the first element
        of the data array */
      let beginDate = new Date(this.state.barData[0][0]);
      let endDate = new Date(this.state.barData[this.state.barData.length - 1][0]);

      /* set the x and y domains and domain representations
        x - beginning to end dates of the GDP data
        y - GDP that corresponds to that date */
      let x = d3.time.scale().domain([beginDate, endDate]).range([0, width]);
      let y = d3.scale.linear().range([height, 0])
        .domain([0, d3.max(this.state.barData, (d) => { return d[1]; }) ]);


      /* set the orientation, scale and tick style of the x and y axis */
      let xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years, 4);
      let yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "");

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#bar-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

    /* render and define te svg element where the graph will reside */
     let graph = d3.select("#bar-graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /* draw the x axis */
      graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      /* draw the y axis */
      graph.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "0.8em")
         .style("text-anchor", "end")
         .text("Billions ($)");

      /* populate the graph with bars */
      graph.selectAll(".bar")
        .data(this.state.barData)
        .enter().append("rect")
          .attr("class", "bar")
          .style("fill", "steelblue")
          .attr("x", (d) => { return x(new Date(d[0])); })
          .attr("y", (d) => { return y(d[1]); })
          .attr("height", (d) => { return height - y(d[1]); })
          .attr("width", barWidth - .5)

          //Mouse hover event on each bar for tooltip
          .on("mouseover", function(d) {
            let element = d3.select(this).attr("class", "mouseover");
            let pointInTime = new Date(d[0]);
            let domesticProduct = d[1];

            tooltipElement.transition().duration(150)
              .style("opacity", 0.9);

            tooltipElement.html("<p class='gdp'>" + d3.format("$,.2f")(domesticProduct) +
              " Billions</p><br><p class='year'>" + pointInTime.getFullYear() + " - " +
              months[pointInTime.getMonth()] + "<p>")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 50) + "px");
          })

          //Mouse ends hover event
          .on("mouseout", function() {
            let element = d3.select(this).attr("class", "mouseout");
            tooltipElement.transition().duration(300)
              .style("opacity", 0);
          });
    },
    render: function render() {
      return(
        React.createElement("div", { id: "bar-graph", className: "graph active"})
      );
    }
  });

  const Scatterplot = React.createClass({ displayName: "Scatterplot",
    propTypes: {
      scatterURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { scatterData: null };
    },
    componentDidMount: function componentDidMount() {
      /* D3 ajax call for scatter Data. Asynchronous, so we need to put the drawGraph
      function inside the request callback */
      this.serverRequest = d3.json(this.props.scatterURL, function(error, result) {
        if(error) console.error("Error in fetching scatter data!", error);
        this.setState({ scatterData: result });
        this.drawScatterGraph();
      }.bind(this));
    },
    drawScatterGraph: function drawScatterGraph() {
      /* Dynamically add title text and description */
      d3.select("#scatter-graph").append("h3").text("Doping in Professional Bicycle Racing");
      d3.select("#scatter-graph").append("p").text("35 Fastest - Alpe d'Huez (13.8km Normalized Distance)");

      /* Set graph margins */
      let margin = { top: 10, right: 20, bottom: 20, left: 50 };
      let width = 900 - margin.left - margin.right;
      let height = 400 - margin.top - margin.bottom;

      /* find the fastest and slowest for the x domain and placement for the y domain */
      let fastestTime = d3.min(this.state.scatterData, (d) => { return d.Seconds; });
      let slowestTime = d3.max(this.state.scatterData, (d) => { return d.Seconds; });
      let lastPlace = d3.max(this.state.scatterData, (d) => { return d.Place; });
      let firstPlace = 1;

      /* set the x and y domains and domain representations
        x - time out from fastest
        y - placement in the race */
      let x = d3.scale.linear().domain([slowestTime / 13, 0]).range([0, width]);
      let y = d3.scale.linear().domain([firstPlace, lastPlace + 1]).range([0, height]);

      /* set the orientation, scale and tick style of the x and y axis */
      let xAxis = d3.svg.axis()
        .scale(x).orient("bottom").ticks(7).tickFormat((d) => {
          let time = new Date(1111, 0, 1, 0, d);
          time.setSeconds(time.getSeconds() + d);
          return d3.time.format("%H:%M")(time);
        });
      let yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#scatter-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

      /* render and define te svg element where the graph will reside */
       let graph = d3.select("#scatter-graph").append("svg")
          .attr("width", width + margin.left + margin.right + 100)
          .attr("height", height + margin.bottom + margin.top + 25)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        /* Label the graph plots */
        graph.selectAll("text")
          .data(this.state.scatterData)
          .enter().append("text")
            .text( (d) => { return d.Name; })
            .attr("x", (d) => { return x(d.Seconds - fastestTime); })
            .attr("y", (d) => { return y(d.Place); })
            .attr("transform", "translate(10, +5)");

        /* Draw the x and y axis */
        graph.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis).append("text")
            .attr("x", 300)
            .attr("y", 35)
            .attr("dy", ".40em")
            .style("text-anchor", "middle")
            .text("Minutes Outside of Fastest Time");

        graph.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis).append("text")
            .attr("x", 0)
            .attr("y", -30)
            .attr("dy", ".40em")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .text("Position");

        /* Add the legend dots */
        graph.selectAll(".legend")
          .data([{ dope: false, y: 20, x: 20 }, { dope: true, y: 22, x: 20 }])
          .enter().append("circle")
          .attr("class", "legend")
          .attr("r", 4)
          .attr("cx", (d) => { return x(d.x); })
          .attr("cy", (d) => { return y(d.y); })
          .attr("fill", (d) => { return (d.dope ? "red" : "green"); });

        /* Add the legend text */
        graph.selectAll(".legend-text")
          .data([{ dope: false, y: 20, x: 15 }, { dope: true, y: 22, x: 15 }])
          .enter().append("text")
            .attr("class", "legend-text")
            .attr("x", (d) => { return x(d.x); })
            .attr("y", (d) => { return y(d.y); })
            .text( (d) => { return (!d.dope ? "- Indicates No Allegations" : "- Indicates Doping Allegations"); });

        /* populate the graph with plot points */
        graph.selectAll(".circle")
          .data(this.state.scatterData)
          .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", (d) => { return x(d.Seconds - fastestTime); })
            .attr("cy", (d) => { return y(d.Place); })
            .attr("r", 5)
            .attr("fill", (d) => { return (d.Doping === "" ? "green" : "red"); })
            .attr("data-legend", (d) => { return (d.Doping === "" ? "No Allegations" : "Doping Allegations"); })

            //Mouse hover event on each bar for tooltip
            .on("mouseover", function(d) {
              let element = d3.select(this).attr("class", "mouseover");
              let allegationElement = d.Doping !== "" ? "" + d.Doping : "No allegations of doping.";

              let name =  d.Name;
              let year = d.Year;
              let nationality = d.Nationality;
              let time = d.Time;

              tooltipElement.transition().duration(150)
                .style("opacity", 0.9);

              tooltipElement.html("<em class='name'>" + name + "</em><br><p>" + year +
                "</p><p>" + nationality + "</p><p>" + time +
                "<p>" + allegationElement + "</p>")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
            })

            //Mouse ends hover event
            .on("mouseout", function() {
              let element = d3.select(this).attr("class", "mouseout");
              tooltipElement.transition().duration(300)
                .style("opacity", 0);
            });
    },
    render: function render() {
      return(
        React.createElement("div", { id: "scatter-graph", className: "graph hidden" })
      );
    }
  });

  const HeatMap = React.createClass({ displayName: "HeatMap",
    propTypes: {
      heatURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { heatMapData: null };
    },
    componentDidMount: function componentDidMount() {
      /* d3 ajax call for heat data. Asynchronous, so we need to put the drawGraph
      function inside the request callback */
      this.serverRequest = d3.json(this.props.heatURL, function(error, result) {
        if(error) console.error("Error fetching heat data!", error);

        this.setState({ heatMapData: result });
        this.drawHeatMap();
      }.bind(this));
    },
    drawHeatMap: function drawHeatMap() {
      /* Dynamically add title text and description */
      d3.select("#heat-graph").append("h3").text("Monthly Global Land-Surface Temperature");
      d3.select("#heat-graph").append("h4").text("1753 - 2015");
      d3.select("#heat-graph").append("p").text("Temperatures are in Celsius and reported as" +
            " anomalies relative to the Jan 1951-Dec 1980 average.");
      d3.select("#heat-graph").append("p").text("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07");

      /* Set graph margins and dimensions*/
      let margin = { top: 20, right: 20, bottom: 120, left: 100 };
      let width = 1100 - margin.left - margin.right;
      let height = 600 - margin.top - margin.bottom;

      /* Graph Scope Variables */
      let months = ["January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"];
      let colorVariance = ["#FF86DB", "#FFD2F2", "#34738C", "#91C4D8", "#D1F1FE",
                          "#FFFFC0", "#FFFF72", "#FFD072", "#FFB872", "#FF8972", "#8C1700"];
      let baseTemp = this.state.heatMapData.baseTemperature;

      /* Extract only the unique years from each data point */
      let recordedYears = this.state.heatMapData.monthlyVariance.map(
        (variance) => { return variance.year; });
      recordedYears = recordedYears.filter( (y, i) => { return recordedYears.indexOf(y) === i; });

      /* Extract the monthly variances and find the lows / highs */
      let monthlyVarianceData = this.state.heatMapData.monthlyVariance.map(
        (variance) => { return variance.variance; });

      /* Extract the highest and lowest data points */
      let lowestVariance = d3.min(monthlyVarianceData);
      let highestVariance = d3.max(monthlyVarianceData);
      let oldestYear = d3.min(recordedYears);
      let recentYear = d3.max(recordedYears);
      let beginDate = new Date(oldestYear, 0);
      let endDate = new Date(recentYear, 0);

      /* Find the dimensions of the heat map */
      let mapWidth = width / recordedYears.length;
      let mapHeight = height / months.length - .5;

      /* Draw the color variance legend */
      let varianceScale = d3.scale.quantile()
        .domain([lowestVariance + baseTemp, highestVariance + baseTemp]).range(colorVariance);

      /* set the x domains and domain representations, scale and style
        x - time (years) */
      let x = d3.time.scale().domain([beginDate, endDate]).range([0, width]);
      let xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years, 11);

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#heat-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

      /* draw the svg and graph*/
      let graph = d3.select("#heat-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /* Draw the month labels to the left and label that axis */
      graph.selectAll(".heatMonth")
        .data(months)
        .enter().append("text")
        .attr("class", "heatMonth")
        .attr("x", -60)
        .attr("y", (d, i) => { return i * mapHeight; })
        .attr("transform", "translate(-6," + mapHeight / 1.5 + ")")
        .text( (d) => { return d; });

      graph.append("g")
        .attr("transform", "translate(" + -85 + "," + (height / 2) + ")")
        .append("text")
          .attr("class", "heatLabel")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Months");

      /* Draw the x-axis */
      graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      graph.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height + 50) + ")")
        .append("text")
          .attr("class", "heatLabel")
          .attr("text-anchor", "middle")
          .text("Years");

      /* Draw the monthly points and color them */
      graph.selectAll(".tempYears")
        .data(this.state.heatMapData.monthlyVariance, (d) => { return (d.year + ":" + d.month); })
        .enter().append("rect")
          .attr("class", "tempYears")
          .attr("x", (d) => { return ((d.year - oldestYear) * mapWidth); })
          .attr("y", (d) => { return ((d.month - 1) * mapHeight); })
          .attr("rx", 0)
          .attr("ry", 0)
          .attr("width", mapWidth)
          .attr("height", mapHeight)
          .style("fill", "gray")
          //Mouse hover event on item for tooltip
          .on("mouseover", function(d) {
            let element = d3.select(this).attr("class", "mouseover");

            tooltipElement.transition().duration(150)
              .style("opacity", 0.9);

            tooltipElement.html("<em class='name'>" + d.year + " - " + months[d.month - 1] + "</em><br>" +
              "<p>" + "Temperature: " + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</p><p>" +
              "<p>" + "Variance: " + d.variance + " &#8451" + "</p>")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 50) + "px");
          })
          //Mouse ends hover event
          .on("mouseout", function() {
            let element = d3.select(this).attr("class", "mouseout");
            tooltipElement.transition().duration(300)
              .style("opacity", 0);
          })
          .transition().duration(3000)
            .style("fill", (d) => { return varianceScale(d.variance + baseTemp); });

        /* Draw the legend by plotting it on the graph and then coloring the blocks
          with an array loop */
        let legendWidth = 40;
        graph.selectAll(".heatLegend")
          .data([0].concat(varianceScale.quantiles()), (d) => { return d; })
          .enter().append("g")
            .attr("class", "heatLegend")
            .append("rect")
              .attr("x", (d, i) => { return legendWidth * i + (50 * colorVariance.length); })
              .attr("y", height + 70)
              .attr("width", legendWidth)
              .attr("height", mapHeight / 2)
              .style("fill", (d, i) => { return colorVariance[i]; });

        /* Draw the text for the legend and then place it below the legend grid */
        graph.selectAll(".heatLegend")
          .append("text")
            .attr("x", (d, i) => {
              return ((legendWidth * i) + Math.floor(legendWidth / 2) - 2 + (width - legendWidth * colorVariance.length));
            })
            .attr("y", mapHeight + height + 70)
            .text( (d) => { return (Math.floor(d * 10) / 10); });
    },
    render: function render() {
      return(
        React.createElement("div", { id: "heat-graph", className: "graph hidden" })
      );
    }
  });

  /* User Story: I can see a Force-directed Graph that shows which campers are posting links on Camper News to which domains.
User Story: I can see each camper's icon on their node.
User Story: I can see the relationship between the campers and the domains they're posting.
User Story: I can tell approximately many times campers have linked to a specific domain from it's node size.
User Story: I can tell approximately how many times a specific camper has posted a link from their node's size.*/
  const ForceDirected = React.createClass({ displayName: "ForceDirected",
    propTypes: {
      forceURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { forceDirectedData: null, forceNodes: null, forceEdges: null };
    },
    componentDidMount: function componentDidMount() {
      /* D3 ajax call for data. Asynchronous, so we need to put the drawGraph
      function inside the request callback */
      this.serverRequest = d3.json(this.props.forceURL, function(error, result) {
        if(error) console.error("Error fetching force data!", error);
        console.log(result);

        let edges = [{ source: 0, target: 1}];
        let nodes = [{name: 0}, {name: 1}];

        result.forEach( function(i) {

        });

        this.setState({ forceDirectedData: result, forceNodes: nodes, forceEdges: edges });
        this.drawForceDirected();
      }.bind(this));
    },
    drawForceDirected: function drawForceDirected() {
      /* Dynamically add title text and description */
      d3.select("#force-graph").append("h3").text("FCC Camper News Network");
      d3.select("#force-graph").append("p").text("Shows the relationship between campers and news domains on FreeCodeCamp.");
      d3.select("#force-graph").append("p").text("Recent 100 posts.");
      /* Set graph margins and dimensions*/
      let width = 1100;
      let height = 600;

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#force-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

      /* draw the svg and graph size*/
      let graph = d3.select("#force-graph").append("svg")
      .attr("width", width)
      .attr("height", height);

      /* define the force directed layout */
      let force = d3.layout.force()
        .size([width, height])
        .nodes(this.state.forceNodes)
        .links(this.state.forceEdges)
        .start();

      /* draw the links first */
      let edge = graph.selectAll(".edge")
        .data(this.state.forceEdges)
        .enter().append("line")
        .attr("class", "edge");
        //.style("stroke-width", function(d) { return Math.sqrt(d.value); });

      /* daw the nodes second */
      let node = graph.selectAll(".node")
        .data(this.state.forceNodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        //.style("fill", function(d) { return color(d.group); })
        //.call(force.drag)
        //Mouse hover event on item for tooltip
        .on("mouseover", function(d) {
          let element = d3.select(this).attr("class", "mouseover");

          tooltipElement.transition().duration(150)
            .style("opacity", 0.9);

          tooltipElement.html("<em class='name'>" + d.name + "</em>")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
        })
        //Mouse ends hover event
        .on("mouseout", function() {
          let element = d3.select(this).attr("class", "mouseout");
          tooltipElement.transition().duration(300)
            .style("opacity", 0);
        });

    /* position the force nodes based on it's calculations */
      force.on("tick", function() {
        edge.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });

    },
    render: function render() {
      return(
        React.createElement("div", { id: "force-graph", className: "graph hidden" })
      );
    }
  });

  const GlobalMap = React.createClass({ displayName: "GlobalMap",
    propTypes: {
      globalURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { gobalMapData: null };
    },
    componentDidMount: function componentDidMount() {
      /* D3 ajax call for data. Asynchronous, so we need to put the drawGraph
      function inside the request callback */
      this.serverRequest = d3.json(this.props.globalURL, function(error, result) {
        if(error) console.error("Error fetching global data!", error);

        this.setState({ globalMapData: result });
        this.drawGlobalMap();
      }.bind(this));
    },
    drawGlobalMap: function drawGlobalMap() {
      /* Dynamically add title text and description */
      d3.select("#global-graph").append("h3").text("Global Meteorite Landings");
      d3.select("#global-graph").append("p").text("Sub Title");

      /* Set graph margins and dimensions*/
      let margin = { top: 20, right: 20, bottom: 20, left: 20 };
      let width = 1100 - margin.left - margin.right;
      let height = 600 - margin.top - margin.bottom;

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#global-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

      /* draw the svg and graph*/
      let graph = d3.select("#global-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    },
    render: function render() {
      return(
        React.createElement("div", { id: "global-graph", className: "graph hidden" })
      );
    }
  });

  ReactDOM.render(React.createElement(Collection,
      { barURL: BAR_URL, scatterURL: SCATTER_URL, heatURL: HEAT_URL, forceURL: FORCE_URL, globalURL: GLOBAL_URL }),
      document.getElementById("main"));

}());
