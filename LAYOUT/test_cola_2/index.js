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
      name: 'cola',
      animate: false,
      nodeDimensionsIncludeLabels: false,
      avoidOverlap: true,
      nodeSpacing: function( node ){ return 10 + node.width(); },
      edgeLength: 50,
      unconstrIter: 100,
      userConstIter: 100,
      allConstIter: 100,
      convergenceThreshold: 0.01,
      padding: 10,
      randomize: true,
      alignment: function( node ){ return null; },
      flow: { axis: 'y', minSeparation: 40 },
      groupingStrength: 0.1,
      edgeSymDiffLength: 5,
      edgeJaccardLength: 20,
      nodeRepulsion: function( node ){ return 2048; },
      nodeOverlap: 10,
      idealEdgeLength: function( edge ){ return 30 + 30 * edge.weight(); },
      edgeElasticity: function( edge ){ return 8; },
      nestingFactor: 0.1,
      gravity: 0.25,
      numIter: 1000,
      sampleSize: 25,
      quality: 'default'
    }
    
    
 // Redimensionnement automatique
   

  });
  
  
  

