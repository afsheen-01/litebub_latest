import React from 'react';

export const LitebubInput = ({label, placeholder, onChange }) => {
	
	console.log(label, placeholder, onChange    );

	return (
		<>
			<input
				className="ui input massive topic-input"
				name="topic"
				placeholder="type a topic"
				// onKeyUp={(e) => {
				// 	setCurrTopic(e.target.value);
				// }}
			/>	
		</>
	);

};