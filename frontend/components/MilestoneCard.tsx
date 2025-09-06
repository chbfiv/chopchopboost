import React from 'react';

interface MilestoneCardProps {
	imageUrl: string;
}

// MilestoneCard displays only the image in an 8.7:7 aspect ratio (like BoosterPackCard)
const MilestoneCard: React.FC<MilestoneCardProps> = ({ imageUrl }) => {
	return (
			<div
				style={{
					width: '100%',
					aspectRatio: '8.7 / 7',
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					background: 'transparent',
					border: 'none',
					padding: 0,
				}}
			>
				<img
					src={imageUrl}
					alt="Milestone"
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: 'block',
						background: 'transparent',
					}}
				/>
			</div>
	);
};

export default MilestoneCard;
