<?php
### Check Whether User Can Manage Polls
if(!current_user_can('manage_polls')) {
	die('Access Denied');
}

### Variables Variables Variables
$base_name = plugin_basename('wp-polls/poll-results.php');
$base_page = 'admin.php?page='.$base_name;
?>

<div class="wrap">
	<h2><?php _e('Poll Results', 'wp-polls'); ?></h2>

	<table class="form-table">
		<tbody>
		<tr>
			<th width="20%" scope="row" valign="top"> <?php echo test(); clean_votes();?></th>
			<td width="80%"><?php echo polls_archive(1);?></td>
		</tr>
	</table>
	<style>
		.container {
			height: 200px;
			position: relative;
		}

		.center {
			margin: 0;
			position: absolute;
			top: 50%;
			left: 50%;
			-ms-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	</style>
</div>
