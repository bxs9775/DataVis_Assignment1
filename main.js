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
      
      this.dataset.sort((a,b) => getDataX(b) - getDataX(a));
      
      chart.attr('width', this.width)
        .attr('height', this.height);
      
      // our range is limited from 0 to width - 100, 
      // which is for the 80 pixels on left for axis and 
      // 20 pixels on right for padding
      let xScale = d3.scaleLinear()
      .domain([this.xMin,this.xMax])
      .rangeRound([0, this.width - this.xPadding]);
      
      // using scale band to work with nominal values 
      // the Array.map() call allows us to get a new array
      // by calling a function on each item of the source array 
      // here it pulls out the app_name
      let yScale = d3.scaleBand()
      .domain(this.dataset.map(this.getDataY))
      .rangeRound([this.yPadding, this.height - this.yPadding]);
      
      chart.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', 80)
        .attr('y', (d) => yScale(d.app_name))
        .attr('width', (d) => xScale(this.getDataX(d)))
        .attr('height', this.barHeight)
        .attr('fill', this.color);
      
      // AXES
      chart.append('g')
        .attr('class', 'xaxis axis')
        .attr('transform', `translate(80, ${this.height - 20})`)
        .call(d3.axisBottom(xScale));
      
      chart.append('g')
        .attr('class', 'yaxis axis')
        .attr('transform', `translate(80,0 )`)
        .call(d3.axisLeft(yScale));
    };
    return {
      dataset: dataset,
      width: 1200,
      height: dataset.length * 30,
      yPadding: 22,
      XPadding: 100,
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

function makeBarChart(chart, dataset, color, getDataX, getDataY, xMin, xMax){
  
  let w = 1200;
  let h = dataset.length * 30;
  
  let outerYPadding = 22;
  let barHeight = 18;
  
  // sort the data by downloads
  // uses built-in Array.sort() with comparator function
  dataset.sort((a,b) => getDataX(b) - getDataX(a));

  chart.attr('width', w)
    .attr('height', h);

  // our range is limited from 0 to width - 100, 
  // which is for the 80 pixels on left for axis and 
  // 20 pixels on right for padding
  let xScale = d3.scaleLinear()
    .domain([xMin,xMax])
    .rangeRound([0, w - 100]);

  // using scale band to work with nominal values 
  // the Array.map() call allows us to get a new array
  // by calling a function on each item of the source array 
  // here it pulls out the app_name
  let yScale = d3.scaleBand()
    .domain(dataset.map(getDataY))
    .rangeRound([outerYPadding, h - outerYPadding]);

  chart.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', 80)
    .attr('y', (d) => yScale(d.app_name))
    .attr('width', (d) => xScale(getDataX(d)))
    .attr('height', barHeight)
    .attr('fill', color);

  // AXES
  chart.append('g')
    .attr('class', 'xaxis axis')
    .attr('transform', `translate(80, ${h - 20})`)
    .call(d3.axisBottom(xScale));

  chart.append('g')
    .attr('class', 'yaxis axis')
    .attr('transform', `translate(80,0 )`)
    .call(d3.axisLeft(yScale));
}

function makeScatterplot(){
  
}

function makeChart1(dataset) {
  let chart1 = d3.select('#chart1');
  
  let barChart1 = chartTypes.barChart(dataset,(d) => d.downloads,(d) => d.app_name);
  barChart1.color = "cornflowerblue";
  barChart1.display = barChart1.display.bind(barChart1);
  barChart1.display(chart1);
}

function makeChart2(dataset) {
  let chart2 = d3.select('#chart2');
  
  let xMin = 0;
  //let xMin = 4.5;
  let xMax = d3.max(dataset, (d) => d.average_rating);
  
  makeBarChart(chart2,dataset,'lightblue',(d) => d.average_rating,(d) => d.app_name,xMin,xMax);
}

function makeChart3(dataset) {
  let chart3 = d3.select("#chart3");
  
  let xMin = 0;
  let xMax = d3.max(dataset, (d) => d.thirty_day_keep);
  
  makeBarChart(chart3,dataset,"lightskyblue",(d) => d.thirty_day_keep,(d) => d.app_name,xMin,xMax);
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
