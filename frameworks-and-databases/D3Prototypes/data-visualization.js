/* D3 Data Visualization Prototypes
  This is a collection of various D3 data visualizations using different statistical
  data. A FreeCodeCamp directed project.

  References:
      - http://bl.ocks.org/kiranml1/6872226
      - http://bl.ocks.org/d3noob/8952219
      - http://codepen.io/FreeCodeCamp/pen/adBBWd
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
      /* jQuery ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = $.get(this.props.barURL, function(result) {
        this.setState({ rawData: JSON.parse(result), barData: JSON.parse(result).data });
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
      let xAxis = d3.svg.axis()
        .scale(x).orient("bottom").ticks(d3.time.years, 4);
      let yAxis = d3.svg.axis()
        .scale(y).orient("left").ticks(10, "");

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
            let element = d3.select(this);

            element.attr("class", "mouseout");
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
      /* jQuery ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = $.get(this.props.scatterURL, function(result) {
        this.setState({ scatterData: JSON.parse(result) });
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
      let y = d3.scale.linear().range([0, height])
        .domain([firstPlace, lastPlace + 1]);

      /* set the orientation, scale and tick style of the x and y axis */
      let xAxis = d3.svg.axis()
        .scale(x).orient("bottom").ticks(7).tickFormat((d) => {
          let time = new Date(1111, 0, 1, 0, d);
          time.setSeconds(time.getSeconds() + d);
          return d3.time.format("%H:%M")(time);
        });
      let yAxis = d3.svg.axis()
        .scale(y).orient("left").ticks(6);

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
              let element = d3.select(this);

              element.attr("class", "mouseout");
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
      /* jQuery ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = $.get(this.props.heatURL, function(result) {
        this.setState({ heatMapData: JSON.parse(result) });
        console.log(this.state.heatMapData);
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

      /* Set graph margins */
      let margin = { top: 10, right: 20, bottom: 20, left: 50 };
      let width = 900 - margin.left - margin.right;
      let height = 400 - margin.top - margin.bottom;
    },
    render: function render() {
      return(
        React.createElement("div", { id: "heat-graph", className: "graph hidden" })
      );
    }
  });

  const ForceDirected = React.createClass({ displayName: "ForceDirected",
    propTypes: {
      forceURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { forceDirectedData: null };
    },
    componentDidMount: function componentDidMount() {
      /* jQuery ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = $.get(this.props.forceURL, function(result) {
        this.setState({ forceDirectedData: result });
        console.log(this.state.forceDirectedData);
        this.drawForceDirected();
      }.bind(this));
    },
    drawForceDirected: function drawForceDirected() {
      /* Dynamically add title text and description */
      d3.select("#force-graph").append("h3").text("Title");
      d3.select("#force-graph").append("p").text("Sub Title");

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
      /* jQuery ajax call for Bar Data. Asynchronous, so we need to put the drawBarGraph
      function inside the request callback */
      this.serverRequest = $.get(this.props.globalURL, function(result) {
        this.setState({ globalMapData: JSON.parse(result) });

        console.log(this.state.globalMapData);
        this.drawGlobalMap();
      }.bind(this));
    },
    drawGlobalMap: function drawGlobalMap() {
      /* Dynamically add title text and description */
      d3.select("#global-graph").append("h3").text("Title");
      d3.select("#global-graph").append("p").text("Sub Title");
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
