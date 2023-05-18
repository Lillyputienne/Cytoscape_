/**
 * Arij Alkharrat, Elsa Coutaud, Lilly Duverger, Caroline Sancho
 */


var go = document.querySelector('#go');

// Creation of variables for the different parameters given by the user.
var file = '';
document.querySelector('#json_input_file').addEventListener('input',function() {
  file = document.querySelector('#json_input_file').files[0];
});

var log_ratio = '';
document.querySelector('#log_ratio').addEventListener('input', function() {
  log_ratio = document.querySelector('#log_ratio').value;
});

var p_value = '';
document.querySelector('#p_values').addEventListener('input', function() {
  p_value = document.querySelector('#p_values').value;
});

var abundance = '';
document.querySelector('#abundance').addEventListener('input', function() {
  abundance = document.querySelector('#abundance').value;
});

var algo = '';
document.querySelector('#algorithm').addEventListener('input',function() {
  algo = document.querySelector('#algorithm').value;
  document.getElementById('node-selection').innerText = this.value;
})

function min_max_ab(json,abundance) {
  // Return the minimum and maximum values among all abundance values contained in the json file. 
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

  return [min_ab, max_ab];
}

function display_cytoscape(json, log_ratio, p_value, abundance, layout_options) {
  // Create and display a cytoscape graph.
  var [min, max] = min_max_ab(json, abundance);

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
            'font-size':'40',
          }
        },

        // Size of the nodes
        {
          selector: `node[${abundance}]`,
          css: {
            'width':`mapData(ab_group_size, ${min}, ${max}, 25, 100)`,
            'height':`mapData(ab_group_size, ${min}, ${max}, 25, 100)`,
          },
        },

        // Color of the nodes, for -2 to 0.
        {
          selector: `node[${log_ratio} <= 0]`,
          css: {
            'background-color':`mapData(${log_ratio},-2,0,#FF00FF,#FFFFFF)`,
          }
        },

        // Color of the nodes, for 0 to 2.
        {
          selector: `node[${log_ratio} > 0]`,
          css: {
            'background-color':`mapData(${log_ratio},0,2,#FFFFFF,#008000)`,
          }
        },

        // Shape of the nodes
        {
          selector: `node[${p_value} > 0.05]`,
          css: {
            'shape':'square',
          }
        },

        // Cluster
        {
          selector: ':parent',
          css: {
            'content':'data(id)',
            'text-valign': 'top',
            'text-halign': 'center',
            'background-color':'#F1F1F1',
            'font-size':'50'
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
      
      layout: layout_options,
    });
  
};

function switch_algo(algo) {
  // Returns the options for the selected algorithm (algo).
  var layout_options={};

  switch (algo) {
    case 'none' : 
      layout_options = {
        name: 'preset',
      }
      break;

    case 'fcose' : 
      layout_options = {
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
      };
      break;
    
    case 'cise' :
      layout_options = {
        name: 'cise',
        idealEdgeLength: 20,
        edgeElasticity: 0.20,
        nodeOverlap: 15,
        nodeRepulsion: 800,
        nodeAttraction: 1000,
        gravity: 50,
        numIter: 1000
      };
      break;

    case 'cola' : 
      break;
    
    case 'elk_force' : 
      layout_options = {
        name: 'elk',
        elk: {
          'edgeRouting': 'organic',
          'algorithm': 'org.eclipse.elk.force',
          'crossingMinimization': 'LAYER_INTERCHANGE',
          'layered.spacing.nodeNodeBetweenLayer': 100,
          'layered.spacing.nodeNodeWithinLayer': 50,
          'layered.spacing.edgeNodeBetweenLayer': 50,
          'spacing.edgeEdge': 50,
          'spacing.nodeNode': 50,
          'spacing.edgeNode': 50,
          'edgeLabelPlacement': 'NONE'
        }
      };
      break;
    
    case 'elk_spore' :
      layout_options = {
        name: 'elk',
        elk: {
          'edgeRouting': 'organic',
          'algorithm': 'org.eclipse.elk.sporeOverlap',
          'crossingMinimization': 'LAYER_INTERCHANGE',
          'layered.spacing.nodeNodeBetweenLayer': 100,
          'layered.spacing.nodeNodeWithinLayer': 50,
          'layered.spacing.edgeNodeBetweenLayer': 50,
          'spacing.edgeEdge': 50,
          'spacing.nodeNode': 50,
          'spacing.edgeNode': 50,
          'edgeLabelPlacement': 'NONE'
        }
      };
      break;

    case 'elk_disco' : 
      layout_options = {
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
      };
      break;

  };
  return layout_options;
};

function check_parameters(event) {
  // Checks if the user has chosen all parameters and a JSON file. 
  event.preventDefault();
  var json_format = /(\.json)$/i;
  if (file == "" || (!json_format.exec(file.name))) {
    alert("Please choose a JSON file.")
    return false;
  }

  else if (algo == "" || log_ratio == "" || p_value =="" || abundance == "") {
    alert("Please choose an option for all the parameters.");
    return false;
  }
  return true;
};

function size_legend(json, abundance) {
  // Give the size legend. 
  var [min, max] = min_max_ab(json, abundance);
  var size_2 = (max-min)*0.25+min;
  var size_3 = (max-min)*0.5+min;
  var size_4 = (max-min)*0.75+min;

  document.getElementById("sq1").textContent = min.toFixed(2);
  document.getElementById("sq2").textContent = size_2.toFixed(2);
  document.getElementById("sq3").textContent = size_3.toFixed(2);
  document.getElementById("sq4").textContent = size_4.toFixed(2);
  document.getElementById("sq5").textContent = max.toFixed(2);
};


go.addEventListener('click', function(event) { 
  if (check_parameters(event)) {
    var reader = new FileReader();
      
    reader.onload = function() {
      var data_file = reader.result;
      var json = JSON.parse(data_file);

      var layout_options = switch_algo(algo);
      display_cytoscape(json, log_ratio, p_value, abundance, layout_options);
      size_legend(json,abundance);
    } 

    reader.readAsText(file);    
  };
});


