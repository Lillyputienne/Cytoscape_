import myJSON from './test.json' assert {type: 'json'};
console.log(myJSON.nodes[1]);
//let cytoscape = require('cytoscape');
//let cola = require('cytoscape-cola');

//cytoscape.use( cola ); // register extension

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
        }
      },

      {
        selector: 'node[log_ratio_conditionA <= 0]',
        css: {
            'background-color':'mapData(log_ratio_conditionA,-2,0,magenta,white)',
        }
      },

      {
        selector: 'node[log_ratio_conditionA > 0]',
        css: {
            'background-color':'mapData(log_ratio_conditionA,0,2,white,green)',
        }
      },

      {
        selector: 'node[p_value_conditionB <= 0.05]',
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
        }
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
  
    elements: myJSON,
  
    layout: {
      name: 'cise',
      idealEdgeLength: 20,
      edgeElasticity: 0.2,
      nodeOverlap: 15,
      nodeRepulsion: 800,
      nodeAttraction: 1000,
      gravity: 50,
      numIter: 1000,
      tilingPaddingVertical: 10,
      tilingPaddingHorizontal: 10,
      tilingPaddingRatio: 0.5,
      randomize: true,
      animate: false,
      animationDuration: 500,
      animationEasing: 'ease-out'
 // Redimensionnement automatique
   
    }
  });
  
  
  

