<?php
### Check Whether User Can Manage Polls
if(!current_user_can('manage_polls')) {
	die('Access Denied');
}

### Poll Manager
$base_name = plugin_basename('wp-polls/polls-manager.php');
$base_page = 'admin.php?page='.$base_name;

### Form Processing
if ( ! empty($_POST['do'] ) ) {
	// Decide What To Do
	switch ( $_POST['do'] ) {
		// Add Poll
		case __( 'Add Poll', 'wp-polls' ):
			check_admin_referer( 'wp-polls_add-poll' );
			$text = '';
			// Poll Question
			$pollq_question = isset( $_POST['pollq_question'] ) ? wp_kses_post( trim( $_POST['pollq_question'] ) ) : '';
			if ( ! empty( $pollq_question ) ) {
				//Poll Vote Factor
				$pollq_vote_factor = isset( $_POST['pollq_dependencies'] ) ? (int) sanitize_key($_POST['pollq_vote_factor']) : 1;
				//Poll Dependencies
				$pollq_dependencies = isset( $_POST['pollq_dependencies'] ) ? esc_sql( wp_kses_post( trim( $_POST['pollq_dependencies'] ) ) ) : '';
				// Poll Start Date
				$timestamp_sql = '';
				$pollq_timestamp_day = isset( $_POST['pollq_timestamp_day'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_day'] ) : 0;
				$pollq_timestamp_month = isset( $_POST['pollq_timestamp_month'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_month'] ) : 0;
				$pollq_timestamp_year = isset( $_POST['pollq_timestamp_year'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_year'] ) : 0;
				$pollq_timestamp_hour = isset( $_POST['pollq_timestamp_hour'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_hour'] ) : 0;
				$pollq_timestamp_minute = isset( $_POST['pollq_timestamp_minute'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_minute'] ) : 0;
				$pollq_timestamp_second = isset( $_POST['pollq_timestamp_second'] ) ? (int) sanitize_key( $_POST['pollq_timestamp_second'] ) : 0;
				$pollq_timestamp = gmmktime( $pollq_timestamp_hour, $pollq_timestamp_minute, $pollq_timestamp_second, $pollq_timestamp_month, $pollq_timestamp_day, $pollq_timestamp_year );
				if ( $pollq_timestamp > current_time( 'timestamp' ) ) {
					$pollq_active = -1;
				} else {
					$pollq_active = 1;
				}
				// Poll End Date
				$pollq_expiry_no = isset( $_POST['pollq_expiry_no'] ) ? (int) sanitize_key( $_POST['pollq_expiry_no'] ) : 0;
				if ( $pollq_expiry_no === 1 ) {
					$pollq_expiry = 0;
				} else {
					$pollq_expiry_day = isset( $_POST['pollq_expiry_day'] ) ? (int) sanitize_key( $_POST['pollq_expiry_day'] ) : 0;
					$pollq_expiry_month = isset( $_POST['pollq_expiry_month'] ) ? (int) sanitize_key( $_POST['pollq_expiry_month'] ) : 0;
					$pollq_expiry_year = isset( $_POST['pollq_expiry_year'] ) ? (int) sanitize_key( $_POST['pollq_expiry_year'] ) : 0;
					$pollq_expiry_hour = isset( $_POST['pollq_expiry_hour'] ) ? (int) sanitize_key( $_POST['pollq_expiry_hour'] ) : 0;
					$pollq_expiry_minute = isset( $_POST['pollq_expiry_minute'] ) ? (int) sanitize_key( $_POST['pollq_expiry_minute'] ) : 0;
					$pollq_expiry_second = isset( $_POST['pollq_expiry_second'] ) ? (int) sanitize_key( $_POST['pollq_expiry_second'] ) : 0;
					$pollq_expiry = gmmktime( $pollq_expiry_hour, $pollq_expiry_minute, $pollq_expiry_second, $pollq_expiry_month, $pollq_expiry_day, $pollq_expiry_year );
					if ( $pollq_expiry <= current_time( 'timestamp' ) ) {
						$pollq_active = 0;
					}
				}
				// Mutilple Poll
				$pollq_multiple_yes = isset( $_POST['pollq_multiple_yes'] ) ? (int) sanitize_key( $_POST['pollq_multiple_yes'] ) : 0;
				$pollq_multiple = 0;
				if ( $pollq_multiple_yes === 1 ) {
					$pollq_multiple = isset( $_POST['pollq_multiple'] ) ? (int) sanitize_key( $_POST['pollq_multiple'] ) : 0;
				} else {
					$pollq_multiple = 0;
				}
				// Insert Poll
				$add_poll_question = $wpdb->insert(
					$wpdb->pollsq,
					array(
						'pollq_question'    => $pollq_question,
						'pollq_timestamp'   => $pollq_timestamp,
						'pollq_totalvotes'  => 0,
						'pollq_active'      => $pollq_active,
						'pollq_expiry'      => $pollq_expiry,
						'pollq_multiple'    => $pollq_multiple,
						'pollq_totalvoters' => 0,
						'pollq_dependencies' 	=> $pollq_dependencies,
						'pollq_vote_factor' 	=> $pollq_vote_factor
					),
					array(
						'%s',
						'%s',
						'%d',
						'%d',
						'%d',
						'%d',
						'%d'
					)
				);
				if ( ! $add_poll_question ) {
					$text .= '<p style="color: red;">' . sprintf(__('Error In Adding Poll \'%s\'.', 'wp-polls'), $pollq_question) . '</p>';
				}
				// Add Poll Answers
				$polla_answers = isset( $_POST['polla_answers'] ) ? $_POST['polla_answers'] : array();
				$polla_qid = (int) $wpdb->insert_id;
				foreach ( $polla_answers as $polla_answer ) {
					$polla_answer = wp_kses_post( trim( $polla_answer ) );
					if ( ! empty( $polla_answer ) ) {
						$add_poll_answers = $wpdb->insert(
							$wpdb->pollsa,
							array(
								'polla_qid'	  => $polla_qid,
								'polla_answers'  => $polla_answer,
								'polla_votes'	=> 0
							),
							array(
								'%d',
								'%s',
								'%d'
							)
						);
						if ( ! $add_poll_answers ) {
							$text .= '<p style="color: red;">' . sprintf(__('Error In Adding Poll\'s Answer \'%s\'.', 'wp-polls'), $polla_answer) . '</p>';
						}
					} else {
						$text .= '<p style="color: red;">' . __( 'Poll\'s Answer is empty.', 'wp-polls' ) . '</p>';
					}
				}
				// Update Lastest Poll ID To Poll Options
				$latest_pollid = polls_latest_id();
				$update_latestpoll = update_option( 'poll_latestpoll', $latest_pollid );
				// If poll starts in the future use the correct poll ID
				$latest_pollid = ( $latest_pollid < $polla_qid ) ? $polla_qid : $latest_pollid;
				if ( empty( $text ) ) {
					$text = '<p style="color: green;">' . sprintf( __( 'Poll \'%s\' (ID: %s) added successfully. Embed this poll with the shortcode: %s or go back to <a href="%s">Manage Polls</a>', 'wp-polls' ), $pollq_question, $latest_pollid, '<input type="text" value=\'[poll id="' . $latest_pollid . '"]\' readonly="readonly" size="10" />', $base_page ) . '</p>';
				} else {
					if ( $add_poll_question ) {
						$text .= '<p style="color: green;">' . sprintf( __( 'Poll \'%s\' (ID: %s) (Shortcode: %s) added successfully, but there are some errors with the Poll\'s Answers. Embed this poll with the shortcode: %s or go back to <a href="%s">Manage Polls</a>', 'wp-polls' ), $pollq_question, $latest_pollid, '<input type="text" value=\'[poll id="' . $latest_pollid . '"]\' readonly="readonly" size="10" />' ) .'</p>';
					}
				}
				do_action( 'wp_polls_add_poll', $latest_pollid );
				cron_polls_place();
			} else {
				$text .= '<p style="color: red;">' . __( 'Poll Question is empty.', 'wp-polls' ) . '</p>';
			}
			break;
	}
}

### Add Poll Form
$poll_noquestion = 2;
$count = 0;
?>
<?php if(!empty($text)) { echo '<!-- Last Action --><div id="message" class="updated fade">'.removeslashes($text).'</div>'; } ?>
<form method="post" action="<?php echo admin_url('admin.php?page='.plugin_basename(__FILE__)); ?>">
<?php wp_nonce_field('wp-polls_add-poll'); ?>
<div class="wrap">
	<h2><?php _e('Add Poll', 'wp-polls'); ?></h2>
	<!-- Poll Question -->
	<h3><?php _e('Poll Question', 'wp-polls'); ?></h3>
	<table class="form-table">
		<tr>
			<th width="20%" scope="row" valign="top"><?php _e('Question', 'wp-polls') ?></th>
			<td width="80%"><input type="text" size="70" name="pollq_question" value="" /></td>
		</tr>
	</table>
	<!-- Poll Answers -->
	<h3><?php _e('Poll Answers', 'wp-polls'); ?></h3>
	<table class="form-table">
		<tfoot>
			<tr>
				<td width="20%">&nbsp;</td>
				<td width="80%"><input type="button" value="<?php _e('Add Answer', 'wp-polls') ?>" onclick="add_poll_answer_add();" class="button" /></td>
			</tr>
		</tfoot>
		<tbody id="poll_answers">
		<?php
			for($i = 1; $i <= $poll_noquestion; $i++) {
				echo "<tr id=\"poll-answer-$i\">\n";
				echo "<th width=\"20%\" scope=\"row\" valign=\"top\">".sprintf(__('Answer %s', 'wp-polls'), number_format_i18n($i))."</th>\n";
				echo "<td width=\"80%\"><input type=\"text\" size=\"50\" maxlength=\"200\" name=\"polla_answers[]\" />&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"".__('Remove', 'wp-polls')."\" onclick=\"remove_poll_answer_add(".$i.");\" class=\"button\" /></td>\n";
				echo "</tr>\n";
				$count++;
			}
		?>
		<tr>
			<th width="40%" scope="row" valign="top"><?php _e('With which factor should a vote be multiplied with?', 'wp-polls'); ?></th>
			<td width="60%">
				<select name="pollq_vote_factor" id="pollq_vote_factor" size="1">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
			</td>
		</tr>
		</tbody>
	</table>
	<!-- Poll Dependencies -->
	<h3><?php _e('Poll Dependencies', 'wp-polls'); ?></h3>
	<table class="form-table">
		<tbody>
		<tr>
			<th width="40%" scope="row" valign="top"><?php _e('Which polls must be answered for a valid result?', 'wp-polls'); ?></th>
			<?php
			echo '<td width="60%">'." <input type=\"text\" size=\"4\" id=\"pollq_dependencies\" name=\"pollq_dependencies\" value=\"\" /></td>\n";
			?>
		</tr>
		</tbody>
	</table>
	<!-- Poll Multiple Answers -->
	<h3><?php _e('Poll Multiple Answers', 'wp-polls') ?></h3>
	<table class="form-table">
		<tr>
			<th width="40%" scope="row" valign="top"><?php _e('Allows Users To Select More Than One Answer?', 'wp-polls'); ?></th>
			<td width="60%">
				<select name="pollq_multiple_yes" id="pollq_multiple_yes" size="1" onchange="check_pollq_multiple();">
					<option value="0"><?php _e('No', 'wp-polls'); ?></option>
					<option value="1"><?php _e('Yes', 'wp-polls'); ?></option>
				</select>
			</td>
		</tr>
		<tr>
			<th width="40%" scope="row" valign="top"><?php _e('Maximum Number Of Selected Answers Allowed?', 'wp-polls') ?></th>
			<td width="60%">
				<select name="pollq_multiple" id="pollq_multiple" size="1" disabled="disabled">
					<?php
						for($i = 1; $i <= $poll_noquestion; $i++) {
							echo "<option value=\"$i\">".number_format_i18n($i)."</option>\n";
						}
					?>
				</select>
			</td>
		</tr>
	</table>
	<!-- Poll Start/End Date -->
	<h3><?php _e('Poll Start/End Date', 'wp-polls'); ?></h3>
	<table class="form-table">
		<tr>
			<th width="20%" scope="row" valign="top"><?php _e('Start Date/Time', 'wp-polls') ?></th>
			<td width="80%"><?php poll_timestamp(current_time('timestamp')); ?></td>
		</tr>
		<tr>
			<th width="20%" scope="row" valign="top"><?php _e('End Date/Time', 'wp-polls') ?></th>
			<td width="80%"><input type="checkbox" name="pollq_expiry_no" id="pollq_expiry_no" value="1" checked="checked" onclick="check_pollexpiry();" />&nbsp;&nbsp;<label for="pollq_expiry_no"><?php _e('Do NOT Expire This Poll', 'wp-polls'); ?></label><?php poll_timestamp(current_time('timestamp'), 'pollq_expiry', 'none'); ?></td>
		</tr>
	</table>
	<p style="text-align: center;"><input type="submit" name="do" value="<?php _e('Add Poll', 'wp-polls'); ?>"  class="button-primary" />&nbsp;&nbsp;<input type="button" name="cancel" value="<?php _e('Cancel', 'wp-polls'); ?>" class="button" onclick="javascript:history.go(-1)" /></p>
</div>
</form>
