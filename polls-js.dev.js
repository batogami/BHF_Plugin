// Variables
pollsL10n.show_loading = parseInt(pollsL10n.show_loading);
pollsL10n.show_fading = parseInt(pollsL10n.show_fading);

function vote_for_all_on_page()
{
	var all_polls = document.getElementsByClassName("wp-polls")
	var poll_ids = []
	var answer_list = []
	for (let i = 0; i < all_polls.length; i++)
	{
		poll_ids.push(all_polls[i].id.replace("polls-", ""))
	}
	for(let i = 0; i < poll_ids.length; i++)
	{
		var poll_id = poll_ids[i];
		var str = "poll_" + poll_id
		var selector = "input[name="+str+"]"
		var check_boxes = document.querySelectorAll(selector)
		for (const element of check_boxes)
		{
			if (element.checked)
			{
				answer_list.push(element.id.replace("poll-answer-", ""));
			}
		}

	}
	if(answer_list.length === 3)
	{
		alert(String(answer_list))
		get_answer_from_id(String(answer_list));
		//poll_ids.forEach(element => poll_vote(element))
	}
}

function onlyUnique(array) {
	while(array.length > 0)
	{
		var a = array.pop()
		if (array.indexOf(a) !== -1)
		{
			return false;
		}
	}
	return true;

}

// When User Vote For Poll
function poll_vote(current_poll_id) {
	jQuery(document).ready(function($) {
        poll_answer_id = '';
        poll_multiple_ans = 0;
        poll_multiple_ans_count = 0;
        if($('#poll_multiple_ans_' + current_poll_id).length) {
            poll_multiple_ans = parseInt($('#poll_multiple_ans_' + current_poll_id).val());
        }
        $('#polls_form_' + current_poll_id + ' input:checkbox, #polls_form_' + current_poll_id + ' input:radio, #polls_form_' + current_poll_id + ' option').each(function(i){
            if ($(this).is(':checked') || $(this).is(':selected')) {
                if(poll_multiple_ans > 0) {
                    poll_answer_id = $(this).val() + ',' + poll_answer_id;
                    poll_multiple_ans_count++;
                } else {
                    poll_answer_id = parseInt($(this).val());
                }
            }
        });
        if(poll_multiple_ans > 0) {
            if(poll_multiple_ans_count > 0 && poll_multiple_ans_count <= poll_multiple_ans) {
                poll_answer_id = poll_answer_id.substring(0, (poll_answer_id.length-1));
                poll_process(current_poll_id, poll_answer_id);
            } else if(poll_multiple_ans_count == 0) {
                alert(pollsL10n.text_valid);
            } else {
                alert(pollsL10n.text_multiple + ' ' + poll_multiple_ans);
            }
        } else {
            if(poll_answer_id > 0) {
                poll_process(current_poll_id, poll_answer_id);
            } else {
                alert(pollsL10n.text_valid);
            }
        }
	});
}

function test_hide(current_poll_id) {
	//var x = document.getElementById("polls-" + next_poll_id);
	//x.style.display = "block";

	var all_polls = document.getElementsByClassName("wp-polls")
	var poll_ids = []
	var answer_list = []
	for (let i = 0; i < all_polls.length; i++)
	{
		poll_ids.push(all_polls[i].id.replace("polls-", ""))
	}
	for(let i = 0; i < poll_ids.length; i++)
	{
		var poll_id = poll_ids[i];
		var str = "poll_" + poll_id
		var selector = "input[name="+str+"]"
		var check_boxes = document.querySelectorAll(selector)
		for (const element of check_boxes)
		{
			if (element.checked)
			{
				answer_list.push(element.id.replace("poll-answer-", ""));
			}
		}

	}

}

function hide_answer_div(ids)
{
	var elementIds = []
	ids.forEach(function(id){
		var x = document.getElementById("poll-answer-div-" + id);
		if (x != null){
			elementIds.push(x.id);
			x.style.display = "none";}
	});
	var answer_divs = document.getElementsByClassName("poll-answer-div")
	for (let i = 0; i < answer_divs.length; i++)
	{
		var div = answer_divs[i]
		if (!elementIds.includes(div.id))
		{
			div.style.display = "block"
		}
	}

}

