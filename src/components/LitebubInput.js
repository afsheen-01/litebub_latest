import React, {createRef, useEffect} from 'react';

export const LitebubInput = (props) => {
	
	const { label, placeholder, defaultValue } = props;

	const inputRef = createRef();

	console.log(defaultValue);


	return (
		<>
			<input
				className="ui input massive topic-input"
				ref={inputRef}
				label={label}
				name="topic"
				defaultValue={defaultValue}
				placeholder={placeholder}
				{...props}
			/>	
		</>
	);

};