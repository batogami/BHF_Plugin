<?php
### Check Whether User Can Manage Polls
if(!current_user_can('manage_polls')) {
	die('Access Denied');
}

### Variables Variables Variables
$base_name = plugin_basename('wp-polls/polls-results.php');
$base_page = 'admin.php?page='.$base_name;
?>
<div class="wrap">
	<h2><?php _e('Poll results', 'wp-polls'); ?></h2>
</div>
