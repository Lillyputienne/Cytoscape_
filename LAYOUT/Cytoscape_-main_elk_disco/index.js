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
  for (let node of json.nodes) {
    if (`${abundance}` in node.data) {
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
  document.getElementById("minValue").textContent = min_ab.toFixed(2);
  document.getElementById("maxValue").textContent = max_ab.toFixed(2);

  return [min_ab, max_ab];
}

document.getElementById('abundance').addEventListener('change', function() {
  document.getElementById('node-selction').innerText = this.value;
});

function afficher_cytoscape(json, log_ratio, p_value, abundance) {
  var [min, max] = min_max_ab(json, abundance);
  console.log(`node[${log_ratio} <= 0]`);
  console.log(p_value);
  console.log(`node[${abundance}]`);

    var cy = window.cy = cytoscape({
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
        name: 'elk',
        elk: {
          'edgeRouting': 'organic',
          'algorithm': 'org.eclipse.elk.disco',
          'crossingMinimization': 'LAYER_INTERCHANGE',
          'layered.spacing.nodeNodeBetweenLayer': 100,
          'layered.spacing.nodeNodeWithinLayer': 50,
          'layered.spacing.edgeNodeBetweenLayer': 50,
          'spacing.edgeEdge': 50,
          'spacing.nodeNode': 50,
          'spacing.edgeNode': 50,
          'edgeLabelPlacement': 'NONE'
      }
    }
  });
  cytoscape.use(elk);
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
