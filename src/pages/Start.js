import React from 'react';
import '../css/mobileRes.css';
import '../css/tabletRes.css';
import  EntryButton  from '../EntryButton';

const Names = ({ navigation }) => {
	const { next } = navigation;
	return (
		<div className="cl-btn-wrapper">
			<div className='center-it'>
				<div onClick={next} className='btnh'>
					<EntryButton />
				</div>
			</div>
		</div>
	);
};

export default Names;
