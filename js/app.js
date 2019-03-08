jQuery(document).foundation();
console.log('js is running')

var interval=false;
var timer=15;
var $csv = [];
var $data = [];
var $matchNumber = 0;
var $forms = 0;
var $teams = [];
var $scouts = [];
var $requiredSatisfied = false;
const $fs = require('fs');
const $os = require('os');
const $homedir = $os.homedir();
if (!$fs.existsSync($homedir+'/scouting')){
    $fs.mkdirSync($homedir+'/scouting');
}
const remote = require('electron').remote;
const $app = remote.app;
console.log($app.getAppPath());

auto=true;

jQuery( document ).ready(function( $ ) {
  clearCSV();
  clearValues();
  $('#formCount').html($forms);
  parseTeams();
  parseScouts();
  console.log('READY!')
  clearValues();
});

function parseTeams(){
  $fs.readFile($homedir+'/scouting/teams.csv', 'utf8', function(err, contents) {
    try{
      var rawdata = contents.split(/\n+/);
      $('select[name=teamNumber]').empty()
      .append($("<option>",{
        text:'Pick a team',
        selected:true,
        disabled:true
      }));
      for (var i=0;i<rawdata.length;i++){
        var fields = rawdata[i].split(',');
        if (i>0){
          $('select[name=teamNumber]')
          .append($("<option>",{
            value:fields[0],
            text:fields[0]+' ---> '+fields[1]
          }));
          $teams.push([fields[0],fields[1]]);
        }

      }
      $('select[name=teamNumber]').val('Pick a team');
      console.log('teams',$teams);
      $('input[name=teamNumber]').remove();
    }
    catch(err) {
      console.log("caught in teamNumber")
      $('select[name=teamNumber]').remove();
    }
    $('#teamNumber').val('');
  });
}
function parseScouts(){
  $fs.readFile($homedir+'/scouting/scouts.csv', 'utf8', function(err, contents) {
    try{
      var rawdata = contents.split(/\n+/);
      $('select[name=scoutName]').empty()
      .append($("<option>",{
        text:'Pick a scout',
        selected:true,
        disabled:true
      }));
      for (var i=0;i<rawdata.length;i++){
        var fields = rawdata[i].split(',');
        if (i>0){
          $('select[name=scoutName]')
          .append($("<option>",{
            value:fields[0],
            text:fields[0]
          }));
          $scouts.push(fields[0]);
        }
      }
      console.log('scouts',$scouts);
      $('input[name=scoutName]').remove();
    }
    catch(err) {
      console.log("caught in scoutName")
      $('select[name=scoutName]').remove();
    }
  });
}
function setTime(val){
	$('#'+val).val(timer);
}
function countUp(id){
	var Val = Number($('#'+id+'Val').val())+1;
	$('#'+id+'Val').val(Number(Val));
}
function countDown(id){
	var currentVal = Number($('#'+id+'Val').val());
	var Val;
	if (currentVal > 0) {
  	Val = currentVal-1;
  } else {
  	Val = currentVal;
  }
	console.log('countUp',id,Val)
	$('#'+id+'Val').val(Number(Val));
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function check() {
  $("form :input").each(function() {
  	if ($(this).val == null) {
  		console.log('this',$(this))
			$(this).val('empty');
  	}
  });
}
function writeToCSV(){
  if ($('#scoutName').val()){
    var scoutname = $('#scoutName').val().replace(/(\r\n|\n|\r)/gm, "");
  }else {
    var scoutnmae = '';
  }
  $data = [
    $('#matchNumber').val(),
    $('#teamNumber').val(),
    ,
    $('input[name=attendance]:checked').val()=='on' ? 'Yes' : 'No',
    $('input[name=sand-qd]:checked').val(),
    $('input[name=sand-hp]:checked').val(),
    $('input[name=sand-cb]:checked').val(),
    $('input[name=ch-cargo]:checked').val(),
    $('input[name=ch-low-rocket]:checked').val(),
    $('input[name=ch-middle-rocket]:checked').val(),
    $('input[name=ch-high-rocket]:checked').val(),
    $('input[name=cc-cargo]:checked').val(),
    $('input[name=cc-low-rocket]:checked').val(),
    $('input[name=cc-middle-rocket]:checked').val(),
    $('input[name=cc-high-rocket]:checked').val(),
    $('input[name=maneuverability-ds]:checked').val(),
    $('input[name=maneuverability-being-attacked]:checked').val(),
    $('input[name=maneuverability-attacking]:checked').val(),
    $('input[name=end-hab1]:checked').val(),
    $('input[name=end-hab2]:checked').val(),
    $('input[name=end-hab3]:checked').val(),
    $('input[name=neg-foul]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-stuck]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-tipped]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-damage]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-stopped]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=performance]:checked').val(),
    $('textarea[name=endgameComments]').val(),



  ];
  console.log('RAW DATA',$data)
  $csv.push(String($data));
  console.log('$CSV DATA',$csv)
  // $('#csv').append($data.join(", "));
  // $('#csv').append("\n");
  $('#csv').html($csv.join('\n'));
  console.log('CSV TEXTAREA DATA',$('#csv').html())
  // $('#csv').append($csv.join('&#13;\n\r'));
}

function copyToClipboard(element) {
  var $temp = $("<textarea>");
  var brRegex = /<br\s*[\/]?>/gi;
  $("body").append($temp);
  $temp.val($(element).html().replace(brRegex, "\r\n")).select();
  document.execCommand("copy");
  $temp.remove();
}
function textToClipboard (text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
function checkReq(){
  console.log($('select[name=teamNumber]').val(),$('input[name=teamNumber]').val()!='',$('#matchNumber').val()!='')
  if(
    ($('select[name=teamNumber]').val() || $('input[name=teamNumber]').val()!='') && $('#matchNumber').val()!=''){
    $('.alert').removeClass('alert');
    $requiredSatisfied = true;
    $('#submit-form').val('Add scout form to match, and clear form');
  }
  else {
    $('#submit-form').addClass('alert');
    $('#submit-form').val('Fill in Team# and Match#');
    $requiredSatisfied = false;
  }
}

$('input[name=matchNumber]').on("change paste keyup",function(){
  checkReq();
})
$('input[name=teamNumber]').on("change paste keyup",function(){
  checkReq();
})
$('select[name=teamNumber]').on("change paste keyup",function(){
  checkReq();
})
$('#submit-form').click(function(){
  if($requiredSatisfied){
    writeToCSV();
    saveToCSVFile($data);
    clearValues();
    $forms+=1;
    $('#formCount').html($forms);
  } else {
    checkReq();
  }
});
$('#newMatch').click(function(){
  textToClipboard($csv.join('\n'))
  // saveCSV();
  clearCSV();
  clearValues();
  $forms = 0;
  $('#formCount').html($forms);
  $('#matchNumber').val(Number($('#matchNumber').val())+1);
});
function saveToCSVFile(v){
  // $fs.appendFile($app.getAppPath()+"/../../../scouting/match_"+$('#matchNumber').val()+".csv", v+$os.EOL, function(err) {
  $fs.appendFile($homedir+"/scouting/match_"+$('#matchNumber').val()+".csv", v+$os.EOL, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
}
function readFile(fileName){
  try{
    $fs.readFile($homedir+'/'+fileName, 'utf8', function(err, contents) {
      return contents;
    });
  }
  catch(err) {
  }
}
function clearCSV(element){
  $('#csv').empty();
  $('#csv').val('');
  $csv = [];
  $data = [];
}
function clearValues(){
  $requiredSatisfied = false;
  var $matchNumber = $('#matchNumber').val();
  $('input[type=number]').val('0');
  $('input[type=text]').val('');
  $('textarea').val('')
  $('#foul').html('0');
  $('#techFoul').html('0');
  $('#matchNumber').val($matchNumber);
  $('input').prop( "checked",false );
  $('select').prop( "checked",false );
  $('input[name=teamNumber]').val('');
  $('select[name=teamNumber]').val('Pick a team');
  $('#scoutName').val('');
  $('.button-group input[value*=Didn]').prop('checked', true);
  $('.button-group input[value*="N/A"]').prop('checked', true);
}
