var input = document.querySelector('#json_input_file');
var select_log = document.querySelector('#log_ratio');
var select_p_value = document.querySelector('#p_values');
var select_abundance = document.querySelector('#abundance');

function get_conditions(json) {
    var log_ratio = [];
    var p_value = [];

    for (let node of json.nodes) {
        for (let key in node.data) { 
            if (key.indexOf('log_ratio') !== -1) {
                if (log_ratio.includes(key)){
                    return [log_ratio, p_value];
                }
                log_ratio.push(key);

            } 
            else if (key.indexOf('p_value') !== -1){
                if (p_value.includes(key)){
                    return [log_ratio, p_value];
                }
                p_value.push(key);
            }
        }
    }
    return [log_ratio, p_value];
};


function add_condition(log_ratio, p_value) {
    var option_log = '<option value="">--Please choose an option--</option>';
    for (var i = 0; i<log_ratio.length; i++){
        option_log += `<option value=${log_ratio[i]}> ${log_ratio[i]} </option>`
    }
    select_log.innerHTML = option_log;

    var option_p_value = '<option value="">--Please choose an option--</option>';
    for (var i = 0; i<p_value.length; i++){
        option_p_value += `<option value=${p_value[i]}> ${p_value[i]} </option>`
    }
    select_p_value.innerHTML = option_p_value;
};


function change_organism(json) { 
    var organism = 'plant';
    for (let node of json.nodes){
        if ('tissue_skin' in node.data) {
            organism = 'human';
        }
    }
    return organism;
};


function add_abundance(organism) {
    var option_ab = `<option value="">--Please choose an option--</option> <option value='ab_group_size'> ab_group_size </option>`;
    if (organism == 'human'){
        option_ab += `<option value='tissue_skin'> tissue_skin </option>`
    }
    select_abundance.innerHTML = option_ab;

};


input.addEventListener('change',function() {
    var file = input.files[0];
    var reader = new FileReader();
      
    reader.onload = function() {
        var json = JSON.parse(reader.result);      
        var [log_ratio, p_value] = get_conditions(json);
        add_condition(log_ratio,p_value);
        add_abundance(change_organism(json));
    }
  
    reader.readAsText(file);

  });