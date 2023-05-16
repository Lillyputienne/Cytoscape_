/**
 * Arij Alkharrat, Elsa Coutaud, Lilly Duverger, Caroline Sancho
 */

var input_file = document.querySelector('#json_input_file');
var file = '';
var go = document.querySelector('#go');
var input_log_ratio = document.querySelector('#log_ratio');
var log_ratio = '';
var input_p_value = document.querySelector('#p_values');
var p_value = '';
var input_abundance = document.querySelector('#abundance');
var abundance = '';

let elk_algorithms = {
  'elk_disco': 'org.eclipse.elk.disco',
  'elk_force': 'org.eclipse.elk.force',
  'elk_spore': 'org.eclipse.elk.sporeOverlap',
}

let elk_layout = {
  'edgeRouting': 'organic',
  'algorithm': '',
  'crossingMinimization': 'LAYER_INTERCHANGE',
  'layered.spacing.nodeNodeBetweenLayer': 100,
  'layered.spacing.nodeNodeWithinLayer': 50,
  'layered.spacing.edgeNodeBetweenLayer': 50,
  'spacing.edgeEdge': 50,
  'spacing.nodeNode': 50,
  'spacing.edgeNode': 50,
  'edgeLabelPlacement': 'NONE'
}


input_file.addEventListener('input',function() {
  file = input_file.files[0];
});

input_log_ratio.addEventListener('input', function() {
  log_ratio = input_log_ratio.value;
});

input_p_value.addEventListener('input', function() {
  p_value = input_p_value.value;
});

input_abundance.addEventListener('input', function() {
  abundance = input_abundance.value;
});


function min_max_ab(json,abundance) {
  var min_ab = Infinity;
  let sizes = [];
  for (let node of json.nodes) {
    if (`${abundance}` in node.data) {
      if(!sizes.includes(node.data[abundance])){
        sizes.push(node.data[abundance]);
      }
      if (node.data[abundance] < min_ab) {
        min_ab = node.data[abundance];
      }
    }
  }

  var max_ab = 0;
  for (let node of json.nodes) {
    if (`${abundance}` in node.data) {
      if (node.data[abundance] > max_ab) {
        max_ab = node.data[abundance];
      }
    }
  }

  sizes.sort((a, b) => {
    return a - b;
  });

  var smaller_half = sizes.slice(0, sizes.length / 2);
  var bigger_half = sizes.slice(sizes.length / 2 + 1);

  let sum_smaller_half = smaller_half.reduce((a, b) => a + b, 0);
  let avg_smaller_half = (sum_smaller_half / smaller_half.length) || 0;

  let sum_bigger_half = bigger_half.reduce((a, b) => a + b, 0);
  let avg_bigger_half = (sum_bigger_half / bigger_half.length) || 0;
  
  
  document.getElementById("sq1").textContent = min_ab.toFixed(2);
  document.getElementById("sq2").textContent = avg_smaller_half.toFixed(2);
  document.getElementById("sq3").textContent = avg_bigger_half.toFixed(2);
  document.getElementById("sq4").textContent = max_ab.toFixed(2);
  return [min_ab, max_ab];
}

document.getElementById('abundance').addEventListener('change', function() {
  document.getElementById('node-selection').innerText = this.value;
});


function afficher_cytoscape(json, log_ratio, p_value, abundance) {
  var [min, max] = min_max_ab(json, abundance);
  console.log(`node[${log_ratio} <= 0]`);
  console.log(p_value);
  console.log(`node[${abundance}]`);

    var settings = {
      container: document.getElementById('cy'),
      
      boxSelectionEnabled: false,
      
      style: [
        {
          selector: 'node',
          css: {
            'content': 'data(displayName)',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape':'ellipse',
            'font-size':'20'
          }
        },

        {
          selector: `node[${abundance}]`,
          css: {
            'width':`mapData(ab_group_size, ${min}, ${max}, 25, 100)`,
            'height':`mapData(ab_group_size, ${min}, ${max}, 25, 100)`,
          },
        },

        {
          selector: `node[${log_ratio} <= 0]`,
          css: {
            'background-color':`mapData(${log_ratio},-2,0,magenta,white)`,
          }
        },

        {
          selector: `node[${log_ratio} > 0]`,
          css: {
            'background-color':`mapData(${log_ratio},0,2,white,green)`,
          }
        },

        {
          selector: `node[${p_value} > 0.05]`,
          css: {
            'shape':'square',
          }
        },

        {
          selector: ':parent',
          css: {
            'content':'data(id)',
            'text-valign': 'top',
            'text-halign': 'center',
            'background-color':'#F1F1F1',
            'font-size':'40'
          }
        },
        {
          selector: 'edge',
          css: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width':'2'
          }
        }
      ],
      
      elements: json,
      
      layout: {
        name: 'fcose',
        nodeDimensionsIncludeLabels: true,
        randomize: true,
        animate: false,
        fit: true,
        padding: 30,
        quality: 'proof',
        nodeRepulsion: 10000,
        idealEdgeLength: 100,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.25,
        numIter: 2500,
        tile: true,
      }
    };

    var selected_algorithm = document.getElementById('algorithm').value;

    switch(selected_algorithm){
      case 'fcose': break; // since this is the layout default value
      case 'cola': break; //! not implemented yet
      case 'cise': break; //! not implemented yet
      case '': break; // in case it is empty
      default: // elk
        elk_layout.algorithm = elk_algorithms[selected_algorithm];
        settings.layout.name = 'elk';
        settings.layout.elk = elk_layout;
    }
    
    var cy = window.cy = cytoscape(settings);
  
};

go.addEventListener('click', function() { 
  var reader = new FileReader();
    
  reader.onload = function() {
    var data_file = reader.result;
    var json = JSON.parse(data_file);   

    afficher_cytoscape(json, log_ratio, p_value, abundance);
  } 

  reader.readAsText(file);
});
