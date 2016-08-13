let deg2rad = Math.PI / 180;

var viewBox = d3.select('svg').node().getAttribute('viewBox').split(/\s+|,/);

let width = Number.parseFloat(viewBox[2]);
let height = Number.parseFloat(viewBox[3]);

let center = [width/2, height/2];

let clipRadius = 20;
let strokeWidth = 0.3;

let radius = 10;
let triHeight = Math.sin(60*deg2rad) * radius;

/* Center the grid vertically */
let numY = Math.trunc(height/triHeight);
if(numY % 2 === 1)
  numY++;
let startY = (height - numY*triHeight) / 2;

/* Create grid points */
let data = [];

for(let i = 0; i <= Math.trunc(width/radius); i++) {
  for(let j = 0; j <= numY; j++) {
    let x = (j % 2) * 0.5 * radius + radius * i;
    let y = startY + triHeight * j;
    data.push([x, y]);
  }
}

drawCircle(data, radius, 'black', strokeWidth, 'none', function(d) {
  let dx = (d[0] - center[0]);
  let dy = (d[1] - center[1]);

  return Math.sqrt(dx*dx + dy*dy) < clipRadius + 0.000001;
});
drawCircle([center], clipRadius, 'black', strokeWidth, 'none');
drawCircle(data, 1, 'none', 0, 'red');

/* Add clipPath */
d3.select('clipPath').append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', clipRadius + (strokeWidth/2));

function drawCircle(data, radius, stroke='black', strokeWidth=0, fill='black', filter) {
  let circle = d3.select('svg').append('g').selectAll('circle').data(data).enter().append('circle');
  if(filter)
    circle = circle.filter(filter);
  circle.attr('cx', function(d) { return d[0]; });
  circle.attr('cy', function(d) { return d[1]; });
  circle.attr('r', radius);
  circle.attr('stroke', stroke);
  circle.attr('stroke-width', strokeWidth);
  circle.attr('fill', fill);
  circle.attr('clip-path','url(#cut-off-edges)');
}