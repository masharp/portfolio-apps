const FCC_API_ALLTIME_URL = "http://fcctop100.herokuapp.com/api/fccusers/top/alltime";
const FCC_API_RECENT_URL = "http://fcctop100.herokuapp.com/api/fccusers/top/recent";


var Leaderboard = React.createClass({ displayName: "Leaderboard",
  loadRecentDataFromAPI: function loadRecentDataFromAPI() {
    $.ajax({
      url: this.props.recentURL,
      dataType: "json",
      cache: false,
      success: function getRecentSuccess(data) {
        this.setState({ recent: data, recentChecked: false });
      }.bind(this),
      error: function getRecentError(xhr, status, error) {
        console.error(this.props.recentURL, status, error.toString());
      }.bind(this)
    });
  },
  loadAllTimeDataFromAPI: function loadAllTimeDataFromAPI() {
    $.ajax({
      url: this.props.allTimeURL,
      dataType: "json",
      cache: false,
      success: function getAllTimeSuccess(data) {
        this.setState({ allTime: data, allTimeChecked: true });
      }.bind(this),
      error: function getAllTimetError(xhr, status, error) {
        console.error(this.props.allTimeURL, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return ({ recent: [], allTime: [] });
  },
  componentDidMount: function componentDidMount() {
    this.loadAllTimeDataFromAPI();
    this.loadRecentDataFromAPI();
  },
  handleChange: function handleChange(event) {
    if(event.target.value === "recent") {
      this.setState({ recentChecked: true, allTimeChecked: false });
    } if(event.target.value === "allTime") {
      this.setState({ allTimeChecked: true, recentChecked: false });
    }
  },
  render: function render() {
    var data = this.state.allTimeChecked ? this.state.allTime : this.state.recent;

    return(
      React.createElement("div", { className: "content" },
        React.createElement("div", { className: "leaderSort" },
          React.createElement("input",
            { id: "allTime-radio", name: "choice", type: "radio", value: "allTime",
              checked: this.state.allTimeChecked, onChange: this.handleChange }),
          React.createElement("label", { htmlFor: "allTime-radio"}, "All Time"),
          React.createElement("input",
            { id: "recent-radio", name: "choice", type: "radio", value: "recent",
              checked: this.state.recentChecked, onChange: this.handleChange }),
          React.createElement("label", { htmlFor: "recent-radio"}, "Recent")
        ),
        React.createElement("table", { className: "leaderboard" },
          React.createElement("thead", null,
            React.createElement("tr", null,
              React.createElement("th", null, "# Rank"),
              React.createElement("th", null, "Camper"),
              React.createElement("th", null, "Recent Points"),
              React.createElement("th", null, "All Time Points")
            )
          ),
          React.createElement(LeaderList, { data: data })
        )
      )
    );
  }
});

var LeaderList = React.createClass({ displayName: "LeaderList",
  render: function render() {
    var dataNodes = this.props.data.map(function mapData(leader, index) {

      return(
        React.createElement(Leader, { key: index, rank: index + 1, leaderName: leader.username,
          recent: leader.recent, allTime: leader.alltime })
      )
    });

    return(
      React.createElement("tbody", { className: "leaderTable" }, dataNodes)
    );
  }
});

var Leader = React.createClass({ displayName: "Leader",
  render: function render() {
    return (
      React.createElement("tr", null,
        React.createElement("td", { className: "rank" }, this.props.rank),
        React.createElement("td", { className: "leaderName" }, this.props.leaderName),
        React.createElement("td", { className: "score" }, this.props.recent),
        React.createElement("td", { className: "score" }, this.props.allTime)
      )
    );
  }
});

ReactDOM.render(React.createElement(Leaderboard,
  {
    recentURL: FCC_API_RECENT_URL,
    allTimeURL: FCC_API_ALLTIME_URL,
    pollInterval: 3000
  }), document.getElementById("main"));
