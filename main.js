function rowConverter(row) {
  return {
    app_name: row.app_name,
    downloads: parseInt(row.downloads),
    average_rating: parseFloat(row.average_rating),
    thirty_day_keep: parseFloat(row.thirty_day_keep)
  }
}

let chartTypes = {
  barChart: (dataset, getDataX, getDataY) => {
    let display = function(chart){
      console.dir(this);
      
      this.dataset.sort((a,b) => this.getDataX(b) - this.getDataX(a));
      
      chart.attr('width', this.width)
        .attr('height', this.height);
      
      // our range is limited from 0 to width - 100, 
      // which is for the 80 pixels on left for axis and 
      // 20 pixels on right for padding
      let xScale = d3.scaleLinear()
      .domain([this.xMin,this.xMax])
      .rangeRound([0, (this.width - this.xPadding)]);
      
      // using scale band to work with nominal values 
      // the Array.map() call allows us to get a new array
      // by calling a function on each item of the source array 
      // here it pulls out the app_name
      let yScale = d3.scaleBand()
      .domain(this.dataset.map(this.getDataY))
      .rangeRound([this.yPadding, this.height - this.yPadding]);
      
      chart.selectAll('rect')
        .data(this.dataset)
        .enter()
        .append('rect')
        .attr('x', 80)
        .attr('y', (d) => yScale(this.getDataY(d)))
        .attr('width', (d) => xScale(this.getDataX(d)))
        .attr('height', this.barHeight)
        .attr('fill', this.color);
      
      // AXES
      var xAxis = d3.axisBottom(xScale);
      if(typeof this.tickFormat !== undefined){
        xAxis.tickFormat(this.tickFormat);
      }
      var yAxis = d3.axisLeft(yScale);
      
      
      chart.append('g')
        .attr('class', 'xaxis axis')
        .attr('transform', `translate(80, ${this.height - 20})`)
        .call(xAxis);
      
      chart.append('g')
        .attr('class', 'yaxis axis')
        .attr('transform', `translate(80,0 )`)
        .call(yAxis);
    };
    return {
      dataset: dataset,
      width: 800,
      height: dataset.length * 30,
      yPadding: 22,
      xPadding: 100,
      barHeight: 18,
      color: "blue",
      getDataX: getDataX,
      getDataY: getDataY,
      xMin: 0,
      xMax: d3.max(dataset,getDataX),
      display: display,
    };
  }
};

function makeChart1(dataset) {
  let chart1 = d3.select('#chart1');
  
  let barChart1 = chartTypes.barChart(dataset,(d) => d.downloads,(d) => d.app_name);
  barChart1.color = "cornflowerblue";
  barChart1.display = barChart1.display.bind(barChart1);
  barChart1.display(chart1);
}

function makeChart2(dataset) {
  let chart2 = d3.select('#chart2');
  
  let barChart2 =  chartTypes.barChart(dataset,(d) => d.average_rating,(d) => d.app_name);
  barChart2.color = "lightblue";
  barChart2.display = barChart2.display.bind(barChart2);
  barChart2.display(chart2);1
}

function makeChart3(dataset) {
  let chart3 = d3.select("#chart3");
  
  let barChart3 =  chartTypes.barChart(dataset,(d) => (d.thirty_day_keep/100),(d) => d.app_name);
  barChart3.color = "lightskyblue";
  barChart3.display = barChart3.display.bind(barChart3);
  barChart3.tickFormat = d3.format(".0%");
  barChart3.display(chart3);
}

function makeChart4(dataset) {
}

function makeChart5(dataset) {
}

window.onload = function () {
  d3.csv('fake_app_download_rating.csv', rowConverter)
    .then((dataset) => {

      makeChart1(dataset);
      makeChart2(dataset);
      makeChart3(dataset);
      makeChart4(dataset);
      makeChart5(dataset);


    });
}