function get_answer_from_id(answer_id)
{
	jQuery(document).ready(function($) {

		// This is the variable we are passing via AJAX
		var fruit = 'Banana';

		// This does the ajax request (The Call).
		$.ajax({
			url: pollsL10n.ajax_url, // Since WP 2.8 ajaxurl is always defined and points to admin-ajax.php
			data: {
				'action':'get_answer_for_id', // This is our PHP function below
				'answer_id' : answer_id // This is the variable we are sending via AJAX
			},
			success:function(data) {
				// This outputs the result of the ajax request (The Callback)
				if(onlyUnique(data.split(', '))) {
					var all_polls = document.getElementsByClassName("wp-polls")
					var poll_ids = []
					for (let i = 0; i < all_polls.length; i++)
					{
						poll_ids.push(all_polls[i].id.replace("polls-", ""))
					}
					poll_ids.forEach(element => poll_vote(element))
				}
				else
				{
					alert("Bitte wählen Sie unterschiedliche Stücke und in allen Kategorien")
				}
				//hide_answer_div(data.split(', '));
			},
			error: function(errorThrown){
				window.alert(errorThrown);
			}
		});

	});
}

// Process Poll (User Click "Vote" Button)
function poll_process(current_poll_id, poll_answer_id) {
	jQuery(document).ready(function($) {
		poll_nonce = $('#poll_' + current_poll_id + '_nonce').val();
		if(pollsL10n.show_fading) {
			$('#polls-' + current_poll_id).fadeTo('def', 0);
			if(pollsL10n.show_loading) {
				$('#polls-' + current_poll_id + '-loading').show();
			}
			$.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=process&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '=' + poll_answer_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
		} else {
			if(pollsL10n.show_loading) {
				$('#polls-' + current_poll_id + '-loading').show();
			}
			$.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=process&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '=' + poll_answer_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
		}
	});
}

// Poll's Result (User Click "View Results" Link)
function poll_result(current_poll_id) {
	jQuery(document).ready(function($) {
        poll_nonce = $('#poll_' + current_poll_id + '_nonce').val();
        if(pollsL10n.show_fading) {
            $('#polls-' + current_poll_id).fadeTo('def', 0);
            if(pollsL10n.show_loading) {
                $('#polls-' + current_poll_id + '-loading').show();
            }
            $.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=result&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
        } else {
            if(pollsL10n.show_loading) {
                $('#polls-' + current_poll_id + '-loading').show();
            }
            $.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=result&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
        }
	});
}

// Poll's Voting Booth  (User Click "Vote" Link)
function poll_booth(current_poll_id) {
	jQuery(document).ready(function($) {
        poll_nonce = $('#poll_' + current_poll_id + '_nonce').val();
        if(pollsL10n.show_fading) {
            $('#polls-' + current_poll_id).fadeTo('def', 0);
            if(pollsL10n.show_loading) {
                $('#polls-' + current_poll_id + '-loading').show();
            }
            $.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=booth&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
        } else {
            if(pollsL10n.show_loading) {
                $('#polls-' + current_poll_id + '-loading').show();
            }
            $.ajax({type: 'POST', xhrFields: {withCredentials: true}, url: pollsL10n.ajax_url, data: 'action=polls&view=booth&poll_id=' + current_poll_id + '&poll_' + current_poll_id + '_nonce=' + poll_nonce, cache: false, success: poll_process_success(current_poll_id)});
        }
	});
}

// Poll Process Successfully
function poll_process_success(current_poll_id) {
    return function(data) {
        jQuery(document).ready(function($) {
            $('#polls-' + current_poll_id).replaceWith(data);
            if(pollsL10n.show_loading) {
                $('#polls-' + current_poll_id + '-loading').hide();
            }
            if(pollsL10n.show_fading) {
                $('#polls-' + current_poll_id).fadeTo('def', 1);
            }
        });
    }
}
