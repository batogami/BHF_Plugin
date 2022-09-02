function vote_for_all_on_page(){var e=document.getElementsByClassName("wp-polls"),a=[],b=[];for(let c=0;c<e.length;c++)a.push(e[c].id.replace("polls-",""));for(let d=0;d<a.length;d++){var g="input[name=poll_"+a[d]+"]",h=document.querySelectorAll(g);for(let f of h)f.checked&&b.push(f.id.replace("poll-answer-",""))}3===b.length&&vote_for_all_ajax(String(b))}function onlyUnique(a){for(;a.length>0;){var b=a.pop();if(-1!==a.indexOf(b))return!1}return!0}function poll_vote(a){jQuery(document).ready(function($){poll_answer_id="",poll_multiple_ans=0,poll_multiple_ans_count=0,$("#poll_multiple_ans_"+a).length&&(poll_multiple_ans=parseInt($("#poll_multiple_ans_"+a).val())),$("#polls_form_"+a+" input:checkbox, #polls_form_"+a+" input:radio, #polls_form_"+a+" option").each(function(a){($(this).is(":checked")||$(this).is(":selected"))&&(poll_multiple_ans>0?(poll_answer_id=$(this).val()+","+poll_answer_id,poll_multiple_ans_count++):poll_answer_id=parseInt($(this).val()))}),poll_multiple_ans>0?poll_multiple_ans_count>0&&poll_multiple_ans_count<=poll_multiple_ans?poll_process(a,poll_answer_id=poll_answer_id.substring(0,poll_answer_id.length-1)):0==poll_multiple_ans_count?alert(pollsL10n.text_valid):alert(pollsL10n.text_multiple+" "+poll_multiple_ans):poll_answer_id>0?poll_process(a,poll_answer_id):alert(pollsL10n.text_valid)})}function hide(){var d=document.getElementsByClassName("wp-polls"),a=[],e=[];for(let b=0;b<d.length;b++)a.push(d[b].id.replace("polls-",""));for(let c=0;c<a.length;c++){var g="input[name=poll_"+a[c]+"]",h=document.querySelectorAll(g);for(let f of h)f.checked&&e.push(f.id.replace("poll-answer-",""))}hide_ajax(String(e))}function hide_ajax(a){jQuery(document).ready(function($){$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:{action:"get_ids_with_same_answer",answer_ids:a},success:function(a){hide_answer_div(a.split(", "))},error:function(a){window.alert(a)}})})}function hide_answer_div(d){var e=[];d.forEach(function(b){var a=document.getElementById("poll-answer-div-"+b);null!=a&&(e.push(a.id),a.style.display="none")});var b=document.getElementsByClassName("poll-answer-div");for(let a=0;a<b.length;a++){var c=b[a];e.includes(c.id)||(c.style.display="block")}}function vote_for_all_ajax(a){jQuery(document).ready(function($){$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:{action:"get_answer_for_id",answer_id:a},success:function(d){if(onlyUnique(d.split(", "))){var b=document.getElementsByClassName("wp-polls"),c=[];for(let a=0;a<b.length;a++)c.push(b[a].id.replace("polls-",""));c.forEach(a=>poll_vote(a))}else alert("Bitte w\xe4hlen Sie unterschiedliche St\xfccke und in allen Kategorien")},error:function(a){window.alert(a)}})})}function poll_process(a,b){jQuery(document).ready(function($){poll_nonce=$("#poll_"+a+"_nonce").val(),pollsL10n.show_fading?($("#polls-"+a).fadeTo("def",0),pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=process&poll_id="+a+"&poll_"+a+"="+b+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)})):(pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=process&poll_id="+a+"&poll_"+a+"="+b+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)}))})}function poll_result(a){jQuery(document).ready(function($){poll_nonce=$("#poll_"+a+"_nonce").val(),pollsL10n.show_fading?($("#polls-"+a).fadeTo("def",0),pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=result&poll_id="+a+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)})):(pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=result&poll_id="+a+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)}))})}function poll_booth(a){jQuery(document).ready(function($){poll_nonce=$("#poll_"+a+"_nonce").val(),pollsL10n.show_fading?($("#polls-"+a).fadeTo("def",0),pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=booth&poll_id="+a+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)})):(pollsL10n.show_loading&&$("#polls-"+a+"-loading").show(),$.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=booth&poll_id="+a+"&poll_"+a+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(a)}))})}function poll_process_success(a){return function(b){jQuery(document).ready(function($){$("#polls-"+a).replaceWith(b),pollsL10n.show_loading&&$("#polls-"+a+"-loading").hide(),pollsL10n.show_fading&&$("#polls-"+a).fadeTo("def",1)})}}pollsL10n.show_loading=parseInt(pollsL10n.show_loading),pollsL10n.show_fading=parseInt(pollsL10n.show_fading)
