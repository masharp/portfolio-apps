/* D3 Data Visualization Prototypes
  This is a collection of various D3 data visualizations using different statistical
  data. A FreeCodeCamp directed project.

  www.softwareontheshore.com
  Michael Sharp 2016 */

  /*jshint esnext: true */
(function() {
  "use strict";

  /****************** React Bootstrap Components *******************/
  const Button = ReactBootstrap.Button;

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
      var graphs = [].slice.call(document.getElementsByClassName("graph"));
      document.getElementById("home-grid").classList.add("hidden");

      graphs.forEach(function(graph) {
        if(!graph.classList.contains("hidden")) {
          graph.classList.add("hidden");
        }
      });

      if(graph !== "home") {
        document.getElementById(graph + "-graph").classList.remove("hidden");
      } else {
        document.getElementById("home-grid").classList.remove("hidden");
      }
    },
    render: function render() {
      return (
        React.createElement("div", { id: "content", className: "container" },
          React.createElement("div", { id: "toolbar" },
            React.createElement(Button, { id: "bar-btn",
              onClick: this.showGraph.bind(null, "home") }, "Home")
          ),
          React.createElement("hr", {}),
          React.createElement("div", { id: "home-grid" },
            React.createElement("img", { src: "/assets/apps/data-visualization/bar-chart.jpg",
                className: "img-btn img-circle", onClick: this.showGraph.bind(null, "bar") }),

            React.createElement("img", { src: "/assets/apps/data-visualization/scatter-chart.jpg",
                className: "img-btn img-circle", onClick: this.showGraph.bind(null, "scatter") }),

            React.createElement("img", { src: "/assets/apps/data-visualization/heat-chart.jpg",
                className: "img-btn img-circle", onClick: this.showGraph.bind(null, "heat") }),

            React.createElement("img", { src: "/assets/apps/data-visualization/force-chart.jpg",
                className: "img-btn img-circle", onClick: this.showGraph.bind(null, "force") }),

            React.createElement("img", { src: "/assets/apps/data-visualization/global-chart.jpg",
                className: "img-btn img-circle", onClick: this.showGraph.bind(null, "global") })
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
  /* --------------------------------------------------------------------------------
    A D3 bar chart that shows the relationship between
    References : ["http://codepen.io/FreeCodeCamp/pen/adBBWd",
                  "http://bl.ocks.org/d3noob/8952219",
                  "http://bl.ocks.org/kiranml1/6872226"]
   ----------------------------------------------------------------------------------*/
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
          .attr("width", barWidth - 0.5)

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
        React.createElement("div", { id: "bar-graph", className: "graph hidden"})
      );
    }
  });

  /* --------------------------------------------------------------------------------
    A D3 scatter-plot chart that shows the relationship between doping and fast race times
    in professional bycicle racing.
    References : ["http://codepen.io/FreeCodeCamp/full/GoNNEy"]
   ----------------------------------------------------------------------------------*/
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

  /* --------------------------------------------------------------------------------
    A relatively simple D3 Heat-Map chart that shows the global surface temperature
    changes by month and year since it was first recorded. Color coded.
    References : ["http://codepen.io/FreeCodeCamp/full/rxWWGa"]
   ----------------------------------------------------------------------------------*/
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
      let mapHeight = height / months.length - 0.5;

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
                .attr("x", (d, i) => { return legendWidth * i + (40 * colorVariance.length); })
                .attr("y", height + 70)
                .attr("width", legendWidth)
                .attr("height", mapHeight / 2)
                .style("fill", (d, i) =>  { return colorVariance[i]; });

          /* Draw the text for the legend and then place it below the legend grid */
          graph.selectAll(".heatLegend")
            .append("text")
              .attr("x", (d, i) =>  {
                return (((legendWidth - 2) * i) + Math.floor(legendWidth / 2) - 100 + (width - legendWidth * colorVariance.length));
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

  /* --------------------------------------------------------------------------------
    A relatively simple D3 Force-Directed Graph that shows the relationship between
    a social news aggregator (FCC Camper News), recent users, and
    their recent news domains (medium, twitter, etc).
    References : ["https://bl.ocks.org/mbostock/4062045",
                  "http://codepen.io/FreeCodeCamp/full/KVNNXY"]
    TODO: There are a lot of for loop iterations due to array of objects data structure.
          Seems to load alright even with the other graphs due to only 100 elements.
          May need to refractor for efficiency.
   ----------------------------------------------------------------------------------*/
  const ForceDirected = React.createClass({ displayName: "ForceDirected",
    propTypes: {
      forceURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { forceNodes: null, forceEdges: null };
    },
    componentDidMount: function componentDidMount() {
      /* D3 ajax call for data. The callback extracts the usable data from the
        JSON and registers it to the react container state. */
      this.serverRequest = d3.json(this.props.forceURL, function(error, result) {
        if(error) console.error("Error fetching force data!", error);

        let fccImg = "https://cdn.rawgit.com/Deftwun/e3756a8b518cbb354425/raw/6584db8babd6cbc4ecb35ed36f0d184a506b979e/free-code-camp-logo.svg";

        let edges = [];
        //Register FCC News aggregator as the first element to help with assigning node edges
        let nodes = [{ type: "domain", full_domain: "www.freecodecamp.com", name: "FCC Camper News", links: 0, icon: fccImg }];

        /* extract the useful information from the resulting JSON */
        result.forEach( function(i) {
          let domain = { type: "domain", name: findDomain(i.link), links: 1, icon: fccImg, color: "green" };
          let author = { type: "author", name: i.author.username, icon: ((i.author.picture) ? i.author.picture : fccIcon),
                        color: "brown",links: 1, posts: [domain.name] };
          let edgeD = { source: 0, target: null }; //all domain nodes link to fcc node

          /* check if nodes contain author or domain already, uses helper function */
          if(findNode(nodes, author)) {
            for(let j = 0; j < nodes.length; j++) {
              if(nodes[j].name === author.name) {
                nodes[j].links++;
                  if(nodes[j].posts) { nodes[j].posts.push(domain.name); }
                break; //break this loop
              }
            }
          } else {
            nodes.push(author);
          }

          if(findNode(nodes, domain)) {
            for(let k = 0; k < nodes.length; k++) {
              if(nodes[k].name === domain.name) {
                nodes[k].links++;
                break; //break this loop
              }
            }
          } else {
            nodes.push(domain);
            edgeD.target = nodes.length - 1;
            edges.push(edgeD);
            nodes[0].links++;
          }
        });

        /* find the edges for each author's domain postings */
        nodes.forEach(function(node, i) {
          if(node.type === "author") {
            let uniquePosts = node.posts.filter((d, i) => { return i === node.posts.indexOf(d); });

            uniquePosts.forEach(function(d) {
              let postEdge = { source: findNode(nodes, d), target: i };
              edges.push(postEdge);
            });
          }
        });

        /* register nodes and edges to the react state and then draw the graph */
        this.setState({ forceNodes: nodes, forceEdges: edges });
        this.drawForceDirected();
      }.bind(this));

      /* helper function to check the node array for duplicates */
      function findNode(nodes, item) {
        let target = item.name ? item.name : item;
        for(let n = 0; n < nodes.length; n++) {
          if(nodes[n].name === target) { return n; }
        }
        return null;
      }

      /* helper function to extract the domain name without a regex */
      function findDomain(url) {
        let full = url.split("/")[2];
        let name = full.split(".");

        /* check edge cases like subdomains or domain masking like (t.co for twitter)
        if edge cases become too complicated, may need a better solution */
        if(name[0] === "www") { //most urls
          name = name[1];
        } else if (name[0] === "medium") { //medium subdomain
          name = "medium";
        } else if (name[0] === "t") { //twitter masking
          name = "twitter";
        } else if (name[0] !== "www" && name.length > 2) { //most other subdomains
          name = name[1];
        } else {
          name = name[0]; //if there is no www or edge cases
        }

        if(name === undefined || name === "undefined") { name = "Name Unavailable."; }
        return name;
      }
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
        .nodes(d3.values(this.state.forceNodes))
        .links(this.state.forceEdges)
        .linkDistance(100)
        .charge(-130)
        .start();

      /* draw the links first */
      let edge = graph.selectAll(".edge")
        .data(this.state.forceEdges)
        .enter().append("line")
        .attr("class", "edge")
        .style("stroke-width", (d) => { return d.links * 5; });

      /* daw the nodes second */
      let node = graph.selectAll(".node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", (d) => { return (d.links + 5) / 1.5; })
        .style("fill", (d) => { return d.color; })
        .call(force.drag)
        //Mouse hover event on item for tooltip
        .on("mouseover", function(d) {
          let element = d3.select(this).attr("class", "mouseover");
          tooltipElement.transition().duration(150)
            .style("opacity", 0.9);

          tooltipElement.html("<img class= 'forced-img' src='" + d.icon +"'/>" +
            "<br><em class='name'>" + d.name + "</em><p>" + d.links + "</p>")
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

      /* Add the legend */
      graph.selectAll(".legend")
        .data(["fcc", "domain", "author"])
        .enter().append("circle")
        .attr("class", "legend")
        .attr("r", 4)
        .attr("cx", width - 200)
        .attr("cy", (d, i) => { return (height - 100) + (i * 20); })
        .attr("fill", (d) => {
          switch(d) {
            case "fcc":
              return "black";
            case "domain":
              return "green";
            case "author":
              return "brown";
          }
        });

        /* Add the legend text */
        graph.selectAll(".legend-text")
          .data(["fcc", "domain", "author"])
          .enter().append("text")
            .attr("class", "legend-text")
            .attr("x", width - 175)
            .attr("y", (d, i) => { return (height - 95) + (i * 20); })
            .text( (d) => {
              switch(d) {
                case "fcc":
                  return "FCC Camper News";
                case "domain":
                  return "News or Social Domain";
                case "author":
                  return "Camper";
              }
             });
    },
    render: function render() {
      return(
        React.createElement("div", { id: "force-graph", className: "graph hidden" })
      );
    }
  });

  /* --------------------------------------------------------------------------------
    A relatively simple D3 Global Map Visualization of meteorite impacts across the Earth.
    Uses the D3 topojson package to handle GeoJSON data.
    References : ["http://codepen.io/FreeCodeCamp/full/mVEJag",
                  "http://bl.ocks.org/mbostock/3757132",
                    "https://bost.ocks.org/mike/map/"]

    TODO: Perhaps add a zoom / resize functionality
   ----------------------------------------------------------------------------------*/
  const GlobalMap = React.createClass({ displayName: "GlobalMap",
    propTypes: {
      globalURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { gobalMapNeo: null, globalMapData: null };
    },
    componentDidMount: function componentDidMount() {
      /* self-executing promise so that we can update the react component state
        d3 calls are mode, then call the graph drawing function */
      let self = this;

      (function() {
        return new Promise(function(resolve, reject) {
          d3.json(self.props.globalURL, function(error, neo) {
            if(error) console.error("Error fetching global data!", error);
            resolve(neo);
          });
        });
      })().then(function(neo) {
        d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, map) {
          if(error) console.error("Error fetching global map data!", error);
          self.setState({ globalMapData: map, globalMapNeo: neo });
          self.drawGlobalMap();
        });
      });
    },
    drawGlobalMap: function drawGlobalMap() {
      /* Dynamically add title text and description */
      d3.select("#global-graph").append("h3").text("Global Meteorite Landings");
      d3.select("#global-graph").append("p").text("Data collected by NASA programs");

      /* Set graph margins and dimensions*/
      let width = 1100;
      let height = 600;

      /* define the mouseover tooltip elements */
      let tooltip = d3.select(".tooltip");
      let tooltipElement = d3.select("#global-graph").append("div")
        .attr("class", "tooltip").style("opacity", 0);

      /* draw the map projection */
      let projection = d3.geo.mercator()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / 2])
        .precision(0.1);

      let path = d3.geo.path()
        .projection(projection);

      let graticule = d3.geo.graticule();

      /* draw the svg and graph*/
      let graph = d3.select("#global-graph").append("svg")
        .attr("width", width)
        .attr("height", height);

      graph.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

      /* draw the map based on geo data stored in the react component state */
      graph.insert("path", ".graticule")
        .datum(topojson.feature(this.state.globalMapData, this.state.globalMapData.objects.land))
        .attr("class", "land")
        .attr("d", path);

      graph.insert("path", ".graticule")
        .datum(topojson.mesh(this.state.globalMapData,
            this.state.globalMapData.objects.countries, (a, b) => { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);

      /* Draw the meteroite strikes on the map */
      graph.append("g").selectAll("path")
        .data(this.state.globalMapNeo.features)
        .enter().append("circle")
          .attr("cx", (d) => { return projection([ d.properties.reclong, d.properties.reclat])[0]; })
          .attr("cy", (d) => { return projection([ d.properties.reclong, d.properties.reclat])[1]; })
          .attr("r", (d) => {
            let masses = 700000/4;
            let mass = d.properties.mass;

            if(mass <= masses) { return 3; }
            else if(mass <= masses * 2) { return 12; }
            else if(mass <= masses * 3) { return 24; }
            else if(masses <= masses * 20) { return 36; }
            else if(masses <= masses * 75) { return 48; }
            else return 55;
          })
          .attr("fill-opacity", (d) => { return 0.5; })
          .attr("stroke-width", 1)
          .attr("stroke", "red")
          .attr("fill", "white")
          //Mouse hover event on item for tooltip
          .on("mouseover", function(d) {
            let element = d3.select(this).attr("class", "mouseover");
            tooltipElement.transition().duration(150)
              .style("opacity", 0.9);

            tooltipElement.html(
              "<em>Name: " + d.properties.name + "</em>" +
              "<p>Year: " + d.properties.year.split("-")[0] + "</p>" +
              "<p>Mass (kg): " + d.properties.mass + "</p>" +
              "<p>Classification: " + d.properties.recclass + "</p>" +
              "<p>Outcome: " + d.properties.fall + "</p>")
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
        React.createElement("div", { id: "global-graph", className: "graph hidden" })
      );
    }
  });

  ReactDOM.render(React.createElement(Collection,
      { barURL: BAR_URL, scatterURL: SCATTER_URL, heatURL: HEAT_URL, forceURL: FORCE_URL, globalURL: GLOBAL_URL }),
      document.getElementById("main"));

}());
